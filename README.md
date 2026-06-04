# Sirius Games 🎮

A curated collection of 10 browser-based mini-games built entirely from scratch using **Vanilla HTML, CSS, and JavaScript**. 

This project explores fundamental game development concepts—such as state management, collision detection, game loops, physics, and UI interactions—without relying on heavy frameworks or game engines.

## 🚀 Live Demo
Play the games live at: [games.sirius-aah.com](https://games.sirius-aah.com)

---

## 🕹️ Game Implementations & Logic Breakdown

### 1. Ping Game (DOM-based)
**Concept:** Logical Puzzle (Lights Out), Event handling, Grid indexing.
**How it works:** A puzzle game where the user must click a cell to toggle its state and the state of its immediate neighbors. The goal is to turn all pieces black. It relies on a CSS grid and mathematical coordinate checks to invert the neighboring cell states accurately without wrapping around the board.

### 2. Hangman (DOM-based)
**Concept:** String manipulation, Array filtering, Keyboard Events.
**How it works:** A hidden word is chosen from a dictionary array. As the user types letters, the game listens to `keydown` events, checks if the letter exists in the string (using `includes()` or `indexOf()`), and either reveals the letter in the UI or decreases the life counter, rendering a new part of the hangman figure.

### 3. Memory Game (DOM-based)
**Concept:** Array shuffling, State machines, `setTimeout()`.
**How it works:** A grid of cards is generated and randomly shuffled (often using the Fisher-Yates algorithm). The game uses a state machine to track if `0`, `1`, or `2` cards are currently flipped. When 2 cards are flipped, it compares their hidden values. If they match, they stay visible; if not, a `setTimeout()` flips them back after a short delay.

### 4. Snake (HTML5 Canvas)
**Concept:** `requestAnimationFrame()`, Grid-based movement, Collision detection.
**How it works:** Rendered on a 2D Canvas context. The snake is represented as an array of coordinate objects `[{x, y}]`. On every frame, a new head is pushed to the array in the current direction of movement. If the head touches the food, the tail is kept (snake grows). If not, the last tail segment is popped. Collision is calculated by checking if the head coordinates match any wall boundary or any body segment coordinates.

### 5. Pong (HTML5 Canvas)
**Concept:** 2D Physics, Velocity, Bounding Box Collision.
**How it works:** The ball has `dx` and `dy` (velocity) properties. On each frame, the ball's position updates based on its velocity. If it hits the top or bottom wall, `dy` is inverted (`dy = -dy`). If it hits a paddle (using Axis-Aligned Bounding Box collision), `dx` is inverted. The CPU paddle follows the ball's `y` coordinate with a slight speed handicap to make it beatable.

### 6. Flappy Box (HTML5 Canvas)
**Concept:** Gravity simulation, Vertical Velocity, Procedural generation.
**How it works:** The player character (box) has a constant downward force (gravity) applied to its vertical velocity (`vy`) every frame. Pressing space applies a negative impulse to `vy`, making it jump. Pipes are generated at regular intervals and pushed into an array, moving steadily to the left. The game loops through the pipes array to render them and perform collision checks against the player's bounding box.

### 7. Tic Tac Toe (DOM-based)
**Concept:** Grid logic, Win condition checking, Turn-based state.
**How it works:** A simple 3x3 grid using arrays to track X's and O's. On every turn, it checks an array of 8 possible winning line combinations to determine if a player has won or if the board is full (draw).

### 8. Connect 4 (DOM-based)
**Concept:** 2D Arrays, Gravity-simulated grid insertion, Multi-directional win checking.
**How it works:** A 6x7 grid tracked via a 2D array. When a column is clicked, the disc "falls" to the lowest available row. It then checks vertically, horizontally, and diagonally for 4 consecutive identical discs to determine the winner.

### 9. 2048 (DOM-based)
**Concept:** Array shifting/merging, Matrix transposition, Keyboard/Swipe event handling.
**How it works:** Uses a 4x4 array. Sliding tiles involves filtering non-zero elements, merging adjacent duplicates, and padding with zeros. For vertical moves, it temporarily transposes the rows into columns, applies the horizontal slide logic, and transposes back. Supports both arrow keys and mobile touch swipes.

### 10. Minesweeper (DOM-based)
**Concept:** Recursive revealing (Flood fill), Grid neighbor calculations, Left/Right click handling.
**How it works:** A 10x10 grid with randomly distributed mines. Neighbor mine counts are pre-calculated. Clicking an empty cell uses a recursive flood-fill algorithm to reveal all adjacent safe cells. Right-clicking (`contextmenu` event) places flags to mark suspected mines and track remaining mines.

---

## 🛠️ Technologies Used
- **HTML5**: Semantic structure and `<canvas>` elements for rendering physics-based games.
- **CSS3 / Tailwind CSS**: Responsive, modern styling for the main hub interface.
- **Vanilla JavaScript (ES6+)**: Core game logic, DOM manipulation, `requestAnimationFrame`, math operations, and event handling.

## 👨‍💻 Local Development
To run this project locally, simply clone the repository and open `index.html` in your browser. No build steps, bundlers, or servers required!

```bash
git clone https://github.com/amineaith3/games.git
cd games
start index.html
```

## 📄 License
Built by [Amine Ait Hamma](https://github.com/amineaith3). All rights reserved.
