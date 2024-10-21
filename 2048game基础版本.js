const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
let board = [];
let score = 0;

const initBoard = () => {
    board = [];
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(0);
        }
        board.push(row);
    }
    addNewTile();
    addNewTile();
    updateBoard();
};

const addNewTile = () => {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) emptyTiles.push({ x: i, y: j });
        }
    }
    if (emptyTiles.length === 0) return;
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomTile.x][randomTile.y] = Math.random() < 0.9 ? 2 : 4;
};

const updateBoard = () => {
    gridElement.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = board[i][j];
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = value > 0 ? value : '';
            if (value > 0) {
                tile.setAttribute('data-value', value);
            }
            gridElement.appendChild(tile);
        }
    }
    scoreElement.textContent = score;
};

const slideRow = (row) => {
    let arr = row.filter(val => val);
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);
    arr = [...arr, ...zeros];
    return arr;
};

const combineRow = (row) => {
    for (let i = 0; i < 3; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
};

const slideAndCombine = (row) => {
    row = slideRow(row);
    row = combineRow(row);
    row = slideRow(row);
    return row;
};

const rotateBoard = (board) => {
    let newBoard = [];
    for (let i = 0; i < 4; i++) {
        let newRow = [];
        for (let j = 0; j < 4; j++) {
            newRow.push(board[j][i]);
        }
        newBoard.push(newRow.reverse());
    }
    return newBoard;
};

const moveLeft = () => {
    for (let i = 0; i < 4; i++) {
        board[i] = slideAndCombine(board[i]);
    }
    addNewTile();
    updateBoard();
};

const moveRight = () => {
    for (let i = 0; i < 4; i++) {
        board[i] = slideAndCombine(board[i].reverse()).reverse();
    }
    addNewTile();
    updateBoard();
};



const moveUp = () => {
    for (let j = 0; j < 4; j++) {
        let newColumn = [];
        let score = 0;

        // 提取列
        for (let i = 0; i < 4; i++) {
            newColumn.push(board[i][j]);
        }

        // 移除零并合并
        for (let i = 0; i < newColumn.length; i++) {
            if (newColumn[i] !== 0) {
                // 如果下一个数字与当前数字相同，进行合并
                if (newColumn[i] === newColumn[i + 1]) {
                    newColumn[i] *= 2; // 合并
                    score += newColumn[i];
                    newColumn[i + 1] = 0; // 将合并后的数字下一个位置设为零
                    i++; // 跳过下一个元素
                }
            }
        }

        // 移除合并后的零并填充至四个元素
        newColumn = newColumn.filter(value => value !== 0);
        while (newColumn.length < 4) newColumn.push(0);

        // 更新棋盘的列
        for (let i = 0; i < 4; i++) {
            board[i][j] = newColumn[i];
        }
    }

    addNewTile(); // 添加新数字
    updateBoard(); // 更新棋盘显示
};

const moveDown = () => {
    for (let j = 0; j < 4; j++) {
        let newColumn = [];
        let score = 0;

        // 提取列并倒序
        for (let i = 3; i >= 0; i--) {
            newColumn.push(board[i][j]);
        }

        // 移除零并合并
        for (let i = 0; i < newColumn.length; i++) {
            if (newColumn[i] !== 0) {
                // 如果下一个数字与当前数字相同，进行合并
                if (newColumn[i] === newColumn[i + 1]) {
                    newColumn[i] *= 2; // 合并
                    score += newColumn[i];
                    newColumn[i + 1] = 0; // 将合并后的数字下一个位置设为零
                    i++; // 跳过下一个元素
                }
            }
        }

        // 移除合并后的零并填充至四个元素
        newColumn = newColumn.filter(value => value !== 0);
        while (newColumn.length < 4) newColumn.push(0);

        // 更新棋盘的列
        for (let i = 0; i < 4; i++) {
            board[3 - i][j] = newColumn[i]; // 更新棋盘的列，倒序填充
        }
    }

    addNewTile(); // 添加新数字
    updateBoard(); // 更新棋盘显示
};


const isGameOver = () => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        }
    }
    return true;
};

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
    }
    if (isGameOver()) {
        setTimeout(() => {
            alert("Game Over! Final score: " + score);
            initBoard();
        }, 100);
    }
});

initBoard();
