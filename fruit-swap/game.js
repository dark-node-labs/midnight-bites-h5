const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const BOARD = 8;
const MAX_LEVEL = 20;
const TYPES = [
  { name: "Apple", color: "#f13b25", dark: "#9e1d16", light: "#ff9b74", emoji: "🍎" },
  { name: "Orange", color: "#ff9b18", dark: "#d45b0a", light: "#ffe56f", emoji: "🍊" },
  { name: "Banana", color: "#ffd943", dark: "#b86d10", light: "#fff4a4", emoji: "🍌" },
  { name: "Grapes", color: "#7f43b8", dark: "#3d1a64", light: "#d79cff", emoji: "🍇" },
  { name: "Lemon", color: "#ffd92f", dark: "#d99a13", light: "#fff7a6", emoji: "🍋" },
  { name: "Strawberry", color: "#f04435", dark: "#9e1d22", light: "#ff9d83", emoji: "🍓" },
  { name: "Kiwi", color: "#9bd83a", dark: "#4a9618", light: "#ecff9a", emoji: "🥝" },
  { name: "Watermelon", color: "#f04a42", dark: "#188542", light: "#fff0e8", emoji: "🍉" },
];

const state = {
  mode: "menu",
  level: 1,
  maxLevel: MAX_LEVEL,
  activeTypes: 5,
  goals: [],
  board: [],
  selected: null,
  hint: null,
  score: 0,
  moves: 30,
  target: 6500,
  timeLeft: 120,
  chain: 0,
  message: "Swap fruits to match 3 or more.",
  inputLocked: false,
  cell: 66,
  boardX: 0,
  boardY: 0,
  isMobile: false,
  particles: [],
  floating: [],
  shake: 0,
  elapsed: 0,
  rngSeed: 20260514,
  soundOn: true,
};

let lastTime = performance.now();
let candySpritesReady = false;
const candySprites = [];
const uiButtons = [];
const audio = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  musicTimer: null,
  musicStep: 0,
};

function random01() {
  state.rngSeed = (state.rngSeed * 1664525 + 1013904223) >>> 0;
  return state.rngSeed / 4294967296;
}

function randomType() {
  return Math.floor(random01() * state.activeTypes);
}

function clampLevel(level) {
  return Math.max(1, Math.min(MAX_LEVEL, level));
}

function levelSettings(level) {
  const safeLevel = clampLevel(level);
  return {
    target: Math.round(3600 + safeLevel * 680 + Math.pow(safeLevel, 1.42) * 150),
    moves: Math.max(17, 29 - Math.floor(safeLevel * 0.55)),
    time: Math.max(55, 112 - Math.floor(safeLevel * 2.8)),
    activeTypes: Math.min(TYPES.length, 6 + Math.floor((safeLevel - 1) / 5)),
    goalCount: safeLevel >= 13 ? 3 : safeLevel >= 6 ? 2 : 1,
  };
}

function makeLevelGoals(level, activeTypes, goalCount) {
  const goals = [];
  for (let i = 0; i < goalCount; i += 1) {
    let type = (level * 2 + i * 3) % activeTypes;
    while (goals.some((goal) => goal.type === type)) type = (type + 1) % activeTypes;
    goals.push({
      type,
      needed: 10 + Math.floor(level * 0.7) + i * 3,
      collected: 0,
    });
  }
  return goals;
}

function isGoalType(type) {
  return state.goals.find((goal) => goal.type === type);
}

function collectGoalFruit(type) {
  const goal = isGoalType(type);
  if (goal) goal.collected += 1;
}

function goalsComplete() {
  return state.goals.length > 0 && state.goals.every((goal) => goal.collected >= goal.needed);
}

function ensureAudio() {
  if (!state.soundOn) return false;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  if (!audio.ctx) {
    audio.ctx = new AudioContext();
    audio.master = audio.ctx.createGain();
    audio.musicGain = audio.ctx.createGain();
    audio.sfxGain = audio.ctx.createGain();
    audio.master.gain.value = 0.72;
    audio.musicGain.gain.value = 0.16;
    audio.sfxGain.gain.value = 0.45;
    audio.musicGain.connect(audio.master);
    audio.sfxGain.connect(audio.master);
    audio.master.connect(audio.ctx.destination);
  }
  if (audio.ctx.state === "suspended") audio.ctx.resume();
  return true;
}

function playTone(freq, duration = 0.12, type = "sine", gain = 0.18, delay = 0, destination = audio.sfxGain) {
  if (!ensureAudio()) return;
  const now = audio.ctx.currentTime + delay;
  const osc = audio.ctx.createOscillator();
  const env = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  env.gain.setValueAtTime(0.001, now);
  env.gain.exponentialRampToValueAtTime(gain, now + 0.015);
  env.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(env);
  env.connect(destination);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function playNoiseBurst(duration = 0.09, gain = 0.2, delay = 0) {
  if (!ensureAudio()) return;
  const now = audio.ctx.currentTime + delay;
  const buffer = audio.ctx.createBuffer(1, Math.ceil(audio.ctx.sampleRate * duration), audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    const fade = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * fade;
  }
  const source = audio.ctx.createBufferSource();
  const filter = audio.ctx.createBiquadFilter();
  const env = audio.ctx.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1700, now);
  filter.Q.value = 1.4;
  env.gain.setValueAtTime(gain, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + duration);
  source.connect(filter);
  filter.connect(env);
  env.connect(audio.sfxGain);
  source.start(now);
  source.stop(now + duration);
}

function playSfx(name) {
  if (!state.soundOn) return;
  if (name === "select") playTone(620, 0.06, "triangle", 0.13);
  else if (name === "hint") {
    playTone(740, 0.07, "sine", 0.13);
    playTone(988, 0.11, "sine", 0.12, 0.06);
  } else if (name === "swap") {
    playTone(360, 0.06, "triangle", 0.11);
    playTone(560, 0.07, "triangle", 0.1, 0.045);
  } else if (name === "bad") {
    playTone(220, 0.12, "sawtooth", 0.12);
    playTone(150, 0.16, "sawtooth", 0.1, 0.08);
  } else if (name === "match") {
    playNoiseBurst(0.08, 0.26);
    [659, 880, 1175, 1568].forEach((freq, i) => playTone(freq, 0.16, "triangle", 0.18 - i * 0.018, i * 0.035));
    playTone(2093, 0.18, "sine", 0.11, 0.13);
  } else if (name === "win") {
    [523, 659, 784, 1046, 1319].forEach((freq, i) => playTone(freq, 0.18, "sine", 0.13, i * 0.07));
  } else if (name === "lose") {
    [330, 247, 196].forEach((freq, i) => playTone(freq, 0.2, "triangle", 0.11, i * 0.09));
  }
}

function musicTick() {
  if (!ensureAudio()) return;
  const chords = [
    [523, 659, 784, 1046],
    [440, 554, 659, 880],
    [494, 622, 740, 988],
    [392, 523, 659, 784],
  ];
  const chord = chords[Math.floor(audio.musicStep / 8) % chords.length];
  const note = chord[audio.musicStep % chord.length];
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const filter = audio.ctx.createBiquadFilter();
  const env = audio.ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(note, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, now);
  env.gain.setValueAtTime(0.001, now);
  env.gain.exponentialRampToValueAtTime(0.085, now + 0.035);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
  osc.connect(filter);
  filter.connect(env);
  env.connect(audio.musicGain);
  osc.start(now);
  osc.stop(now + 0.48);
  audio.musicStep += 1;
}

function startMusic() {
  if (!state.soundOn || audio.musicTimer) return;
  if (!ensureAudio()) return;
  musicTick();
  audio.musicTimer = setInterval(musicTick, 520);
}

function stopMusic() {
  if (!audio.musicTimer) return;
  clearInterval(audio.musicTimer);
  audio.musicTimer = null;
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  if (state.soundOn) {
    startMusic();
    playSfx("select");
  } else {
    stopMusic();
    if (audio.ctx) audio.ctx.suspend();
  }
}

function makeGlassMaterial(color, opacity = 0.76) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.18,
    metalness: 0,
    transparent: true,
    opacity: Math.min(0.98, opacity + 0.14),
    transmission: 0.12,
    thickness: 0.45,
    ior: 1.38,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
  });
}

function initCandySprites() {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  const spriteSize = 256;
  renderer.setSize(spriteSize, spriteSize, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const camera = new THREE.OrthographicCamera(-1.18, 1.18, 1.18, -1.18, 0.1, 20);
  camera.position.set(0, -3.6, 5.2);
  camera.lookAt(0, 0, 0);

  for (let i = 0; i < TYPES.length; i += 1) {
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffc8a8, 2.4));
    const key = new THREE.DirectionalLight(0xffffff, 3.8);
    key.position.set(-2.5, -3.5, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 2.4, 8);
    rim.position.set(2.4, 1.5, 3);
    scene.add(rim);

    const group = create3DCandy(TYPES[i]);
    scene.add(group);
    renderer.render(scene, camera);

    const raw = document.createElement("canvas");
    raw.width = spriteSize;
    raw.height = spriteSize;
    raw.getContext("2d").drawImage(renderer.domElement, 0, 0);

    const enhanced = document.createElement("canvas");
    enhanced.width = spriteSize;
    enhanced.height = spriteSize;
    const ectx = enhanced.getContext("2d");
    drawSpriteOutline(ectx, raw, spriteSize);
    ectx.drawImage(raw, 0, 0);
    enhanceSpriteDetails(ectx, TYPES[i], spriteSize);

    const img = new Image();
    img.src = enhanced.toDataURL("image/png");
    candySprites[i] = img;
  }
  candySpritesReady = true;
}

function drawSpriteOutline(ectx, source, size) {
  const outline = document.createElement("canvas");
  outline.width = size;
  outline.height = size;
  const octx = outline.getContext("2d");
  const offsets = [
    [-5, 0], [5, 0], [0, -5], [0, 5],
    [-4, -4], [4, -4], [-4, 4], [4, 4],
    [-7, 0], [7, 0], [0, -7], [0, 7],
  ];
  for (const [x, y] of offsets) {
    octx.clearRect(0, 0, size, size);
    octx.drawImage(source, x, y);
    octx.globalCompositeOperation = "source-in";
    octx.fillStyle = "rgba(92, 52, 25, 0.72)";
    octx.fillRect(0, 0, size, size);
    octx.globalCompositeOperation = "source-over";
    ectx.drawImage(outline, 0, 0);
  }
}

