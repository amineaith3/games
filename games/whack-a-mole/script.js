const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let score = 0;
let time = 30;
let moleTimer;
let gameTimer;

function randomHole() {
  return Math.floor(Math.random() * holes.length);
}

function showMole() {
  holes.forEach(h => h.classList.remove("mole"));
  const idx = randomHole();
  holes[idx].classList.add("mole");
}

function startGame() {
  score = 0;
  time = 30;
  scoreEl.textContent = score;
  timeEl.textContent = time;

  moleTimer = setInterval(showMole, 800);

  gameTimer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
      clearInterval(moleTimer);
      clearInterval(gameTimer);
      alert(`⏰ Time's up! Score: ${score}`);
      holes.forEach(h => h.classList.remove("mole"));
    }
  }, 1000);
}

holes.forEach(hole => {
  hole.addEventListener("click", () => {
    if (hole.classList.contains("mole")) {
      score++;
      scoreEl.textContent = score;
      hole.classList.remove("mole");
    }
  });
});

startBtn.onclick = () => {
  clearInterval(moleTimer);
  clearInterval(gameTimer);
  startGame();
};

resetBtn.onclick = () => {
  clearInterval(moleTimer);
  clearInterval(gameTimer);
  startGame();
};
