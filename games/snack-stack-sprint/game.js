const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const foods = {
  rice: { label: "米饭", color: "#fff8ee", mark: "米" },
  nori: { label: "海苔", color: "#2f554a", mark: "苔" },
  fish: { label: "鱼片", color: "#e85d4f", mark: "鱼" },
  egg: { label: "鸡蛋", color: "#f3b94f", mark: "蛋" },
  tea: { label: "奶茶", color: "#d95d39", mark: "茶" },
  dumpling: { label: "饺子", color: "#ead8bf", mark: "饺" },
  cake: { label: "蛋糕", color: "#dd78a0", mark: "糕" },
  wasabi: { label: "芥末", color: "#72a84f", mark: "芥" },
};

const foodIds = Object.keys(foods);
const recipes = [
  ["rice", "fish", "nori"],
  ["dumpling", "tea", "cake"],
  ["rice", "egg", "tea"],
  ["nori", "rice", "wasabi", "fish"],
  ["cake", "tea", "dumpling"],
  ["egg", "rice", "nori", "tea"],
  ["fish", "rice", "wasabi"],
  ["dumpling", "nori", "egg", "cake"],
];

const ticketSlots = [
  { x: 40, y: 110, w: 276, h: 148 },
  { x: 342, y: 110, w: 276, h: 148 },
  { x: 644, y: 110, w: 276, h: 148 },
];

const focusButton = { x: 720, y: 40, w: 192, h: 48 };

let seed = 42;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

const state = {
  mode: "menu",
  score: 0,
  streak: 0,
  bestStreak: 0,
  served: 0,
  misses: 0,
  level: 1,
  selected: 0,
  focus: 0,
  focusTimer: 0,
  spawnTimer: 0,
  recipeCursor: 0,
  tickets: [],
  tiles: [],
  floats: [],
  message: "先选订单，再从传送带抓食材。",
  messageTimer: 0,
};

function rectHit(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function pointerPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * W,
    y: ((event.clientY - rect.top) / rect.height) * H,
  };
}

function addFloat(text, x, y, color = "#a83f22") {
  state.floats.push({ text, x, y, life: 0.95, color });
}

function makeTicket() {
  const recipe = recipes[state.recipeCursor % recipes.length];
  state.recipeCursor += 1;
  return {
    recipe: [...recipe],
    progress: 0,
    patience: 100,
    maxPatience: 100,
    flash: 0,
  };
}

function neededFoods() {
  return state.tickets
    .map((ticket) => ticket.recipe[ticket.progress])
    .filter(Boolean);
}

function resetGame() {
  seed = 42;
  state.mode = "playing";
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.served = 0;
  state.misses = 0;
  state.level = 1;
  state.selected = 0;
  state.focus = 0;
  state.focusTimer = 0;
  state.spawnTimer = 0.2;
  state.recipeCursor = 0;
  state.tickets = [makeTicket(), makeTicket(), makeTicket()];
  state.tiles = [];
  state.floats = [];
  state.message = "高峰开始";
  state.messageTimer = 1.1;
}

function spawnTile() {
  const needs = neededFoods();
  const useNeed = needs.length && rand() < 0.68;
  const id = useNeed ? needs[Math.floor(rand() * needs.length)] : foodIds[Math.floor(rand() * foodIds.length)];
  const lane = Math.floor(rand() * 2);
  state.tiles.push({
    id,
    x: -60,
    y: lane ? 514 : 438,
    r: 32,
    picked: false,
  });
}

function selectedTicket() {
  return state.tickets[state.selected];
}

function failTicket(index, reason) {
  state.misses += 1;
  state.streak = 0;
  state.tickets[index] = makeTicket();
  state.selected = Math.min(state.selected, state.tickets.length - 1);
  state.message = reason;
  state.messageTimer = 1.2;
  addFloat("-订单", ticketSlots[index].x + 138, ticketSlots[index].y + 76, "#a83f22");
  if (state.misses >= 3) {
    state.mode = "gameover";
    state.message = "营业结束";
  }
}