function enhanceSpriteDetails(ectx, type, size) {
  const c = size / 2;
  const r = size * 0.34;
  if (type.candy === "banana") {
    ectx.clearRect(0, 0, size, size);
    paintFullBananaSprite(ectx, c, r);
    return;
  }
  ectx.save();
  ectx.globalCompositeOperation = "source-over";

  const shadow = ectx.createRadialGradient(c + r * 0.15, c + r * 0.55, 2, c + r * 0.15, c + r * 0.55, r * 1.05);
  shadow.addColorStop(0, "rgba(70, 24, 16, 0.24)");
  shadow.addColorStop(1, "rgba(70, 24, 16, 0)");
  ectx.fillStyle = shadow;
  ectx.beginPath();
  ectx.ellipse(c + r * 0.1, c + r * 0.55, r * 0.95, r * 0.24, -0.08, 0, Math.PI * 2);
  ectx.fill();

  if (type.candy === "strawberry") paintStrawberryOverlay(ectx, c, r);
  else if (type.candy === "orange") paintOrangeOverlay(ectx, c, r);
  else if (type.candy === "banana") paintBananaOverlay(ectx, c, r);
  else if (type.candy === "slice") paintCitrusOverlay(ectx, c, r, type.sliceColor === "#e93632" ? "#fff2e8" : "#fff9b2", type.sliceColor === "#e93632");
  else if (type.candy === "apple") paintAppleOverlay(ectx, c, r);
  else if (type.candy === "lime") paintOrangeOverlay(ectx, c, r, "rgba(255,255,255,0.32)");
  else if (type.berry) paintStrawberryOverlay(ectx, c, r);
  else if (type.citrus) paintCitrusOverlay(ectx, c, r, "#fff0a2");
  else if (type.candy === "grapes") paintSugarOverlay(ectx, c, r);
  else if (type.candy === "watermelon") paintWatermelonOverlay(ectx, c, r);
  else if (type.peach) paintPeachOverlay(ectx, c, r);
  else if (type.berryOrb) paintBlueberryOverlay(ectx, c, r);
  else if (type.candy === "sugarBall") paintSugarOverlay(ectx, c, r);
  else if (type.candy === "heart") paintHeartOverlay(ectx, c, r, type);
  else if (type.candy === "popsicle") paintPopsicleOverlay(ectx, c, r);
  else paintCitrusOverlay(ectx, c, r, "#fff2e8", true);

  paintSpecularOverlay(ectx, c, r);
  ectx.restore();
}

function bananaPath(ectx, c, r) {
  ectx.beginPath();
  ectx.moveTo(c - r * 0.78, c + r * 0.1);
  ectx.bezierCurveTo(c - r * 0.18, c + r * 0.86, c + r * 0.66, c + r * 0.44, c + r * 0.82, c - r * 0.36);
  ectx.bezierCurveTo(c + r * 0.36, c + r * 0.12, c - r * 0.24, c + r * 0.16, c - r * 0.58, c - r * 0.22);
  ectx.bezierCurveTo(c - r * 0.68, c - r * 0.08, c - r * 0.74, c + r * 0.02, c - r * 0.78, c + r * 0.1);
  ectx.closePath();
}

function paintFullBananaSprite(ectx, c, r) {
  const shadow = ectx.createRadialGradient(c + r * 0.1, c + r * 0.56, 2, c + r * 0.1, c + r * 0.56, r);
  shadow.addColorStop(0, "rgba(78, 38, 10, 0.25)");
  shadow.addColorStop(1, "rgba(78, 38, 10, 0)");
  ectx.fillStyle = shadow;
  ectx.beginPath();
  ectx.ellipse(c + r * 0.08, c + r * 0.58, r * 0.88, r * 0.22, -0.1, 0, Math.PI * 2);
  ectx.fill();

  ectx.lineJoin = "round";
  ectx.lineCap = "round";
  ectx.strokeStyle = "rgba(83, 49, 18, 0.84)";
  ectx.lineWidth = r * 0.15;
  bananaPath(ectx, c, r);
  ectx.stroke();

  const fill = ectx.createLinearGradient(c - r * 0.6, c - r * 0.25, c + r * 0.55, c + r * 0.45);
  fill.addColorStop(0, "#fff59c");
  fill.addColorStop(0.42, "#ffd943");
  fill.addColorStop(1, "#f0a91b");
  ectx.fillStyle = fill;
  bananaPath(ectx, c, r);
  ectx.fill();

  ectx.strokeStyle = "rgba(255, 244, 150, 0.86)";
  ectx.lineWidth = r * 0.07;
  ectx.beginPath();
  ectx.moveTo(c - r * 0.42, c - r * 0.02);
  ectx.bezierCurveTo(c - r * 0.05, c + r * 0.35, c + r * 0.48, c + r * 0.2, c + r * 0.64, c - r * 0.2);
  ectx.stroke();

  ectx.fillStyle = "#9a5816";
  ectx.beginPath();
  ectx.ellipse(c - r * 0.7, c - r * 0.05, r * 0.11, r * 0.08, -0.5, 0, Math.PI * 2);
  ectx.fill();
  ectx.beginPath();
  ectx.ellipse(c + r * 0.76, c - r * 0.36, r * 0.12, r * 0.08, -0.7, 0, Math.PI * 2);
  ectx.fill();

  ectx.fillStyle = "rgba(255,255,255,0.78)";
  ectx.beginPath();
  ectx.ellipse(c - r * 0.34, c - r * 0.23, r * 0.18, r * 0.06, -0.5, 0, Math.PI * 2);
  ectx.fill();
}

function paintSpecularOverlay(ectx, c, r) {
  ectx.fillStyle = "rgba(255,255,255,0.9)";
  ectx.beginPath();
  ectx.ellipse(c - r * 0.34, c - r * 0.42, r * 0.3, r * 0.13, -0.55, 0, Math.PI * 2);
  ectx.fill();
  ectx.fillStyle = "rgba(255,255,255,0.44)";
  ectx.beginPath();
  ectx.ellipse(c - r * 0.07, c - r * 0.18, r * 0.16, r * 0.06, -0.45, 0, Math.PI * 2);
  ectx.fill();
}

function paintStrawberryOverlay(ectx, c, r) {
  ectx.save();
  ectx.fillStyle = "rgba(255, 232, 198, 0.9)";
  for (let i = 0; i < 32; i += 1) {
    const a = (i * 2.399963) % (Math.PI * 2);
    const rr = r * (0.18 + ((i * 37) % 64) / 100);
    const x = c + Math.cos(a) * rr * 0.72;
    const y = c + Math.sin(a) * rr * 0.88;
    if (y < c - r * 0.68 || y > c + r * 0.8) continue;
    ectx.save();
    ectx.translate(x, y);
    ectx.rotate(a + Math.PI / 2);
    ectx.beginPath();
    ectx.ellipse(0, 0, r * 0.035, r * 0.017, 0, 0, Math.PI * 2);
    ectx.fill();
    ectx.restore();
  }
  ectx.restore();
}

function paintAppleOverlay(ectx, c, r) {
  ectx.save();
  ectx.fillStyle = "rgba(142, 26, 16, 0.18)";
  ectx.beginPath();
  ectx.ellipse(c, c + r * 0.12, r * 0.18, r * 0.62, 0, 0, Math.PI * 2);
  ectx.fill();
  ectx.restore();
}

function paintOrangeOverlay(ectx, c, r, color = "rgba(255, 231, 100, 0.42)") {
  ectx.save();
  ectx.fillStyle = color;
  for (let i = 0; i < 20; i += 1) {
    const a = (i * 2.399963 + 0.5) % (Math.PI * 2);
    const rr = r * (0.2 + ((i * 17) % 48) / 100);
    ectx.beginPath();
    ectx.arc(c + Math.cos(a) * rr, c + Math.sin(a) * rr, r * 0.018, 0, Math.PI * 2);
    ectx.fill();
  }
  ectx.restore();
}

function paintBananaOverlay(ectx, c, r) {
  ectx.save();
  ectx.strokeStyle = "rgba(178, 105, 12, 0.32)";
  ectx.lineWidth = 4;
  ectx.beginPath();
  ectx.arc(c, c + r * 0.04, r * 0.56, Math.PI * 0.1, Math.PI * 1.18);
  ectx.stroke();
  ectx.restore();
}

function paintCitrusOverlay(ectx, c, r, color, red = false) {
  ectx.save();
  ectx.strokeStyle = color;
  ectx.lineWidth = red ? 3 : 2.4;
  ectx.globalAlpha = red ? 0.86 : 0.66;
  for (let i = 0; i < 14; i += 1) {
    const a = (Math.PI * 2 * i) / 14;
    ectx.beginPath();
    ectx.moveTo(c, c);
    ectx.lineTo(c + Math.cos(a) * r * 0.76, c + Math.sin(a) * r * 0.76);
    ectx.stroke();
  }
  ectx.beginPath();
  ectx.arc(c, c, r * 0.72, 0, Math.PI * 2);
  ectx.stroke();
  ectx.restore();
}

function paintSugarOverlay(ectx, c, r) {
  ectx.fillStyle = "rgba(255,255,255,0.82)";
  for (let i = 0; i < 34; i += 1) {
    const a = (i * 2.399963 + 0.2) % (Math.PI * 2);
    const rr = r * (0.2 + ((i * 29) % 56) / 100);
    ectx.beginPath();
    ectx.arc(c + Math.cos(a) * rr, c + Math.sin(a) * rr, r * 0.025, 0, Math.PI * 2);
    ectx.fill();
  }
}

function paintWatermelonOverlay(ectx, c, r) {
  ectx.save();
  ectx.fillStyle = "rgba(31, 18, 22, 0.78)";
  for (const [x, y, rot] of [[-0.25, 0.08, -0.2], [0.02, 0.22, 0.1], [0.28, 0.04, 0.25]]) {
    ectx.save();
    ectx.translate(c + x * r, c + y * r);
    ectx.rotate(rot);
    ectx.beginPath();
    ectx.ellipse(0, 0, r * 0.04, r * 0.075, 0, 0, Math.PI * 2);
    ectx.fill();
    ectx.restore();
  }
  ectx.restore();
}

