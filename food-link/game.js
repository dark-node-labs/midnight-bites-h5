const LEVELS = [
  { name: "Snack Start", rows: 4, cols: 6, foodCount: 12, time: 150 },
  { name: "Fast Food Mix", rows: 4, cols: 7, foodCount: 14, time: 165 },
  { name: "Sweet Counter", rows: 5, cols: 6, foodCount: 15, time: 175 },
  { name: "Picnic Plate", rows: 4, cols: 8, foodCount: 16, time: 185 },
  { name: "Dessert Rush", rows: 6, cols: 6, foodCount: 18, time: 200 },
  { name: "Lunch Break", rows: 5, cols: 8, foodCount: 20, time: 215 },
  { name: "Market Basket", rows: 6, cols: 7, foodCount: 21, time: 225 },
  { name: "Big Buffet", rows: 6, cols: 8, foodCount: 24, time: 240 },
  { name: "Party Platter", rows: 7, cols: 8, foodCount: 28, time: 265 },
  { name: "Master Feast", rows: 8, cols: 8, foodCount: 32, time: 295 },
  { name: "Quick Snack", rows: 4, cols: 6, foodCount: 12, time: 115 },
  { name: "Speedy Fries", rows: 4, cols: 7, foodCount: 14, time: 125 },
  { name: "Candy Sprint", rows: 5, cols: 6, foodCount: 15, time: 135 },
  { name: "Pizza Panic", rows: 4, cols: 8, foodCount: 16, time: 145 },
  { name: "Donut Dash", rows: 6, cols: 6, foodCount: 18, time: 160 },
  { name: "Burger Blitz", rows: 5, cols: 8, foodCount: 20, time: 170 },
  { name: "Fruit Frenzy", rows: 6, cols: 7, foodCount: 21, time: 180 },
  { name: "Buffet Rush", rows: 6, cols: 8, foodCount: 24, time: 195 },
  { name: "Feast Trial", rows: 7, cols: 8, foodCount: 28, time: 215 },
  { name: "Grand Feast", rows: 8, cols: 8, foodCount: 32, time: 240 },
];

const foodArt = [
  ["Burger", "🍔"],
  ["Fries", "🍟"],
  ["Hot Dog", "🌭"],
  ["Pizza", "🍕"],
  ["Donut", "🍩"],
  ["Ice Cream", "🍦"],
  ["Cake", "🍰"],
  ["Cupcake", "🧁"],
  ["Cookie", "🍪"],
  ["Popcorn", "🍿"],
  ["Pretzel", "🥨"],
  ["Sandwich", "🥪"],
  ["Taco", "🌮"],
  ["Burrito", "🌯"],
  ["Pancakes", "🥞"],
  ["Waffle", "🧇"],
  ["Croissant", "🥐"],
  ["Bread", "🍞"],
  ["Apple", "🍎"],
  ["Banana", "🍌"],
  ["Strawberry", "🍓"],
  ["Watermelon", "🍉"],
  ["Chocolate", "🍫"],
  ["Lollipop", "🍭"],
  ["Candy", "🍬"],
  ["Cheese", "🧀"],
  ["Pie", "🥧"],
  ["Bacon", "🥓"],
  ["Egg", "🥚"],
  ["Soda", "🥤"],
  ["Grapes", "🍇"],
  ["Peach", "🍑"],
];

const foods = foodArt.map(([name, emoji]) => [
  name,
  makeFoodImage(name, emoji),
  emoji,
]);

function makeFoodImage(name, emoji) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="11" stdDeviation="9" flood-color="#51341d" flood-opacity=".28"/>
        </filter>
      </defs>
      <text x="120" y="124" text-anchor="middle" dominant-baseline="middle"
        font-size="148" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
        filter="url(#shadow)">${emoji}</text>
      <title>${name}</title>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const boardEl = document.getElementById("board");
const boardWrapEl = document.querySelector(".board-wrap");
const pathLayer = document.getElementById("path-layer");
const levelEl = document.getElementById("level");
const levelNameEl = document.getElementById("level-name");
const scoreEl = document.getElementById("score");
const matchesEl = document.getElementById("matches");
const pairsLabelEl = document.getElementById("pairs-label");
const timerEl = document.getElementById("timer");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayButton = document.getElementById("overlay-button");
const pauseButton = document.getElementById("pause");
const musicButton = document.getElementById("music");
const sfxButton = document.getElementById("sfx");