function completeTicket(index) {
  const slot = ticketSlots[index];
  const ticket = state.tickets[index];
  const patienceBonus = Math.round(ticket.patience * 4);
  const streakBonus = state.streak * 16;
  state.score += 320 + patienceBonus + streakBonus;
  state.served += 1;
  state.focus = Math.min(100, state.focus + 18);
  state.tickets[index] = makeTicket();
  state.message = "订单完成";
  state.messageTimer = 0.9;
  addFloat(`+${320 + patienceBonus + streakBonus}`, slot.x + 138, slot.y + 72, "#2f7f79");
  if (state.served > 0 && state.served % 4 === 0) {
    state.level += 1;
    state.focus = Math.min(100, state.focus + 20);
    addFloat("速度提升", W / 2, 88, "#d95d39");
  }
}

function pickTile(tile) {
  if (state.mode !== "playing" || tile.picked) return;
  const ticket = selectedTicket();
  const expected = ticket.recipe[ticket.progress];
  if (tile.id === expected) {
    tile.picked = true;
    ticket.progress += 1;
    ticket.flash = 0.28;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const points = 70 + state.level * 8 + state.streak * 9;
    state.score += points;
    state.focus = Math.min(100, state.focus + 7);
    addFloat(`+${points}`, tile.x, tile.y - 44, "#2f7f79");
    state.message = "拿对了";
    state.messageTimer = 0.5;
    if (ticket.progress >= ticket.recipe.length) completeTicket(state.selected);
  } else {
    ticket.patience = Math.max(0, ticket.patience - 20);
    ticket.flash = 0.35;
    state.streak = 0;
    state.score = Math.max(0, state.score - 30);
    state.focus = Math.min(100, state.focus + 4);
    addFloat("拿错了", tile.x, tile.y - 44, "#a83f22");
    state.message = `现在不需要${foods[tile.id].label}`;
    state.messageTimer = 0.9;
  }
}

function activateFocus() {
  if (state.mode !== "playing" || state.focus < 100 || state.focusTimer > 0) return;
  state.focus = 0;
  state.focusTimer = 5.5;
  state.message = "专注时刻";
  state.messageTimer = 1;
  addFloat("专注", focusButton.x + 96, focusButton.y + 78, "#d95d39");
}

function handlePointer(event) {
  event.preventDefault();
  const p = pointerPoint(event);
  if (state.mode === "menu" || state.mode === "gameover") {
    resetGame();
    return;
  }
  if (rectHit(focusButton, p.x, p.y)) {
    activateFocus();
    return;
  }
  const ticketIndex = ticketSlots.findIndex((slot) => rectHit(slot, p.x, p.y));
  if (ticketIndex >= 0) {
    state.selected = ticketIndex;
    state.message = `已选择订单 ${ticketIndex + 1}`;
    state.messageTimer = 0.7;
    return;
  }
  for (let i = state.tiles.length - 1; i >= 0; i -= 1) {
    const tile = state.tiles[i];
    if (Math.hypot(p.x - tile.x, p.y - tile.y) <= tile.r + 10) {
      pickTile(tile);
      return;
    }
  }
}

canvas.addEventListener("pointerdown", handlePointer);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "enter" || key === " ") {
    if (state.mode !== "playing") resetGame();
    else activateFocus();
  }
  if (["1", "2", "3"].includes(key)) {
    state.selected = Number(key) - 1;
  }
  if (key === "f") {
    if (!document.fullscreenElement) canvas.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
});

function update(dt) {
  if (state.mode !== "playing") {
    state.floats = state.floats.map((f) => ({ ...f, y: f.y - dt * 35, life: f.life - dt })).filter((f) => f.life > 0);
    return;
  }
  const focusScale = state.focusTimer > 0 ? 0.42 : 1;
  state.focusTimer = Math.max(0, state.focusTimer - dt);
  state.spawnTimer -= dt;
  const spawnEvery = Math.max(0.52, 1.08 - state.level * 0.08) / focusScale;
  if (state.spawnTimer <= 0) {
    spawnTile();
    state.spawnTimer = spawnEvery;
  }
  const speed = (155 + state.level * 24) * focusScale;
  state.tiles.forEach((tile) => {
    tile.x += speed * dt;
  });
  state.tiles = state.tiles.filter((tile) => tile.x < W + 70 && !tile.picked);
  state.tickets.forEach((ticket, index) => {
    ticket.patience -= (4.6 + state.level * 0.55) * dt * focusScale;
    ticket.flash = Math.max(0, ticket.flash - dt);
    if (ticket.patience <= 0) failTicket(index, "顾客离开了");
  });
  state.messageTimer = Math.max(0, state.messageTimer - dt);
  state.floats = state.floats
    .map((f) => ({ ...f, y: f.y - dt * 44, life: f.life - dt }))
    .filter((f) => f.life > 0);
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fillRound(x, y, w, h, r, color) {
  ctx.fillStyle = color;
  roundedRect(x, y, w, h, r);
  ctx.fill();
}

function strokeRound(x, y, w, h, r, color, width = 3) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  roundedRect(x, y, w, h, r);
  ctx.stroke();
}