function paintPeachOverlay(ectx, c, r) {
  ectx.save();
  ectx.strokeStyle = "rgba(255, 224, 190, 0.72)";
  ectx.lineWidth = 3;
  ectx.beginPath();
  ectx.ellipse(c + r * 0.08, c, r * 0.24, r * 0.72, 0.08, -1.15, 1.25);
  ectx.stroke();
  ectx.restore();
}

function paintBlueberryOverlay(ectx, c, r) {
  ectx.save();
  ectx.strokeStyle = "rgba(35, 42, 110, 0.75)";
  ectx.lineWidth = 3;
  ectx.beginPath();
  ectx.arc(c - r * 0.16, c - r * 0.08, r * 0.16, 0, Math.PI * 2);
  ectx.stroke();
  ectx.restore();
}

function paintHeartOverlay(ectx, c, r, type) {
  ectx.save();
  ectx.strokeStyle = "rgba(255,245,230,0.7)";
  ectx.lineWidth = r * 0.06;
  traceCanvasHeart(ectx, c, c + r * 0.02, r * 0.46);
  ectx.stroke();
  ectx.fillStyle = type.light;
  ectx.globalAlpha = 0.16;
  traceCanvasHeart(ectx, c, c + r * 0.04, r * 0.3);
  ectx.fill();
  ectx.restore();
}

function traceCanvasHeart(ectx, x, y, r) {
  ectx.beginPath();
  ectx.moveTo(x, y + r * 0.66);
  ectx.bezierCurveTo(x - r * 0.95, y + r * 0.1, x - r * 0.9, y - r * 0.58, x - r * 0.36, y - r * 0.66);
  ectx.bezierCurveTo(x - r * 0.1, y - r * 0.7, x, y - r * 0.44, x, y - r * 0.32);
  ectx.bezierCurveTo(x, y - r * 0.44, x + r * 0.1, y - r * 0.7, x + r * 0.36, y - r * 0.66);
  ectx.bezierCurveTo(x + r * 0.9, y - r * 0.58, x + r * 0.95, y + r * 0.1, x, y + r * 0.66);
  ectx.closePath();
}

function paintPopsicleOverlay(ectx, c, r) {
  ectx.save();
  ectx.translate(c, c);
  ectx.rotate(-0.55);
  for (let i = -3; i <= 4; i += 1) {
    ectx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.52)" : "rgba(230,92,30,0.18)";
    ectx.fillRect(-r * 0.42, i * r * 0.2, r * 0.84, r * 0.075);
  }
  ectx.restore();
}

function create3DCandy(type) {
  const group = new THREE.Group();
  group.rotation.x = 0.18;
  group.rotation.z = -0.08;
  if (type.candy === "apple") create3DApple(group, type);
  else if (type.candy === "orange") create3DOrange(group, type);
  else if (type.candy === "banana") create3DBanana(group, type);
  else if (type.candy === "strawberry") create3DStrawberry(group, type);
  else if (type.candy === "lime") create3DLime(group, type);
  else if (type.candy === "slice") create3DSlice(group, type);
  else if (type.candy === "fruit") create3DFruit(group, type);
  else if (type.candy === "grapes") create3DGrapes(group, type);
  else if (type.candy === "watermelon") create3DWatermelon(group, type);
  else if (type.candy === "sugarBall") create3DGlassBall(group, type);
  else if (type.candy === "heart") create3DHeart(group, type);
  else if (type.candy === "popsicle") create3DPopsicle(group, type);
  else create3DCitrusPop(group, type);
  return group;
}

function add3DGloss(group, x = -0.32, y = -0.28, z = 0.52, s = 0.22) {
  const gloss = new THREE.Mesh(
    new THREE.SphereGeometry(s, 24, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.72 }),
  );
  gloss.position.set(x, y, z);
  gloss.scale.set(1.7, 0.58, 0.2);
  group.add(gloss);
}

function add3DStem(group, type) {
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.55, 12),
    new THREE.MeshStandardMaterial({ color: type.stem || "#5c7721", roughness: 0.44 }),
  );
  stem.position.set(0.04, 0.08, 0.74);
  stem.rotation.x = 0.58;
  stem.rotation.z = -0.35;
  group.add(stem);

  const leaf = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 8),
    new THREE.MeshStandardMaterial({ color: "#34a43b", roughness: 0.36 }),
  );
  leaf.position.set(-0.2, 0.04, 0.62);
  leaf.scale.set(1.55, 0.5, 0.16);
  leaf.rotation.z = -0.45;
  group.add(leaf);
}

function create3DApple(group, type) {
  const left = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 26), makeGlassMaterial(type.color, 0.92));
  left.position.set(-0.16, -0.02, 0);
  left.scale.set(0.88, 1.05, 0.82);
  group.add(left);
  const right = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 26), makeGlassMaterial(type.color, 0.92));
  right.position.set(0.16, -0.02, 0);
  right.scale.set(0.88, 1.05, 0.82);
  group.add(right);
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 20), makeGlassMaterial(type.color, 0.9));
  bottom.position.set(0, -0.28, -0.02);
  bottom.scale.set(1.05, 0.72, 0.72);
  group.add(bottom);
  add3DStem(group, type);
  add3DGloss(group, -0.28, -0.28, 0.55, 0.2);
}

function create3DOrange(group, type) {
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 28), makeGlassMaterial(type.color, 0.94));
  orb.scale.set(1, 1, 0.86);
  group.add(orb);
  add3DStem(group, type);
  add3DGloss(group, -0.3, -0.28, 0.54, 0.2);
}

function create3DLime(group, type) {
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 28), makeGlassMaterial(type.color, 0.92));
  orb.scale.set(1, 0.94, 0.82);
  group.add(orb);
  add3DStem(group, type);
  add3DGloss(group, -0.3, -0.28, 0.54, 0.2);
}

function create3DStrawberry(group, type) {
  const berry = new THREE.Mesh(new THREE.SphereGeometry(0.64, 48, 28), makeGlassMaterial(type.color, 0.94));
  berry.scale.set(0.92, 0.94, 1.05);
  group.add(berry);
  const point = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.74, 48), makeGlassMaterial(type.dark, 0.84));
  point.position.z = -0.34;
  point.rotation.x = Math.PI;
  point.scale.set(0.9, 0.9, 0.66);
  group.add(point);
  add3DSeeds(group, 30);
  add3DStem(group, type);
  add3DGloss(group, -0.26, -0.26, 0.58, 0.18);
}

function create3DBanana(group, type) {
  const mat = makeGlassMaterial(type.color, 0.94);
  const banana = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.13, 18, 72, Math.PI * 1.22), mat);
  banana.rotation.z = -0.55;
  banana.rotation.x = 0.25;
  banana.scale.set(1.12, 0.9, 0.78);
  group.add(banana);
  const tipMat = new THREE.MeshStandardMaterial({ color: 0x8a4a13, roughness: 0.36 });
  for (const [x, y] of [[-0.42, -0.33], [0.44, 0.3]]) {
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), tipMat);
    tip.position.set(x, y, 0.08);
    tip.scale.set(1, 0.75, 0.45);
    group.add(tip);
  }
  add3DGloss(group, -0.28, -0.16, 0.3, 0.16);
}

function create3DSlice(group, type) {
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.22, 64), makeGlassMaterial(type.color, 0.94));
  disk.rotation.x = Math.PI / 2;
  group.add(disk);
  const rind = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.045, 12, 64), makeGlassMaterial(type.rim, 0.95));
  rind.position.z = 0.12;
  group.add(rind);
  add3DSegments(group, type);
  add3DGloss(group, -0.26, -0.28, 0.35, 0.16);
}

function create3DFruit(group, type) {
  if (type.berry) {
    const berry = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 28), makeGlassMaterial(type.color, 0.82));
    berry.scale.set(0.9, 0.92, 1.08);
    group.add(berry);
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 48), makeGlassMaterial(type.dark, 0.68));
    point.position.z = -0.36;
    point.rotation.x = Math.PI;
    point.scale.set(0.82, 0.82, 0.62);
    group.add(point);
    add3DSeeds(group, 24);
  } else if (type.berryOrb) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.76, 56, 32), makeGlassMaterial(type.color, 0.78));
    orb.scale.set(1, 1, 0.82);
    group.add(orb);
    const crown = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 24), new THREE.MeshStandardMaterial({ color: 0x203884, roughness: 0.35 }));
    crown.position.set(-0.16, -0.12, 0.65);
    crown.rotation.x = 0.3;
    group.add(crown);
  } else {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.78, 56, 32), makeGlassMaterial(type.color, 0.76));
    orb.scale.set(1, 1, 0.78);
    group.add(orb);
    if (type.citrus) add3DSegments(group, type);
    if (type.peach) add3DPeachCrease(group);
  }
  add3DStem(group, type);
  add3DGloss(group);
}

function add3DPeachCrease(group) {
  const crease = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.012, 8, 48, Math.PI * 1.1),
    new THREE.MeshBasicMaterial({ color: 0xffe0c2, transparent: true, opacity: 0.55 }),
  );
  crease.position.set(0.08, 0, 0.62);
  crease.rotation.z = Math.PI / 2;
  crease.rotation.x = 0.25;
  group.add(crease);
}

function create3DGrapes(group, type) {
  const positions = [
    [-0.28, 0.18, 0.08],
    [0.05, 0.22, 0.14],
    [0.32, 0.06, 0.08],
    [-0.12, -0.08, 0.18],
    [0.18, -0.18, 0.12],
    [-0.02, -0.42, 0.06],
  ];
  for (const [x, y, z] of positions) {
    const grape = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 20), makeGlassMaterial(type.color, 0.8));
    grape.position.set(x, y, z);
    grape.scale.set(1, 1, 0.88);
    group.add(grape);
  }
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.035, 0.65, 10),
    new THREE.MeshStandardMaterial({ color: 0x5c7721, roughness: 0.45 }),
  );
  stem.position.set(0.05, 0.5, 0.28);
  stem.rotation.x = 0.78;
  stem.rotation.z = -0.2;
  group.add(stem);
  add3DGloss(group, -0.28, -0.1, 0.45, 0.18);
}

