const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

const grid = 20;
const cols = canvas.width / grid;
const rows = canvas.height / grid;

let snake = [{ x: 7, y: 7 }];
let dx = 1;
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let gameStarted = false;

let speed = 150;
const MIN_SPEED = 60;
const MAX_SPEED = 300;
const SPEED_STEP = 15;

let loop = null;

function randomFood() {
  let ok = false;
  while (!ok) {
    food.x = Math.floor(Math.random() * cols);
    food.y = Math.floor(Math.random() * rows);
    ok = !snake.some(p => p.x === food.x && p.y === food.y);
  }
}

function drawGrid() {
  ctx.strokeStyle = "#1f2933";
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * grid, 0);
    ctx.lineTo(x * grid, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * grid);
    ctx.lineTo(canvas.width, y * grid);
    ctx.stroke();
  }
}

function draw() {
  ctx.fillStyle = "#065f46";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x * grid, food.y * grid, grid, grid);

  ctx.fillStyle = "#34d399";
  snake.forEach(p => ctx.fillRect(p.x * grid, p.y * grid, grid, grid));
}

function update() {
  if (!gameStarted || gameOver) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= cols ||
    head.y < 0 || head.y >= rows ||
    snake.some(p => p.x === head.x && p.y === head.y)
  ) {
    gameOver = true;
    alert(`💀 Game Over! Score: ${score}`);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    randomFood();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    loop = setInterval(update, speed);
  }
}

function restartLoop() {
  if (!gameStarted) return;
  clearInterval(loop);
  loop = setInterval(update, speed);
}

function resetGame() {
  clearInterval(loop);
  snake = [{ x: 7, y: 7 }];
  dx = 1;
  dy = 0;
  score = 0;
  speed = 150;
  scoreEl.textContent = `Score: ${score}`;
  gameOver = false;
  gameStarted = false;
  randomFood();
  draw();
}
document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();

  if (k === "p") {
    startGame();
    return;
  }

  if (k === "r") {
    resetGame();
    return;
  }

  if (k === "l") {
    speed = Math.max(MIN_SPEED, speed - SPEED_STEP);
    restartLoop();
    return;
  }

  if (k === "k") {
    speed = Math.min(MAX_SPEED, speed + SPEED_STEP);
    restartLoop();
    return;
  }

  if (!gameStarted) return;

  if ((k === "w" || k === "arrowup") && dy === 0) { dx = 0; dy = -1; }
  else if ((k === "s" || k === "arrowdown") && dy === 0) { dx = 0; dy = 1; }
  else if ((k === "a" || k === "arrowleft") && dx === 0) { dx = -1; dy = 0; }
  else if ((k === "d" || k === "arrowright") && dx === 0) { dx = 1; dy = 0; }
});

startBtn.onclick = startGame;
resetBtn.onclick = resetGame;

randomFood();
draw();

