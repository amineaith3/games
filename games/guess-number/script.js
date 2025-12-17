let target = Math.floor(Math.random() * 100) + 1;
let tries = 0;

const guessInput = document.getElementById("guess");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");

function checkGuess() {
  const value = Number(guessInput.value);
  if (!value || value < 1 || value > 100) {
    message.textContent = "Please enter a number between 1 and 100.";
    return;
  }

  tries++;
  attempts.textContent = `Attempts: ${tries}`;

  if (value === target) {
    message.textContent = `🎉 Correct! The number was ${target}`;
    guessBtn.disabled = true;
    guessBtn.classList.add("opacity-50");
    guessInput.style.backgroundColor = "#22c55e"; // green
  } else if (value < target) {
    message.textContent = "📉 Too low!";
    guessInput.style.backgroundColor = "#1e293b"; // dark
  } else {
    message.textContent = "📈 Too high!";
    guessInput.style.backgroundColor = "#fef3c7"; // light
  }

  guessInput.value = "";
  guessInput.focus();
}

// Guess button click
guessBtn.onclick = checkGuess;

// Press Enter to guess
guessInput.addEventListener("keyup", e => {
  if (e.key === "Enter") checkGuess();
});

// Reset button
resetBtn.onclick = () => {
  target = Math.floor(Math.random() * 100) + 1;
  tries = 0;
  message.textContent = "";
  attempts.textContent = "";
  guessBtn.disabled = false;
  guessBtn.classList.remove("opacity-50");
  guessInput.value = "";
  guessInput.style.backgroundColor = "white";
  guessInput.focus();
};