function create3DWatermelon(group, type) {
  const sliceShape = new THREE.Shape();
  sliceShape.moveTo(-0.78, -0.25);
  sliceShape.quadraticCurveTo(0, 0.86, 0.78, -0.25);
  sliceShape.lineTo(-0.78, -0.25);
  const rind = new THREE.Mesh(
    new THREE.ExtrudeGeometry(sliceShape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.03, bevelSegments: 5 }).center(),
    makeGlassMaterial(type.color, 0.84),
  );
  rind.rotation.x = 0.08;
  group.add(rind);
  const green = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.12, 0.26), makeGlassMaterial(0x2bb44a, 0.85));
  green.position.set(0, -0.32, 0);
  group.add(green);
  const seedMat = new THREE.MeshStandardMaterial({ color: 0x2b1720, roughness: 0.3 });
  for (const [x, y] of [[-0.28, 0.05], [0, 0.22], [0.28, 0.04]]) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 6), seedMat);
    seed.position.set(x, y, 0.2);
    seed.scale.set(0.7, 1.2, 0.35);
    group.add(seed);
  }
  add3DGloss(group, -0.2, -0.02, 0.3, 0.16);
}

function add3DSeeds(group, count) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffecd0, roughness: 0.25 });
  for (let i = 0; i < count; i += 1) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), mat);
    const a = (i * 2.399963) % (Math.PI * 2);
    const rr = 0.18 + ((i * 37) % 48) / 100;
    seed.position.set(Math.cos(a) * rr, Math.sin(a) * rr, 0.66 + ((i * 11) % 8) / 100);
    seed.scale.set(1.3, 0.55, 0.32);
    group.add(seed);
  }
}

function add3DSegments(group, type) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xfff1a0, transparent: true, opacity: 0.62 });
  for (let i = 0; i < 12; i += 1) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.68, 0.035), mat);
    seg.position.z = 0.63;
    seg.rotation.z = (Math.PI * 2 * i) / 12;
    group.add(seg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.018, 8, 64), mat);
  ring.position.z = 0.64;
  group.add(ring);
}

function create3DGlassBall(group, type) {
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.78, 56, 32), makeGlassMaterial(type.color, 0.74));
  orb.scale.set(1, 1, 0.82);
  group.add(orb);
  add3DSegments(group, type);
  add3DSugar(group, 24);
  add3DGloss(group, -0.34, -0.28, 0.54, 0.24);
}

function add3DSugar(group, count) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  for (let i = 0; i < count; i += 1) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.027, 8, 6), mat);
    const a = (i * 2.399963 + 0.2) % (Math.PI * 2);
    const rr = 0.2 + ((i * 29) % 50) / 100;
    dot.position.set(Math.cos(a) * rr, Math.sin(a) * rr, 0.62 + ((i * 17) % 9) / 100);
    group.add(dot);
  }
}

function heartShape2D(scale = 1) {
  const s = scale;
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.5 * s);
  shape.bezierCurveTo(-0.85 * s, 0, -0.85 * s, 0.64 * s, -0.28 * s, 0.68 * s);
  shape.bezierCurveTo(-0.08 * s, 0.7 * s, 0, 0.5 * s, 0, 0.36 * s);
  shape.bezierCurveTo(0, 0.5 * s, 0.08 * s, 0.7 * s, 0.28 * s, 0.68 * s);
  shape.bezierCurveTo(0.85 * s, 0.64 * s, 0.85 * s, 0, 0, -0.5 * s);
  return shape;
}

function create3DHeart(group, type) {
  const outer = heartShape2D(0.9);
  const hole = heartShape2D(0.42);
  outer.holes.push(hole);
  const heart = new THREE.Mesh(
    new THREE.ExtrudeGeometry(outer, { depth: 0.32, bevelEnabled: true, bevelSize: 0.09, bevelThickness: 0.08, bevelSegments: 12 }).center(),
    makeGlassMaterial(type.color, 0.78),
  );
  heart.rotation.z = Math.PI;
  group.add(heart);
  add3DGloss(group, -0.25, -0.15, 0.36, 0.18);
}

function create3DPopsicle(group, type) {
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.95, 16), new THREE.MeshStandardMaterial({ color: 0xd9a676, roughness: 0.45 }));
  stick.position.set(0, -0.78, -0.15);
  stick.rotation.x = Math.PI / 2;
  group.add(stick);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.72, 10, 28), makeGlassMaterial(type.color, 0.8));
  body.rotation.z = Math.PI / 2;
  body.scale.set(0.9, 1, 0.55);
  group.add(body);
  for (let i = -2; i <= 2; i += 1) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.035), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffd18f : 0xffffff, transparent: true, opacity: 0.72 }));
    stripe.position.set(0, i * 0.18, 0.25);
    stripe.rotation.z = -0.55;
    group.add(stripe);
  }
  add3DGloss(group, -0.18, -0.22, 0.35, 0.16);
}

function create3DCitrusPop(group, type) {
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 16), new THREE.MeshStandardMaterial({ color: 0xd9a676, roughness: 0.45 }));
  stick.position.set(0, -0.72, -0.15);
  stick.rotation.x = Math.PI / 2;
  group.add(stick);
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.22, 64), makeGlassMaterial(type.color, 0.82));
  disk.rotation.x = Math.PI / 2;
  group.add(disk);
  add3DSegments(group, type);
  add3DGloss(group, -0.28, -0.28, 0.44, 0.19);
}

function createTile(type = randomType()) {
  return { id: `${Date.now()}-${Math.random()}`, type, x: 0, y: 0, sx: 0, sy: 0, scale: 1 };
}

function makeBoard() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const board = buildRandomBoard();
    if (findPossibleMove(board)) return board;
  }
  const board = buildRandomBoard();
  seedGuaranteedMove(board);
  return board;
}

function buildRandomBoard() {
  const board = [];
  for (let y = 0; y < BOARD; y += 1) {
    const row = [];
    for (let x = 0; x < BOARD; x += 1) {
      let tile;
      do {
        tile = createTile();
      } while (
        (x >= 2 && row[x - 1].type === tile.type && row[x - 2].type === tile.type) ||
        (y >= 2 && board[y - 1][x].type === tile.type && board[y - 2][x].type === tile.type)
      );
      row.push(tile);
    }
    board.push(row);
  }
  syncTilePositions(board);
  return board;
}

function seedGuaranteedMove(board) {
  const pattern = [
    [0, 1, 0],
    [2, 0, 3],
    [4, 5, 6],
  ];
  for (let y = 0; y < pattern.length; y += 1) {
    for (let x = 0; x < pattern[y].length; x += 1) {
      board[y][x] = createTile(pattern[y][x] % state.activeTypes);
    }
  }
  syncTilePositions(board);
}

function syncTilePositions(board = state.board) {
  for (let y = 0; y < BOARD; y += 1) {
    for (let x = 0; x < BOARD; x += 1) {
      const tile = board[y][x];
      if (!tile) continue;
      tile.x = x;
      tile.y = y;
      tile.sx = x;
      tile.sy = y;
      tile.scale = 1;
    }
  }
}

function startGame(level = state.level) {
  startMusic();
  playSfx("select");
  const nextLevel = clampLevel(level);
  const settings = levelSettings(nextLevel);
  state.mode = "playing";
  state.level = nextLevel;
  state.maxLevel = MAX_LEVEL;
  state.activeTypes = settings.activeTypes;
  state.goals = makeLevelGoals(nextLevel, settings.activeTypes, settings.goalCount);
  state.rngSeed = 20260514 + nextLevel * 9973;
  state.board = makeBoard();
  state.selected = null;
  state.hint = null;
  state.score = 0;
  state.target = settings.target;
  state.moves = settings.moves;
  state.timeLeft = settings.time;
  state.chain = 0;
  state.message = `Level ${state.level}: Collect the goal fruits.`;
  state.inputLocked = false;
  state.particles = [];
  state.floating = [];
}

function continueFromOverlay() {
  if (state.mode === "won") {
    if (state.level < MAX_LEVEL) startGame(state.level + 1);
    else startGame(1);
  } else if (state.mode === "lost") {
    startGame(state.level);
  } else {
    startGame(1);
  }
}

function findMatchesOn(board = state.board) {
  const matches = new Set();
  for (let y = 0; y < BOARD; y += 1) {
    let runStart = 0;
    for (let x = 1; x <= BOARD; x += 1) {
      const same =
        x < BOARD &&
        board[y][x] &&
        board[y][runStart] &&
        board[y][x].type === board[y][runStart].type;
      if (!same) {
        if (x - runStart >= 3) for (let i = runStart; i < x; i += 1) matches.add(`${i},${y}`);
        runStart = x;
      }
    }
  }
  for (let x = 0; x < BOARD; x += 1) {
    let runStart = 0;
    for (let y = 1; y <= BOARD; y += 1) {
      const same =
        y < BOARD &&
        board[y][x] &&
        board[runStart][x] &&
        board[y][x].type === board[runStart][x].type;
      if (!same) {
        if (y - runStart >= 3) for (let i = runStart; i < y; i += 1) matches.add(`${x},${i}`);
        runStart = y;
      }
    }
  }
  return [...matches].map((key) => key.split(",").map(Number));
}

function findMatches() {
  return findMatchesOn(state.board);
}

function findPossibleMove(board = state.board) {
  const directions = [
    [1, 0],
    [0, 1],
  ];
  for (let y = 0; y < BOARD; y += 1) {
    for (let x = 0; x < BOARD; x += 1) {
      if (!board[y][x]) continue;
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= BOARD || ny >= BOARD || !board[ny][nx]) continue;
        const testBoard = board.map((row) => row.slice());
        testBoard[y][x] = board[ny][nx];
        testBoard[ny][nx] = board[y][x];
        if (findMatchesOn(testBoard).length) {
          return { from: { x, y }, to: { x: nx, y: ny } };
        }
      }
    }
  }
  return null;
}

function describeMove(move) {
  if (!move) return "No moves found. Board reshuffled.";
  return `Hint: swap row ${move.from.y + 1}, column ${move.from.x + 1} with row ${move.to.y + 1}, column ${move.to.x + 1}.`;
}

function ensurePlayableBoard() {
  const move = findPossibleMove();
  if (move) return { move, reshuffled: false };
  state.board = makeBoard();
  state.selected = null;
  state.hint = null;
  return { move: findPossibleMove(), reshuffled: true };
}

function showHint() {
  const result = ensurePlayableBoard();
  state.hint = result.move;
  state.message = result.reshuffled ? "Board reshuffled. Press H for a hint." : describeMove(result.move);
  playSfx("hint");
}

