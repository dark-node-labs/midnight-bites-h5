(function () {
  "use strict";

  const PART_LABELS = {
    head: "head",
    body: "body",
    hair: "hair",
    helmet: "helmet",
    ears: "ears",
    belly: "belly",
    tail: "tail",
    paws: "paws",
    stripes: "stripes",
    wings: "wings",
    horns: "horns",
    mane: "mane",
    beak: "beak",
    accessory: "scarf",
    shoes: "shoes",
    gloves: "gloves",
    mark: "mark",
    badge: "badge"
  };

  const TEMPLATES = [
    { id: "starry-cat", name: "Starry Cat", parts: ["head", "body", "ears", "belly", "tail", "accessory"] },
    { id: "candy-tiger", name: "Candy Tiger", parts: ["head", "body", "ears", "belly", "stripes", "tail"] },
    { id: "moon-fox", name: "Moon Fox", parts: ["head", "body", "ears", "tail", "paws", "mark"] },
    { id: "cloud-bunny", name: "Cloud Bunny", parts: ["head", "body", "ears", "belly", "paws", "accessory"] },
    { id: "berry-panda", name: "Berry Panda", parts: ["head", "body", "ears", "belly", "paws", "accessory"] },
    { id: "bubble-seal", name: "Bubble Seal", parts: ["head", "body", "belly", "paws", "tail", "mark"] },
    { id: "cosmic-deer", name: "Cosmic Deer", parts: ["head", "body", "ears", "horns", "belly", "mark"] },
    { id: "pebble-penguin", name: "Pebble Penguin", parts: ["head", "body", "belly", "wings", "beak", "paws"] },
    { id: "noodle-pup", name: "Noodle Pup", parts: ["head", "body", "ears", "belly", "tail", "accessory"] },
    { id: "tiny-dragon", name: "Tiny Dragon", parts: ["head", "body", "ears", "belly", "wings", "tail"] }
  ];

  const els = {
    character: document.getElementById("toon-character"),
    roundPill: document.getElementById("toon-round-pill"),
    timer: document.getElementById("toon-timer"),
    score: document.getElementById("toon-score"),
    status: document.getElementById("toon-status"),
    controlTitle: document.getElementById("toon-control-title"),
    controlCopy: document.getElementById("toon-control-copy"),
    startBtn: document.getElementById("toon-start-btn"),
    lockBtn: document.getElementById("toon-lock-btn"),
    nextBtn: document.getElementById("toon-next-btn"),
    copyBtn: document.getElementById("toon-copy-btn"),
    battleBtn: document.getElementById("toon-battle-btn"),
    hue: document.getElementById("toon-hue"),
    sat: document.getElementById("toon-sat"),
    bright: document.getElementById("toon-bright"),
    hueValue: document.getElementById("toon-hue-value"),
    satValue: document.getElementById("toon-sat-value"),
    brightValue: document.getElementById("toon-bright-value"),
    preview: document.getElementById("toon-preview"),
    previewValues: document.getElementById("toon-preview-values"),
    results: document.getElementById("toon-results"),
    actualSwatch: document.getElementById("toon-actual-swatch"),
    guessSwatch: document.getElementById("toon-guess-swatch"),
    resultText: document.getElementById("toon-result-text"),
    summaryList: document.getElementById("toon-summary-list"),
    bestBox: document.getElementById("toon-best-box"),
    shareFallback: document.getElementById("toon-share-fallback"),
    shareText: document.getElementById("toon-share-text"),
    shareClose: document.getElementById("toon-share-close")
  };

  const today = new Date();
  const dateString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  const storageKey = `toon-tone-game-daily-${dateString}`;
  const state = {
    mode: "intro",
    rounds: generateChallengeSet(dateString, 0),
    current: 0,
    setIndex: 0,
    levelBase: 0,
    total: 0,
    results: [],
    guess: { h: 180, s: 70, v: 70 },
    timerId: null,
    timeLeft: 5
  };

  function seededRandom(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function random() {
      h += h << 13;
      h ^= h >>> 7;
      h += h << 3;
      h ^= h >>> 17;
      h += h << 5;
      return (h >>> 0) / 4294967296;
    };
  }

  function pick(rand, list) {
    return list[Math.floor(rand() * list.length)];
  }

  function makeColor(rand) {
    return {
      h: Math.floor(rand() * 360),
      s: 48 + Math.floor(rand() * 45),
      v: 48 + Math.floor(rand() * 43)
    };
  }

  function generateRound(seed, index) {
    const rand = seededRandom(`${seed}-${index}`);
    const template = TEMPLATES[index % TEMPLATES.length];
    const colors = {};
    template.parts.forEach((part) => {
      colors[part] = makeColor(rand);
    });
    const targetPool = template.parts.filter((part) => part !== "head");
    return {
      id: `${template.id}-${index}`,
      characterType: template.id,
      characterName: template.name,
      colors,
      targetPart: pick(rand, targetPool)
    };
  }

  function generateDailyRounds(day) {
    return generateChallengeSet(day, 0);
  }

  function generateChallengeSet(day, setIndex) {
    const rand = seededRandom(`toon-tone-game-${day}`);
    const order = TEMPLATES.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const swapIndex = Math.floor(rand() * (i + 1));
      [order[i], order[swapIndex]] = [order[swapIndex], order[i]];
    }
    return Array.from({ length: 5 }, (_, index) => {
      const absoluteIndex = setIndex * 5 + index;
      const templateIndex = order[absoluteIndex % order.length];
      const template = TEMPLATES[templateIndex];
      const roundRand = seededRandom(`toon-tone-game-${day}-stage-${absoluteIndex + 1}-${template.id}`);
      const round = generateRound(`toon-tone-game-${day}-${template.id}`, absoluteIndex);
      round.characterType = template.id;
      round.characterName = template.name;
      round.colors = {};
      template.parts.forEach((part) => {
        round.colors[part] = makeColor(roundRand);
      });
      round.targetPart = pick(roundRand, template.parts.filter((part) => part !== "head"));
      round.level = absoluteIndex + 1;
      round.memorySeconds = memorySecondsForLevel(round.level);
      return round;
    });
  }

  function memorySecondsForLevel(level) {
    return Math.max(2, 6 - Math.ceil(level / 5));
  }

  function hsvToRgb(hsv) {
    const h = ((hsv.h % 360) + 360) % 360;
    const s = Math.max(0, Math.min(100, hsv.s)) / 100;
    const v = Math.max(0, Math.min(100, hsv.v)) / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  function hsvToCss(hsv) {
    const rgb = hsvToRgb(hsv);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  function rgbToLab(rgb) {
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
    y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
    z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;
    return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
  }

  function deltaE(a, b) {
    return Math.sqrt(
      Math.pow(a.l - b.l, 2) +
      Math.pow(a.a - b.a, 2) +
      Math.pow(a.b - b.b, 2)
    );
  }

  function scoreGuess(target, guess) {
    const diff = deltaE(rgbToLab(hsvToRgb(target)), rgbToLab(hsvToRgb(guess)));
    return {
      delta: diff,
      score: Math.round(Math.max(0, 100 - diff * 2))
    };
  }

  function diagnose(target, guess, delta) {
    const hueDelta = ((((guess.h - target.h) % 360) + 540) % 360) - 180;
    if (delta < 5) return "Very close";
    if (guess.v - target.v > 10) return "Too bright";
    if (target.s - guess.s > 14) return "Too muted";
    if (hueDelta > 0) return "Hue was warmer than target";
    return "Hue was cooler than target";
  }

  function colorFor(round, part, hiddenPart, overrideColor) {
    if (part === hiddenPart && overrideColor) return hsvToCss(overrideColor);
    if (part === hiddenPart) return "url(#hiddenChecks)";
    return hsvToCss(round.colors[part] || { h: 30, s: 40, v: 90 });
  }

  function outline() {
    return "#332119";
  }

  function faceOverlay(type) {
    if (type === "tiny-monster") {
      return `
        <circle cx="250" cy="145" r="25" fill="#fff7e8" stroke="${outline()}" stroke-width="7"/>
        <circle cx="250" cy="149" r="11" fill="${outline()}"/>
        <circle cx="255" cy="143" r="4" fill="#ffffff"/>
        <ellipse cx="204" cy="185" rx="14" ry="9" fill="#ff9aa7" opacity=".55"/>
        <ellipse cx="296" cy="185" rx="14" ry="9" fill="#ff9aa7" opacity=".55"/>
        <path d="M219 212c20 20 43 20 62 0" fill="none" stroke="${outline()}" stroke-width="8" stroke-linecap="round"/>
      `;
    }
    if (type === "pixel-hero") {
      return `
        <rect x="216" y="142" width="18" height="22" rx="5" fill="${outline()}"/>
        <rect x="266" y="142" width="18" height="22" rx="5" fill="${outline()}"/>
        <rect x="221" y="146" width="5" height="5" rx="2" fill="#ffffff"/>
        <rect x="271" y="146" width="5" height="5" rx="2" fill="#ffffff"/>
        <path d="M226 181h48" stroke="${outline()}" stroke-width="8" stroke-linecap="round"/>
      `;
    }
    const y = type === "round-robot" || type === "star-explorer" ? 162 : 176;
    return `
      <ellipse cx="216" cy="${y}" rx="20" ry="24" fill="#ffffff" opacity=".96"/>
      <ellipse cx="284" cy="${y}" rx="20" ry="24" fill="#ffffff" opacity=".96"/>
      <circle cx="219" cy="${y + 2}" r="11" fill="${outline()}"/>
      <circle cx="287" cy="${y + 2}" r="11" fill="${outline()}"/>
      <circle cx="224" cy="${y - 5}" r="4" fill="#ffffff"/>
      <circle cx="292" cy="${y - 5}" r="4" fill="#ffffff"/>
      <ellipse cx="190" cy="${y + 36}" rx="17" ry="10" fill="#ff9aa7" opacity=".48"/>
      <ellipse cx="310" cy="${y + 36}" rx="17" ry="10" fill="#ff9aa7" opacity=".48"/>
      <path d="M224 ${y + 45}c17 18 35 18 52 0" fill="none" stroke="${outline()}" stroke-width="8" stroke-linecap="round"/>
    `;
  }

  function animalFace(mouthY = 214) {
    return `
      <ellipse cx="213" cy="174" rx="23" ry="28" fill="#fffaf1"/>
      <ellipse cx="287" cy="174" rx="23" ry="28" fill="#fffaf1"/>
      <circle cx="217" cy="178" r="12" fill="${outline()}"/>
      <circle cx="291" cy="178" r="12" fill="${outline()}"/>
      <circle cx="224" cy="168" r="5" fill="#ffffff"/>
      <circle cx="298" cy="168" r="5" fill="#ffffff"/>
      <ellipse cx="187" cy="211" rx="23" ry="13" fill="#ff9cab" opacity=".56"/>
      <ellipse cx="313" cy="211" rx="23" ry="13" fill="#ff9cab" opacity=".56"/>
      <path d="M232 ${mouthY}c12 13 24 13 36 0" fill="none" stroke="${outline()}" stroke-width="8" stroke-linecap="round"/>
    `;
  }

  function animalCharacterMarkup(round, fill, hiddenAttrs) {
    const o = outline();
    const whiskers = `
      <path d="M172 198l-44-13M172 215l-50 8M328 198l44-13M328 215l50 8" fill="none" stroke="${o}" stroke-width="6" stroke-linecap="round" opacity=".8"/>
    `;
    const star = (x, y, r1, r2, part) => {
      const points = [];
      for (let i = 0; i < 10; i += 1) {
        const angle = -Math.PI / 2 + i * Math.PI / 5;
        const r = i % 2 === 0 ? r1 : r2;
        points.push(`${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`);
      }
      return `<polygon points="${points.join(" ")}" fill="${fill(part)}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs(part)}/>`;
    };

    const templates = {
      "starry-cat": `
        <path d="M138 210C104 169 105 103 143 67l54 62c34-16 72-16 106 0l54-62c38 36 39 102 5 143 1 9 2 18 2 28 0 84-51 138-114 138S136 322 136 238c0-10 1-19 2-28z" fill="${fill("head")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("head")}/>
        <path d="M142 67l54 62c-22 9-41 24-55 43-12-36-11-73 1-105zM358 67l-54 62c22 9 41 24 55 43 12-36 11-73-1-105z" fill="${fill("ears")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        ${whiskers}${animalFace(226)}
        <path d="M166 305c34-32 134-32 168 0l31 106H135z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="370" rx="64" ry="45" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <path d="M354 338c66 0 74-70 24-78" fill="none" stroke="${fill("tail")}" stroke-width="26" stroke-linecap="round"${hiddenAttrs("tail")}/>
        ${star(250, 323, 31, 14, "accessory")}
      `,
      "candy-tiger": `
        <circle cx="250" cy="204" r="123" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M153 103l59 39-67 41zM347 103l-59 39 67 41z" fill="${fill("ears")}" stroke="${o}" stroke-width="9" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        <path d="M205 103l-20 62M250 82v76M295 103l20 62M154 217l58-16M346 217l-58-16" stroke="${fill("stripes")}" stroke-width="15" stroke-linecap="round"${hiddenAttrs("stripes")}/>
        ${animalFace(232)}
        <path d="M160 315c40-31 140-31 180 0l34 101H126z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="370" rx="70" ry="48" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <path d="M358 350c56 32 93-20 48-57" fill="none" stroke="${fill("tail")}" stroke-width="25" stroke-linecap="round"${hiddenAttrs("tail")}/>
      `,
      "moon-fox": `
        <path d="M132 213c10-70 56-121 118-121s108 51 118 121l-34 116c-29 34-139 34-168 0z" fill="${fill("head")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("head")}/>
        <path d="M151 92l76 50-88 69zM349 92l-76 50 88 69z" fill="${fill("ears")}" stroke="${o}" stroke-width="9" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        ${animalFace(229)}
        <path d="M203 233c32 32 62 32 94 0l31 67c-38 35-118 35-156 0z" fill="${fill("mark")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("mark")}/>
        <path d="M164 321c41-31 131-31 172 0l34 101H130z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <path d="M351 354c76-5 91-91 24-113-6 50-32 89-76 116" fill="${fill("tail")}" stroke="${o}" stroke-width="9" stroke-linejoin="round"${hiddenAttrs("tail")}/>
        <circle cx="190" cy="405" r="27" fill="${fill("paws")}" stroke="${o}" stroke-width="8"${hiddenAttrs("paws")}/><circle cx="310" cy="405" r="27" fill="${fill("paws")}" stroke="${o}" stroke-width="8"${hiddenAttrs("paws")}/>
      `,
      "cloud-bunny": `
        <path d="M178 51c-46 75-41 145 8 179l54-25c-3-71-20-122-62-154zM322 51c46 75 41 145-8 179l-54-25c3-71 20-122 62-154z" fill="${fill("ears")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        <circle cx="250" cy="214" r="108" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        ${animalFace(240)}
        <path d="M153 333c33-53 161-53 194 0l27 85H126z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="377" rx="73" ry="50" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <circle cx="182" cy="410" r="27" fill="${fill("paws")}" stroke="${o}" stroke-width="8"${hiddenAttrs("paws")}/><circle cx="318" cy="410" r="27" fill="${fill("paws")}" stroke="${o}" stroke-width="8"${hiddenAttrs("paws")}/>
        <path d="M220 318h60l-30 34z" fill="${fill("accessory")}" stroke="${o}" stroke-width="7" stroke-linejoin="round"${hiddenAttrs("accessory")}/>
      `,
      "berry-panda": `
        <circle cx="156" cy="126" r="48" fill="${fill("ears")}" stroke="${o}" stroke-width="9"${hiddenAttrs("ears")}/><circle cx="344" cy="126" r="48" fill="${fill("ears")}" stroke="${o}" stroke-width="9"${hiddenAttrs("ears")}/>
        <circle cx="250" cy="211" r="121" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        <ellipse cx="208" cy="184" rx="35" ry="48" fill="${fill("paws")}" stroke="${o}" stroke-width="8"${hiddenAttrs("paws")}/><ellipse cx="292" cy="184" rx="35" ry="48" fill="${fill("paws")}" stroke="${o}" stroke-width="8"${hiddenAttrs("paws")}/>
        ${animalFace(236)}
        <path d="M154 326c31-52 161-52 192 0l31 95H123z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="376" rx="77" ry="53" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <circle cx="250" cy="315" r="28" fill="${fill("accessory")}" stroke="${o}" stroke-width="8"${hiddenAttrs("accessory")}/>
      `,
      "bubble-seal": `
        <path d="M250 80c78 0 128 61 128 132 0 81-58 136-128 136s-128-55-128-136c0-71 50-132 128-132z" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        ${animalFace(236)}
        <path d="M154 321c35-43 157-43 192 0l43 91H111z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="371" rx="83" ry="50" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <path d="M118 366l-58 31 70 18M382 366l58 31-70 18" fill="${fill("paws")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("paws")}/>
        <path d="M227 310c16-26 30-26 46 0" fill="none" stroke="${fill("mark")}" stroke-width="16" stroke-linecap="round"${hiddenAttrs("mark")}/>
        <path d="M222 418l28-24 28 24" fill="${fill("tail")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("tail")}/>
      `,
      "cosmic-deer": `
        <path d="M178 83c-45-38-66-17-48 36M322 83c45-38 66-17 48 36M190 82l-20-49M310 82l20-49" fill="none" stroke="${fill("horns")}" stroke-width="16" stroke-linecap="round"${hiddenAttrs("horns")}/>
        <path d="M151 130l55 43-65 33zM349 130l-55 43 65 33z" fill="${fill("ears")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        <circle cx="250" cy="213" r="113" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        ${animalFace(239)}
        ${star(250, 128, 24, 11, "mark")}
        <path d="M154 326c34-48 158-48 192 0l35 92H119z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="376" rx="75" ry="50" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
      `,
      "pebble-penguin": `
        <circle cx="250" cy="179" r="88" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M139 319c0-92 50-144 111-144s111 52 111 144v79H139z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="310" rx="72" ry="98" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <path d="M143 288l-67 69 80 3M357 288l67 69-80 3" fill="${fill("wings")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("wings")}/>
        <ellipse cx="214" cy="166" rx="21" ry="26" fill="#fffaf1"/><ellipse cx="286" cy="166" rx="21" ry="26" fill="#fffaf1"/>
        <circle cx="217" cy="170" r="11" fill="${o}"/><circle cx="289" cy="170" r="11" fill="${o}"/>
        <path d="M250 189l-28 25h56z" fill="${fill("beak")}" stroke="${o}" stroke-width="7" stroke-linejoin="round"${hiddenAttrs("beak")}/>
        <path d="M189 421h54M257 421h54" stroke="${fill("paws")}" stroke-width="24" stroke-linecap="round"${hiddenAttrs("paws")}/>
      `,
      "noodle-pup": `
        <path d="M157 100c-60 40-56 112-4 138l48-83zM343 100c60 40 56 112 4 138l-48-83z" fill="${fill("ears")}" stroke="${o}" stroke-width="9" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        <circle cx="250" cy="207" r="113" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        ${animalFace(239)}
        <ellipse cx="250" cy="225" rx="35" ry="27" fill="${fill("belly")}" stroke="${o}" stroke-width="7"${hiddenAttrs("belly")}/>
        <path d="M156 324c36-47 152-47 188 0l36 93H120z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <path d="M350 348c67 11 78-55 29-75" fill="none" stroke="${fill("tail")}" stroke-width="24" stroke-linecap="round"${hiddenAttrs("tail")}/>
        <path d="M202 313h96" stroke="${fill("accessory")}" stroke-width="22" stroke-linecap="round"${hiddenAttrs("accessory")}/>
      `,
      "tiny-dragon": `
        <path d="M154 120l51 38-62 43zM346 120l-51 38 62 43z" fill="${fill("ears")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("ears")}/>
        <circle cx="250" cy="213" r="112" fill="${fill("head")}" stroke="${o}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M213 93l37-52 37 52" fill="${fill("tail")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("tail")}/>
        ${animalFace(238)}
        <path d="M154 326c36-49 156-49 192 0l34 92H120z" fill="${fill("body")}" stroke="${o}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <ellipse cx="250" cy="376" rx="74" ry="50" fill="${fill("belly")}" stroke="${o}" stroke-width="8"${hiddenAttrs("belly")}/>
        <path d="M142 333l-79-65 90-12M358 333l79-65-90-12" fill="${fill("wings")}" stroke="${o}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("wings")}/>
      `
    };

    return templates[round.characterType] || "";
  }

  function renderCharacter(round, options = {}) {
    const hiddenPart = options.hiddenPart || null;
    const overrideColor = options.overrideColor || null;
    const fill = (part) => colorFor(round, part, hiddenPart, overrideColor);
    const hiddenAttrs = (part) => part === hiddenPart ? ' stroke-dasharray="13 10" opacity="0.86"' : "";
    const base = `
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#5a2f1d" flood-opacity=".18"></feDropShadow>
        </filter>
        <pattern id="hiddenChecks" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#f7efe5"></rect>
          <rect x="12" y="12" width="12" height="12" fill="#f7efe5"></rect>
          <rect x="12" width="12" height="12" fill="#a99c92"></rect>
          <rect y="12" width="12" height="12" fill="#a99c92"></rect>
        </pattern>
      </defs>
      <ellipse cx="250" cy="456" rx="132" ry="26" fill="#513022" opacity=".13"></ellipse>
    `;
    const animalMarkup = animalCharacterMarkup(round, fill, hiddenAttrs);
    if (animalMarkup) {
      return `<svg viewBox="0 0 500 500" aria-label="${round.characterName}" role="img">${base}<g filter="url(#softShadow)">${animalMarkup}</g></svg>`;
    }
    const templates = {
      "round-robot": `
        <rect x="147" y="226" width="206" height="177" rx="55" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <circle cx="250" cy="156" r="102" fill="${fill("head")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M158 91c45-54 141-54 184 0v72H158z" fill="${fill("helmet")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("helmet")}/>
        <circle cx="213" cy="159" r="14" fill="${outline()}"/><circle cx="287" cy="159" r="14" fill="${outline()}"/>
        <path d="M219 204c22 18 43 18 64 0" fill="none" stroke="${outline()}" stroke-width="9" stroke-linecap="round"/>
        <circle cx="250" cy="292" r="30" fill="${fill("accessory")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("accessory")}/>
        <rect x="168" y="390" width="58" height="43" rx="16" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
        <rect x="274" y="390" width="58" height="43" rx="16" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
      `,
      "star-explorer": `
        <path d="M250 55l36 74 82 12-59 58 14 82-73-38-73 38 14-82-59-58 82-12z" fill="${fill("helmet")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("helmet")}/>
        <circle cx="250" cy="174" r="86" fill="${fill("head")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("head")}/>
        <rect x="166" y="243" width="168" height="162" rx="32" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <path d="M202 302l48-38 48 38-18 58h-60z" fill="${fill("badge")}" stroke="${outline()}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("badge")}/>
        <circle cx="217" cy="171" r="12" fill="${outline()}"/><circle cx="284" cy="171" r="12" fill="${outline()}"/>
        <path d="M151 288l-40 31M349 288l40 31" fill="none" stroke="${fill("gloves")}" stroke-width="20" stroke-linecap="round"${hiddenAttrs("gloves")}/>
      `,
      "cloud-hair-kid": `
        <rect x="163" y="250" width="174" height="152" rx="42" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <circle cx="250" cy="171" r="82" fill="${fill("head")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M154 138c-22-53 42-88 75-50 28-62 118-37 112 31 54 9 50 76 3 87H169c-48-7-58-59-15-68z" fill="${fill("hair")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("hair")}/>
        <path d="M160 281h180l-90 54z" fill="${fill("accessory")}" stroke="${outline()}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("accessory")}/>
        <circle cx="220" cy="176" r="11" fill="${outline()}"/><circle cx="285" cy="176" r="11" fill="${outline()}"/>
        <rect x="173" y="396" width="60" height="38" rx="14" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
        <rect x="267" y="396" width="60" height="38" rx="14" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
      `,
      "space-helmet-scout": `
        <circle cx="250" cy="168" r="112" fill="${fill("helmet")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("helmet")}/>
        <circle cx="250" cy="178" r="77" fill="${fill("head")}" stroke="${outline()}" stroke-width="9"${hiddenAttrs("head")}/>
        <rect x="154" y="260" width="192" height="146" rx="28" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <rect x="215" y="293" width="70" height="46" rx="14" fill="${fill("badge")}" stroke="${outline()}" stroke-width="7"${hiddenAttrs("badge")}/>
        <circle cx="223" cy="177" r="10" fill="${outline()}"/><circle cx="277" cy="177" r="10" fill="${outline()}"/>
        <rect x="166" y="399" width="62" height="36" rx="12" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
        <rect x="272" y="399" width="62" height="36" rx="12" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
      `,
      "tiny-monster": `
        <path d="M151 163c0-71 46-113 99-113s99 42 99 113v96c0 68-44 114-99 114s-99-46-99-114z" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <circle cx="250" cy="149" r="72" fill="${fill("head")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M175 91l28-52 23 62M274 101l24-62 31 53" fill="${fill("hair")}" stroke="${outline()}" stroke-width="9" stroke-linejoin="round"${hiddenAttrs("hair")}/>
        <circle cx="250" cy="147" r="19" fill="${outline()}"/><circle cx="250" cy="147" r="8" fill="#fff"/>
        <path d="M219 201c18 18 46 18 64 0" fill="none" stroke="${outline()}" stroke-width="9" stroke-linecap="round"/>
        <path d="M250 275l31 54h-62z" fill="${fill("mark")}" stroke="${outline()}" stroke-width="8" stroke-linejoin="round"${hiddenAttrs("mark")}/>
        <path d="M150 265l-46 32M350 265l46 32" fill="none" stroke="${fill("gloves")}" stroke-width="20" stroke-linecap="round"${hiddenAttrs("gloves")}/>
      `,
      "retro-toy-runner": `
        <rect x="163" y="238" width="174" height="158" rx="26" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <circle cx="250" cy="157" r="82" fill="${fill("head")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("head")}/>
        <rect x="173" y="77" width="154" height="64" rx="22" fill="${fill("helmet")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("helmet")}/>
        <path d="M166 278l168 0" stroke="${fill("accessory")}" stroke-width="26" stroke-linecap="round"${hiddenAttrs("accessory")}/>
        <circle cx="221" cy="156" r="10" fill="${outline()}"/><circle cx="279" cy="156" r="10" fill="${outline()}"/>
        <path d="M173 395l-28 39M327 395l28 39" stroke="${fill("shoes")}" stroke-width="24" stroke-linecap="round"${hiddenAttrs("shoes")}/>
      `,
      "magic-apprentice": `
        <path d="M250 43l90 145H160z" fill="${fill("hair")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("hair")}/>
        <circle cx="250" cy="180" r="77" fill="${fill("head")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("head")}/>
        <path d="M156 269c42-45 147-45 188 0l-36 140H192z" fill="${fill("body")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <path d="M182 300h136" stroke="${fill("accessory")}" stroke-width="24" stroke-linecap="round"${hiddenAttrs("accessory")}/>
        <path d="M250 318l18 31 35 8-25 25 4 35-32-15-32 15 4-35-25-25 35-8z" fill="${fill("mark")}" stroke="${outline()}" stroke-width="7" stroke-linejoin="round"${hiddenAttrs("mark")}/>
        <circle cx="224" cy="180" r="10" fill="${outline()}"/><circle cx="278" cy="180" r="10" fill="${outline()}"/>
      `,
      "snack-mascot": `
        <rect x="151" y="97" width="198" height="306" rx="70" fill="${fill("body")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("body")}/>
        <circle cx="250" cy="153" r="73" fill="${fill("head")}" stroke="${outline()}" stroke-width="9"${hiddenAttrs("head")}/>
        <path d="M183 94c32-50 102-50 134 0-22 15-45 23-67 23s-45-8-67-23z" fill="${fill("hair")}" stroke="${outline()}" stroke-width="9"${hiddenAttrs("hair")}/>
        <rect x="205" y="262" width="90" height="50" rx="16" fill="${fill("badge")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("badge")}/>
        <circle cx="224" cy="153" r="10" fill="${outline()}"/><circle cx="276" cy="153" r="10" fill="${outline()}"/>
        <rect x="171" y="399" width="62" height="37" rx="12" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
        <rect x="267" y="399" width="62" height="37" rx="12" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
      `,
      "pixel-hero": `
        <path d="M162 87h176v58h36v98h-36v72h-52v88h-72v-88h-52v-72h-36v-98h36z" fill="${fill("body")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <rect x="178" y="80" width="144" height="122" rx="18" fill="${fill("helmet")}" stroke="${outline()}" stroke-width="10"${hiddenAttrs("helmet")}/>
        <rect x="204" y="123" width="92" height="62" rx="12" fill="${fill("head")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("head")}/>
        <rect x="116" y="247" width="54" height="48" rx="12" fill="${fill("gloves")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("gloves")}/>
        <rect x="330" y="247" width="54" height="48" rx="12" fill="${fill("gloves")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("gloves")}/>
        <rect x="176" y="398" width="62" height="38" rx="10" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
        <rect x="262" y="398" width="62" height="38" rx="10" fill="${fill("shoes")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("shoes")}/>
      `,
      "raindrop-buddy": `
        <path d="M250 55c74 83 113 145 113 214 0 77-51 137-113 137s-113-60-113-137c0-69 39-131 113-214z" fill="${fill("body")}" stroke="${outline()}" stroke-width="10" stroke-linejoin="round"${hiddenAttrs("body")}/>
        <circle cx="250" cy="180" r="73" fill="${fill("head")}" stroke="${outline()}" stroke-width="9"${hiddenAttrs("head")}/>
        <path d="M201 104c33-45 70-45 99 0-31 17-64 18-99 0z" fill="${fill("hair")}" stroke="${outline()}" stroke-width="9"${hiddenAttrs("hair")}/>
        <path d="M176 274h148" stroke="${fill("accessory")}" stroke-width="24" stroke-linecap="round"${hiddenAttrs("accessory")}/>
        <circle cx="224" cy="181" r="10" fill="${outline()}"/><circle cx="276" cy="181" r="10" fill="${outline()}"/>
        <path d="M250 321c20 20 42 20 61 0-9 42-111 42-122 0 19 20 41 20 61 0z" fill="${fill("mark")}" stroke="${outline()}" stroke-width="8"${hiddenAttrs("mark")}/>
      `
    };
    return `<svg viewBox="0 0 500 500" aria-label="${round.characterName}" role="img">${base}<g filter="url(#softShadow)">${templates[round.characterType]}${faceOverlay(round.characterType)}</g></svg>`;
  }

  function setMode(mode) {
    state.mode = mode;
    const round = state.rounds[state.current];
    const levelNumber = state.levelBase + Math.min(state.current + 1, state.rounds.length);
    const visibleMax = Math.max(500, (state.results.length || 5) * 100);
    els.roundPill.textContent = `Round ${levelNumber}`;
    els.score.textContent = `${state.total} / ${visibleMax}`;
    els.results.hidden = mode !== "result" && mode !== "summary";
    els.startBtn.hidden = mode !== "intro" && mode !== "summary";
    els.lockBtn.disabled = mode !== "guess";
    els.nextBtn.disabled = mode !== "result";
    els.copyBtn.hidden = mode !== "summary";

    if (mode === "intro") {
      els.timer.textContent = "Daily";
      els.controlTitle.textContent = "Daily Challenge";
      els.controlCopy.textContent = "Five original cartoon-style animals are ready. Clear the daily set, then continue into harder new rounds.";
      els.status.textContent = "Press Start to play today's fixed 5-round challenge.";
      els.character.innerHTML = renderCharacter(round);
    }

    if (mode === "memorize") {
      const seconds = round.memorySeconds || memorySecondsForLevel(levelNumber);
      els.controlTitle.textContent = "Memorize";
      els.controlCopy.textContent = `Study ${round.characterName}. You have ${seconds} seconds before one color is hidden.`;
      els.status.textContent = `Look closely at every color. Difficulty: ${seconds}s memory time.`;
      els.character.innerHTML = renderCharacter(round);
      startTimer();
    }

    if (mode === "guess") {
      const part = PART_LABELS[round.targetPart] || round.targetPart;
      els.timer.textContent = "Guess";
      els.controlTitle.textContent = "Match Color";
      els.controlCopy.textContent = `Match the hidden ${part} color from memory.`;
      els.status.textContent = `Match the hidden ${part} color from memory.`;
      els.character.innerHTML = renderCharacter(round, { hiddenPart: round.targetPart });
    }

    if (mode === "summary") {
      const completed = state.results.length;
      const maxScore = completed * 100;
      const lastSetStart = state.levelBase + 1;
      const lastSetEnd = state.levelBase + state.rounds.length;
      els.timer.textContent = "Done";
      els.controlTitle.textContent = state.setIndex === 0 ? "Daily Result" : "Challenge Result";
      els.controlCopy.textContent = `You scored ${state.total}/${maxScore}. Rounds ${lastSetStart}-${lastSetEnd} are complete.`;
      els.status.textContent = state.setIndex === 0
        ? "Daily set complete. Continue for new animals, new colors, and shorter memory timers."
        : "Set complete. Continue to make the next 5 rounds harder.";
      els.character.innerHTML = renderCharacter(state.rounds[4]);
      if (state.setIndex === 0) {
        saveDailyResult();
      } else {
        renderBest();
      }
      renderSummary();
      els.startBtn.textContent = "Continue";
    } else {
      els.startBtn.textContent = "Start";
    }
  }

  function startTimer() {
    clearInterval(state.timerId);
    const round = state.rounds[state.current];
    state.timeLeft = round.memorySeconds || memorySecondsForLevel(state.levelBase + state.current + 1);
    els.timer.textContent = `${state.timeLeft}s`;
    state.timerId = setInterval(() => {
      state.timeLeft -= 1;
      els.timer.textContent = `${state.timeLeft}s`;
      if (state.timeLeft <= 0) {
        clearInterval(state.timerId);
        randomizeGuess();
        setMode("guess");
      }
    }, 1000);
  }

  function randomizeGuess() {
    const rand = seededRandom(`${dateString}-guess-${state.current}-${Date.now()}`);
    state.guess = { h: Math.floor(rand() * 360), s: 55, v: 72 };
    syncSliders();
  }

  function syncSliders() {
    els.hue.value = state.guess.h;
    els.sat.value = state.guess.s;
    els.bright.value = state.guess.v;
    updatePreview();
  }

  function updatePreview() {
    state.guess = {
      h: Number(els.hue.value),
      s: Number(els.sat.value),
      v: Number(els.bright.value)
    };
    const hueFull = hsvToCss({ h: state.guess.h, s: 100, v: 95 });
    const satFull = hsvToCss({ h: state.guess.h, s: 100, v: state.guess.v });
    const satZero = hsvToCss({ h: state.guess.h, s: 0, v: state.guess.v });
    const brightFull = hsvToCss({ h: state.guess.h, s: state.guess.s, v: 100 });
    els.hue.style.setProperty("--track", "linear-gradient(90deg, #ff1b12 0%, #ff9f00 15%, #fff400 28%, #40ff00 42%, #00ffd5 56%, #0062ff 70%, #7b00ff 84%, #ff006f 100%)");
    els.sat.style.setProperty("--track", `linear-gradient(90deg, ${satZero}, ${satFull})`);
    els.bright.style.setProperty("--track", `linear-gradient(90deg, #020711, ${brightFull})`);
    els.hueValue.textContent = `${state.guess.h} deg`;
    els.satValue.textContent = `${state.guess.s}%`;
    els.brightValue.textContent = `${state.guess.v}%`;
    els.preview.style.background = hsvToCss(state.guess);
    els.previewValues.textContent = `H ${state.guess.h} · S ${state.guess.s}% · B ${state.guess.v}%`;
  }

  function lockColor() {
    if (state.mode !== "guess") return;
    const round = state.rounds[state.current];
    const target = round.colors[round.targetPart];
    const result = scoreGuess(target, state.guess);
    const diagnosis = diagnose(target, state.guess, result.delta);
    const entry = {
      round: state.levelBase + state.current + 1,
      characterName: round.characterName,
      part: PART_LABELS[round.targetPart] || round.targetPart,
      target,
      guess: { ...state.guess },
      delta: result.delta,
      score: result.score,
      diagnosis
    };
    state.results.push(entry);
    state.total += result.score;
    els.actualSwatch.style.background = hsvToCss(target);
    els.guessSwatch.style.background = hsvToCss(state.guess);
    els.resultText.textContent = `Delta E ${result.delta.toFixed(1)} · ${result.score}/100 · ${diagnosis}`;
    els.character.innerHTML = renderCharacter(round, { hiddenPart: round.targetPart, overrideColor: target });
    els.score.textContent = `${state.total} / ${Math.max(500, state.results.length * 100)}`;
    setMode("result");
  }

  function nextRound() {
    if (state.mode !== "result") return;
    state.current += 1;
    if (state.current >= 5) {
      setMode("summary");
    } else {
      setMode("memorize");
    }
  }

  function startGame() {
    clearInterval(state.timerId);
    if (state.mode === "summary") {
      continueChallenge();
      return;
    }
    state.rounds = generateChallengeSet(dateString, 0);
    state.current = 0;
    state.setIndex = 0;
    state.levelBase = 0;
    state.total = 0;
    state.results = [];
    els.summaryList.innerHTML = "";
    setMode("memorize");
  }

  function continueChallenge() {
    state.setIndex += 1;
    state.levelBase = state.setIndex * 5;
    state.rounds = generateChallengeSet(dateString, state.setIndex);
    state.current = 0;
    els.summaryList.innerHTML = "";
    setMode("memorize");
  }

  function getStoredDaily() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch (error) {
      return null;
    }
  }

  function saveDailyResult() {
    const previous = getStoredDaily();
    const attempts = previous ? previous.attempts + 1 : 1;
    const bestScore = Math.max(previous ? previous.bestScore : 0, state.total);
    const payload = {
      bestScore,
      attempts,
      lastResult: {
        score: state.total,
        rounds: state.results,
        playedAt: new Date().toISOString()
      }
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (error) {
      // Local best score is optional; gameplay should continue if storage is blocked.
    }
    renderBest();
  }

  function renderBest() {
    const stored = getStoredDaily();
    if (!stored) {
      els.bestBox.textContent = "Local daily best: no score yet. Finish today's challenge to save your best result on this device.";
      return;
    }
    els.bestBox.textContent = `Local daily best: ${stored.bestScore}/500 across ${stored.attempts} attempt${stored.attempts === 1 ? "" : "s"} today.`;
  }

  function renderSummary() {
    const recentResults = state.results.slice(-5);
    els.summaryList.innerHTML = recentResults.map((item) => `
      <li>
        Round ${item.round}: ${item.characterName} ${item.part} · ${item.score}/100 · Delta E ${item.delta.toFixed(1)} · ${item.diagnosis}
      </li>
    `).join("");
  }

  function shareText() {
    const maxScore = Math.max(500, state.results.length * 100);
    return `Toon Tone Game ${state.total}/${maxScore}
I matched hidden toon colors from memory on Bitesize Arcade.
Play: https://bitesizearcade.com/toon-tone-game/`;
  }

  async function copyResult() {
    const text = shareText();
    try {
      await navigator.clipboard.writeText(text);
      els.status.textContent = "Result copied to clipboard.";
    } catch (error) {
      els.shareText.value = text;
      els.shareFallback.hidden = false;
      els.shareFallback.setAttribute("aria-hidden", "false");
    }
  }

  function showBattleComingSoon() {
    els.status.textContent = "Battle Mode - Coming Soon. Daily Challenge is ready now, with local best scores on this device.";
  }

  [els.hue, els.sat, els.bright].forEach((input) => {
    input.addEventListener("input", updatePreview);
  });
  els.startBtn.addEventListener("click", startGame);
  els.lockBtn.addEventListener("click", lockColor);
  els.nextBtn.addEventListener("click", nextRound);
  els.copyBtn.addEventListener("click", copyResult);
  els.battleBtn.addEventListener("click", showBattleComingSoon);
  els.shareClose.addEventListener("click", () => {
    els.shareFallback.hidden = true;
    els.shareFallback.setAttribute("aria-hidden", "true");
  });

  syncSliders();
  renderBest();
  setMode("intro");
}());
