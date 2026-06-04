const boardElement = document.getElementById('board');
const flagsLeftElement = document.getElementById('flagsLeft');
const timerElement = document.getElementById('timer');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const levelSelect = document.getElementById('levelSelect');
const bestTimeElement = document.getElementById('bestTime');

const LEVELS = [
    { rows: 9, cols: 9, mines: 10 },
    { rows: 16, cols: 16, mines: 40 },
    { rows: 16, cols: 30, mines: 99 },
    { rows: 20, cols: 30, mines: 130 }
];

let currentLevel = 0;
let ROWS = LEVELS[0].rows;
let COLS = LEVELS[0].cols;
let MINES = LEVELS[0].mines;

let board = [];
let gameActive = false;
let firstClick = true;
let flagsLeft = MINES;
let timer = 0;
let timerInterval;

const numberColors = ['', 'text-blue-400', 'text-green-400', 'text-red-500', 'text-purple-500', 'text-yellow-600', 'text-teal-400', 'text-slate-900', 'text-gray-400'];

function loadBestTime() {
    const best = localStorage.getItem(`minesweeper_best_${currentLevel}`);
    bestTimeElement.innerText = best ? best + 's' : 'Inf';
}

function saveBestTime(time) {
    const best = localStorage.getItem(`minesweeper_best_${currentLevel}`);
    if (!best || time < parseInt(best)) {
        localStorage.setItem(`minesweeper_best_${currentLevel}`, time);
        loadBestTime();
    }
}

function initGame() {
    clearInterval(timerInterval);
    boardElement.innerHTML = '';
    board = [];
    gameActive = true;
    firstClick = true;
    
    ROWS = LEVELS[currentLevel].rows;
    COLS = LEVELS[currentLevel].cols;
    MINES = LEVELS[currentLevel].mines;
    
    flagsLeft = MINES;
    timer = 0;
    flagsLeftElement.innerText = flagsLeft;
    timerElement.innerText = timer;
    statusElement.innerText = '🙂';
    
    loadBestTime();

    boardElement.style.gridTemplateColumns = `repeat(${COLS}, minmax(0, 1fr))`;

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell unrevealed';
            cell.addEventListener('click', () => handleCellClick(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(r, c);
            });
            boardElement.appendChild(cell);
            row.push({ isMine: false, isRevealed: false, isFlagged: false, element: cell, neighbors: 0 });
        }
        board.push(row);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.innerText = timer;
    }, 1000);
}

function placeMines(firstR, firstC) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);
        // Ensure first click and its immediate neighbors are empty
        if (!board[r][c].isMine && (Math.abs(r - firstR) > 1 || Math.abs(c - firstC) > 1)) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!board[r][c].isMine) {
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (r+i >= 0 && r+i < ROWS && c+j >= 0 && c+j < COLS && board[r+i][c+j].isMine) count++;
                    }
                }
                board[r][c].neighbors = count;
            }
        }
    }
}

function handleCellClick(r, c) {
    if (!gameActive || board[r][c].isFlagged || board[r][c].isRevealed) return;
    
    if (firstClick) {
        firstClick = false;
        placeMines(r, c);
        startTimer();
    }

    if (board[r][c].isMine) {
        gameOver(false);
    } else {
        revealCell(r, c);
        checkWin();
    }
}

function handleRightClick(r, c) {
    if (!gameActive || board[r][c].isRevealed) return;
    
    if (board[r][c].isFlagged) {
        board[r][c].isFlagged = false;
        board[r][c].element.innerText = '';
        flagsLeft++;
    } else if (flagsLeft > 0) {
        board[r][c].isFlagged = true;
        board[r][c].element.innerText = '🚩';
        flagsLeft--;
    }
    flagsLeftElement.innerText = flagsLeft;
}

function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c].isRevealed || board[r][c].isFlagged) return;
    
    board[r][c].isRevealed = true;
    const el = board[r][c].element;
    el.classList.remove('unrevealed');
    el.classList.add('revealed');

    if (board[r][c].neighbors > 0) {
        el.innerText = board[r][c].neighbors;
        el.classList.add(numberColors[board[r][c].neighbors]);
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(r+i, c+j);
            }
        }
    }
}

function gameOver(win) {
    gameActive = false;
    clearInterval(timerInterval);
    statusElement.innerText = win ? '😎' : '😵';
    
    if (win) saveBestTime(timer);
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let cell = board[r][c];
            if (cell.isMine) {
                cell.element.classList.remove('unrevealed');
                cell.element.classList.add('revealed');
                cell.element.innerText = '💣';
                if (!win && !cell.isRevealed) cell.element.classList.add('bg-red-500');
            } else if (cell.isFlagged && !cell.isMine) {
                cell.element.innerText = '❌';
            }
        }
    }
}

function checkWin() {
    let revealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isRevealed) revealedCount++;
        }
    }
    if (revealedCount === ROWS * COLS - MINES) {
        gameOver(true);
    }
}

levelSelect.addEventListener('change', (e) => {
    currentLevel = parseInt(e.target.value);
    initGame();
});

restartBtn.addEventListener('click', initGame);
initGame();
