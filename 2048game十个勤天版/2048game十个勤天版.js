const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const playerDisplay = document.getElementById('player-display');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playerNameInput = document.getElementById('player-name');

let board = [];
let score = 0;

// 数字对应的图片
const tileImages = {
    2: "images_2.0/1.png",
    4: "images_2.0/2.png",
    8: "images_2.0/3.png",
    16: "images_2.0/4.png",
    32: "images_2.0/5.png",
    64: "images_2.0/6.png",
    128: "images_2.0/7.png",
    256: "images_2.0/8.png",
    512: "images_2.0/9.png",
    1024: "images_2.0/10.png",
    2048: "images_2.0/11.png"
};

// 初始化游戏棋盘
const initBoard = () => {
    board = [];
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            row.push(0);  // 初始化为空
        }
        board.push(row);
    }
    addNewTile();
    addNewTile();
    updateBoard();
};

// 在随机空位置添加一个新的方块
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

// 更新棋盘显示
const updateBoard = () => {
    gridElement.innerHTML = '';  // 清空当前显示的棋盘
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = board[i][j];
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (value > 0) {
                tile.style.backgroundImage = `url(${tileImages[value]})`; // 将数字替换为图片
            }
            gridElement.appendChild(tile);
        }
    }
    scoreElement.textContent = `分数: ${score}`;  // 更新分数
};

// 判断是否游戏结束
const isGameOver = () => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (i > 0 && board[i][j] === board[i - 1][j]) return false;
            if (j > 0 && board[i][j] === board[i][j - 1]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
};

// 向左移动并合并方块
const moveLeft = () => {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let newRow = board[i].filter(value => value !== 0);  // 移除 0
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow[j + 1] = 0;
            }
        }
        newRow = newRow.filter(value => value !== 0);  // 再次移除 0
        while (newRow.length < 4) newRow.push(0);
        if (newRow.toString() !== board[i].toString()) {
            board[i] = newRow;
            moved = true;
        }
    }
    if (moved) addNewTile();
    updateBoard();
};

// 向右移动并合并方块
const moveRight = () => {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let newRow = board[i].filter(value => value !== 0);  // 移除 0
        for (let j = newRow.length - 1; j > 0; j--) {
            if (newRow[j] === newRow[j - 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow[j - 1] = 0;
            }
        }
        newRow = newRow.filter(value => value !== 0);  // 再次移除 0
        while (newRow.length < 4) newRow.unshift(0);
        if (newRow.toString() !== board[i].toString()) {
            board[i] = newRow;
            moved = true;
        }
    }
    if (moved) addNewTile();
    updateBoard();
};

const moveDown = () => {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let newColumn = [];
        for (let i = 3; i >= 0; i--) {
            if (board[i][j] !== 0) {
                newColumn.push(board[i][j]);  // 提取非零值
            }
        }

        for (let k = 0; k < newColumn.length - 1; k++) {
            if (newColumn[k] === newColumn[k + 1]) {
                newColumn[k] *= 2;  // 合并
                score += newColumn[k];
                newColumn[k + 1] = 0;  // 设置为零
            }
        }

        newColumn = newColumn.filter(value => value !== 0);  // 移除零
        while (newColumn.length < 4) newColumn.push(0);  // 填充零

        for (let i = 3; i >= 0; i--) {
            if (board[i][j] !== newColumn[3 - i]) {
                moved = true;  // 检查是否有变化
                board[i][j] = newColumn[3 - i];
            }
        }
    }

    if (moved) addNewTile();
    updateBoard();
};


const moveUp = () => {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let newColumn = [];
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== 0) {
                newColumn.push(board[i][j]);  // 提取非零值
            }
        }

        for (let k = 0; k < newColumn.length - 1; k++) {
            if (newColumn[k] === newColumn[k + 1]) {
                newColumn[k] *= 2;  // 合并
                score += newColumn[k];
                newColumn[k + 1] = 0;  // 设置为零
            }
        }

        newColumn = newColumn.filter(value => value !== 0);  // 移除零
        while (newColumn.length < 4) newColumn.push(0);  // 填充零

        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== newColumn[i]) {
                moved = true;  // 检查是否有变化
                board[i][j] = newColumn[i];
            }
        }
    }

    if (moved) addNewTile();
    updateBoard();
};


// 处理键盘事件
document.addEventListener('keydown', (event) => {
    if (gameScreen.style.display === 'block') {
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
            endScreen.style.display = 'block';
            finalScoreElement.textContent = `最终得分: ${score}`;
            gameScreen.style.display = 'none';
        }
    }
});

// 开始游戏
startButton.addEventListener('click', () => {
    const playerName = playerNameInput.value || '玩家';
    playerDisplay.textContent = `玩家: ${playerName}`;
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    initBoard();
});

// 重新开始游戏
restartButton.addEventListener('click', () => {
    endScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    initBoard();
});