let grid = [];
let levelIndex = 0;
let level = LEVELS[levelIndex];
let selected = null;
let score = 0;
let matches = 0;
let timeLeft = level.time;
let running = true;
let paused = false;
let sfxMuted = Boolean(navigator.webdriver);
let musicMuted = true;
let lastTick = performance.now();
let hintTiles = [];
let wonLevel = false;
let audioCtx = null;
let musicTimer = null;
let musicStep = 0;

const MUSIC_THEME = [
  { note: 523.25, harmony: 659.25, length: 0.18 },
  { note: 587.33, harmony: 783.99, length: 0.16 },
  { note: 659.25, harmony: 880.0, length: 0.18 },
  { note: 783.99, harmony: 987.77, length: 0.2 },
  { note: 659.25, harmony: 783.99, length: 0.16 },
  { note: 587.33, harmony: 739.99, length: 0.18 },
  { note: 493.88, harmony: 659.25, length: 0.2 },
  { note: 523.25, harmony: 698.46, length: 0.22 },
];

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeGrid() {
  const pairItems = foods.slice(0, level.foodCount).flatMap((food, id) => [
    { id, name: food[0], image: food[1], icon: food[2] },
    { id, name: food[0], image: food[1], icon: food[2] },
  ]);
  const shuffled = shuffle(pairItems);
  grid = Array.from({ length: level.rows + 2 }, () => Array(level.cols + 2).fill(null));
  for (let r = 1; r <= level.rows; r += 1) {
    for (let c = 1; c <= level.cols; c += 1) {
      grid[r][c] = shuffled[(r - 1) * level.cols + (c - 1)];
    }
  }
}

