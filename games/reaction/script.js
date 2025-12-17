const box = document.getElementById("box");
const text = document.getElementById("text");
const result = document.getElementById("result");

let startTime = 0;
let timeout = null;
let state = "idle"; // idle, waiting, ready

function resetGame() {
  text.textContent = "Click to start";
  result.textContent = "";
  box.style.backgroundColor = "#16a34a"; // green
  state = "idle";
}

box.onclick = () => {
  if (state === "idle") {
    result.textContent = "";
    text.textContent = "Wait for green...";
    box.style.backgroundColor = "#dc2626"; // red

    const delay = Math.random() * 3000 + 1000;
    state = "waiting";

    timeout = setTimeout(() => {
      box.style.backgroundColor = "#16a34a"; // green
      text.textContent = "CLICK!";
      startTime = performance.now();
      state = "ready";
    }, delay);

  } else if (state === "waiting") {
    clearTimeout(timeout);
    box.style.backgroundColor = "#f59e0b"; // orange for too soon
    text.textContent = "❌ Too soon! Click to try again.";
    state = "idle";

  } else if (state === "ready") {
    const reaction = Math.round(performance.now() - startTime);
    result.textContent = `⏱️ ${reaction} ms`;
    text.textContent = "Click to try again";
    state = "done";

    // Auto reload after 10 seconds
    setTimeout(resetGame, 10000);
  }
};

// Initialize
resetGame();