function swapTiles(a, b) {
  const first = state.board[a.y][a.x];
  const second = state.board[b.y][b.x];
  state.board[a.y][a.x] = second;
  state.board[b.y][b.x] = first;
  first.x = b.x;
  first.y = b.y;
  second.x = a.x;
  second.y = a.y;
}

function areAdjacent(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

function tileCenter(x, y) {
  return { x: state.boardX + x * state.cell + state.cell / 2, y: state.boardY + y * state.cell + state.cell / 2 };
}

function addBurst(x, y, type) {
  const center = tileCenter(x, y);
  for (let i = 0; i < 14; i += 1) {
    const angle = random01() * Math.PI * 2;
    const speed = 80 + random01() * 150;
    state.particles.push({
      x: center.x,
      y: center.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.5 + random01() * 0.35,
      maxLife: 0.85,
      color: TYPES[type].light,
      r: 2 + random01() * 4,
    });
  }
}

function addFloating(text, x, y) {
  const center = tileCenter(x, y);
  state.floating.push({ text, x: center.x, y: center.y, vy: -36, life: 0.8 });
}

function collapseBoard() {
  for (let x = 0; x < BOARD; x += 1) {
    let writeY = BOARD - 1;
    for (let y = BOARD - 1; y >= 0; y -= 1) {
      const tile = state.board[y][x];
      if (tile) {
        state.board[writeY][x] = tile;
        tile.x = x;
        tile.y = writeY;
        writeY -= 1;
      }
    }
    for (let y = writeY; y >= 0; y -= 1) {
      const tile = createTile();
      tile.x = x;
      tile.y = y;
      tile.sx = x;
      tile.sy = y - writeY - 1.2;
      state.board[y][x] = tile;
    }
  }
}

function resolveMatches() {
  const matches = findMatches();
  if (!matches.length) {
    const playable = ensurePlayableBoard();
    if (playable.reshuffled) state.message = "Board reshuffled. Press H for a hint.";
    state.inputLocked = false;
    state.chain = 0;
    updateEndState();
    return false;
  }

  state.inputLocked = true;
  state.chain += 1;
  const points = matches.length * 100 * state.chain;
  state.score += points;
  state.message = state.chain > 1 ? `Combo x${state.chain}!` : "Fruit match!";
  playSfx("match");
  addFloating(`+${points}`, matches[0][0], matches[0][1]);

  for (const [x, y] of matches) {
    const tile = state.board[y][x];
    if (!tile) continue;
    collectGoalFruit(tile.type);
    addBurst(x, y, tile.type);
    state.board[y][x] = null;
  }

  setTimeout(() => {
    collapseBoard();
    setTimeout(() => resolveMatches(), 180);
  }, 160);
  return true;
}

function attemptSwap(target) {
  if (state.inputLocked || state.mode !== "playing") return;
  state.hint = null;
  if (!state.selected) {
    state.selected = target;
    state.message = "Choose an adjacent fruit.";
    return;
  }

  const from = state.selected;
  state.selected = null;
  if (from.x === target.x && from.y === target.y) {
    state.message = "Selection cleared.";
    return;
  }
  if (!areAdjacent(from, target)) {
    state.selected = target;
    state.message = "Now choose a neighbor.";
    return;
  }

  state.inputLocked = true;
  playSfx("swap");
  swapTiles(from, target);
  setTimeout(() => {
    const matches = findMatches();
    if (!matches.length) {
      swapTiles(from, target);
      state.shake = 0.25;
      state.message = "No match. Try another swap.";
      playSfx("bad");
      setTimeout(() => {
        state.inputLocked = false;
      }, 160);
      return;
    }
    state.moves -= 1;
    state.chain = 0;
    resolveMatches();
  }, 130);
}

function updateEndState() {
  if (goalsComplete()) {
    if (state.mode !== "won") playSfx("win");
    state.mode = "won";
    state.message = state.level >= MAX_LEVEL ? "All levels complete!" : `Level ${state.level} complete!`;
  } else if (state.moves <= 0 || state.timeLeft <= 0) {
    if (state.mode !== "lost") playSfx("lose");
    state.mode = "lost";
    state.message = `Level ${state.level} failed. Try again.`;
  }
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: ((event.clientX - rect.left) / rect.width) * canvas.width, y: ((event.clientY - rect.top) / rect.height) * canvas.height };
}

function boardPoint(point) {
  const x = Math.floor((point.x - state.boardX) / state.cell);
  const y = Math.floor((point.y - state.boardY) / state.cell);
  if (x < 0 || y < 0 || x >= BOARD || y >= BOARD) return null;
  return { x, y };
}

function toggleFullscreen() {
  if (!document.fullscreenElement) canvas.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function handleButtonPress(id) {
  if (id === "restart") startGame(state.level);
  else if (id === "hint" && state.mode === "playing" && !state.inputLocked) showHint();
  else if (id === "fullscreen") {
    playSfx("select");
    toggleFullscreen();
  } else if (id === "sound") {
    toggleSound();
  }
}

function hitButton(point) {
  for (const button of uiButtons) {
    if (
      point.x >= button.x &&
      point.x <= button.x + button.w &&
      point.y >= button.y &&
      point.y <= button.y + button.h
    ) {
      return button;
    }
  }
  return null;
}

function handlePointerDown(event) {
  const point = canvasPoint(event);
  const button = hitButton(point);
  if (button) {
    handleButtonPress(button.id);
    return;
  }
  if (state.mode === "menu" || state.mode === "won" || state.mode === "lost") {
    continueFromOverlay();
    return;
  }
  const target = boardPoint(point);
  if (target) attemptSwap(target);
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === " " || key === "enter" || key === "r") {
    if (key === "r") startGame(state.level);
    else if (state.mode !== "playing") continueFromOverlay();
  }
  if (key === "f") {
    playSfx("select");
    toggleFullscreen();
  }
  if (key === "h" && state.mode === "playing" && !state.inputLocked) {
    showHint();
  }
  if (key === "m") {
    toggleSound();
  }
}

