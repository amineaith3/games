const words = [
    "javascript", "hangman", "tailwind", "programming", "developer",
    "function", "variable", "algorithm", "interface", "object",
    "array", "string", "boolean", "condition", "loop",
    "recursion", "callback", "promise", "event", "document",
    "element", "style", "browser", "node", "module",
    "class", "syntax", "debugging", "framework", "library"
  ];
  
  let chosenWord = "";
  let displayWord = [];
  let lives = 8;
  const guessed = new Set();
  
  const wordEl = document.getElementById("word");
  const livesEl = document.getElementById("lives");
  const lettersEl = document.getElementById("letters");
  const messageEl = document.getElementById("message");
  const resetBtn = document.getElementById("reset");
  
  function startGame() {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    displayWord = Array(chosenWord.length).fill("_");
    lives = 8;
    guessed.clear();
    wordEl.textContent = displayWord.join(" ");
    livesEl.textContent = `Lives: ${lives}`;
    messageEl.textContent = "";
  
    lettersEl.innerHTML = "";
    "abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
      const btn = document.createElement("button");
      btn.textContent = letter.toUpperCase();
      btn.className = "bg-red-600 hover:bg-red-500 p-2 rounded font-semibold";
      btn.onclick = () => guessLetter(letter, btn);
      lettersEl.appendChild(btn);
    });
  }
  
  // Main guessing logic
  function guessLetter(letter, btn = null) {
    if (guessed.has(letter) || lives <= 0) return;
  
    guessed.add(letter);
  
    if (btn) {
      btn.disabled = true;
      btn.classList.add("opacity-50");
    } else {
      // Disable corresponding button if user typed
      const button = [...lettersEl.children].find(b => b.textContent.toLowerCase() === letter);
      if (button) {
        button.disabled = true;
        button.classList.add("opacity-50");
      }
    }
  
    if (chosenWord.includes(letter)) {
      chosenWord.split("").forEach((l, i) => {
        if (l === letter) displayWord[i] = letter.toUpperCase();
      });
      wordEl.textContent = displayWord.join(" ");
      if (!displayWord.includes("_")) {
        messageEl.textContent = "🎉 You Win!";
      }
    } else {
      lives--;
      livesEl.textContent = `Lives: ${lives}`;
      if (lives === 0) {
        messageEl.textContent = `💀 Game Over! Word was: ${chosenWord.toUpperCase()}`;
        wordEl.textContent = chosenWord.toUpperCase().split("").join(" ");
      }
    }
  }
  
  // Listen to keyboard input
  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key)) {
      guessLetter(key);
    }
  });
  
  resetBtn.onclick = startGame;
  startGame();
  