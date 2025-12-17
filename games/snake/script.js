const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

const grid = 20;
let snake = [{ x: 7, y: 7 }];
let dx = 1;
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let gameStarted = false;
let loop = null;

function randomFood() {
  let valid = false;
  while (!valid) {
    food.x = Math.floor(Math.random() * (canvas.width / grid));
    food.y = Math.floor(Math.random() * (canvas.height / grid));
    valid = !snake.some(p => p.x === food.x && p.y === food.y);
  }
}

function draw() {
  ctx.fillStyle = "#065f46";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x * grid, food.y * grid, grid, grid);

  ctx.fillStyle = "#34d399";
  snake.forEach(p => ctx.fillRect(p.x * grid, p.y * grid, grid, grid));
}

function update() {
  if (!gameStarted || gameOver) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= canvas.width / grid ||
    head.y < 0 || head.y >= canvas.height / grid ||
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

document.addEventListener("keydown", e => {
  if (!gameStarted) return;

  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  else if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

startBtn.onclick = () => {
  if (!gameStarted) {
    gameStarted = true;
    loop = setInterval(update, 150);
  }
};

resetBtn.onclick = () => {
  clearInterval(loop);
  snake = [{ x: 7, y: 7 }];
  dx = 1;
  dy = 0;
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  gameOver = false;
  gameStarted = false;
  randomFood();
  draw();
};

randomFood();
draw();