function update(dt) {
  state.elapsed += dt;
  if (state.mode === "playing" && !state.inputLocked) {
    state.timeLeft = Math.max(0, state.timeLeft - dt);
    updateEndState();
  }
  state.shake = Math.max(0, state.shake - dt);

  for (let y = 0; y < BOARD; y += 1) {
    for (let x = 0; x < BOARD; x += 1) {
      const tile = state.board[y]?.[x];
      if (!tile) continue;
      tile.sx += (tile.x - tile.sx) * Math.min(1, dt * 12);
      tile.sy += (tile.y - tile.sy) * Math.min(1, dt * 12);
      tile.scale += (1 - tile.scale) * Math.min(1, dt * 10);
    }
  }

  state.particles = state.particles.filter((p) => {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 180 * dt;
    return p.life > 0;
  });
  state.floating = state.floating.filter((f) => {
    f.life -= dt;
    f.y += f.vy * dt;
    return f.life > 0;
  });
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#fff7df");
  gradient.addColorStop(0.48, "#f7d1c8");
  gradient.addColorStop(1, "#d7f0df");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 24; i += 1) {
    const x = (i * 149 + Math.sin(state.elapsed + i) * 18) % canvas.width;
    const y = (i * 89 + Math.cos(state.elapsed * 0.7 + i) * 12) % canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 14 + (i % 4) * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHud() {
  uiButtons.length = 0;
  if (state.isMobile) {
    drawMobileHud();
    return;
  }
  const panelX = 662;
  const panelY = 84;
  const panelW = 232;
  const panelH = 600;
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  roundRect(panelX, panelY, panelW, panelH, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(63, 50, 77, 0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#272338";
  ctx.font = "700 34px Inter, sans-serif";
  ctx.fillText("Fruit Swap", panelX + 24, panelY + 50);
  ctx.fillStyle = "#e94f7a";
  ctx.font = "900 16px Inter, sans-serif";
  ctx.fillText(`Level ${state.level}/${MAX_LEVEL}`, panelX + 24, panelY + 76);
  drawStat("Score", state.score.toString(), panelX + 24, panelY + 112);
  drawGoals(panelX + 24, panelY + 182, panelW - 48, false);
  drawStat("Moves", state.moves.toString(), panelX + 24, panelY + 326);
  drawStat("Time", `${Math.ceil(state.timeLeft)}s`, panelX + 24, panelY + 402);
  ctx.fillStyle = "#5a5266";
  ctx.font = "600 18px Inter, sans-serif";
  wrapText(state.message, panelX + 24, panelY + 458, panelW - 48, 25);
  drawHudButton("hint", "Hint", panelX + 24, panelY + 528, 86, 34);
  drawHudButton("restart", "Restart", panelX + 122, panelY + 528, 86, 34);
  drawHudButton("fullscreen", "Full", panelX + 24, panelY + 574, 86, 34);
  drawHudButton("sound", state.soundOn ? "Sound On" : "Muted", panelX + 122, panelY + 574, 86, 34);
}

function drawMobileHud() {
  const pad = 16;
  ctx.fillStyle = "#272338";
  ctx.font = "900 34px Inter, sans-serif";
  ctx.fillText("Fruit Swap", pad, 40);
  ctx.fillStyle = "#e94f7a";
  ctx.font = "900 14px Inter, sans-serif";
  ctx.fillText(`Level ${state.level}/${MAX_LEVEL}`, canvas.width - 112, 38);

  const cardY = 58;
  const gap = 8;
  const cardW = (canvas.width - pad * 2 - gap * 2) / 3;
  drawMobileStat("Score", state.score.toString(), pad, cardY, cardW);
  drawMobileStat("Moves", state.moves.toString(), pad + (cardW + gap), cardY, cardW);
  drawMobileStat("Time", `${Math.ceil(state.timeLeft)}s`, pad + (cardW + gap) * 2, cardY, cardW);

  drawGoals(pad, 122, canvas.width - pad * 2, true);

  ctx.fillStyle = "#5a5266";
  ctx.font = "800 15px Inter, sans-serif";
  wrapText(state.message, pad, 176, canvas.width - pad * 2, 20);

  const boardBottom = state.boardY + state.cell * BOARD;
  const buttonY = Math.min(canvas.height - 108, boardBottom + 22);
  const buttonW = (canvas.width - pad * 2 - 10) / 2;
  drawHudButton("hint", "Hint", pad, buttonY, buttonW, 40);
  drawHudButton("restart", "Restart", pad + buttonW + 10, buttonY, buttonW, 40);
  drawHudButton("fullscreen", "Full", pad, buttonY + 50, buttonW, 40);
  drawHudButton("sound", state.soundOn ? "Sound On" : "Muted", pad + buttonW + 10, buttonY + 50, buttonW, 40);
}

function drawMobileStat(label, value, x, y, w) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  roundRect(x, y, w, 52, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(63, 50, 77, 0.12)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#80758c";
  ctx.font = "800 10px Inter, sans-serif";
  ctx.fillText(label.toUpperCase(), x + 8, y + 18);
  ctx.fillStyle = "#272338";
  ctx.font = "900 20px Inter, sans-serif";
  ctx.fillText(value, x + 8, y + 42);
}

function drawGoals(x, y, w, compact) {
  ctx.fillStyle = "#80758c";
  ctx.font = compact ? "900 11px Inter, sans-serif" : "900 13px Inter, sans-serif";
  ctx.fillText("GOALS", x, y);
  if (!state.goals.length) return;

  const gap = compact ? 7 : 0;
  const pillH = compact ? 34 : 30;
  const pillW = compact ? (w - gap * (state.goals.length - 1)) / state.goals.length : w;
  for (let i = 0; i < state.goals.length; i += 1) {
    const goal = state.goals[i];
    const px = compact ? x + i * (pillW + gap) : x;
    const py = y + 10 + (compact ? 0 : i * 35);
    const done = goal.collected >= goal.needed;
    ctx.fillStyle = done ? "rgba(218, 255, 224, 0.86)" : "rgba(255, 255, 255, 0.74)";
    roundRect(px, py, pillW, pillH, 8);
    ctx.fill();
    ctx.strokeStyle = done ? "rgba(68, 165, 88, 0.45)" : "rgba(63, 50, 77, 0.14)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = `${compact ? 19 : 20}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText(TYPES[goal.type].emoji, px + 8, py + pillH / 2 + 1);
    ctx.fillStyle = "#272338";
    ctx.font = compact ? "900 14px Inter, sans-serif" : "900 16px Inter, sans-serif";
    const shown = Math.min(goal.collected, goal.needed);
    ctx.fillText(`${shown}/${goal.needed}`, px + (compact ? 36 : 46), py + pillH / 2 + 1);
    ctx.textBaseline = "alphabetic";
  }
  ctx.textAlign = "start";
}

function drawStat(label, value, x, y) {
  ctx.fillStyle = "#80758c";
  ctx.font = "700 14px Inter, sans-serif";
  ctx.fillText(label.toUpperCase(), x, y);
  ctx.fillStyle = "#272338";
  ctx.font = "800 32px Inter, sans-serif";
  ctx.fillText(value, x, y + 36);
}

function drawHudButton(id, label, x, y, w, h) {
  uiButtons.push({ id, x, y, w, h });
  const disabled = id === "hint" && (state.mode !== "playing" || state.inputLocked);
  ctx.save();
  ctx.globalAlpha = disabled ? 0.45 : 1;
  const fill = ctx.createLinearGradient(x, y, x, y + h);
  fill.addColorStop(0, "#ffffff");
  fill.addColorStop(1, "#ffe9d8");
  ctx.fillStyle = fill;
  roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(63, 50, 77, 0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#272338";
  ctx.font = label.length > 7 ? "800 13px Inter, sans-serif" : "800 15px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
  ctx.restore();
}

function drawBoard() {
  const offset = state.shake > 0 ? Math.sin(state.elapsed * 70) * state.shake * 20 : 0;
  const boardSize = state.cell * BOARD;
  const x0 = state.boardX + offset;
  const y0 = state.boardY;
  ctx.fillStyle = "rgba(75, 45, 70, 0.18)";
  roundRect(x0 - 12, y0 - 12, boardSize + 24, boardSize + 24, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  roundRect(x0 - 2, y0 - 2, boardSize + 4, boardSize + 4, 8);
  ctx.fill();
  for (let y = 0; y < BOARD; y += 1) {
    for (let x = 0; x < BOARD; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#fff5e1" : "#ffe9d8";
      roundRect(x0 + x * state.cell + 4, y0 + y * state.cell + 4, state.cell - 8, state.cell - 8, 8);
      ctx.fill();
    }
  }
  for (let y = 0; y < BOARD; y += 1) {
    for (let x = 0; x < BOARD; x += 1) {
      const tile = state.board[y][x];
      if (tile) drawTile(tile, x0, y0);
    }
  }
  if (state.hint && state.mode === "playing") {
    ctx.strokeStyle = "rgba(255, 205, 46, 0.95)";
    ctx.lineWidth = 4;
    for (const cell of [state.hint.from, state.hint.to]) {
      roundRect(x0 + cell.x * state.cell + 7, y0 + cell.y * state.cell + 7, state.cell - 14, state.cell - 14, 8);
      ctx.stroke();
    }
  }
  if (state.selected) {
    ctx.strokeStyle = "#272338";
    ctx.lineWidth = 4;
    roundRect(x0 + state.selected.x * state.cell + 7, y0 + state.selected.y * state.cell + 7, state.cell - 14, state.cell - 14, 8);
    ctx.stroke();
  }
}

function candyGradient(type, r) {
  const gradient = ctx.createRadialGradient(-r * 0.38, -r * 0.44, r * 0.05, r * 0.14, r * 0.18, r * 1.22);
  gradient.addColorStop(0, type.light);
  gradient.addColorStop(0.24, "#ffffff");
  gradient.addColorStop(0.42, type.color);
  gradient.addColorStop(0.76, type.rim);
  gradient.addColorStop(1, type.dark);
  return gradient;
}

function drawTile(tile, x0, y0) {
  const type = TYPES[tile.type];
  const cx = x0 + tile.sx * state.cell + state.cell / 2;
  const cy = y0 + tile.sy * state.cell + state.cell / 2;
  const r = state.cell * 0.41 * tile.scale;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin((tile.x + 1) * 3.1 + (tile.y + 2) * 1.7) * 0.035);
  drawContactShadow(r);
  drawReferenceFruit(type, r);
  /*
  if (candySpritesReady && candySprites[tile.type]?.complete) {
    const size = r * 2.82;
    ctx.drawImage(candySprites[tile.type], -size / 2, -size / 2, size, size);
  } else if (type.candy === "fruit") drawFruit(type, r);
  else if (type.candy === "sugarBall") drawSugarBall(type, r);
  else if (type.candy === "heart") drawHeart(type, r);
  else if (type.candy === "popsicle") drawPopsicle(type, r);
  else drawLollipop(type, r);
  */
  ctx.restore();
}

function drawReferenceFruit(type, r) {
  drawEmojiFruit(type, r);
}

function drawEmojiFruit(type, r) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.round(r * 1.55)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;

  const shadow = ctx.createRadialGradient(r * 0.12, r * 0.6, r * 0.05, r * 0.12, r * 0.6, r * 0.9);
  shadow.addColorStop(0, "rgba(65, 38, 20, 0.26)");
  shadow.addColorStop(1, "rgba(65, 38, 20, 0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(r * 0.1, r * 0.62, r * 0.82, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "rgba(70, 39, 24, 0.22)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 5;
  ctx.fillText(type.emoji, 0, r * 0.02);

  ctx.shadowColor = "transparent";
  ctx.restore();
}

function refOutline(fill, stroke = "#6b3a18", width = 4) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

function refLeaf(x, y, r, angle = -0.55) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#58d320";
  ctx.strokeStyle = "#2d7d16";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.34, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function refStem(x, y, r, angle = 0.35) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "#8a4a13";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.38);
  ctx.stroke();
  ctx.restore();
}

function refHighlight(r, x = -0.35, y = -0.35) {
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.beginPath();
  ctx.ellipse(r * x, r * y, r * 0.22, r * 0.1, -0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.beginPath();
  ctx.ellipse(r * (x + 0.23), r * (y + 0.18), r * 0.1, r * 0.045, -0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawRefApple(type, r) {
  const fill = ctx.createLinearGradient(-r * 0.6, -r * 0.65, r * 0.55, r * 0.65);
  fill.addColorStop(0, "#ff693f");
  fill.addColorStop(0.55, "#f33723");
  fill.addColorStop(1, "#c71d17");
  ctx.beginPath();
  ctx.moveTo(0, r * 0.72);
  ctx.bezierCurveTo(-r * 0.92, r * 0.52, -r * 0.86, -r * 0.52, -r * 0.35, -r * 0.58);
  ctx.bezierCurveTo(-r * 0.12, -r * 0.62, -r * 0.04, -r * 0.45, 0, -r * 0.36);
  ctx.bezierCurveTo(r * 0.04, -r * 0.45, r * 0.12, -r * 0.62, r * 0.35, -r * 0.58);
  ctx.bezierCurveTo(r * 0.86, -r * 0.52, r * 0.92, r * 0.52, 0, r * 0.72);
  ctx.closePath();
  refOutline(fill);
  refStem(r * 0.04, -r * 0.56, r);
  refLeaf(r * 0.22, -r * 0.74, r);
  refHighlight(r);
}

function drawRefOrange(type, r) {
  const fill = ctx.createRadialGradient(-r * 0.35, -r * 0.38, r * 0.08, 0, 0, r);
  fill.addColorStop(0, "#ffe35c");
  fill.addColorStop(0.34, "#ffad1f");
  fill.addColorStop(1, "#f0780e");
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.76, 0, Math.PI * 2);
  refOutline(fill);
  refLeaf(r * 0.18, -r * 0.74, r, -0.35);
  refHighlight(r, -0.32, -0.36);
}

function drawRefLime(type, r) {
  const fill = ctx.createRadialGradient(-r * 0.35, -r * 0.38, r * 0.08, 0, 0, r);
  fill.addColorStop(0, "#efff94");
  fill.addColorStop(0.42, "#9bdd31");
  fill.addColorStop(1, "#58a918");
  ctx.beginPath();
  ctx.ellipse(0, r * 0.03, r * 0.72, r * 0.78, -0.45, 0, Math.PI * 2);
  refOutline(fill);
  refHighlight(r, -0.28, -0.38);
}

function drawRefBanana(type, r) {
  ctx.beginPath();
  ctx.moveTo(-r * 0.78, r * 0.1);
  ctx.bezierCurveTo(-r * 0.12, r * 0.82, r * 0.68, r * 0.42, r * 0.84, -r * 0.36);
  ctx.bezierCurveTo(r * 0.36, r * 0.12, -r * 0.22, r * 0.16, -r * 0.58, -r * 0.22);
  ctx.bezierCurveTo(-r * 0.68, -r * 0.08, -r * 0.74, r * 0.02, -r * 0.78, r * 0.1);
  ctx.closePath();
  const fill = ctx.createLinearGradient(-r * 0.65, -r * 0.2, r * 0.7, r * 0.45);
  fill.addColorStop(0, "#fff38b");
  fill.addColorStop(0.48, "#ffd936");
  fill.addColorStop(1, "#f0a918");
  refOutline(fill);
  ctx.strokeStyle = "rgba(160,91,10,0.38)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, -r * 0.02);
  ctx.bezierCurveTo(-r * 0.05, r * 0.34, r * 0.48, r * 0.18, r * 0.62, -r * 0.2);
  ctx.stroke();
  ctx.fillStyle = "#9a5816";
  ctx.beginPath();
  ctx.ellipse(-r * 0.72, -r * 0.04, r * 0.1, r * 0.07, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.78, -r * 0.36, r * 0.1, r * 0.07, -0.7, 0, Math.PI * 2);
  ctx.fill();
  refHighlight(r, -0.35, -0.28);
}

function drawRefGrapes(type, r) {
  const fill = ctx.createRadialGradient(-r * 0.18, -r * 0.2, r * 0.05, 0, 0, r);
  fill.addColorStop(0, "#d997ff");
  fill.addColorStop(0.4, "#8d4bc2");
  fill.addColorStop(1, "#4c2382");
  const grapes = [
    [-0.28, -0.12], [0.02, -0.18], [0.32, -0.08],
    [-0.18, 0.16], [0.14, 0.14], [-0.02, 0.42],
  ];
  for (const [x, y] of grapes) {
    ctx.beginPath();
    ctx.arc(r * x, r * y, r * 0.25, 0, Math.PI * 2);
    refOutline(fill, "#562270", 3);
  }
  refStem(r * 0.08, -r * 0.48, r, 0.15);
  refLeaf(r * 0.22, -r * 0.58, r, -0.25);
  refHighlight(r, -0.2, -0.12);
}

function drawRefStrawberry(type, r) {
  const fill = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.08, 0, 0, r);
  fill.addColorStop(0, "#ff9270");
  fill.addColorStop(0.42, "#f04335");
  fill.addColorStop(1, "#bd1f25");
  ctx.beginPath();
  ctx.moveTo(0, r * 0.82);
  ctx.bezierCurveTo(-r * 0.86, r * 0.35, -r * 0.82, -r * 0.5, -r * 0.32, -r * 0.62);
  ctx.bezierCurveTo(-r * 0.1, -r * 0.72, r * 0.1, -r * 0.72, r * 0.32, -r * 0.62);
  ctx.bezierCurveTo(r * 0.82, -r * 0.5, r * 0.86, r * 0.35, 0, r * 0.82);
  ctx.closePath();
  refOutline(fill);
  ctx.fillStyle = "#ffd68a";
  for (let i = 0; i < 14; i += 1) {
    const a = (i * 2.399963) % (Math.PI * 2);
    const rr = r * (0.18 + ((i * 31) % 45) / 100);
    const x = Math.cos(a) * rr * 0.72;
    const y = Math.sin(a) * rr * 0.82;
    if (y < -r * 0.52 || y > r * 0.58) continue;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.035, r * 0.018, a, 0, Math.PI * 2);
    ctx.fill();
  }
  refLeaf(-r * 0.16, -r * 0.64, r, 0.2);
  refLeaf(r * 0.06, -r * 0.68, r, -0.8);
  refLeaf(r * 0.25, -r * 0.58, r, -0.3);
  refHighlight(r, -0.28, -0.38);
}

function drawRefSlice(type, r) {
  const isRed = type.name === "Grapefruit Slice";
  const base = isRed ? "#f04a42" : "#ffd92f";
  const dark = isRed ? "#9e1a1f" : "#cf9810";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.76, 0, Math.PI * 2);
  refOutline("#fff8d8", dark, 4);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
  ctx.fillStyle = base;
  ctx.fill();
  ctx.strokeStyle = "#fffdf2";
  ctx.lineWidth = 3;
  for (let i = 0; i < 10; i += 1) {
    const a = (Math.PI * 2 * i) / 10;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  refHighlight(r, -0.36, -0.38);
}

function drawContactShadow(r) {
  ctx.save();
  ctx.shadowColor = "transparent";
  const shadow = ctx.createRadialGradient(r * 0.12, r * 0.58, r * 0.08, r * 0.12, r * 0.58, r * 0.98);
  shadow.addColorStop(0, "rgba(80, 44, 42, 0.28)");
  shadow.addColorStop(0.72, "rgba(80, 44, 42, 0.12)");
  shadow.addColorStop(1, "rgba(80, 44, 42, 0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(r * 0.1, r * 0.62, r * 0.98, r * 0.28, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCandyShell(type, r, path) {
  ctx.save();
  ctx.translate(r * 0.12, r * 0.18);
  ctx.globalAlpha = 0.46;
  ctx.fillStyle = "#4b1e21";
  path();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(r * 0.055, r * 0.085);
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = type.dark;
  ctx.lineWidth = r * 0.2;
  ctx.lineJoin = "round";
  path();
  ctx.stroke();
  ctx.restore();

  ctx.globalAlpha = 0.96;
  ctx.fillStyle = candyGradient(type, r);
  path();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255, 239, 220, 0.88)";
  ctx.lineWidth = r * 0.1;
  path();
  ctx.stroke();

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = r * 0.16;
  path();
  ctx.stroke();

  ctx.globalAlpha = 0.16;
  ctx.fillStyle = type.light;
  ctx.beginPath();
  ctx.ellipse(r * 0.12, r * 0.18, r * 0.7, r * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawFruit(type, r) {
  const fruitShape = type.berry
    ? () => strawberryPath(r)
    : () => {
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.98, r * 0.94, 0, 0, Math.PI * 2);
  };
  drawCandyShell(type, r, fruitShape);
  if (type.citrus) drawCitrusSegments(type, r);
  if (!type.citrus && !type.berry) drawOrbCore(type, r);
  if (type.berry) drawBerrySeeds(r);
  drawLowerShade(r, type);
  drawSugar(r, 18);
  if (type.stem) {
    ctx.strokeStyle = type.stem;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.76);
    ctx.quadraticCurveTo(r * 0.08, -r * 1.02, r * 0.22, -r * 1.12);
    ctx.stroke();
    ctx.fillStyle = "#49b33f";
    ctx.beginPath();
    ctx.ellipse(-r * 0.18, -r * 0.82, r * 0.24, r * 0.1, -0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  drawBigSpecular(r);
}

function strawberryPath(r) {
  ctx.beginPath();
  ctx.moveTo(0, r * 0.92);
  ctx.bezierCurveTo(-r * 0.9, r * 0.42, -r * 0.98, -r * 0.44, -r * 0.45, -r * 0.76);
  ctx.bezierCurveTo(-r * 0.18, -r * 0.94, r * 0.18, -r * 0.94, r * 0.45, -r * 0.76);
  ctx.bezierCurveTo(r * 0.98, -r * 0.44, r * 0.9, r * 0.42, 0, r * 0.92);
  ctx.closePath();
}

function drawSugarBall(type, r) {
  drawCandyShell(type, r, () => {
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.96, 0, 0, Math.PI * 2);
  });
  drawLowerShade(r, type);
  drawOrbCore(type, r);
  ctx.fillStyle = "rgba(255, 190, 235, 0.22)";
  ctx.beginPath();
  ctx.arc(r * 0.3, r * 0.28, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  drawSugar(r, 22);
  drawBigSpecular(r);
}

function drawOrbCore(type, r) {
  ctx.save();
  ctx.globalAlpha = 0.32;
  ctx.strokeStyle = type.light;
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 5; i += 1) {
    const a = -0.7 + i * 0.35;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * (0.18 + i * 0.13), r * 0.78, a, -1.15, 1.15);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, Math.PI * 0.1, Math.PI * 0.86);
  ctx.stroke();
  ctx.restore();
}

function drawCitrusSegments(type, r) {
  ctx.save();
  ctx.globalAlpha = 0.58;
  ctx.strokeStyle = "rgba(255, 244, 178, 0.95)";
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12 - 0.1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r * 0.78, Math.sin(angle) * r * 0.78);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.74, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 235, 72, 0.16)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBerrySeeds(r) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 230, 202, 0.96)";
  for (let i = 0; i < 26; i += 1) {
    const angle = (i * 2.399963 + 0.2) % (Math.PI * 2);
    const radius = r * (0.18 + ((i * 31) % 58) / 100);
    ctx.save();
    ctx.translate(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.045, r * 0.022, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function heartPath(r) {
  ctx.beginPath();
  ctx.moveTo(0, r * 0.76);
  ctx.bezierCurveTo(-r * 1.08, r * 0.12, -r * 1.04, -r * 0.66, -r * 0.42, -r * 0.76);
  ctx.bezierCurveTo(-r * 0.12, -r * 0.82, 0, -r * 0.52, 0, -r * 0.38);
  ctx.bezierCurveTo(0, -r * 0.52, r * 0.12, -r * 0.82, r * 0.42, -r * 0.76);
  ctx.bezierCurveTo(r * 1.04, -r * 0.66, r * 1.08, r * 0.12, 0, r * 0.76);
  ctx.closePath();
}

function drawHeart(type, r) {
  ctx.save();
  ctx.translate(r * 0.12, r * 0.18);
  ctx.fillStyle = "rgba(74, 22, 24, 0.32)";
  heartPath(r);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = candyGradient(type, r);
  heartRingPath(r, r * 0.48);
  ctx.fill("evenodd");
  ctx.strokeStyle = "rgba(255, 237, 221, 0.88)";
  ctx.lineWidth = r * 0.12;
  heartPath(r);
  ctx.stroke();

  ctx.fillStyle = type.dark;
  ctx.globalAlpha = 0.22;
  heartPath(r * 0.5);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255, 245, 225, 0.62)";
  ctx.lineWidth = r * 0.08;
  heartPath(r * 0.48);
  ctx.stroke();
  ctx.fillStyle = type.light;
  ctx.globalAlpha = 0.18;
  heartPath(r * 0.34);
  ctx.fill();
  ctx.globalAlpha = 1;
  drawBigSpecular(r, -0.2, -0.2);
}

function drawPopsicle(type, r) {
  ctx.save();
  ctx.rotate(-0.72);
  ctx.save();
  ctx.translate(r * 0.12, r * 0.16);
  ctx.fillStyle = "rgba(95, 45, 38, 0.26)";
  roundRect(-r * 0.5, -r * 1.02, r, r * 1.7, r * 0.24);
  ctx.fill();
  ctx.restore();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#dcb284";
  ctx.lineWidth = r * 0.22;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, r * 0.72);
  ctx.lineTo(0, r * 1.33);
  ctx.stroke();
  ctx.globalAlpha = 0.96;
  ctx.fillStyle = candyGradient(type, r);
  roundRect(-r * 0.5, -r * 1.02, r, r * 1.7, r * 0.24);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowColor = "transparent";
  ctx.save();
  roundRect(-r * 0.5, -r * 1.02, r, r * 1.7, r * 0.24);
  ctx.clip();
  for (let i = -3; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.78)" : "rgba(255,145,43,0.5)";
    ctx.fillRect(-r * 0.76, -r * 0.95 + i * r * 0.32, r * 1.52, r * 0.16);
  }
  ctx.restore();
  const side = ctx.createLinearGradient(0, -r, 0, r);
  side.addColorStop(0, "rgba(255,255,255,0.72)");
  side.addColorStop(1, "rgba(161,63,28,0.35)");
  ctx.strokeStyle = side;
  ctx.lineWidth = 4;
  roundRect(-r * 0.43, -r * 0.92, r * 0.86, r * 1.52, r * 0.2);
  ctx.stroke();
  drawBigSpecular(r, -0.14, -0.34);
  ctx.restore();
}

