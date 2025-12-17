const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const paddle = { x: 10, y: 150, width: 10, height: 80, dy: 0 };
const ball = { x: 3 * canvas.width / 4, y: canvas.height / 2, radius: 8, dx: -3, dy: 3 };

let score = 0;
let gameOver = false;

// Draw everything
function draw() {
  ctx.fillStyle = "#0e7490"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paddle
  ctx.fillStyle = "#22d3ee";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

// Update game state
function update() {
  if (gameOver) return;

  // Move paddle
  paddle.y += paddle.dy;
  if (paddle.y < 0) paddle.y = 0;
  if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Bounce top & bottom
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Bounce right wall
  if (ball.x + ball.radius > canvas.width) {
    ball.dx = -ball.dx;
  }

  // Paddle collision
  if (
    ball.x - ball.radius <= paddle.x + paddle.width &&
    ball.y >= paddle.y &&
    ball.y <= paddle.y + paddle.height
  ) {
    // Compute hit point relative to paddle center (-1 to 1)
    const relativeIntersectY = (paddle.y + paddle.height / 2) - ball.y;
    const normalized = relativeIntersectY / (paddle.height / 2);

    // Maximum bounce angle in radians (~75 degrees)
    const maxBounce = Math.PI / 3;

    // Set new velocities
    const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
    ball.dx = speed * Math.cos(normalized * maxBounce);
    ball.dy = -speed * Math.sin(normalized * maxBounce);

    // Ensure ball goes to the right direction
    if (ball.dx < 0) ball.dx = -ball.dx;

    score++;
    scoreEl.textContent = `Score: ${score}`;
  }

  // Ball missed
  if (ball.x - ball.radius < 0) {
    gameOver = true;
    alert(`💀 Game Over! Score: ${score}`);
  }

  draw();
}

// Paddle controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") paddle.dy = -5;
  if (e.key === "ArrowDown") paddle.dy = 5;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") paddle.dy = 0;
});

// Reset button
document.getElementById("reset").onclick = () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -3;
  ball.dy = 3;
  paddle.y = canvas.height / 2 - paddle.height / 2;
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  gameOver = false;
};

// Start game loop
setInterval(update, 20);
