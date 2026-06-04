const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const WINNING_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function initGame() {
    boardElement.innerHTML = '';
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusElement.innerText = `Player X's turn`;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('w-20', 'h-20', 'bg-slate-800', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-4xl', 'font-bold', 'cursor-pointer', 'hover:bg-slate-700', 'transition-colors');
        cell.addEventListener('click', () => handleCellClick(cell, i));
        boardElement.appendChild(cell);
    }
}

function handleCellClick(cell, index) {
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'text-purple-400' : 'text-blue-400');

    checkWin();
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i < WINNING_CONDITIONS.length; i++) {
        const [a, b, c] = WINNING_CONDITIONS[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusElement.innerText = `Player ${currentPlayer} wins! 🎉`;
        statusElement.classList.add('text-green-400');
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusElement.innerText = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.innerText = `Player ${currentPlayer}'s turn`;
}

restartBtn.addEventListener('click', () => {
    statusElement.classList.remove('text-green-400');
    initGame();
});

initGame();
