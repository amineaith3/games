const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'R'; // 'R' for Red, 'Y' for Yellow
let gameActive = true;

function initGame() {
    boardElement.innerHTML = '';
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    currentPlayer = 'R';
    gameActive = true;
    updateStatus();

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('w-10', 'h-10', 'sm:w-12', 'sm:h-12', 'rounded-full', 'bg-slate-900', 'cursor-pointer', 'transition-colors', 'shadow-inner');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleColumnClick(c));
            boardElement.appendChild(cell);
        }
    }
}

function handleColumnClick(col) {
    if (!gameActive) return;
    
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = currentPlayer;
            updateBoard();
            checkWin(r, col);
            if (gameActive) {
                currentPlayer = currentPlayer === 'R' ? 'Y' : 'R';
                updateStatus();
            }
            return;
        }
    }
}

function updateBoard() {
    const cells = boardElement.children;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            const cell = cells[idx];
            if (board[r][c] === 'R') {
                cell.classList.replace('bg-slate-900', 'bg-red-500');
            } else if (board[r][c] === 'Y') {
                cell.classList.replace('bg-slate-900', 'bg-yellow-400');
            }
        }
    }
}

function checkWin(row, col) {
    if (checkDirection(row, col, 1, 0) || // Horizontal
        checkDirection(row, col, 0, 1) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal down
        checkDirection(row, col, 1, -1))  // Diagonal up
    {
        statusElement.innerText = `${currentPlayer === 'R' ? 'Red' : 'Yellow'} Wins! 🎉`;
        statusElement.classList.add(currentPlayer === 'R' ? 'text-red-400' : 'text-yellow-400');
        gameActive = false;
    }
}

function checkDirection(row, col, dRow, dCol) {
    let count = 1;
    count += countConsecutive(row, col, dRow, dCol);
    count += countConsecutive(row, col, -dRow, -dCol);
    return count >= 4;
}

function countConsecutive(row, col, dRow, dCol) {
    let r = row + dRow;
    let c = col + dCol;
    let count = 0;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        count++;
        r += dRow;
        c += dCol;
    }
    return count;
}

function updateStatus() {
    statusElement.innerText = `${currentPlayer === 'R' ? 'Red' : 'Yellow'}'s Turn`;
    statusElement.className = 'text-slate-400 mb-4 text-sm font-bold ' + (currentPlayer === 'R' ? 'text-red-400' : 'text-yellow-400');
}

restartBtn.addEventListener('click', initGame);
initGame();
