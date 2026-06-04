const tilesContainer = document.getElementById('tiles-container');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const gameOverOverlay = document.getElementById('gameOver');

let board = [];
let score = 0;
let gameActive = true;

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

// We will track tiles by ID to reuse DOM elements
let tilesMap = new Map();
let nextTileId = 1;

function getCellSizeAndGap() {
    return window.innerWidth >= 640 ? { size: 80, gap: 8 } : { size: 64, gap: 8 };
}

function initGame() {
    board = Array(4).fill(null).map(() => Array(4).fill(null));
    score = 0;
    scoreElement.innerText = score;
    gameActive = true;
    gameOverOverlay.classList.add('hidden');
    gameOverOverlay.classList.remove('flex');
    
    tilesContainer.innerHTML = '';
    tilesMap.clear();
    
    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (!board[r][c]) emptyCells.push({r, c});
        }
    }
    if (emptyCells.length > 0) {
        let {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        let val = Math.random() < 0.9 ? 2 : 4;
        
        let id = nextTileId++;
        let tile = { id, val, r, c };
        board[r][c] = tile;
        createTileElement(tile);
    }
}

function createTileElement(tile) {
    const el = document.createElement('div');
    el.className = `tile ${colors[tile.val] || 'bg-yellow-900 text-white'}`;
    el.innerText = tile.val;
    el.id = 'tile-' + tile.id;
    
    // Initial spawn animation (scale up)
    el.style.transform = `translate(${getPos(tile.c)}px, ${getPos(tile.r)}px) scale(0)`;
    tilesContainer.appendChild(el);
    
    // Trigger layout
    el.offsetHeight;
    
    el.style.transform = `translate(${getPos(tile.c)}px, ${getPos(tile.r)}px) scale(1)`;
    tilesMap.set(tile.id, el);
}

function updateTileElement(tile) {
    const el = tilesMap.get(tile.id);
    if (!el) return;
    el.style.transform = `translate(${getPos(tile.c)}px, ${getPos(tile.r)}px) scale(1)`;
    el.className = `tile ${colors[tile.val] || 'bg-yellow-900 text-white'}`;
    el.innerText = tile.val;
}

function removeTileElement(id) {
    const el = tilesMap.get(id);
    if (el) {
        // Wait for slide animation to finish before removing
        setTimeout(() => {
            el.remove();
            tilesMap.delete(id);
        }, 150);
    }
}

function getPos(idx) {
    const { size, gap } = getCellSizeAndGap();
    return idx * (size + gap);
}

window.addEventListener('resize', () => {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c]) updateTileElement(board[r][c]);
        }
    }
});

function slide(row) {
    let arr = row.filter(val => val !== null);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].val === arr[i+1].val) {
            arr[i].val *= 2;
            score += arr[i].val;
            
            // Mark the absorbed tile to slide and disappear
            let absorbed = arr[i+1];
            absorbed.mergedInto = arr[i]; 
            
            arr[i+1] = null;
        }
    }
    
    let newRow = [];
    let absorbedTiles = [];
    for (let item of row) {
        if (item && item.mergedInto) absorbedTiles.push(item);
    }
    
    arr = arr.filter(val => val !== null);
    
    // Assign new row positions
    for (let i = 0; i < 4; i++) {
        newRow.push(arr[i] || null);
    }
    
    return { newRow, absorbedTiles };
}

function handleInput(dir) {
    if (!gameActive) return;
    
    let changed = false;
    let allAbsorbed = [];
    
    if (dir === 'ArrowLeft') {
        for (let r = 0; r < 4; r++) {
            let { newRow, absorbedTiles } = slide(board[r]);
            allAbsorbed.push(...absorbedTiles);
            for (let c = 0; c < 4; c++) {
                if (newRow[c] !== board[r][c]) changed = true;
                if (newRow[c]) { newRow[c].c = c; newRow[c].r = r; }
            }
            board[r] = newRow;
        }
    } else if (dir === 'ArrowRight') {
        for (let r = 0; r < 4; r++) {
            let { newRow, absorbedTiles } = slide(board[r].slice().reverse());
            newRow.reverse();
            allAbsorbed.push(...absorbedTiles);
            for (let c = 0; c < 4; c++) {
                if (newRow[c] !== board[r][c]) changed = true;
                if (newRow[c]) { newRow[c].c = c; newRow[c].r = r; }
            }
            board[r] = newRow;
        }
    } else if (dir === 'ArrowUp') {
        for (let c = 0; c < 4; c++) {
            let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
            let { newRow, absorbedTiles } = slide(col);
            allAbsorbed.push(...absorbedTiles);
            for (let r = 0; r < 4; r++) {
                if (newRow[r] !== board[r][c]) changed = true;
                if (newRow[r]) { newRow[r].r = r; newRow[r].c = c; }
                board[r][c] = newRow[r];
            }
        }
    } else if (dir === 'ArrowDown') {
        for (let c = 0; c < 4; c++) {
            let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
            let { newRow, absorbedTiles } = slide(col.reverse());
            newRow.reverse();
            allAbsorbed.push(...absorbedTiles);
            for (let r = 0; r < 4; r++) {
                if (newRow[r] !== board[r][c]) changed = true;
                if (newRow[r]) { newRow[r].r = r; newRow[r].c = c; }
                board[r][c] = newRow[r];
            }
        }
    }
    
    // Process absorbed animations
    for (let absorbed of allAbsorbed) {
        absorbed.c = absorbed.mergedInto.c;
        absorbed.r = absorbed.mergedInto.r;
        const el = tilesMap.get(absorbed.id);
        if (el) {
            el.style.transform = `translate(${getPos(absorbed.c)}px, ${getPos(absorbed.r)}px) scale(1)`;
            el.style.zIndex = '0';
        }
        removeTileElement(absorbed.id);
    }
    
    if (changed) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c]) {
                    const el = tilesMap.get(board[r][c].id);
                    if (el) el.style.zIndex = '10';
                    updateTileElement(board[r][c]);
                }
            }
        }
        scoreElement.innerText = score;
        setTimeout(() => {
            addRandomTile();
            checkGameOver();
        }, 150);
    }
}

function checkGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (!board[r][c]) return;
            if (c < 3 && board[r][c].val === board[r][c+1].val) return;
            if (r < 3 && board[r][c].val === board[r+1][c].val) return;
        }
    }
    gameActive = false;
    gameOverOverlay.classList.remove('hidden');
    gameOverOverlay.classList.add('flex');
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