function text(value, x, y, size, color = "#2d1d17", align = "left", weight = 850) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
}

function drawFood(id, x, y, r = 26) {
  const food = foods[id];
  ctx.save();
  ctx.shadowColor = "rgba(72, 31, 19, 0.18)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 7;
  ctx.fillStyle = food.color;
  ctx.beginPath();
  if (id === "tea") {
    roundedRect(x - r, y - r, r * 2, r * 2, 10);
    ctx.fill();
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#2d1d17";
  if (id === "tea") {
    roundedRect(x - r, y - r, r * 2, r * 2, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 6, y - r - 12);
    ctx.lineTo(x + 14, y + 8);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  text(food.mark, x, y + 1, 18, id === "nori" || id === "fish" ? "#fff8ee" : "#2d1d17", "center", 950);
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#fff3e5");
  grad.addColorStop(0.5, "#f5d0b5");
  grad.addColorStop(1, "#d9976f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.beginPath();
  ctx.arc(118, 70, 56, 0, Math.PI * 2);
  ctx.fill();
  fillRound(26, 24, 908, 76, 18, "rgba(255, 248, 239, 0.82)");
  fillRound(0, 385, W, 255, 0, "rgba(45, 29, 23, 0.94)");
  fillRound(34, 414, 892, 158, 18, "rgba(255, 248, 239, 0.96)");
  ctx.strokeStyle = "rgba(72, 31, 19, 0.2)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(34, 493);
  ctx.lineTo(926, 493);
  ctx.stroke();
}

function drawHud() {
  text("小吃打包冲刺", 52, 61, 28);
  text(`分数 ${state.score}`, 372, 52, 20, "rgba(45, 29, 23, 0.78)");
  text(`连击 ${state.streak}`, 372, 78, 18, "rgba(45, 29, 23, 0.68)");
  text(`等级 ${state.level}`, 540, 52, 20, "rgba(45, 29, 23, 0.78)");
  text(`失误 ${state.misses}/3`, 540, 78, 18, "rgba(45, 29, 23, 0.68)");
  fillRound(focusButton.x, focusButton.y, focusButton.w, focusButton.h, 14, "rgba(255,255,255,0.66)");
  fillRound(focusButton.x + 6, focusButton.y + 6, (focusButton.w - 12) * (state.focus / 100), focusButton.h - 12, 10, state.focus >= 100 ? "#d95d39" : "#f3b94f");
  strokeRound(focusButton.x, focusButton.y, focusButton.w, focusButton.h, 14, "rgba(72,31,19,0.16)", 2);
  text(state.focusTimer > 0 ? "专注中" : "专注时刻", focusButton.x + focusButton.w / 2, focusButton.y + 25, 16, "#2d1d17", "center", 950);
}

function drawTickets() {
  state.tickets.forEach((ticket, index) => {
    const slot = ticketSlots[index];
    const selected = index === state.selected;
    const bg = ticket.flash > 0 ? "rgba(255, 223, 205, 0.98)" : "rgba(255, 248, 239, 0.9)";
    fillRound(slot.x, slot.y, slot.w, slot.h, 18, bg);
    strokeRound(slot.x, slot.y, slot.w, slot.h, 18, selected ? "#d95d39" : "rgba(72, 31, 19, 0.18)", selected ? 5 : 2);
    text(`订单 ${index + 1}`, slot.x + 18, slot.y + 25, 16, "#a83f22", "left", 950);
    fillRound(slot.x + 18, slot.y + 46, slot.w - 36, 12, 8, "rgba(72,31,19,0.12)");
    const patienceColor = ticket.patience < 28 ? "#a83f22" : "#2f7f79";
    fillRound(slot.x + 18, slot.y + 46, (slot.w - 36) * (ticket.patience / ticket.maxPatience), 12, 8, patienceColor);
    ticket.recipe.forEach((id, step) => {
      const x = slot.x + 42 + step * 58;
      const y = slot.y + 100;
      fillRound(x - 25, y - 25, 50, 50, 12, step < ticket.progress ? "rgba(47,127,121,0.18)" : "rgba(255,255,255,0.7)");
      drawFood(id, x, y, 17);
      if (step < ticket.progress) {
        text("完成", x, y + 31, 10, "#2f7f79", "center", 950);
      }
    });
  });
}

function drawTiles() {
  state.tiles.forEach((tile) => {
    drawFood(tile.id, tile.x, tile.y, tile.r);
    text(foods[tile.id].label, tile.x, tile.y + 49, 13, "#2d1d17", "center", 850);
  });
}

function drawMessage() {
  if (state.mode !== "playing" || state.messageTimer <= 0) return;
  const msg = state.mode === "menu" ? "点击开始。先选 1-3 号订单，再抓传送带上的对应食材。" : state.message;
  const y = state.mode === "playing" ? 306 : 316;
  fillRound(214, y - 28, 532, 56, 16, "rgba(255, 248, 239, 0.88)");
  strokeRound(214, y - 28, 532, 56, 16, "rgba(72, 31, 19, 0.14)", 2);
  text(msg, W / 2, y, 18, "#2d1d17", "center", 900);
}

function drawOverlay() {
  if (state.mode === "playing") return;
  fillRound(184, 158, 592, 320, 24, "rgba(255, 248, 239, 0.96)");
  strokeRound(184, 158, 592, 320, 24, "#2d1d17", 4);
  text(state.mode === "menu" ? "小吃打包冲刺" : "营业结束", W / 2, 226, 42, "#2d1d17", "center", 950);
  if (state.mode === "menu") {
    text("三张订单、移动传送带、一个救场技能。", W / 2, 284, 21, "rgba(45,29,23,0.76)", "center", 750);
    text("先点订单，再在耐心耗尽前抓下一份食材。", W / 2, 318, 18, "rgba(45,29,23,0.68)", "center", 750);
  } else {
    text(`分数 ${state.score}`, W / 2, 286, 28, "#2f7f79", "center", 950);
    text(`完成 ${state.served} 单  最佳连击 ${state.bestStreak}`, W / 2, 324, 19, "rgba(45,29,23,0.72)", "center", 850);
  }
  fillRound(370, 382, 220, 58, 16, "#d95d39");
  text(state.mode === "menu" ? "开始营业" : "再玩一次", W / 2, 412, 22, "#fff8ee", "center", 950);
}

function render() {
  drawBackground();
  drawHud();
  drawTickets();
  drawTiles();
  state.floats.forEach((f) => {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life / 0.95));
    text(f.text, f.x, f.y, 22, f.color, "center", 950);
    ctx.globalAlpha = 1;
  });
  drawMessage();
  drawOverlay();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update(1 / 60);
  render();
};

window.render_game_to_text = () => JSON.stringify({
  note: "画布坐标原点在左上角，x 向右，y 向下。",
  mode: state.mode,
  score: state.score,
  streak: state.streak,
  bestStreak: state.bestStreak,
  served: state.served,
  misses: state.misses,
  level: state.level,
  selectedTicket: state.selected,
  focus: Math.round(state.focus),
  focusTimer: Number(state.focusTimer.toFixed(1)),
  tickets: state.tickets.map((ticket, index) => ({
    index,
    patience: Math.round(ticket.patience),
    recipe: ticket.recipe,
    progress: ticket.progress,
    next: ticket.recipe[ticket.progress] || null,
    slot: ticketSlots[index],
  })),
  visibleTiles: state.tiles.map((tile) => ({ id: tile.id, label: foods[tile.id].label, x: Math.round(tile.x), y: tile.y })),
  message: state.message,
});

render();
requestAnimationFrame(frame);