function render() {
  updateBoardMetrics();
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${level.cols}, var(--tile))`;
  levelEl.textContent = `${levelIndex + 1}`;
  levelNameEl.textContent = level.name;
  for (let r = 1; r <= level.rows; r += 1) {
    for (let c = 1; c <= level.cols; c += 1) {
      const item = grid[r][c];
      if (!item) {
        const empty = document.createElement("div");
        empty.className = "tile empty";
        empty.style.visibility = "hidden";
        boardEl.appendChild(empty);
        continue;
      }
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.dataset.row = r;
      tile.dataset.col = c;
      tile.dataset.id = item.id;
      tile.setAttribute("aria-label", item.name);
      if (selected?.r === r && selected?.c === c) tile.classList.add("selected");
      if (hintTiles.some((pos) => pos.r === r && pos.c === c)) tile.classList.add("hint");
      tile.innerHTML = `<span class="food-icon" aria-hidden="true">${item.icon}</span><span class="food-label">${item.name}</span>`;
      tile.addEventListener("click", () => pickTile(r, c));
      boardEl.appendChild(tile);
    }
  }
  scoreEl.textContent = String(score);
  matchesEl.textContent = `${matches}`;
  pairsLabelEl.textContent = `/${level.foodCount} pairs`;
  timerEl.textContent = formatTime(timeLeft);
  updateControlButtons();
  sizePathLayer();
}

function updateBoardMetrics() {
  boardEl.style.setProperty("--cols", level.cols);
  boardEl.style.setProperty("--rows", level.rows);
  if (!boardWrapEl) return;

  const styles = getComputedStyle(boardEl);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  const wrapStyles = getComputedStyle(boardWrapEl);
  const horizontalPadding =
    (Number.parseFloat(wrapStyles.paddingLeft) || 0) +
    (Number.parseFloat(wrapStyles.paddingRight) || 0);
  const availableWidth = boardWrapEl.clientWidth - horizontalPadding;
  const maxTile = window.matchMedia("(max-width: 760px)").matches ? 58 : 76;
  const minTile = window.matchMedia("(max-width: 360px)").matches
    ? 28
    : window.matchMedia("(max-width: 420px)").matches
      ? 31
      : 42;
  const fittedTile = Math.floor((availableWidth - gap * (level.cols - 1)) / level.cols);
  const tile = Math.max(minTile, Math.min(maxTile, fittedTile));

  document.documentElement.style.setProperty("--tile", `${tile}px`);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function pickTile(r, c) {
  if (!running || paused || !grid[r][c]) return;
  clearHint();
  if (selected?.r === r && selected?.c === c) {
    selected = null;
    render();
    return;
  }
  if (!selected) {
    selected = { r, c };
    render();
    return;
  }
  const first = selected;
  const second = { r, c };
  selected = null;
  const path = canConnect(first, second);
  if (path && grid[first.r][first.c].id === grid[second.r][second.c].id) {
    removePair(first, second, path);
  } else {
    playSfx(120, "square", 90);
    selected = second;
    render();
  }
}

function isEmpty(r, c, target) {
  if (target && target.r === r && target.c === c) return true;
  return r >= 0 && r < level.rows + 2 && c >= 0 && c < level.cols + 2 && !grid[r][c];
}

function clearRow(r, c1, c2, target) {
  const [start, end] = [Math.min(c1, c2), Math.max(c1, c2)];
  for (let c = start + 1; c < end; c += 1) {
    if (!isEmpty(r, c, target)) return false;
  }
  return true;
}

function clearCol(c, r1, r2, target) {
  const [start, end] = [Math.min(r1, r2), Math.max(r1, r2)];
  for (let r = start + 1; r < end; r += 1) {
    if (!isEmpty(r, c, target)) return false;
  }
  return true;
}

function canConnect(a, b) {
  if (a.r === b.r && a.c === b.c) return null;
  if (grid[a.r][a.c]?.id !== grid[b.r][b.c]?.id) return null;
  if (a.r === b.r && clearRow(a.r, a.c, b.c, b)) return [a, b];
  if (a.c === b.c && clearCol(a.c, a.r, b.r, b)) return [a, b];

  const corner1 = { r: a.r, c: b.c };
  if (isEmpty(corner1.r, corner1.c, b) && clearRow(a.r, a.c, corner1.c, b) && clearCol(b.c, a.r, b.r, b)) {
    return [a, corner1, b];
  }
  const corner2 = { r: b.r, c: a.c };
  if (isEmpty(corner2.r, corner2.c, b) && clearCol(a.c, a.r, corner2.r, b) && clearRow(b.r, a.c, b.c, b)) {
    return [a, corner2, b];
  }

  for (let r = 0; r < level.rows + 2; r += 1) {
    const p1 = { r, c: a.c };
    const p2 = { r, c: b.c };
    if (
      isEmpty(p1.r, p1.c, b) &&
      isEmpty(p2.r, p2.c, b) &&
      clearCol(a.c, a.r, p1.r, b) &&
      clearRow(r, a.c, b.c, b) &&
      clearCol(b.c, p2.r, b.r, b)
    ) {
      return [a, p1, p2, b];
    }
  }

  for (let c = 0; c < level.cols + 2; c += 1) {
    const p1 = { r: a.r, c };
    const p2 = { r: b.r, c };
    if (
      isEmpty(p1.r, p1.c, b) &&
      isEmpty(p2.r, p2.c, b) &&
      clearRow(a.r, a.c, p1.c, b) &&
      clearCol(c, a.r, b.r, b) &&
      clearRow(b.r, p2.c, b.c, b)
    ) {
      return [a, p1, p2, b];
    }
  }
  return null;
}

function tileCenter(pos) {
  const boardRect = boardEl.getBoundingClientRect();
  const layerRect = pathLayer.getBoundingClientRect();
  const tile = boardEl.querySelector(`[data-row="${pos.r}"][data-col="${pos.c}"]`);
  if (tile) {
    const rect = tile.getBoundingClientRect();
    return {
      x: rect.left - layerRect.left + rect.width / 2,
      y: rect.top - layerRect.top + rect.height / 2,
    };
  }
  const tileSize = boardRect.width / level.cols;
  return {
    x: (pos.c - 0.5) * tileSize - (boardRect.left - layerRect.left),
    y: (pos.r - 0.5) * tileSize - (boardRect.top - layerRect.top),
  };
}

function drawPath(path) {
  pathLayer.innerHTML = "";
  const points = path.map(tileCenter);
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points.map((p) => `${p.x},${p.y}`).join(" "));
  polyline.setAttribute("class", "link-path");
  pathLayer.appendChild(polyline);
  setTimeout(() => {
    pathLayer.innerHTML = "";
  }, 260);
}

function removePair(a, b, path) {
  drawPath(path);
  playSfx(520, "sine", 80);
  score += Math.max(50, 130 + timeLeft + levelIndex * 35 - matches * 4);
  matches += 1;
  const firstTile = boardEl.querySelector(`[data-row="${a.r}"][data-col="${a.c}"]`);
  const secondTile = boardEl.querySelector(`[data-row="${b.r}"][data-col="${b.c}"]`);
  firstTile?.classList.add("removing");
  secondTile?.classList.add("removing");
  setTimeout(() => {
    grid[a.r][a.c] = null;
    grid[b.r][b.c] = null;
    if (matches === level.foodCount) endGame(true);
    if (running) ensurePlayableBoard();
    render();
  }, 170);
}

function findPair() {
  const positions = [];
  for (let r = 1; r <= level.rows; r += 1) {
    for (let c = 1; c <= level.cols; c += 1) {
      if (grid[r][c]) positions.push({ r, c });
    }
  }
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      if (canConnect(positions[i], positions[j])) return [positions[i], positions[j]];
    }
  }
  return null;
}

function getOccupiedPositions() {
  const positions = [];
  for (let r = 1; r <= level.rows; r += 1) {
    for (let c = 1; c <= level.cols; c += 1) {
      if (grid[r][c]) positions.push({ r, c, item: grid[r][c] });
    }
  }
  return positions;
}

function forcePlayablePair() {
  const positions = getOccupiedPositions();
  const byId = new Map();
  for (const pos of positions) {
    if (!byId.has(pos.item.id)) byId.set(pos.item.id, []);
    byId.get(pos.item.id).push(pos);
  }
  const pair = [...byId.values()].find((group) => group.length >= 2);
  if (!pair) return;

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const a = positions[i];
      const b = positions[j];
      if (a.r === b.r && Math.abs(a.c - b.c) === 1) {
        const firstItem = pair[0].item;
        const secondItem = pair[1].item;
        grid[pair[0].r][pair[0].c] = a.item;
        grid[pair[1].r][pair[1].c] = b.item;
        grid[a.r][a.c] = firstItem;
        grid[b.r][b.c] = secondItem;
        return;
      }
    }
  }
}

function showHint() {
  if (!running || paused) return;
  const pair = findPair();
  if (!pair) {
    shuffleRemaining(true);
    return;
  }
  hintTiles = pair;
  score = Math.max(0, score - 20);
  render();
}

function clearHint() {
  hintTiles = [];
}

function collectRemainingItems() {
  const items = [];
  for (let r = 1; r <= level.rows; r += 1) {
    for (let c = 1; c <= level.cols; c += 1) {
      if (grid[r][c]) items.push(grid[r][c]);
    }
  }
  return items;
}

function placeRemainingItems(items) {
  let index = 0;
  for (let r = 1; r <= level.rows; r += 1) {
    for (let c = 1; c <= level.cols; c += 1) {
      if (grid[r][c]) {
        grid[r][c] = items[index];
        index += 1;
      }
    }
  }
}

function shuffleRemaining(manual = false) {
  if (manual && (!running || paused)) return;
  const items = collectRemainingItems();
  if (items.length < 2) return;
  for (let attempts = 0; attempts < 30; attempts += 1) {
    placeRemainingItems(shuffle(items));
    if (findPair()) break;
  }
  if (!findPair()) forcePlayablePair();
  selected = null;
  clearHint();
  if (manual) score = Math.max(0, score - 35);
  render();
}

function ensurePlayableBoard() {
  const remaining = level.rows * level.cols - matches * 2;
  if (remaining <= 0 || findPair()) return;
  shuffleRemaining(false);
}

function endGame(won) {
  running = false;
  paused = false;
  stopMusicLoop();
  wonLevel = won;
  const lastLevel = levelIndex === LEVELS.length - 1;
  overlayTitle.textContent = won
    ? lastLevel
      ? "Master feast cleared!"
      : `Level ${levelIndex + 1} cleared!`
    : "Time is up!";
  overlayButton.textContent = won ? (lastLevel ? "Play Again" : "Next Level") : "Try Again";
  overlay.classList.remove("hidden");
}

function startLevel(index, resetScore = false) {
  levelIndex = index;
  level = LEVELS[levelIndex];
  makeGrid();
  while (!findPair()) makeGrid();
  selected = null;
  if (resetScore) score = 0;
  matches = 0;
  timeLeft = level.time;
  running = true;
  paused = false;
  wonLevel = false;
  clearHint();
  overlay.classList.add("hidden");
  lastTick = performance.now();
  if (!musicMuted) startMusicLoop();
  render();
}

function newGame() {
  startLevel(0, true);
}

function continueFromOverlay() {
  if (paused) {
    resumeGame();
    return;
  }
  if (wonLevel && levelIndex < LEVELS.length - 1) {
    startLevel(levelIndex + 1);
    return;
  }
  if (wonLevel) {
    startLevel(0, true);
    return;
  }
  startLevel(levelIndex);
}

function tick(now) {
  if (running && !paused && now - lastTick >= 1000) {
    const elapsed = Math.floor((now - lastTick) / 1000);
    timeLeft -= elapsed;
    lastTick += elapsed * 1000;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame(false);
    }
    render();
  }
  requestAnimationFrame(tick);
}

function advanceTime(ms) {
  if (!running || paused) return;
  timeLeft = Math.max(0, timeLeft - Math.floor(ms / 1000));
  if (timeLeft === 0) endGame(false);
  render();
}

function sizePathLayer() {
  pathLayer.setAttribute("viewBox", `0 0 ${pathLayer.clientWidth} ${pathLayer.clientHeight}`);
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playSfx(freq, type, duration) {
  if (sfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(0.035, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration / 1000);
}

function playMusicNote() {
  if (musicMuted || !running || paused) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const beat = MUSIC_THEME[musicStep % MUSIC_THEME.length];
  const start = ctx.currentTime;
  const makeVoice = (freq, volume, delay = 0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const voiceStart = start + delay;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, voiceStart);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.01, voiceStart + beat.length);
    gain.gain.setValueAtTime(0.0001, voiceStart);
    gain.gain.exponentialRampToValueAtTime(volume, voiceStart + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, voiceStart + beat.length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(voiceStart);
    osc.stop(voiceStart + beat.length + 0.03);
  };

  makeVoice(beat.note, 0.012);
  if (musicStep % 2 === 0) makeVoice(beat.harmony, 0.006, 0.035);
  if (musicStep % 4 === 0) makeVoice(beat.note / 2, 0.004, 0.02);
  musicStep += 1;
}

function startMusicLoop() {
  if (musicTimer || musicMuted || paused || !running) return;
  playMusicNote();
  musicTimer = window.setInterval(playMusicNote, 360);
}

function stopMusicLoop() {
  if (!musicTimer) return;
  window.clearInterval(musicTimer);
  musicTimer = null;
}

function updateControlButtons() {
  pauseButton.textContent = paused ? "Resume" : "Pause";
  pauseButton.setAttribute("aria-pressed", String(paused));
  musicButton.textContent = musicMuted ? "Music Off" : "Music On";
  musicButton.setAttribute("aria-pressed", String(!musicMuted));
  sfxButton.textContent = sfxMuted ? "SFX Off" : "SFX On";
  sfxButton.setAttribute("aria-pressed", String(!sfxMuted));
}

function pauseGame() {
  if (!running || paused) return;
  paused = true;
  stopMusicLoop();
  overlayTitle.textContent = "Paused";
  overlayButton.textContent = "Resume";
  overlay.classList.remove("hidden");
  updateControlButtons();
}

function resumeGame() {
  if (!paused) return;
  paused = false;
  overlay.classList.add("hidden");
  lastTick = performance.now();
  if (!musicMuted) startMusicLoop();
  updateControlButtons();
}

function togglePause() {
  if (paused) {
    resumeGame();
    return;
  }
  pauseGame();
}

function toggleMusic() {
  musicMuted = !musicMuted;
  if (musicMuted) {
    stopMusicLoop();
  } else {
    startMusicLoop();
  }
  updateControlButtons();
}

function toggleSfx() {
  sfxMuted = !sfxMuted;
  updateControlButtons();
}

document.getElementById("new-game").addEventListener("click", newGame);
overlayButton.addEventListener("click", continueFromOverlay);
document.getElementById("hint").addEventListener("click", showHint);
document.getElementById("shuffle").addEventListener("click", () => shuffleRemaining(true));
pauseButton.addEventListener("click", togglePause);
musicButton.addEventListener("click", toggleMusic);
sfxButton.addEventListener("click", toggleSfx);
window.addEventListener("resize", () => {
  updateBoardMetrics();
  sizePathLayer();
});

window.render_game_to_text = () => JSON.stringify({
  note: "Grid origin is the top-left visible tile; rows and columns are 1-based.",
  level: levelIndex + 1,
  levelName: level.name,
  rows: level.rows,
  cols: level.cols,
  running,
  paused,
  score,
  matches,
  pairsTotal: level.foodCount,
  timeLeft,
  selected,
  remainingTiles: level.rows * level.cols - matches * 2,
  availablePair: findPair(),
});
window.advanceTime = advanceTime;

newGame();
requestAnimationFrame(tick);