function drawLollipop(type, r) {
  ctx.save();
  ctx.rotate(-0.72);
  ctx.strokeStyle = "#dcb284";
  ctx.lineWidth = r * 0.18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, r * 0.54);
  ctx.lineTo(0, r * 1.34);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(r * 0.08, r * 0.14);
  ctx.fillStyle = "rgba(100, 36, 36, 0.22)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 0.98;
  const rind = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.08, 0, 0, r);
  rind.addColorStop(0, "#fff9f0");
  rind.addColorStop(0.58, "#fff2e8");
  rind.addColorStop(0.72, "#f4d8c4");
  rind.addColorStop(1, "#b21d22");
  ctx.fillStyle = rind;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.shadowColor = "transparent";
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.76, 0, Math.PI * 2);
  ctx.clip();
  for (let i = 0; i < 12; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 12);
    const pulp = ctx.createRadialGradient(0, 0, 0, r * 0.38, 0, r * 0.78);
    pulp.addColorStop(0, i % 2 === 0 ? "rgba(255, 105, 92, 0.86)" : "rgba(205, 22, 32, 0.78)");
    pulp.addColorStop(1, "rgba(124, 10, 20, 0.7)");
    ctx.fillStyle = pulp;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r * 0.78, -0.09, 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255, 247, 235, 0.88)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r * 0.74, Math.sin(angle) * r * 0.74);
    ctx.stroke();
  }
  ctx.fillStyle = "#fff9f5";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.78)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.76, -0.5, Math.PI * 0.8);
  ctx.stroke();
  drawBigSpecular(r);
}

