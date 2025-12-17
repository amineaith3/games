const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start");

const box = { x: 50, y: 200, width: 25, height: 25, dy: 0 };
const gravity = 0.5;
const jump = -6;

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;  // bigger vertical gap
let pipeInterval = 2000; // longer horizontal interval
let lastPipe = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

function resetGame() {
  box.y = 200;
  box.dy = 0;
  pipes = [];
  lastPipe = 0;
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  gameOver = false;
  gameStarted = false;
}

function draw() {
  // Background
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Box (bird)
  ctx.fillStyle = "#111111"; // blackish
  ctx.fillRect(box.x, box.y, box.width, box.height);

  // Pipes
  ctx.fillStyle = "#0369a1";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);
  });
}

function update(timestamp) {
  if (!gameStarted || gameOver) return;

  // Gravity
  box.dy += gravity;
  box.y += box.dy;

  // Floor & ceiling
  if (box.y + box.height > canvas.height || box.y < 0) {
    gameOver = true;
    alert(`💀 Game Over! Score: ${score}`);
    return;
  }

  // Pipes
  if (!lastPipe || timestamp - lastPipe > pipeInterval) {
    const topHeight = Math.random() * (canvas.height - pipeGap - 60) + 30;
    const bottomHeight = canvas.height - pipeGap - topHeight;
    pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight, passed: false });
    lastPipe = timestamp;
  }

  pipes.forEach(pipe => {
    pipe.x -= 3;

    // Collision
    if (
      box.x + box.width > pipe.x &&
      box.x < pipe.x + pipeWidth &&
      (box.y < pipe.top || box.y + box.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
      alert(`💀 Game Over! Score: ${score}`);
    }

    // Scoring
    if (!pipe.passed && pipe.x + pipeWidth < box.x) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      pipe.passed = true;
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(p => p.x + pipeWidth > 0);

  draw();
  requestAnimationFrame(update);
}

function jumpBox() {
  if (!gameOver && gameStarted) box.dy = jump;
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jumpBox();
});
canvas.addEventListener("click", jumpBox);
document.getElementById("reset").onclick = resetGame;

startBtn.onclick = () => {
  if (!gameStarted) {
    gameStarted = true;
    requestAnimationFrame(update);
  }
}

resetGame();