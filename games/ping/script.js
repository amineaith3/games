// THEME SWITCH
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("themeToggle");

  btn.onclick = () => {
      const html = document.documentElement;

      // toggle class
      if (html.classList.contains("dark")) {
          html.classList.remove("dark");
          localStorage.setItem("theme", "light");
      } else {
          html.classList.add("dark");
          localStorage.setItem("theme", "dark");
      }
  };
});

// --- GAME STATE ---
const ROWS = 6;
const COLS = 6;
let flag = Array(ROWS * COLS).fill(0);
let touches = 0;

// translate index ↔ row/col
function idx(r, c) {
  return r * COLS + c;
}

// toggle a single cell
function toggleCell(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;

  const index = idx(r, c);
  const id = String.fromCharCode(97 + r) + (c + 1);
  const mode = document.documentElement.classList.contains("dark");

  flag[index] = flag[index] ? 0 : 1;

  // Black in both modes → stays black
  // OFF = grey (light) or dark grey (dark mode)
  document.getElementById(id).style.backgroundColor =
      flag[index]
          ? "black"
          : mode
              ? "#4b5563"  // dark grey
              : "#9ca3af"; // light grey
}


// toggle cell + neighbors (8 directions)
function handleTouch(r, c) {
  const dirs = [
      [-1, 0],  // up
      [1, 0],   // down
      [0, -1],  // left
      [0, 1],   // right
      [-1, -1], // up-left
      [-1, 1],  // up-right
      [1, -1],  // down-left
      [1, 1]    // down-right
  ];

  dirs.forEach(([dr, dc]) => toggleCell(r + dr, c + dc));

  touches++;
  checkWin();
}

// attach all grid click events automatically
function setup() {
  for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
          const id = String.fromCharCode(97 + r) + (c + 1); // a1..f6
          document.getElementById(id).onclick = () => handleTouch(r, c);
      }
  }
}

function checkWin() {
  if (flag.every(v => v === 1)) {
      setTimeout(() => {
          alert("You win!!\nTouches: " + touches);
          setTimeout(() => location.reload(), 5000);
      }, 500);
  }
}

function info() {
  if (touches > 200) {
      alert(
          "Tip:\n" +
          "Think of the board as a 6×6 matrix.\n" +
          "Cells toggle themselves + all 8 neighbors.\n" +
          "You can win in under 20 touches."
      );
  }
}

function returner() {
  window.location.href = "https://compilcourt.w3spaces.com/big_linker/main_page.html";
}
// Auto-generate the 6×6 grid
window.onload = () => {
  const grid = document.getElementById("grid");

  for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
          const id = String.fromCharCode(97 + r) + (c + 1); // a1..f6

          const cell = document.createElement("div");
          cell.id = id;
          cell.className = "w-12 h-12 bg-gray-400 dark:bg-gray-600 rounded cursor-pointer hover:opacity-80 transition";

          
          cell.onclick = () => handleTouch(r, c);

          grid.appendChild(cell);
      }
  }
};



