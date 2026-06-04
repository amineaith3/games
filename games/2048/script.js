const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

let board = [];
let score = 0;

const colors = {
    2: 'bg-slate-700 text-slate-200',
    4: 'bg-slate-600 text-slate-200',
    8: 'bg-orange-400 text-white',
    16: 'bg-orange-500 text-white',
    32: 'bg-red-400 text-white',
    64: 'bg-red-500 text-white',
    128: 'bg-yellow-400 text-white shadow-[0_0_10px_rgba(250,204,21,0.5)]',
    256: 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.6)]',
    512: 'bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.7)]',
    1024: 'bg-yellow-700 text-white text-3xl',
    2048: 'bg-yellow-800 text-white text-3xl shadow-[0_0_30px_rgba(161,98,7,0.8)]',
};

function initGame() {
    board = Array(4).fill(null).map(() => Array(4).fill(0));
    score = 0;
    scoreElement.innerText = score;
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyCells.push({r, c});
        }
    }
    if (emptyCells.length > 0) {
        let {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            const val = board[r][c];
            let classString = 'w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-100 ';
            classString += val ? colors[val] || 'bg-slate-900 text-white' : 'bg-slate-900/50';
            cell.className = classString;
            cell.innerText = val ? val : '';
            boardElement.appendChild(cell);
        }
    }
}

function slide(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i+1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i+1] = 0;
        }
    }
    arr = arr.filter(val => val);
    while (arr.length < 4) arr.push(0);
    return arr;
}

function handleInput(dir) {
    let oldBoard = JSON.stringify(board);
    if (dir === 'ArrowLeft') {
        for (let r = 0; r < 4; r++) board[r] = slide(board[r]);
    } else if (dir === 'ArrowRight') {
        for (let r = 0; r < 4; r++) board[r] = slide(board[r].reverse()).reverse();
    } else if (dir === 'ArrowUp') {
        for (let c = 0; c < 4; c++) {
            let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
            col = slide(col);
            for (let r = 0; r < 4; r++) board[r][c] = col[r];
        }
    } else if (dir === 'ArrowDown') {
        for (let c = 0; c < 4; c++) {
            let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
            col = slide(col.reverse()).reverse();
            for (let r = 0; r < 4; r++) board[r][c] = col[r];
        }
    }
    
    if (oldBoard !== JSON.stringify(board)) {
        addRandomTile();
        updateBoard();
        scoreElement.innerText = score;
    }
}

window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        handleInput(e.key);
    }
});

let touchStartX = 0;
let touchStartY = 0;
window.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, {passive: false});

window.addEventListener('touchend', e => {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) handleInput('ArrowRight');
        else if (dx < -30) handleInput('ArrowLeft');
    } else {
        if (dy > 30) handleInput('ArrowDown');
        else if (dy < -30) handleInput('ArrowUp');
    }
});

restartBtn.addEventListener('click', initGame);
initGame();
