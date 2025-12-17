const choices = ["rock", "paper", "scissors"];
const resultEl = document.getElementById("result");
const cpuChoiceEl = document.getElementById("cpuChoice");
const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");
const resetBtn = document.getElementById("reset");

let playerScore = 0;
let cpuScore = 0;
const winningScore = 10;
let gameOver = false;

function resetGame() {
  playerScore = 0;
  cpuScore = 0;
  gameOver = false;
  playerScoreEl.textContent = playerScore;
  cpuScoreEl.textContent = cpuScore;
  resultEl.textContent = "";
  cpuChoiceEl.textContent = "";
}

function playRound(playerChoice) {
  if (gameOver) return;

  const cpuChoice = choices[Math.floor(Math.random() * choices.length)];
  cpuChoiceEl.textContent = `CPU chose: ${cpuChoice}`;

  if (playerChoice === cpuChoice) {
    resultEl.textContent = "😐 Draw!";
  } else if (
    (playerChoice === "rock" && cpuChoice === "scissors") ||
    (playerChoice === "paper" && cpuChoice === "rock") ||
    (playerChoice === "scissors" && cpuChoice === "paper")
  ) {
    playerScore++;
    playerScoreEl.textContent = playerScore;
    resultEl.textContent = "🎉 You win this round!";
  } else {
    cpuScore++;
    cpuScoreEl.textContent = cpuScore;
    resultEl.textContent = "💀 CPU wins this round!";
  }

  if (playerScore >= winningScore) {
    resultEl.textContent = "🏆 You reached 10 points! You win the game!";
    gameOver = true;
  } else if (cpuScore >= winningScore) {
    resultEl.textContent = "💀 CPU reached 10 points! You lose the game!";
    gameOver = true;
  }
}

document.querySelectorAll(".choice").forEach(btn => {
  btn.onclick = () => playRound(btn.dataset.choice);
});

resetBtn.onclick = resetGame;

resetGame();