function heartRingPath(outer, inner) {
  heartPath(outer);
  ctx.moveTo(0, inner * 0.76);
  ctx.bezierCurveTo(inner * 1.08, inner * 0.12, inner * 1.04, -inner * 0.66, inner * 0.42, -inner * 0.76);
  ctx.bezierCurveTo(inner * 0.12, -inner * 0.82, 0, -inner * 0.52, 0, -inner * 0.38);
  ctx.bezierCurveTo(0, -inner * 0.52, -inner * 0.12, -inner * 0.82, -inner * 0.42, -inner * 0.76);
  ctx.bezierCurveTo(-inner * 1.04, -inner * 0.66, -inner * 1.08, inner * 0.12, 0, inner * 0.76);
  ctx.closePath();
}

function drawLowerShade(r, type, height = 0.82) {
  const shade = ctx.createLinearGradient(0, -r, 0, r);
  shade.addColorStop(0, "rgba(255,255,255,0)");
  shade.addColorStop(0.56, "rgba(255,255,255,0)");
  shade.addColorStop(1, "rgba(58,20,35,0.28)");
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.05, r * 0.78, r * height, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.26;
  ctx.strokeStyle = type.dark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.82, Math.PI * 0.1, Math.PI * 0.88);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawBigSpecular(r, x = -0.32, y = -0.42) {
  ctx.save();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.beginPath();
  ctx.ellipse(r * x, r * y, r * 0.28, r * 0.13, -0.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.54)";
  ctx.beginPath();
  ctx.ellipse(r * (x + 0.24), r * (y + 0.18), r * 0.13, r * 0.06, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.ellipse(r * 0.2, r * 0.33, r * 0.23, r * 0.1, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGloss(r, x = -0.34, y = -0.4) {
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.beginPath();
  ctx.ellipse(r * x, r * y, r * 0.36, r * 0.15, -0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.08, -r * 0.12, r * 0.16, r * 0.07, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(r * 0.22, r * 0.32, r * 0.18, r * 0.08, -0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawSugar(r, count) {
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  for (let i = 0; i < count; i += 1) {
    const angle = (i * 2.399963 + 0.35) % (Math.PI * 2);
    const radius = r * (0.25 + ((i * 37) % 58) / 100);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(x, y, r * (0.035 + ((i * 11) % 8) / 230), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.font = "800 28px Inter, sans-serif";
  ctx.textAlign = "center";
  for (const f of state.floating) {
    ctx.globalAlpha = Math.max(0, f.life / 0.8);
    ctx.fillStyle = "#272338";
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.textAlign = "start";
  ctx.globalAlpha = 1;
}

function drawOverlay(title, subtitle, action) {
  ctx.fillStyle = "rgba(255, 248, 237, 0.82)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#272338";
  ctx.textAlign = "center";
  const mobile = state.isMobile;
  ctx.font = mobile ? "900 46px Inter, sans-serif" : "900 72px Inter, sans-serif";
  ctx.fillText(title, canvas.width / 2, mobile ? 210 : 210);
  ctx.font = mobile ? "700 18px Inter, sans-serif" : "600 24px Inter, sans-serif";
  wrapTextCentered(subtitle, canvas.width / 2, mobile ? 262 : 270, mobile ? 340 : 560, mobile ? 27 : 34);
  ctx.fillStyle = "#e94f7a";
  roundRect(canvas.width / 2 - (mobile ? 112 : 130), mobile ? 354 : 384, mobile ? 224 : 260, mobile ? 58 : 64, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = mobile ? "800 20px Inter, sans-serif" : "800 22px Inter, sans-serif";
  ctx.fillText(action, canvas.width / 2, mobile ? 391 : 424);
  ctx.fillStyle = "#5a5266";
  ctx.font = mobile ? "700 15px Inter, sans-serif" : "600 18px Inter, sans-serif";
  if (mobile) {
    wrapTextCentered("Match 3+ fruits. Collect the goal fruits shown above.", canvas.width / 2, 468, 340, 24);
  } else {
    ctx.fillText("Match 3+ fruits. Collect the goal fruits shown on the HUD.", canvas.width / 2, 500);
    ctx.fillText("Click one fruit, then click an adjacent fruit to swap.", canvas.width / 2, 532);
  }
  ctx.textAlign = "start";
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

function wrapTextCentered(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

function resizeCanvas() {
  const mobile = window.innerWidth <= 700 || window.innerHeight > window.innerWidth * 1.12;
  canvas.width = mobile ? 430 : 960;
  canvas.height = mobile ? 760 : 720;
}

function layout() {
  state.isMobile = canvas.width <= 500;
  if (state.isMobile) {
    state.cell = Math.floor(Math.min((canvas.width - 28) / BOARD, (canvas.height - 300) / BOARD));
    state.boardX = Math.floor((canvas.width - state.cell * BOARD) / 2);
    state.boardY = 205;
  } else {
    state.cell = 66;
    state.boardX = 77;
    state.boardY = 96;
  }
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  layout();
  drawBoard();
  drawHud();
  drawParticles();
  if (state.mode === "menu") drawOverlay("Fruit Swap", "Collect the shown fruit goals to clear each level.", "Start Game");
  else if (state.mode === "won") {
    const finalLevel = state.level >= MAX_LEVEL;
    drawOverlay(finalLevel ? "All Clear!" : "Level Clear!", `Level ${state.level}/${MAX_LEVEL} goals complete`, finalLevel ? "Play Again" : "Next Level");
  } else if (state.mode === "lost") drawOverlay("Game Over", `Level ${state.level}/${MAX_LEVEL}  Score: ${state.score}`, "Try Again");
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function renderGameToText() {
  return JSON.stringify({
    coordinates: "Board origin is top-left. x increases right, y increases down.",
    mode: state.mode,
    level: state.level,
    maxLevel: MAX_LEVEL,
    activeTypes: state.activeTypes,
    score: state.score,
    goals: state.goals.map((goal) => ({
      fruit: TYPES[goal.type].name,
      emoji: TYPES[goal.type].emoji,
      collected: goal.collected,
      needed: goal.needed,
    })),
    goalsComplete: goalsComplete(),
    target: state.target,
    moves: state.moves,
    timeLeft: Math.ceil(state.timeLeft),
    boardOrigin: { x: state.boardX, y: state.boardY },
    cellSize: state.cell,
    isMobile: state.isMobile,
    selected: state.selected,
    hint: state.hint,
    inputLocked: state.inputLocked,
    soundOn: state.soundOn,
    message: state.message,
    buttons: uiButtons.map(({ id, x, y, w, h }) => ({ id, x, y, w, h })),
    board: state.board.map((row) => row.map((tile) => (tile ? TYPES[tile.type].name : "Empty"))),
  });
}

window.render_game_to_text = renderGameToText;
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i += 1) update(1 / 60);
  render();
};

canvas.addEventListener("pointerdown", handlePointerDown);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("resize", () => {
  resizeCanvas();
  render();
});
document.addEventListener("fullscreenchange", () => {
  resizeCanvas();
  render();
});

state.board = makeBoard();
resizeCanvas();
render();
requestAnimationFrame(loop);
