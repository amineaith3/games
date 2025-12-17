const display = document.getElementById("display");
const input = document.getElementById("input");
const message = document.getElementById("message");
const roundEl = document.getElementById("round");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let sequence = [];
let round = 1;
let waitingForInput = false;

// Generate random number 0-9
function generateNextNumber() {
  return Math.floor(Math.random() * 10);
}

// Show sequence one number at a time
async function showSequence() {
  waitingForInput = true;
  input.value = "";
  input.disabled = true;
  message.textContent = "";
  
  for (let num of sequence) {
    display.textContent = num;
    await new Promise(r => setTimeout(r, 800));
    display.textContent = "";
    await new Promise(r => setTimeout(r, 300));
  }

  input.disabled = false;
  input.focus();
  waitingForInput = true;
}

// Generate new random sequence of length = round
function nextRound() {
  sequence = Array.from({ length: round }, generateNextNumber);
  roundEl.textContent = `Round: ${round}`;
  showSequence();
}

// Handle user input
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && waitingForInput) {
    const guess = input.value.split("").map(Number);

    if (guess.length !== sequence.length) {
      message.textContent = "💀 Wrong length!";
      return;
    }

    for (let i = 0; i < sequence.length; i++) {
      if (guess[i] !== sequence[i]) {
        message.textContent = `💀 Wrong sequence! Game over.`;
        waitingForInput = false;
        input.disabled = true;
        return;
      }
    }

    message.textContent = "✅ Correct!";
    round++;
    waitingForInput = false;
    setTimeout(nextRound, 800);
  }
});

// Start button
startBtn.onclick = () => {
  sequence = [];
  round = 1;
  nextRound();
};

// Reset button
resetBtn.onclick = () => {
  sequence = [];
  round = 1;
  display.textContent = "";
  input.value = "";
  input.disabled = true;
  message.textContent = "";
  roundEl.textContent = `Round: ${round}`;
  waitingForInput = false;
};
