const appShell = document.getElementById("app-shell");
const canvasFrame = document.getElementById("canvas-frame");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-btn");
const retryButton = document.getElementById("retry-btn");
const reviveButton = document.getElementById("revive-btn");
const shareButton = document.getElementById("share-btn");
const pauseButton = document.getElementById("pause-btn");
const quitButton = document.getElementById("quit-btn");
const audioButton = document.getElementById("audio-btn");
const menuButton = document.getElementById("menu-btn");
const menuAudioButton = document.getElementById("menu-audio-btn");
const citySelect = document.getElementById("province-select");
const leaderboardElement = document.getElementById("leaderboard");
const statusLine = document.getElementById("status-line");
const heroCopy = document.getElementById("hero-copy");
const controlCard = document.getElementById("control-card");
const heroCityPill = document.getElementById("hero-city-pill");
const heroScenePill = document.getElementById("hero-scene-pill");
const heroMarketLine = document.getElementById("hero-market-line");
const heroTagline = document.getElementById("hero-tagline");
const heroIngredientStrip = document.getElementById("hero-ingredient-strip");
const cityPreviewTitle = document.getElementById("city-preview-title");
const cityPreviewSubtitle = document.getElementById("city-preview-subtitle");
const cityPreviewScene = document.getElementById("city-preview-scene");
const cityPreviewItems = document.getElementById("city-preview-items");
const audioStatePill = document.getElementById("audio-state-pill");
const audioDiagnostics = document.getElementById("audio-diagnostics");
const bgmSlider = document.getElementById("bgm-slider");
const ambienceSlider = document.getElementById("ambience-slider");
const sfxSlider = document.getElementById("sfx-slider");
const bgmValue = document.getElementById("bgm-value");
const ambienceValue = document.getElementById("ambience-value");
const sfxValue = document.getElementById("sfx-value");
const bgmToggle = document.getElementById("bgm-toggle");
const ambienceToggle = document.getElementById("ambience-toggle");
const sfxToggle = document.getElementById("sfx-toggle");
const presetGrooveButton = document.getElementById("preset-groove");
const presetMarketButton = document.getElementById("preset-market");
const audioPresetHint = document.getElementById("audio-preset-hint");
const floatingAudioPanel = document.getElementById("floating-audio-panel");
const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const loadingProgress = document.getElementById("loading-progress");
const healthDialog = document.getElementById("health-dialog");
const healthConfirmButton = document.getElementById("health-confirm-btn");
const healthCancelButton = document.getElementById("health-cancel-btn");
const shareFallbackDialog = document.getElementById("share-fallback-dialog");
const shareFallbackText = document.getElementById("share-fallback-text");
const shareFallbackClose = document.getElementById("share-fallback-close");

const DESIGN_WIDTH = 900;
const DESIGN_HEIGHT = 1380;

const BASE_ITEM_TYPES = [
  { id: "sausage", art: "sausage" },
  { id: "ricecake", art: "ricecake" },
  { id: "squid", art: "squid" },
  { id: "tofu", art: "tofu" },
  { id: "wing", art: "wing" },
  { id: "corn", art: "corn" },
  { id: "chili", art: "chili" },
  { id: "potato", art: "potato" },
  { id: "shrimp", art: "shrimp" },
  { id: "pancake", art: "pancake" },
  { id: "cola", art: "drink" },
  { id: "icejelly", art: "dessert" },
];

const CITY_THEMES = [
  {
    "city": "New York",
    "market": "Food Truck Night",
    "scene": "neon",
    "sound": "street",
    "accent": "#c95f34",
    "skyTop": "#ffe4c7",
    "skyBottom": "#e7aa73",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Hot Dog",
        "short": "Dog",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Pretzel",
        "short": "Pret",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Calamari",
        "short": "Cal",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Falafel",
        "short": "Fal",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Street Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Nachos",
        "short": "Nach",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Fries",
        "short": "Fries",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Roll",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Pizza Slice",
        "short": "Pizza",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Cola Float",
        "short": "Cola",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Donut",
        "short": "Donut",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Los Angeles",
    "market": "Beach Bites",
    "scene": "harbor",
    "sound": "harbor",
    "accent": "#cc683d",
    "skyTop": "#ffe7c7",
    "skyBottom": "#edb884",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Fish Taco",
        "short": "Taco",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Churros",
        "short": "Chur",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Crispy Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Avocado Bowl",
        "short": "Avo",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "BBQ Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Elote",
        "short": "Elote",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Hot Salsa",
        "short": "Salsa",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Loaded Fries",
        "short": "Fries",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Taco",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Mini Burger",
        "short": "Burger",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Iced Lemonade",
        "short": "Lemon",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Ice Cream",
        "short": "Cream",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Tokyo",
    "market": "Yokocho Alley",
    "scene": "lanterns",
    "sound": "metro",
    "accent": "#b84c2a",
    "skyTop": "#ffe3bf",
    "skyBottom": "#ef9f62",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Yakitori",
        "short": "Yaki",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Mochi",
        "short": "Mochi",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Grilled Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Tofu Bites",
        "short": "Tofu",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Karaage",
        "short": "Kara",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Butter Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Spicy Gyoza",
        "short": "Gyoza",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Croquette",
        "short": "Croq",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Ebi Fry",
        "short": "Ebi",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Okonomiyaki",
        "short": "Okono",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Melon Soda",
        "short": "Soda",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Taiyaki",
        "short": "Tai",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Seoul",
    "market": "Market Lane",
    "scene": "neon",
    "sound": "metro",
    "accent": "#d44f2d",
    "skyTop": "#ffe0be",
    "skyBottom": "#ee9959",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Tteok Skewer",
        "short": "Skew",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Hotteok",
        "short": "Hot",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Ojingeo",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Tofu Cup",
        "short": "Tofu",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "K-Fried Chicken",
        "short": "KFC",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Corn Dog",
        "short": "Dog",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Tteokbokki",
        "short": "Tteok",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Twist Potato",
        "short": "Twist",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Mandu",
        "short": "Mandu",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Kimchi Pancake",
        "short": "Panc",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Milk Tea",
        "short": "Tea",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Bingsu Cup",
        "short": "Bing",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Bangkok",
    "market": "Street Stall",
    "scene": "arcade",
    "sound": "street",
    "accent": "#c85631",
    "skyTop": "#ffe2c2",
    "skyBottom": "#e8ab6a",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Satay",
        "short": "Satay",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Mango Rice",
        "short": "Mango",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Chili Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Tofu Satay",
        "short": "Tofu",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Thai Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Coconut Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Papaya Salad",
        "short": "Salad",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Roti Chips",
        "short": "Roti",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Cake",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Banana Roti",
        "short": "Roti",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Thai Tea",
        "short": "Tea",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Coconut Ice",
        "short": "Coco",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Singapore",
    "market": "Hawker Center",
    "scene": "arcade",
    "sound": "harbor",
    "accent": "#c76739",
    "skyTop": "#ffe6c6",
    "skyBottom": "#efb47d",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Satay Sticks",
        "short": "Satay",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Kaya Toast",
        "short": "Kaya",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Sambal Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Tofu Puff",
        "short": "Tofu",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Soy Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Sweet Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Chili Crab",
        "short": "Crab",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Curry Puff",
        "short": "Curry",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Prawn Roll",
        "short": "Prawn",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Roti Prata",
        "short": "Prata",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Kopi Ice",
        "short": "Kopi",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Ice Kacang",
        "short": "Ice",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "London",
    "market": "Late Market",
    "scene": "alley",
    "sound": "northern",
    "accent": "#a85d3a",
    "skyTop": "#eef6ff",
    "skyBottom": "#abc2de",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Sausage Roll",
        "short": "Roll",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Scone",
        "short": "Scone",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Fish Bites",
        "short": "Fish",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Veggie Pie",
        "short": "Pie",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Roast Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Buttered Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Curry Chips",
        "short": "Curry",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Chips",
        "short": "Chips",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Prawn Cup",
        "short": "Prawn",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Mini Pie",
        "short": "Pie",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Ginger Ale",
        "short": "Ale",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Custard Tart",
        "short": "Tart",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Paris",
    "market": "Midnight Cafe",
    "scene": "courtyard",
    "sound": "street",
    "accent": "#aa693d",
    "skyTop": "#eef7df",
    "skyBottom": "#b7cf8b",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Bistro Skewer",
        "short": "Skew",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Macaron",
        "short": "Mac",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Sea Bites",
        "short": "Sea",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Cheese Toast",
        "short": "Toast",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Herb Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Corn Cup",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Spicy Crepe",
        "short": "Crepe",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Pommes Frites",
        "short": "Frites",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Garlic Shrimp",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Crepe",
        "short": "Crepe",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Cafe Frappe",
        "short": "Cafe",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Gelato",
        "short": "Gel",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Mexico City",
    "market": "Taco Night",
    "scene": "lanterns",
    "sound": "spicy",
    "accent": "#c44a2d",
    "skyTop": "#ffe0c3",
    "skyBottom": "#e47d53",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Al Pastor",
        "short": "Pastor",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Churros",
        "short": "Chur",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Lime Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Bean Tostada",
        "short": "Bean",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Adobo Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Elote",
        "short": "Elote",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Salsa Nachos",
        "short": "Nach",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Papitas",
        "short": "Papa",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Taco",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Quesadilla",
        "short": "Ques",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Agua Fresca",
        "short": "Agua",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Paleta",
        "short": "Pal",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Istanbul",
    "market": "Bazaar Snacks",
    "scene": "courtyard",
    "sound": "northern",
    "accent": "#c46c38",
    "skyTop": "#ffe7c6",
    "skyBottom": "#dca068",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Kebab",
        "short": "Kebab",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Baklava",
        "short": "Bak",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Sea Skewer",
        "short": "Sea",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Meze Cup",
        "short": "Meze",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Spice Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Roasted Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Hot Ezme",
        "short": "Ezme",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Spice Fries",
        "short": "Fries",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Prawn Wrap",
        "short": "Prawn",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Lahmacun",
        "short": "Lahm",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Ayran",
        "short": "Ayran",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Lokum",
        "short": "Lokum",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Barcelona",
    "market": "Tapas Street",
    "scene": "river",
    "sound": "street",
    "accent": "#b9613f",
    "skyTop": "#ffe7d3",
    "skyBottom": "#d59b76",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Chorizo Bite",
        "short": "Chor",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Churros",
        "short": "Chur",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Fried Calamari",
        "short": "Cal",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Olive Toast",
        "short": "Olive",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Paprika Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Corn Tapas",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Patatas Bravas",
        "short": "Brav",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Bravas",
        "short": "Brav",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Garlic Prawn",
        "short": "Prawn",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Tortilla Bite",
        "short": "Tort",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Sangria Soda",
        "short": "Soda",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Crema Cup",
        "short": "Crema",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Sydney",
    "market": "Harbor Bites",
    "scene": "harbor",
    "sound": "harbor",
    "accent": "#c26e42",
    "skyTop": "#e5f4ff",
    "skyBottom": "#86bad9",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Sausage Sizzle",
        "short": "Sizzle",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Lamington",
        "short": "Lam",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Salt Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Veggie Roll",
        "short": "Veg",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "BBQ Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Beach Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Chili Chips",
        "short": "Chili",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Wedges",
        "short": "Wedg",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Prawn Skewer",
        "short": "Prawn",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Meat Pie",
        "short": "Pie",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Lime Soda",
        "short": "Soda",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Pavlova Cup",
        "short": "Pav",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Toronto",
    "market": "Global Eats",
    "scene": "neon",
    "sound": "metro",
    "accent": "#cf6a42",
    "skyTop": "#ffe7cb",
    "skyBottom": "#efbb87",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Street Dog",
        "short": "Dog",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Maple Donut",
        "short": "Maple",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Crispy Fish",
        "short": "Fish",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Veggie Poutine",
        "short": "Veg",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Buffalo Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Corn Cup",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Chili Bowl",
        "short": "Chili",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Poutine",
        "short": "Pout",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Box",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Mini Pancake",
        "short": "Panc",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Root Beer",
        "short": "Root",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Butter Tart",
        "short": "Tart",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Dubai",
    "market": "Night Bazaar",
    "scene": "courtyard",
    "sound": "northern",
    "accent": "#b6673d",
    "skyTop": "#e8f3ff",
    "skyBottom": "#9fc0d5",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Shawarma",
        "short": "Shaw",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Date Cake",
        "short": "Date",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Grilled Squid",
        "short": "Squid",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Hummus Bite",
        "short": "Hum",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Zaatar Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Spice Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Harissa Wrap",
        "short": "Wrap",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Falafel Fries",
        "short": "Fries",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Prawn Kebab",
        "short": "Prawn",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Manakish",
        "short": "Mana",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Mint Cooler",
        "short": "Mint",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Rose Gelato",
        "short": "Rose",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Sao Paulo",
    "market": "Grill Street",
    "scene": "arcade",
    "sound": "street",
    "accent": "#aa5f40",
    "skyTop": "#edf8e7",
    "skyBottom": "#99c79a",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Churrasco",
        "short": "Chur",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Brigadeiro",
        "short": "Brig",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Sea Skewer",
        "short": "Sea",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Cheese Bread",
        "short": "Pao",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Grill Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Corn Cake",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Hot Pastel",
        "short": "Past",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Cassava Fries",
        "short": "Cass",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Pastel",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Pastel",
        "short": "Past",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Guarana",
        "short": "Guar",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Acai Cup",
        "short": "Acai",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  },
  {
    "city": "Berlin",
    "market": "Food Hall",
    "scene": "alley",
    "sound": "northern",
    "accent": "#c86a45",
    "skyTop": "#e6f7ff",
    "skyBottom": "#8cc8d8",
    "soupInner": "#ffdc90",
    "soupMid": "#f0a255",
    "soupOuter": "#b35931",
    "glow": "rgba(255, 231, 170, 0.13)",
    "items": {
      "sausage": {
        "label": "Currywurst",
        "short": "Wurst",
        "fill": "#c96344",
        "accent": "#65281a"
      },
      "ricecake": {
        "label": "Apple Strudel",
        "short": "Strud",
        "fill": "#f2c785",
        "accent": "#6d4421"
      },
      "squid": {
        "label": "Fish Roll",
        "short": "Fish",
        "fill": "#f3a7a5",
        "accent": "#7e373d"
      },
      "tofu": {
        "label": "Veggie Kebab",
        "short": "Veg",
        "fill": "#f6ead2",
        "accent": "#7b6639"
      },
      "wing": {
        "label": "Smoked Wings",
        "short": "Wing",
        "fill": "#d39b58",
        "accent": "#6f3d1e"
      },
      "corn": {
        "label": "Market Corn",
        "short": "Corn",
        "fill": "#f4be42",
        "accent": "#895f06"
      },
      "chili": {
        "label": "Spicy Wurst",
        "short": "Spicy",
        "fill": "#c24c46",
        "accent": "#651716"
      },
      "potato": {
        "label": "Kartoffel",
        "short": "Kart",
        "fill": "#d7bf72",
        "accent": "#705b1f"
      },
      "shrimp": {
        "label": "Shrimp Roll",
        "short": "Shr",
        "fill": "#ffb39f",
        "accent": "#8c4639"
      },
      "pancake": {
        "label": "Pretzel Bun",
        "short": "Pret",
        "fill": "#f4c472",
        "accent": "#7c5011"
      },
      "cola": {
        "label": "Club Mate",
        "short": "Mate",
        "fill": "#71564f",
        "accent": "#f7dcc0"
      },
      "icejelly": {
        "label": "Cherry Cake",
        "short": "Cake",
        "fill": "#8dc7d7",
        "accent": "#2b4e5c"
      }
    }
  }
];

const CITY_THEME_MAP = Object.fromEntries(CITY_THEMES.map((theme) => [theme.city, theme]));
const CITIES = CITY_THEMES.map((theme) => theme.city);

const STORAGE_KEYS = {
  city: "midnight-bites-city",
  scores: "midnight-bites-best-scores",
  audioMix: "midnight-bites-audio-mix",
};

const AUDIO_DEFAULTS = {
  music: 0.34,
  ambience: 0.42,
  sfx: 0.82,
  preset: "groove",
  musicMuted: false,
  ambienceMuted: false,
  sfxMuted: false,
};

const AUDIO_PRESETS = {
  groove: {
    label: "Light Groove",
    hint: "Music stays bright while ambience keeps a light arcade rhythm.",
    recommendedLevels: {
      music: 0.34,
      ambience: 0.42,
      sfx: 0.82,
    },
    gainTargets: {
      ambienceActive: 0.17,
      ambienceIdle: 0.08,
      musicActive: 0.22,
      musicIdle: 0.12,
      musicResult: 0.14,
      voiceActive: 0.05,
      voiceIdle: 0.02,
    },
    scheduleAhead: 2.2,
    vendorInterval: 5.76,
    vendorLeadIn: 3.84,
    musicStyle: "groove",
    ambienceStyle: "groove",
    vendorStyle: "groove",
  },
  market: {
    label: "Street Ambience",
    hint: "Music steps back while crowd, pans, and street texture come forward.",
    recommendedLevels: {
      music: 0.18,
      ambience: 0.58,
      sfx: 0.8,
    },
    gainTargets: {
      ambienceActive: 0.24,
      ambienceIdle: 0.12,
      musicActive: 0.09,
      musicIdle: 0.05,
      musicResult: 0.07,
      voiceActive: 0.075,
      voiceIdle: 0.035,
    },
    scheduleAhead: 2.6,
    vendorInterval: 7.68,
    vendorLeadIn: 4.8,
    musicStyle: "market",
    ambienceStyle: "market",
    vendorStyle: "market",
  },
};

const CITY_SOUND_PROFILES = {
  spicy: {
    tempo: 1.08,
    leadLift: 1.06,
    kick: 1.08,
    hat: 1.05,
    ambienceColor: 1.1,
    ambienceDensity: 1,
    correctPitch: 1.08,
    mistakePitch: 1.06,
    vendorStyle: "groove",
  },
  harbor: {
    tempo: 0.94,
    leadLift: 1.14,
    kick: 0.78,
    hat: 0.7,
    ambienceColor: 0.9,
    ambienceDensity: 0.82,
    correctPitch: 1.12,
    mistakePitch: 0.92,
    vendorStyle: "market",
  },
  street: {
    tempo: 1,
    leadLift: 1,
    kick: 0.92,
    hat: 0.88,
    ambienceColor: 1,
    ambienceDensity: 0.92,
    correctPitch: 1,
    mistakePitch: 1,
    vendorStyle: "groove",
  },
  metro: {
    tempo: 1.02,
    leadLift: 1.18,
    kick: 0.88,
    hat: 0.94,
    ambienceColor: 1.04,
    ambienceDensity: 0.76,
    correctPitch: 0.96,
    mistakePitch: 0.98,
    vendorStyle: "market",
  },
  northern: {
    tempo: 0.98,
    leadLift: 0.92,
    kick: 0.9,
    hat: 0.82,
    ambienceColor: 0.88,
    ambienceDensity: 0.86,
    correctPitch: 0.93,
    mistakePitch: 0.9,
    vendorStyle: "groove",
  },
};

const STAGES = [
  {
    name: "Warm-up",
    orderCount: 4,
    orderLengths: [3],
    boardCount: 16,
    columns: 4,
    orbitScale: 1,
    panicGain: 4.2,
    mistakePenalty: 20,
    targetBias: 0.58,
    hintStrength: 1,
    revive: false,
  },
  {
    name: "Rush Hour",
    orderCount: 9,
    orderLengths: [3, 4, 4],
    boardCount: 25,
    columns: 5,
    orbitScale: 1.6,
    panicGain: 7.5,
    mistakePenalty: 24,
    targetBias: 0.33,
    hintStrength: 0.35,
    revive: true,
  },
];

const audioState = {
  ctx: null,
  compressor: null,
  master: null,
  sfxGain: null,
  ambienceGain: null,
  musicGain: null,
  voiceGain: null,
  noiseBuffer: null,
  ambienceScheduledUntil: 0,
  musicScheduledUntil: 0,
  vendorScheduledAt: 0,
  musicBeatIndex: 0,
  ambienceBarIndex: 0,
  vendorPhraseIndex: 0,
  lastUiSyncAt: 0,
  settings: { ...AUDIO_DEFAULTS },
};

const state = {
  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,
  dpr: Math.max(1, Math.min(window.devicePixelRatio || 1, 2)),
  viewportMode: window.innerWidth <= 640 && window.innerHeight > window.innerWidth ? "mobile" : "desktop",
  mode: "menu",
  daySeed: dayToSeed(new Date()),
  province: CITIES[0],
  theme: CITY_THEMES[0],
  catalog: [],
  itemMap: {},
  stageIndex: 0,
  score: 0,
  combo: 0,
  bestCombo: 0,
  clearedStage1: false,
  reviveAvailable: false,
  reviveUsed: false,
  panic: 0,
  shake: 0,
  toast: "",
  toastTimer: 0,
  board: [],
  orders: [],
  orderIndex: 0,
  orderStepIndex: 0,
  completedOrders: 0,
  effects: [],
  summary: null,
  provinceBoard: [],
  pointerDown: false,
  lastTime: 0,
  autoAdvanceTimer: 0,
  screenshotTick: 0,
  audioDrawerOpen: false,
  loadingDone: false,
  healthAcknowledged: false,
  pendingStartAction: null,
};

resizeCanvas();
setupCitySelect();
loadPersistedState();
loadAudioMixSettings();
applyCityTheme(state.province, { announce: false, resetScene: true });
bindEvents();
refreshButtonStates();
updateLeaderboard();
setStatus(`${state.province} is live: ${getThemeSignature(state.theme).join(", ")} are on the menu. Tap once to enable sound.`);
syncAudioPanel(true);
render();
requestAnimationFrame(frame);
finishLoadingWhenReady();

function dayToSeed(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return Number(`${year}${month}${day}`);
}

function createRng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function randomChoice(rng, array) {
  return array[Math.floor(rng() * array.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getStorageApi() {
  try {
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function safeStorageGet(key) {
  const storage = getStorageApi();
  if (!storage) {
    return null;
  }
  try {
    return storage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeStorageSet(key, value) {
  const storage = getStorageApi();
  if (!storage) {
    return false;
  }
  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function safeStorageJsonGet(key, fallback) {
  const raw = safeStorageGet(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function loadAudioMixSettings() {
  const saved = safeStorageJsonGet(STORAGE_KEYS.audioMix, {});
  audioState.settings = {
    ...AUDIO_DEFAULTS,
    ...saved,
  };
  audioState.settings.preset = getAudioPresetName();
}

function saveAudioMixSettings() {
  safeStorageSet(STORAGE_KEYS.audioMix, JSON.stringify(audioState.settings));
}

function getChannelLevel(channel) {
  return clamp(Number(audioState.settings[channel] ?? 0), 0, 1);
}

function isChannelMuted(channel) {
  return Boolean(audioState.settings[`${channel}Muted`]);
}

function getChannelMix(channel) {
  return isChannelMuted(channel) ? 0 : getChannelLevel(channel);
}

function getAudioPresetName() {
  return AUDIO_PRESETS[audioState.settings.preset] ? audioState.settings.preset : "groove";
}

function getAudioPreset() {
  return AUDIO_PRESETS[getAudioPresetName()];
}

function getUiMode() {
  return state.mode === "menu" ? "menu" : "game";
}

function getViewportMode() {
  return state.viewportMode || "desktop";
}

function getGameplayLayout(stage = STAGES[state.stageIndex] || STAGES[0]) {
  const denseStage = stage.columns >= 5;
  if (getViewportMode() === "mobile") {
    return {
      columns: denseStage ? 4 : stage.columns,
      boardCount: denseStage ? 20 : Math.min(stage.boardCount, 16),
      paddingX: denseStage ? 86 : 82,
      topY: denseStage ? 316 : 318,
      bottomY: denseStage ? 1204 : 1196,
      itemWidthBase: denseStage ? 148 : 156,
      itemWidthJitter: denseStage ? 14 : 16,
      itemHeightBase: denseStage ? 106 : 112,
      itemHeightJitter: 10,
      jitterX: denseStage ? 7 : 8,
      jitterY: denseStage ? 10 : 12,
      hitScale: 0.58,
    };
  }

  return {
    columns: stage.columns,
    boardCount: stage.boardCount,
    paddingX: 120,
    topY: 350,
    bottomY: 1160,
    itemWidthBase: 122,
    itemWidthJitter: 18,
    itemHeightBase: 88,
    itemHeightJitter: 10,
    jitterX: 16,
    jitterY: 18,
    hitScale: 0.46,
  };
}

function syncLayoutMode() {
  const uiMode = getUiMode();
  appShell.dataset.uiMode = uiMode;
  document.body.dataset.uiMode = uiMode;
  document.body.dataset.healthOpen = healthDialog?.getAttribute("aria-hidden") === "false" ? "true" : "false";
  canvasFrame.dataset.audioOpen = state.audioDrawerOpen ? "true" : "false";
  audioButton.dataset.open = state.audioDrawerOpen ? "true" : "false";
  audioButton.setAttribute("aria-expanded", state.audioDrawerOpen ? "true" : "false");
  menuAudioButton.setAttribute("aria-expanded", state.audioDrawerOpen ? "true" : "false");
  floatingAudioPanel.setAttribute("aria-hidden", state.audioDrawerOpen ? "false" : "true");
}

function toggleAudioDrawer(forceOpen) {
  state.audioDrawerOpen = typeof forceOpen === "boolean" ? forceOpen : !state.audioDrawerOpen;
  syncLayoutMode();
}

function getCitySoundProfile() {
  return CITY_SOUND_PROFILES[state.theme?.sound] || CITY_SOUND_PROFILES.street;
}

function resetAudioScheduling(time = audioState.ctx?.currentTime || 0) {
  audioState.ambienceScheduledUntil = time;
  audioState.musicScheduledUntil = time;
  audioState.musicBeatIndex = 0;
  audioState.ambienceBarIndex = 0;
  audioState.vendorPhraseIndex = 0;
  audioState.vendorScheduledAt = time + getAudioPreset().vendorLeadIn;
}

function updatePresetButtonState(button, active) {
  button.dataset.active = active ? "true" : "false";
}

function applyAudioPreset(presetName, options = {}) {
  const preset = AUDIO_PRESETS[presetName] || AUDIO_PRESETS.groove;
  audioState.settings.preset = presetName in AUDIO_PRESETS ? presetName : "groove";

  if (options.syncLevels) {
    audioState.settings.music = preset.recommendedLevels.music;
    audioState.settings.ambience = preset.recommendedLevels.ambience;
    audioState.settings.sfx = preset.recommendedLevels.sfx;
  }

  if (audioState.ctx) {
    resetAudioScheduling(audioState.ctx.currentTime);
    applyAudioMixToNodes();
  }

  saveAudioMixSettings();
  syncAudioPanel(true);

  if (options.announce) {
    setStatus(`${preset.label}: ${preset.hint}`);
  }
}

function applyAudioMixToNodes() {
  if (!audioState.ctx || !audioState.sfxGain) {
    return;
  }
  audioState.sfxGain.gain.value = 0.92 * getChannelMix("sfx");
}

function updateChannelToggleButton(button, muted) {
  button.dataset.muted = muted ? "true" : "false";
  button.textContent = muted ? "Off" : "On";
}

function syncAudioPanel(force = false) {
  const now = state.screenshotTick;
  if (!force && now - audioState.lastUiSyncAt < 0.12) {
    return;
  }
  audioState.lastUiSyncAt = now;
  const preset = getAudioPreset();

  bgmSlider.value = `${Math.round(getChannelLevel("music") * 100)}`;
  ambienceSlider.value = `${Math.round(getChannelLevel("ambience") * 100)}`;
  sfxSlider.value = `${Math.round(getChannelLevel("sfx") * 100)}`;
  bgmValue.textContent = `${Math.round(getChannelLevel("music") * 100)}%`;
  ambienceValue.textContent = `${Math.round(getChannelLevel("ambience") * 100)}%`;
  sfxValue.textContent = `${Math.round(getChannelLevel("sfx") * 100)}%`;
  updateChannelToggleButton(bgmToggle, isChannelMuted("music"));
  updateChannelToggleButton(ambienceToggle, isChannelMuted("ambience"));
  updateChannelToggleButton(sfxToggle, isChannelMuted("sfx"));
  updatePresetButtonState(presetGrooveButton, getAudioPresetName() === "groove");
  updatePresetButtonState(presetMarketButton, getAudioPresetName() === "market");
  audioPresetHint.textContent = `Current preset: ${preset.label}. ${preset.hint}`;

  const audioReady = Boolean(audioState.ctx);
  audioStatePill.textContent = audioReady
    ? audioState.ctx.state === "running"
      ? "Ready"
      : "Suspended"
    : "Locked";

  const bgmStatus = isChannelMuted("music") ? "Muted" : `${Math.round(getChannelMix("music") * 100)}%`;
  const ambienceStatus = isChannelMuted("ambience") ? "Muted" : `${Math.round(getChannelMix("ambience") * 100)}%`;
  const sfxStatus = isChannelMuted("sfx") ? "Muted" : `${Math.round(getChannelMix("sfx") * 100)}%`;
  const ctxState = audioState.ctx ? audioState.ctx.state : "locked";
  audioDiagnostics.textContent = `${preset.label} | Audio ${ctxState} | BGM ${bgmStatus} | Ambience ${ambienceStatus} | SFX ${sfxStatus} | Schedule ${audioState.musicScheduledUntil.toFixed(1)}s / ${audioState.ambienceScheduledUntil.toFixed(1)}s`;
}

function bindAudioControl(slider, button, channel) {
  slider.addEventListener("input", () => {
    audioState.settings[channel] = clamp(Number(slider.value) / 100, 0, 1);
    applyAudioMixToNodes();
    saveAudioMixSettings();
    syncAudioPanel(true);
  });

  button.addEventListener("click", () => {
    ensureAudio();
    audioState.settings[`${channel}Muted`] = !isChannelMuted(channel);
    applyAudioMixToNodes();
    saveAudioMixSettings();
    syncAudioPanel(true);
  });
}

function getAudioContextCtor() {
  return window.AudioContext || window.webkitAudioContext || null;
}

function ensureAudio() {
  const AudioCtor = getAudioContextCtor();
  if (!AudioCtor) {
    return null;
  }

  if (!audioState.ctx) {
    audioState.ctx = new AudioCtor();
    audioState.compressor = audioState.ctx.createDynamicsCompressor();
    audioState.master = audioState.ctx.createGain();
    audioState.compressor.threshold.value = -18;
    audioState.compressor.knee.value = 18;
    audioState.compressor.ratio.value = 4;
    audioState.compressor.attack.value = 0.003;
    audioState.compressor.release.value = 0.28;
    audioState.master.gain.value = 0.82;
    audioState.sfxGain = audioState.ctx.createGain();
    audioState.ambienceGain = audioState.ctx.createGain();
    audioState.musicGain = audioState.ctx.createGain();
    audioState.voiceGain = audioState.ctx.createGain();
    audioState.sfxGain.gain.value = 0.92;
    audioState.ambienceGain.gain.value = 0.0001;
    audioState.musicGain.gain.value = 0.0001;
    audioState.voiceGain.gain.value = 0.0001;
    audioState.sfxGain.connect(audioState.master);
    audioState.ambienceGain.connect(audioState.master);
    audioState.musicGain.connect(audioState.master);
    audioState.voiceGain.connect(audioState.master);
    audioState.master.connect(audioState.compressor);
    audioState.compressor.connect(audioState.ctx.destination);
    audioState.noiseBuffer = createNoiseBuffer(audioState.ctx);
    resetAudioScheduling(audioState.ctx.currentTime);
    applyAudioMixToNodes();
  }

  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume().catch(() => {});
  }

  applyAudioMixToNodes();
  syncAudioPanel(true);

  return audioState.ctx;
}

function createNoiseBuffer(audioContext) {
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.2);
  }
  return buffer;
}

function connectEnvelope(gainNode, now, peak, duration) {
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(peak, now + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
}

function connectTransient(destination, oscillator, filter, gainNode, now, peak, duration) {
  connectEnvelope(gainNode, now, peak, duration);
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function setGainTarget(gainNode, target, now, ramp = 0.25) {
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setTargetAtTime(Math.max(0.0001, target), now, ramp);
}

function playNoiseSlice(destination, time, peak, duration, frequency, q = 1.2) {
  if (!audioState.noiseBuffer || !destination) {
    return;
  }
  const noise = audioState.ctx.createBufferSource();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  noise.buffer = audioState.noiseBuffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency, time);
  filter.Q.value = q;
  connectEnvelope(gainNode, time, peak, duration);
  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(destination);
  noise.start(time);
  noise.stop(time + duration + 0.02);
}

function scheduleOilPulse(time, intensity, brightness = 1) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }
  playNoiseSlice(
    audioState.ambienceGain,
    time,
    0.016 * intensity,
    0.26,
    1050 * brightness,
    0.72
  );
  playNoiseSlice(
    audioState.ambienceGain,
    time + 0.04,
    0.011 * intensity,
    0.34,
    1780 * brightness,
    0.6
  );

  const bubble = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  bubble.type = "sine";
  bubble.frequency.setValueAtTime(190 * brightness, time + 0.06);
  bubble.frequency.exponentialRampToValueAtTime(122 * brightness, time + 0.2);
  filter.type = "lowpass";
  filter.frequency.value = 540;
  connectTransient(audioState.ambienceGain, bubble, filter, gainNode, time + 0.06, 0.008 * intensity, 0.18);
}

function scheduleSteamRush(time, intensity, color = 1) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }

  playNoiseSlice(
    audioState.ambienceGain,
    time,
    0.012 * intensity,
    0.44,
    780 * color,
    0.45
  );
  playNoiseSlice(
    audioState.ambienceGain,
    time + 0.05,
    0.008 * intensity,
    0.36,
    1320 * color,
    0.52
  );
}

function scheduleCrowdMurmur(time, intensity, center = 560) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }

  playNoiseSlice(audioState.ambienceGain, time, 0.0065 * intensity, 0.72, center, 0.34);
  playNoiseSlice(audioState.ambienceGain, time + 0.12, 0.0045 * intensity, 0.58, center * 1.45, 0.42);
}

function schedulePanTick(time, intensity) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }

  const tick = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  tick.type = "triangle";
  tick.frequency.setValueAtTime(980, time);
  tick.frequency.exponentialRampToValueAtTime(640, time + 0.08);
  filter.type = "bandpass";
  filter.frequency.value = 1200;
  filter.Q.value = 1.1;
  connectTransient(audioState.ambienceGain, tick, filter, gainNode, time, 0.0055 * intensity, 0.08);
}

function scheduleGeneratorHum(time, intensity, base = 96) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }

  const hum = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  hum.type = "sine";
  hum.frequency.setValueAtTime(base, time);
  hum.frequency.linearRampToValueAtTime(base * 1.02, time + 0.52);
  hum.frequency.linearRampToValueAtTime(base * 0.99, time + 1.08);
  filter.type = "lowpass";
  filter.frequency.value = 180;
  connectTransient(audioState.ambienceGain, hum, filter, gainNode, time, 0.006 * intensity, 1.18);
}

function schedulePlateClink(time, intensity) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }

  const clink = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  clink.type = "triangle";
  clink.frequency.setValueAtTime(1540, time);
  clink.frequency.exponentialRampToValueAtTime(980, time + 0.06);
  filter.type = "bandpass";
  filter.frequency.value = 1780;
  filter.Q.value = 1.6;
  connectTransient(audioState.ambienceGain, clink, filter, gainNode, time, 0.0042 * intensity, 0.09);
}

function scheduleTrayShuffle(time, intensity) {
  if (!audioState.ctx || !audioState.ambienceGain) {
    return;
  }

  playNoiseSlice(audioState.ambienceGain, time, 0.0045 * intensity, 0.12, 2250, 1.3);
  playNoiseSlice(audioState.ambienceGain, time + 0.04, 0.0035 * intensity, 0.1, 1680, 1.1);
  schedulePlateClink(time + 0.05, intensity * 0.8);
}

function scheduleAmbienceBar(time, barIndex, intensity, soundProfile = CITY_SOUND_PROFILES.street) {
  const beat = 0.48;
  const density = soundProfile.ambienceDensity;
  const motion = (0.92 + (barIndex % 3) * 0.05) * density;
  const color = (0.95 + (barIndex % 2) * 0.08) * soundProfile.ambienceColor;

  scheduleCrowdMurmur(time + 0.04, intensity * 0.95 * density, (520 + (barIndex % 4) * 55) * soundProfile.ambienceColor);
  scheduleOilPulse(time + 0.02, intensity * motion, color);
  scheduleSteamRush(time + beat * 1 + 0.06, intensity * 0.72 * density, (0.92 + (barIndex % 2) * 0.08) * soundProfile.ambienceColor);
  scheduleOilPulse(time + beat * 2 + 0.02, intensity * 0.82 * density, 1.04 * soundProfile.ambienceColor);

  if (barIndex % 2 === 0) {
    schedulePanTick(time + beat * 3 + 0.11, intensity * 0.8 * density);
  } else {
    scheduleSteamRush(time + beat * 3 + 0.04, intensity * 0.48 * density, 1.04 * soundProfile.ambienceColor);
  }
}

function scheduleMarketAmbienceBar(time, barIndex, intensity, soundProfile = CITY_SOUND_PROFILES.street) {
  const beat = 0.48;
  const density = soundProfile.ambienceDensity;
  const center = (430 + (barIndex % 4) * 36) * soundProfile.ambienceColor;
  scheduleGeneratorHum(time + 0.02, intensity * 0.78 * density, (92 + (barIndex % 3) * 6) * soundProfile.ambienceColor);
  scheduleCrowdMurmur(time + 0.1, intensity * 1.2 * density, center);
  scheduleSteamRush(time + 0.34, intensity * 0.82 * density, (0.86 + (barIndex % 2) * 0.08) * soundProfile.ambienceColor);
  scheduleOilPulse(time + beat * 1.18, intensity * 0.42 * density, 0.84 * soundProfile.ambienceColor);
  scheduleCrowdMurmur(time + beat * 1.72, intensity * 0.76 * density, center + 160);
  scheduleTrayShuffle(time + beat * 2.46, intensity * 0.72 * density);

  if (barIndex % 3 === 1) {
    schedulePlateClink(time + beat * 3.16, intensity * 0.82 * density);
  } else {
    scheduleSteamRush(time + beat * 3.02, intensity * 0.44 * density, 0.96 * soundProfile.ambienceColor);
  }
}

function scheduleKick(time, peak = 0.12) {
  const osc = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(118, time);
  osc.frequency.exponentialRampToValueAtTime(44, time + 0.16);
  filter.type = "lowpass";
  filter.frequency.value = 280;
  connectTransient(audioState.musicGain, osc, filter, gainNode, time, peak, 0.18);
}

function scheduleSnare(time, peak = 0.08) {
  playNoiseSlice(audioState.musicGain, time, peak, 0.12, 2200, 0.75);
  const body = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  body.type = "triangle";
  body.frequency.setValueAtTime(210, time);
  body.frequency.exponentialRampToValueAtTime(130, time + 0.1);
  filter.type = "highpass";
  filter.frequency.value = 680;
  connectTransient(audioState.musicGain, body, filter, gainNode, time, peak * 0.28, 0.1);
}

function scheduleHat(time, peak = 0.028) {
  playNoiseSlice(audioState.musicGain, time, peak, 0.05, 5200, 0.9);
}

function scheduleBassNote(time, frequency, peak = 0.055) {
  const osc = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, time);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.86, time + 0.22);
  filter.type = "lowpass";
  filter.frequency.value = 720;
  connectTransient(audioState.musicGain, osc, filter, gainNode, time, peak, 0.24);
}

function scheduleChordHit(time, notes, peak = 0.03) {
  notes.forEach((frequency, index) => {
    const osc = audioState.ctx.createOscillator();
    const filter = audioState.ctx.createBiquadFilter();
    const gainNode = audioState.ctx.createGain();
    osc.type = index === 0 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(frequency, time);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.002, time + 0.42);
    filter.type = "lowpass";
    filter.frequency.value = 1500 - index * 180;
    connectTransient(audioState.musicGain, osc, filter, gainNode, time, peak, 0.38);
  });
}

function scheduleLeadNote(time, frequency, peak = 0.04) {
  const osc = audioState.ctx.createOscillator();
  const filter = audioState.ctx.createBiquadFilter();
  const gainNode = audioState.ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, time);
  osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, time + 0.04);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, time + 0.18);
  filter.type = "lowpass";
  filter.frequency.value = 1700;
  connectTransient(audioState.musicGain, osc, filter, gainNode, time, peak, 0.2);
}

function scheduleMusicBar(time, barIndex, soundProfile = CITY_SOUND_PROFILES.street) {
  const progression = [
    [196.0, 246.94, 293.66, 392.0],
    [220.0, 277.18, 329.63, 440.0],
    [174.61, 220.0, 261.63, 349.23],
    [196.0, 246.94, 293.66, 392.0],
  ];
  const chord = progression[barIndex % progression.length];
  const beat = 0.48;
  const step = beat / 2;
  const liftedChord = chord.map((note) => note * soundProfile.leadLift);

  scheduleKick(time + beat * 0, 0.12 * soundProfile.kick);
  scheduleKick(time + beat * 2, 0.11 * soundProfile.kick);
  scheduleKick(time + beat * 3.25, 0.08 * soundProfile.kick);
  scheduleSnare(time + beat * 1, 0.065 * soundProfile.kick);
  scheduleSnare(time + beat * 3, 0.07 * soundProfile.kick);

  for (let i = 0; i < 8; i += 1) {
    scheduleHat(time + step * i, (i % 2 === 0 ? 0.028 : 0.018) * soundProfile.hat);
  }

  scheduleBassNote(time + beat * 0, chord[0] * 0.5, 0.05);
  scheduleBassNote(time + beat * 1, chord[1] * 0.5, 0.04);
  scheduleBassNote(time + beat * 2, chord[0] * 0.5, 0.05);
  scheduleBassNote(time + beat * 3, chord[2] * 0.5, 0.04);

  scheduleChordHit(time + 0.02, [liftedChord[1], liftedChord[2], liftedChord[3]], 0.028 * soundProfile.kick);
  scheduleChordHit(time + beat * 2 + 0.02, [liftedChord[1], liftedChord[2], liftedChord[3]], 0.026 * soundProfile.kick);

  scheduleLeadNote(time + step * 1, liftedChord[2], 0.028 * soundProfile.hat);
  scheduleLeadNote(time + step * 3, liftedChord[3], 0.026 * soundProfile.hat);
  scheduleLeadNote(time + step * 5, liftedChord[2], 0.028 * soundProfile.hat);
  scheduleLeadNote(time + step * 7, liftedChord[1], 0.026 * soundProfile.hat);
}

function scheduleBrushTap(time, peak = 0.01) {
  playNoiseSlice(audioState.musicGain, time, peak, 0.08, 3200, 0.6);
}

function scheduleMusicBarMarket(time, barIndex, soundProfile = CITY_SOUND_PROFILES.street) {
  const progression = [
    [196.0, 246.94, 293.66],
    [220.0, 277.18, 329.63],
    [174.61, 220.0, 261.63],
    [196.0, 246.94, 293.66],
  ];
  const chord = progression[barIndex % progression.length].map((note) => note * soundProfile.leadLift);
  const beat = 0.48;

  scheduleKick(time, 0.052 * soundProfile.kick);
  scheduleKick(time + beat * 2.6, 0.026 * soundProfile.kick);
  scheduleBassNote(time + 0.05, chord[0] * 0.5, 0.028);
  scheduleBassNote(time + beat * 2.05, chord[1] * 0.5, 0.02);
  scheduleChordHit(time + beat * 0.58, [chord[0], chord[1], chord[2]], 0.012 * soundProfile.kick);
  scheduleChordHit(time + beat * 2.66, [chord[0], chord[1], chord[2]], 0.01 * soundProfile.kick);
  scheduleBrushTap(time + beat * 1.36, 0.008 * soundProfile.hat);
  scheduleBrushTap(time + beat * 3.28, 0.007 * soundProfile.hat);
}

function scheduleVendorCall(time, phraseIndex = 0, style = "groove") {
  if (!audioState.ctx || !audioState.voiceGain) {
    return;
  }

  const contours = style === "market"
    ? [
        [214, 248, 226, 206],
        [224, 262, 236, 212],
        [206, 242, 220, 198],
      ]
    : [
        [248, 302, 274, 226],
        [266, 328, 288, 238],
        [236, 294, 258, 214],
      ];
  const contour = contours[phraseIndex % contours.length];
  const voice = audioState.ctx.createOscillator();
  const voiceFilter = audioState.ctx.createBiquadFilter();
  const voiceGain = audioState.ctx.createGain();
  voice.type = style === "market" ? "sine" : "triangle";
  voice.frequency.setValueAtTime(contour[0], time);
  voice.frequency.linearRampToValueAtTime(contour[1], time + 0.18);
  voice.frequency.linearRampToValueAtTime(contour[2], time + (style === "market" ? 0.48 : 0.4));
  voice.frequency.linearRampToValueAtTime(contour[3], time + (style === "market" ? 0.82 : 0.64));
  voiceFilter.type = "bandpass";
  voiceFilter.frequency.setValueAtTime(style === "market" ? 620 : 760, time);
  voiceFilter.frequency.linearRampToValueAtTime(style === "market" ? 960 : 1180, time + 0.38);
  voiceFilter.frequency.linearRampToValueAtTime(style === "market" ? 760 : 930, time + (style === "market" ? 0.92 : 0.7));
  voiceFilter.Q.value = style === "market" ? 0.85 : 1.1;
  connectTransient(audioState.voiceGain, voice, voiceFilter, voiceGain, time, style === "market" ? 0.018 : 0.026, style === "market" ? 0.92 : 0.74);

  playNoiseSlice(audioState.voiceGain, time + 0.06, style === "market" ? 0.0028 : 0.0045, 0.16, style === "market" ? 1520 : 1800, 0.65);
  playNoiseSlice(audioState.voiceGain, time + 0.34, style === "market" ? 0.0022 : 0.0035, 0.12, style === "market" ? 1240 : 1450, 0.6);
}

function updateAudioBed() {
  const audioContext = audioState.ctx;
  if (!audioContext || audioContext.state !== "running") {
    return;
  }

  const now = audioContext.currentTime;
  const activeMode = state.mode === "playing" || state.mode === "intermission" || state.mode === "revive";
  const resultMode = state.mode === "result";
  const preset = getAudioPreset();
  const soundProfile = getCitySoundProfile();
  const ambienceMix = getChannelMix("ambience");
  const musicMix = getChannelMix("music");
  const voiceMix = activeMode ? ambienceMix : 0;

  setGainTarget(
    audioState.ambienceGain,
    (activeMode ? preset.gainTargets.ambienceActive : preset.gainTargets.ambienceIdle) * ambienceMix,
    now,
    0.24
  );
  setGainTarget(
    audioState.musicGain,
    (resultMode ? preset.gainTargets.musicResult : activeMode ? preset.gainTargets.musicActive : preset.gainTargets.musicIdle) *
      musicMix,
    now,
    0.18
  );
  setGainTarget(
    audioState.voiceGain,
    (activeMode ? preset.gainTargets.voiceActive : preset.gainTargets.voiceIdle) * voiceMix,
    now,
    0.28
  );

  if (ambienceMix > 0.001) {
    while (audioState.ambienceScheduledUntil < now + preset.scheduleAhead) {
      if (preset.ambienceStyle === "market") {
        scheduleMarketAmbienceBar(
          audioState.ambienceScheduledUntil,
          audioState.ambienceBarIndex,
          activeMode ? 1 : 0.55,
          soundProfile
        );
      } else {
        scheduleAmbienceBar(
          audioState.ambienceScheduledUntil,
          audioState.ambienceBarIndex,
          activeMode ? 1 : 0.52,
          soundProfile
        );
      }
      audioState.ambienceScheduledUntil += 1.92;
      audioState.ambienceBarIndex += 1;
    }
  } else {
    audioState.ambienceScheduledUntil = now;
  }

  if (musicMix > 0.001) {
    while (audioState.musicScheduledUntil < now + preset.scheduleAhead) {
      if (preset.musicStyle === "market") {
        scheduleMusicBarMarket(audioState.musicScheduledUntil, audioState.musicBeatIndex, soundProfile);
      } else {
        scheduleMusicBar(audioState.musicScheduledUntil, audioState.musicBeatIndex, soundProfile);
      }
      audioState.musicScheduledUntil += 1.92;
      audioState.musicBeatIndex += 1;
    }
  } else {
    audioState.musicScheduledUntil = now;
  }

  if (activeMode && voiceMix > 0.001) {
    while (audioState.vendorScheduledAt < now + preset.scheduleAhead + 0.2) {
      const vendorStyle = soundProfile.vendorStyle === "market" || preset.vendorStyle === "market" ? "market" : "groove";
      scheduleVendorCall(audioState.vendorScheduledAt, audioState.vendorPhraseIndex, vendorStyle);
      audioState.vendorScheduledAt += preset.vendorInterval;
      audioState.vendorPhraseIndex += 1;
    }
  } else if (audioState.vendorScheduledAt < now + preset.scheduleAhead) {
    audioState.vendorScheduledAt = now + preset.vendorLeadIn;
  }
}

function playCorrectSound(item) {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.sfxGain) {
    return;
  }

  const now = audioContext.currentTime;
  const pitch = getCitySoundProfile().correctPitch;
  const slurp = audioContext.createOscillator();
  const slurpFilter = audioContext.createBiquadFilter();
  const slurpGain = audioContext.createGain();
  slurp.type = item?.art === "drink" || item?.art === "dessert" ? "sine" : "sawtooth";
  slurp.frequency.setValueAtTime(420 * pitch, now);
  slurp.frequency.exponentialRampToValueAtTime(700 * pitch, now + 0.06);
  slurp.frequency.exponentialRampToValueAtTime(240 * pitch, now + 0.17);
  slurp.frequency.exponentialRampToValueAtTime(310 * pitch, now + 0.29);
  slurpFilter.type = "lowpass";
  slurpFilter.frequency.setValueAtTime(1450, now);
  slurpFilter.frequency.exponentialRampToValueAtTime(620, now + 0.3);
  connectTransient(audioState.sfxGain, slurp, slurpFilter, slurpGain, now, 0.045, 0.3);

  const gulp = audioContext.createOscillator();
  const gulpFilter = audioContext.createBiquadFilter();
  const gulpGain = audioContext.createGain();
  gulp.type = "sine";
  gulp.frequency.setValueAtTime(140 * pitch, now + 0.08);
  gulp.frequency.exponentialRampToValueAtTime(88 * pitch, now + 0.23);
  gulpFilter.type = "lowpass";
  gulpFilter.frequency.value = 420;
  connectTransient(audioState.sfxGain, gulp, gulpFilter, gulpGain, now + 0.08, 0.065, 0.2);

  playNoiseSlice(
    audioState.sfxGain,
    now,
    item?.art === "drink" || item?.art === "dessert" ? 0.09 : 0.07,
    0.18,
    item?.art === "drink" || item?.art === "dessert" ? 980 : 760,
    0.68
  );

  if (Math.random() < 0.65) {
    const lipClick = audioContext.createOscillator();
    const lipFilter = audioContext.createBiquadFilter();
    const lipGain = audioContext.createGain();
    lipClick.type = "square";
    lipClick.frequency.setValueAtTime(900, now + 0.015);
    lipClick.frequency.exponentialRampToValueAtTime(420, now + 0.05);
    lipFilter.type = "bandpass";
    lipFilter.frequency.value = 1800;
    connectTransient(audioState.sfxGain, lipClick, lipFilter, lipGain, now + 0.015, 0.01, 0.05);
  }
}

function playMistakeSound() {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.sfxGain) {
    return;
  }

  const now = audioContext.currentTime;
  const pitch = getCitySoundProfile().mistakePitch;
  const tone = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();
  tone.type = "sawtooth";
  tone.frequency.setValueAtTime(260 * pitch, now);
  tone.frequency.exponentialRampToValueAtTime(130 * pitch, now + 0.18);
  filter.type = "lowpass";
  filter.frequency.value = 920;
  connectTransient(audioState.sfxGain, tone, filter, gainNode, now, 0.052, 0.18);
  playNoiseSlice(audioState.sfxGain, now, 0.018, 0.08, 700, 0.9);
}

function playStageClearSound(finalClear = false) {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.sfxGain) {
    return;
  }

  const notes = finalClear ? [480, 640, 820] : [420, 560];
  notes.forEach((frequency, index) => {
    const now = audioContext.currentTime + index * 0.08;
    const osc = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, now);
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    connectTransient(audioState.sfxGain, osc, filter, gainNode, now, 0.04, 0.24);
  });
}

function playReviveSound() {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.sfxGain) {
    return;
  }

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gainNode = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(360, now);
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.28);
  filter.type = "lowpass";
  filter.frequency.value = 1600;
  connectTransient(audioState.sfxGain, osc, filter, gainNode, now, 0.05, 0.28);
  playNoiseSlice(audioState.sfxGain, now, 0.015, 0.14, 1300, 0.8);
}

function buildThemeCatalog(theme) {
  return BASE_ITEM_TYPES.map((base) => ({
    ...base,
    ...theme.items[base.id],
  }));
}

function getThemeSignature(theme) {
  return [
    theme.items.pancake.label,
    theme.items.sausage.label,
    theme.items.icejelly.label,
  ];
}

function getSceneLabel(scene) {
  const labels = {
    lanterns: "Lantern Heat",
    harbor: "Harbor Air",
    neon: "Neon Corner",
    river: "Riverside Stalls",
    courtyard: "Old Town Gate",
    alley: "Backstreet Bites",
    arcade: "Arcade Market",
  };
  return labels[scene] || "Night Market";
}

function getIngredientEmoji(art) {
  const icons = {
    sausage: "Sk",
    ricecake: "Sw",
    squid: "Sq",
    tofu: "Tf",
    wing: "Wg",
    corn: "Co",
    chili: "Sp",
    potato: "Fr",
    shrimp: "Sh",
    pancake: "Bk",
    drink: "Dr",
    dessert: "Ic",
  };
  return icons[art] || "Food";
}

function getThemePreviewItems(theme) {
  return [
    { art: "sausage", ...theme.items.sausage },
    { art: "pancake", ...theme.items.pancake },
    { art: "dessert", ...theme.items.icejelly },
    { art: "squid", ...theme.items.squid },
  ];
}

function updateThemeShowcase(theme) {
  const sceneLabel = getSceneLabel(theme.scene);
  heroCopy.dataset.scene = theme.scene;
  controlCard.dataset.scene = theme.scene;
  heroCopy.style.setProperty("--hero-top", `${theme.skyTop}`);
  heroCopy.style.setProperty("--hero-bottom", `${shadeColor(theme.skyBottom, 18)}`);
  heroCopy.style.setProperty("--hero-glow", theme.glow.replace("0.12", "0.28").replace("0.13", "0.28").replace("0.14", "0.28"));
  controlCard.style.setProperty("--control-top", `${shadeColor(theme.skyTop, 10)}`);
  controlCard.style.setProperty("--control-bottom", `${shadeColor(theme.skyBottom, 34)}`);
  controlCard.style.setProperty("--control-glow", theme.glow.replace("0.12", "0.22").replace("0.13", "0.22").replace("0.14", "0.22"));

  heroCityPill.textContent = `${theme.city}`;
  heroScenePill.textContent = sceneLabel;
  heroMarketLine.textContent = `${theme.market} · Snacks, colors, and sound shift with the city.`;
  heroTagline.textContent = `${theme.city} brings its own street-food set, visual mood, and sound profile. Pick from ${CITIES.length} global cities before the rush begins.`;
  cityPreviewTitle.textContent = `${theme.city} · ${theme.market}`;
  cityPreviewSubtitle.textContent = `Choose from ${CITIES.length} global cities. Each one changes the snack deck, visual skin, and sound theme.`;
  cityPreviewScene.textContent = sceneLabel;

  heroIngredientStrip.innerHTML = "";
  cityPreviewItems.innerHTML = "";
  getThemePreviewItems(theme).forEach((item, index) => {
    const heroChip = document.createElement("div");
    heroChip.className = "ingredient-mini";
    heroChip.style.background = `linear-gradient(180deg, ${shadeColor(item.fill, 18)}, ${shadeColor(item.fill, -8)})`;
    heroChip.innerHTML = `
      <span class="ingredient-mini-emoji">${getIngredientEmoji(item.art)}</span>
      <span class="ingredient-mini-name">${item.label}</span>
    `;
    heroIngredientStrip.appendChild(heroChip);

    const previewCard = document.createElement("div");
    previewCard.className = "city-preview-item";
    previewCard.style.background = `linear-gradient(180deg, ${shadeColor(item.fill, 22)}, ${shadeColor(item.fill, -4)})`;
    previewCard.innerHTML = `
      <span class="city-preview-icon">${getIngredientEmoji(item.art)}</span>
      <span class="city-preview-text">
        <span class="city-preview-name">${item.label}</span>
        <span class="city-preview-note">${index < 2 ? "Signature pick" : "City flavor"}</span>
      </span>
    `;
    cityPreviewItems.appendChild(previewCard);
  });
}

function getItem(typeId) {
  return state.itemMap[typeId];
}

function randomCatalogItemId(rng) {
  return randomChoice(rng, state.catalog).id;
}

function resetSceneForThemeChange() {
  state.mode = "menu";
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.summary = null;
  state.board = [];
  state.orders = [];
  state.orderIndex = 0;
  state.orderStepIndex = 0;
  state.completedOrders = 0;
  state.toast = "";
  state.toastTimer = 0;
  state.panic = 0;
  state.effects = [];
  state.autoAdvanceTimer = 0;
}

function applyCityTheme(city, options = {}) {
  const theme = CITY_THEME_MAP[city] || CITY_THEMES[0];
  state.province = theme.city;
  state.theme = theme;
  state.catalog = buildThemeCatalog(theme);
  state.itemMap = Object.fromEntries(state.catalog.map((item) => [item.id, item]));
  citySelect.value = theme.city;
  updateThemeShowcase(theme);

  if (audioState.ctx) {
    resetAudioScheduling(audioState.ctx.currentTime);
  }

  if (options.resetScene) {
    resetSceneForThemeChange();
  }

  if (options.announce !== false) {
    setStatus(
      `${theme.city} is ready: ${getThemeSignature(theme).join(", ")} are on tonight's menu.`
    );
  }

  render();
}

function setupCitySelect() {
  citySelect.innerHTML = "";
  CITIES.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

function loadPersistedState() {
  const savedCity = safeStorageGet(STORAGE_KEYS.city);
  if (savedCity && CITIES.includes(savedCity)) {
    state.province = savedCity;
  }
  citySelect.value = state.province;
}

function bindEvents() {
  bindAudioControl(bgmSlider, bgmToggle, "music");
  bindAudioControl(ambienceSlider, ambienceToggle, "ambience");
  bindAudioControl(sfxSlider, sfxToggle, "sfx");
  presetGrooveButton.addEventListener("click", () => {
    ensureAudio();
    applyAudioPreset("groove", { syncLevels: true, announce: true });
  });
  presetMarketButton.addEventListener("click", () => {
    ensureAudio();
    applyAudioPreset("market", { syncLevels: true, announce: true });
  });

  audioButton.addEventListener("click", () => {
    ensureAudio();
    toggleAudioDrawer();
  });

  menuButton.addEventListener("click", () => {
    quitRun();
  });

  menuAudioButton.addEventListener("click", () => {
    ensureAudio();
    toggleAudioDrawer();
  });

  citySelect.addEventListener("change", () => {
    ensureAudio();
    const wasRunning =
      state.mode === "playing" || state.mode === "paused" || state.mode === "intermission" || state.mode === "revive";
    applyCityTheme(citySelect.value, { announce: !wasRunning, resetScene: true });
    if (wasRunning) {
      startRun();
      setStatus(`${state.province} selected. This run has restarted with the new city theme.`);
    }
    safeStorageSet(STORAGE_KEYS.city, state.province);
    updateLeaderboard();
    refreshButtonStates();
  });

  startButton.addEventListener("click", () => {
    ensureAudio();
    if (state.mode === "intermission") {
      continueToStageTwo();
      return;
    }
    requestHealthyStart(startRun);
  });

  retryButton.addEventListener("click", () => {
    ensureAudio();
    requestHealthyStart(startRun);
  });

  pauseButton.addEventListener("click", () => {
    ensureAudio();
    togglePause();
  });

  quitButton.addEventListener("click", () => {
    if (state.mode === "menu") {
      toggleAudioDrawer(false);
      return;
    }
    quitRun();
  });

  reviveButton.addEventListener("click", () => {
    ensureAudio();
    useRevive();
  });

  shareButton.addEventListener("click", async () => {
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Score text copied. Share it with friends.");
    } catch (error) {
      showShareFallback(text);
      setStatus("Copy blocked by the browser. Select the text in the dialog to copy it manually.");
    }
  });

  shareFallbackClose.addEventListener("click", hideShareFallback);

  canvas.addEventListener("pointerdown", (event) => {
    state.pointerDown = true;
    ensureAudio();
    handleCanvasTap(event);
  });

  healthConfirmButton.addEventListener("click", () => {
    state.healthAcknowledged = true;
    hideHealthDialog();
    const action = state.pendingStartAction;
    state.pendingStartAction = null;
    if (typeof action === "function") {
      action();
    }
  });

  healthCancelButton.addEventListener("click", () => {
    state.pendingStartAction = null;
    hideHealthDialog();
    setStatus("Start cancelled. Tap Start Rush when you are ready.");
  });

  window.addEventListener("pointerup", () => {
    state.pointerDown = false;
  });

  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("keydown", async (event) => {
    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      await toggleFullscreen();
    } else if (event.key === "Escape" && document.fullscreenElement) {
      document.exitFullscreen();
    } else if (event.key === " " && (state.mode === "menu" || state.mode === "result")) {
      event.preventDefault();
      ensureAudio();
      requestHealthyStart(startRun);
    } else if (event.key === "Enter" && state.mode === "intermission") {
      event.preventDefault();
      ensureAudio();
      continueToStageTwo();
    } else if (event.key.toLowerCase() === "p" && (state.mode === "playing" || state.mode === "paused")) {
      event.preventDefault();
      ensureAudio();
      togglePause();
    } else if (event.key.toLowerCase() === "q" && (state.mode === "playing" || state.mode === "paused")) {
      event.preventDefault();
      quitRun();
    } else if (event.key === "r" && state.mode !== "playing") {
      ensureAudio();
      requestHealthyStart(startRun);
    }
  });

  document.addEventListener("fullscreenchange", resizeCanvas);
}

function finishLoadingWhenReady() {
  const startedAt = performance.now();
  const markReady = () => {
    const remaining = Math.max(0, 650 - (performance.now() - startedAt));
    window.setTimeout(() => {
      state.loadingDone = true;
      if (loadingText) {
        loadingText.textContent = "Ready. The night market is open.";
      }
      if (loadingProgress) {
        loadingProgress.style.animation = "none";
        loadingProgress.style.width = "100%";
      }
      loadingScreen?.classList.add("is-hidden");
    }, remaining);
  };

  if (document.readyState === "complete") {
    markReady();
  } else {
    window.addEventListener("load", markReady, { once: true });
  }
}

function showHealthDialog(action) {
  state.pendingStartAction = action;
  toggleAudioDrawer(false);
  healthDialog.setAttribute("aria-hidden", "false");
  syncLayoutMode();
  window.setTimeout(() => healthConfirmButton.focus(), 0);
}

function hideHealthDialog() {
  healthDialog.setAttribute("aria-hidden", "true");
  syncLayoutMode();
}

function showShareFallback(text) {
  shareFallbackText.value = text;
  shareFallbackDialog.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    shareFallbackText.focus();
    shareFallbackText.select();
  }, 0);
}

function hideShareFallback() {
  shareFallbackDialog.setAttribute("aria-hidden", "true");
}

function requestHealthyStart(action) {
  if (state.healthAcknowledged) {
    action();
    return;
  }
  showHealthDialog(action);
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function resizeCanvas() {
  const previousViewportMode = state.viewportMode;
  state.dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const narrowScreen = Math.min(window.innerWidth, window.innerHeight) <= 640 || window.innerWidth <= 760;
  state.viewportMode = coarsePointer || narrowScreen ? "mobile" : "desktop";
  canvas.width = DESIGN_WIDTH * state.dpr;
  canvas.height = DESIGN_HEIGHT * state.dpr;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  state.width = DESIGN_WIDTH;
  state.height = DESIGN_HEIGHT;
  if (previousViewportMode && previousViewportMode !== state.viewportMode) {
    relayoutBoardForViewportChange();
  }
  syncLayoutMode();
  render();
}

function startRun() {
  toggleAudioDrawer(false);
  state.mode = "playing";
  state.stageIndex = 0;
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.clearedStage1 = false;
  state.reviveUsed = false;
  state.summary = null;
  state.effects = [];
  state.autoAdvanceTimer = 0;
  prepareStage(0);
  setStatus(`${state.province} is open. Start with Warm-up and learn tonight's order rhythm.`);
  refreshButtonStates();
}

function continueToStageTwo() {
  if (state.mode !== "intermission") {
    return;
  }
  toggleAudioDrawer(false);
  state.mode = "playing";
  state.autoAdvanceTimer = 0;
  prepareStage(1);
  setStatus("Rush Hour confirmed: longer orders, softer hints, faster pressure.");
  refreshButtonStates();
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    state.toast = "Paused";
    state.toastTimer = 0.9;
    setStatus("This run is paused. Tap Resume Rush or press P to continue, or return to the city screen.");
    refreshButtonStates();
  } else if (state.mode === "paused") {
    state.mode = "playing";
    state.toast = "Resume Rush";
    state.toastTimer = 0.9;
    setStatus("Rush resumed. Tap snacks in order to complete tonight's orders.");
    refreshButtonStates();
  }
}

function quitRun() {
  const wasActive = state.mode === "playing" || state.mode === "paused" || state.mode === "intermission" || state.mode === "revive";
  toggleAudioDrawer(false);
  resetSceneForThemeChange();
  if (wasActive) {
    setStatus(`${state.province} run exited. Pick another city or start again.`);
  }
  refreshButtonStates();
}

function prepareStage(index) {
  const stage = STAGES[index];
  const rng = createRng(state.daySeed + (index + 1) * 9973 + state.province.charCodeAt(0) * 11);
  state.stageIndex = index;
  state.orderIndex = 0;
  state.orderStepIndex = 0;
  state.completedOrders = 0;
  state.panic = index === 0 ? 10 : 22;
  state.reviveAvailable = stage.revive;
  state.orders = buildOrders(stage, rng);
  state.board = buildBoard(stage, rng);
  ensureTargetsForCurrentOrder();
  state.toast = `${stage.name} started`;
  state.toastTimer = 1.5;
  refreshButtonStates();
}

function relayoutBoardForViewportChange() {
  if (!state.board.length) {
    return;
  }
  const stage = STAGES[state.stageIndex];
  if (!stage) {
    return;
  }
  const preservedTypes = state.board.map((item) => item.type);
  const rng = createRng(
    state.daySeed +
      state.stageIndex * 101 +
      state.orderIndex * 43 +
      state.orderStepIndex * 7 +
      state.score +
      state.province.charCodeAt(0) * 17 +
      (state.viewportMode === "mobile" ? 5003 : 9007)
  );
  state.board = buildBoard(stage, rng, preservedTypes);
  ensureTargetsForCurrentOrder();
}

function buildOrders(stage, rng) {
  const orders = [];
  for (let i = 0; i < stage.orderCount; i += 1) {
    const length = randomChoice(rng, stage.orderLengths);
    const steps = [];
    for (let j = 0; j < length; j += 1) {
      let candidate = randomCatalogItemId(rng);
      if (j > 0 && rng() < 0.55) {
        while (candidate === steps[j - 1]) {
          candidate = randomCatalogItemId(rng);
        }
      }
      steps.push(candidate);
    }
    orders.push({ steps });
  }
  return orders;
}

function getStageNumberLabel(index = state.stageIndex) {
  return `Stage ${index + 1}`;
}

function getStageHeadline(index = state.stageIndex) {
  const stage = STAGES[index];
  return stage ? `${getStageNumberLabel(index)} · ${stage.name}` : "Ready";
}

function getStageHint(index = state.stageIndex) {
  const stage = STAGES[index];
  if (!stage) {
    return "Ready";
  }
  return index === 0 ? `${stage.orderCount} orders · Learn the rhythm` : `${stage.orderCount} orders · Rush mode`;
}

function isPointInsideActionButton(x, y) {
  return x >= 146 && x <= 756 && y >= 696 && y <= 768;
}

function buildBoard(stage, rng, preservedTypes = []) {
  const layout = getGameplayLayout(stage);
  const board = [];
  const paddingX = layout.paddingX;
  const topY = layout.topY;
  const bottomY = layout.bottomY;
  const columns = layout.columns;
  const boardCount = layout.boardCount;
  const rows = Math.ceil(boardCount / columns);
  const cellWidth = (state.width - paddingX * 2) / columns;
  const cellHeight = (bottomY - topY) / rows;

  for (let i = 0; i < boardCount; i += 1) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    const type = preservedTypes[i] || randomCatalogItemId(rng);
    const anchorX = paddingX + column * cellWidth + cellWidth / 2 + (rng() - 0.5) * layout.jitterX;
    const anchorY = topY + row * cellHeight + cellHeight / 2 + (rng() - 0.5) * layout.jitterY;
    board.push({
      id: `item-${stage.name}-${i}`,
      type,
      x: anchorX,
      y: anchorY,
      anchorX,
      anchorY,
      orbitX: 12 + rng() * 12 * stage.orbitScale,
      orbitY: 8 + rng() * 10 * stage.orbitScale,
      phase: rng() * Math.PI * 2,
      phaseSpeed: 0.7 + rng() * 0.7,
      wobble: (rng() - 0.5) * 0.14,
      angle: (rng() - 0.5) * 0.34,
      width: layout.itemWidthBase + rng() * layout.itemWidthJitter,
      height: layout.itemHeightBase + rng() * layout.itemHeightJitter,
      pulse: rng() * Math.PI * 2,
      pulseSpeed: 1.2 + rng() * 0.8,
      depth: row + rng(),
      targetGlow: 0,
    });
  }

  return board.sort((a, b) => a.depth - b.depth);
}

function ensureTargetsForCurrentOrder() {
  if (state.mode !== "playing") {
    return;
  }
  const stage = STAGES[state.stageIndex];
  const order = state.orders[state.orderIndex];
  if (!order) {
    return;
  }

  const remainingSteps = order.steps.slice(state.orderStepIndex);
  const desiredCount = state.stageIndex === 0 ? 3 : 2;

  remainingSteps.forEach((typeId, idx) => {
    const existing = state.board.filter((item) => item.type === typeId).length;
    if (existing >= desiredCount) {
      return;
    }
    const needed = desiredCount - existing;
    for (let i = 0; i < needed; i += 1) {
      const candidates = state.board.filter((item) => !remainingSteps.includes(item.type));
      const chosen = candidates[Math.floor((idx * 7 + i * 13) % Math.max(1, candidates.length))];
      if (chosen) {
        chosen.type = typeId;
      }
    }
  });

  state.board.forEach((item) => {
    item.targetGlow = remainingSteps.includes(item.type)
      ? stage.hintStrength * (item.type === remainingSteps[0] ? 1 : 0.55)
      : 0;
  });
}

function frame(timestamp) {
  if (!state.lastTime) {
    state.lastTime = timestamp;
  }
  const delta = clamp((timestamp - state.lastTime) / 1000, 0, 0.05);
  state.lastTime = timestamp;
  update(delta);
  render();
  requestAnimationFrame(frame);
}

function update(delta) {
  state.screenshotTick += delta;
  updateAudioBed();
  syncAudioPanel();
  if (state.toastTimer > 0) {
    state.toastTimer = Math.max(0, state.toastTimer - delta);
  }
  state.shake = Math.max(0, state.shake - delta * 3.6);

  if (state.mode === "paused") {
    return;
  }

  state.board.forEach((item, index) => {
    item.phase += delta * item.phaseSpeed;
    item.pulse += delta * item.pulseSpeed;
    item.x = item.anchorX + Math.sin(item.phase + index * 0.21) * item.orbitX;
    item.y = item.anchorY + Math.cos(item.phase * 0.8 + index * 0.13) * item.orbitY;
    item.angle = item.wobble + Math.sin(item.phase * 0.7) * 0.08;
  });

  for (let i = state.effects.length - 1; i >= 0; i -= 1) {
    const effect = state.effects[i];
    effect.life -= delta;
    effect.y += effect.vy * delta;
    effect.scale += delta * 0.5;
    if (effect.life <= 0) {
      state.effects.splice(i, 1);
    }
  }

  if (state.mode === "playing") {
    const stage = STAGES[state.stageIndex];
    state.panic = clamp(state.panic + stage.panicGain * delta, 0, 100);

    if (state.panic >= 100) {
      if (state.reviveAvailable && !state.reviveUsed) {
        state.mode = "revive";
        state.toast = "One save left";
        state.toastTimer = 3;
        refreshButtonStates();
      } else {
        finishRun(false);
      }
    }
  }
}

function handleCanvasTap(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * state.width;
  const y = ((event.clientY - rect.top) / rect.height) * state.height;

  if (state.mode === "menu" || state.mode === "result") {
    requestHealthyStart(startRun);
    return;
  }
  if (state.mode === "revive") {
    useRevive();
    return;
  }
  if (state.mode === "paused") {
    if (isPointInsideActionButton(x, y)) {
      togglePause();
    }
    return;
  }
  if (state.mode === "intermission") {
    if (isPointInsideActionButton(x, y)) {
      continueToStageTwo();
    } else {
      setStatus("Warm-up complete. Tap the center button to enter Rush Hour.");
    }
    return;
  }
  if (state.mode !== "playing") {
    return;
  }

  const order = state.orders[state.orderIndex];
  if (!order) {
    return;
  }
  const expectedType = order.steps[state.orderStepIndex];
  const hit = pickTopItemAt(x, y);
  if (!hit) {
    addMistake("Missed");
    return;
  }

  if (hit.type === expectedType) {
    handleCorrectPick(hit);
  } else {
    addMistake(`Wrong: ${getItem(hit.type).label}`);
  }
}

function pickTopItemAt(x, y) {
  const layout = getGameplayLayout();
  for (let i = state.board.length - 1; i >= 0; i -= 1) {
    const item = state.board[i];
    const dx = Math.abs(x - item.x);
    const dy = Math.abs(y - item.y);
    if (dx <= item.width * layout.hitScale && dy <= item.height * layout.hitScale) {
      return item;
    }
  }
  return null;
}

function handleCorrectPick(item) {
  const order = state.orders[state.orderIndex];
  const pickedItem = getItem(item.type);
  state.score += 120 + state.combo * 8;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.orderStepIndex += 1;
  state.panic = clamp(state.panic - 6.5, 0, 100);
  state.toast = `Got ${pickedItem.label}`;
  state.toastTimer = 0.7;
  playCorrectSound(pickedItem);
  spawnEffect(item.x, item.y, `+${120 + (state.combo - 1) * 8}`);
  refillItem(item);

  if (state.orderStepIndex >= order.steps.length) {
    state.completedOrders += 1;
    state.orderIndex += 1;
    state.orderStepIndex = 0;
    state.score += 180;
    state.panic = clamp(state.panic - 10, 0, 100);
    state.toast = `${STAGES[state.stageIndex].name}: ${state.completedOrders} orders`;
    state.toastTimer = 1;

    if (state.orderIndex >= state.orders.length) {
      handleStageClear();
      return;
    }
  }

  ensureTargetsForCurrentOrder();
  refreshButtonStates();
}

function refillItem(item) {
  const stage = STAGES[state.stageIndex];
  const rng = createRng(
    state.daySeed +
      state.stageIndex * 101 +
      state.orderIndex * 43 +
      state.orderStepIndex * 7 +
      state.score +
      state.province.charCodeAt(0) * 17
  );
  const order = state.orders[state.orderIndex];
  const remaining = order ? order.steps.slice(state.orderStepIndex) : [];
  let nextType = randomCatalogItemId(rng);
  if (remaining.length && rng() < stage.targetBias) {
    nextType = randomChoice(rng, remaining);
  }
  item.type = nextType;
  item.phase = rng() * Math.PI * 2;
  item.pulse = rng() * Math.PI * 2;
}

function addMistake(label) {
  const stage = STAGES[state.stageIndex];
  state.combo = 0;
  state.panic = clamp(state.panic + stage.mistakePenalty, 0, 100);
  state.shake = 1;
  state.toast = label;
  state.toastTimer = 0.8;
  playMistakeSound();
  spawnEffect(state.width / 2, 280, label, "#7d1515");
  refreshButtonStates();
}

function handleStageClear() {
  if (state.stageIndex === 0) {
    state.clearedStage1 = true;
    state.mode = "intermission";
    state.autoAdvanceTimer = 0;
    state.toast = "Warm-up clear. Confirm Rush Hour.";
    state.toastTimer = 1.8;
    playStageClearSound(false);
    setStatus("Warm-up complete. Confirm Rush Hour to continue.");
    refreshButtonStates();
    return;
  }
  playStageClearSound(true);
  finishRun(true);
}

function useRevive() {
  if (state.mode !== "revive") {
    return;
  }
  toggleAudioDrawer(false);
  state.mode = "playing";
  state.reviveUsed = true;
  state.panic = 58;
  state.combo = 0;
  state.toast = "Cooler refill used";
  state.toastTimer = 1.4;
  playReviveSound();
  setStatus("That was your only refill. Finish the current order.");
  refreshButtonStates();
}

function finishRun(cleared) {
  toggleAudioDrawer(false);
  state.mode = "result";
  const stage = STAGES[state.stageIndex];
  const ordersDone = state.completedOrders;
  const nearMiss = !cleared && state.stageIndex === 1 && state.orders.length - ordersDone <= 2;
  state.summary = {
    cleared,
    clearedStage: stage.name,
    totalScore: Math.round(state.score),
    ordersDone,
    totalOrders: state.orders.length,
    bestCombo: state.bestCombo,
    nearMiss,
  };

  persistBestScore(state.summary.totalScore);
  updateLeaderboard();
  setStatus(
    cleared
      ? `${state.province} run cleared.`
      : nearMiss
        ? `${state.orders.length - ordersDone} orders left to clear this run.`
        : "Warm-up is done. Rush Hour needs faster taps."
  );
  refreshButtonStates();
}

function persistBestScore(score) {
  const scores = safeStorageJsonGet(STORAGE_KEYS.scores, {});
  scores[state.province] = Math.max(Number(scores[state.province] || 0), score);
  safeStorageSet(STORAGE_KEYS.scores, JSON.stringify(scores));
}

function buildProvinceBoard() {
  const savedScores = safeStorageJsonGet(STORAGE_KEYS.scores, {});

  const rng = createRng(state.daySeed + 77);
  const list = CITIES.map((city, index) => {
    const baseline = 2400 + Math.floor(rng() * 1800) + index * 23;
    const playerScore = Number(savedScores[city] || 0);
    return {
      province: city,
      score: Math.max(baseline, playerScore),
      player: city === state.province,
    };
  }).sort((a, b) => b.score - a.score);

  const topEight = list.slice(0, 8);
  if (topEight.some((entry) => entry.province === state.province)) {
    return topEight;
  }

  const playerEntry = list.find((entry) => entry.province === state.province);
  return [...topEight.slice(0, 7), playerEntry];
}

function updateLeaderboard() {
  state.provinceBoard = buildProvinceBoard();
  leaderboardElement.innerHTML = "";
  state.provinceBoard.forEach((entry, index) => {
    const li = document.createElement("li");
    if (entry.player) {
      li.style.outline = "2px solid rgba(217, 93, 57, 0.26)";
    }
    li.innerHTML = `
      <span class="rank">${index + 1}</span>
      <span>${entry.province}${entry.player ? " · You" : ""}</span>
      <span class="score">${entry.score}</span>
    `;
    leaderboardElement.appendChild(li);
  });
}

function refreshButtonStates() {
  startButton.textContent = state.mode === "intermission" ? "Rush Hour" : "Start Rush";
  const startBlocked = state.mode === "playing" || state.mode === "revive" || state.mode === "paused";
  startButton.disabled = startBlocked;
  retryButton.textContent = state.mode === "result" ? "New Run" : "Restart";
  retryButton.disabled = state.mode === "menu";
  pauseButton.textContent = state.mode === "paused" ? "Resume" : "Pause";
  pauseButton.disabled = !(state.mode === "playing" || state.mode === "paused");
  audioButton.textContent = state.audioDrawerOpen ? "Close" : "Sound";
  audioButton.disabled = state.mode === "menu";
  menuButton.textContent = "Cities";
  menuButton.disabled = state.mode === "menu";
  menuAudioButton.textContent = state.audioDrawerOpen ? "Close Sound" : "Sound";
  quitButton.textContent = state.mode === "menu" ? "Close Sound Panel" : "Back to Cities";
  quitButton.disabled = false;
  reviveButton.disabled = state.mode !== "revive";
  citySelect.disabled = false;
  syncLayoutMode();
}

function setStatus(text) {
  statusLine.textContent = text;
}

function buildShareText() {
  const summary = state.summary;
  if (!summary) {
    return `I just picked ${state.province} in Midnight Bites and I'm ready for the rush.`;
  }
  if (summary.cleared) {
    return `I cleared every ${state.province} order in Midnight Bites with ${summary.totalScore} points and a best combo of ${summary.bestCombo}.`;
  }
  return `I scored ${summary.totalScore} in ${state.province} on Midnight Bites, with ${summary.totalOrders - summary.ordersDone} orders left to clear the run.`;
}

function spawnEffect(x, y, text, color = "#2d1d17") {
  state.effects.push({
    x,
    y,
    vy: -38,
    text,
    color,
    life: 0.85,
    scale: 1,
  });
}

function render() {
  ctx.clearRect(0, 0, state.width, state.height);
  drawBackground();
  drawHeader();
  drawBoard();
  drawEffects();
  drawFooter();
  drawOverlay();
}

function getThemeSceneStyle(theme) {
  const styles = {
    lanterns: {
      frameOuterTop: "#6d281e",
      frameOuterBottom: "#41140f",
      frameInnerTop: "#983b24",
      frameInnerBottom: "#5a1d15",
      stageTop: "#fff2e8",
      stageBottom: "#f0d2bd",
      orderTop: "#fff5ee",
      orderBottom: "#f0ddcf",
      panelText: "#5b2c1a",
      meterTrack: "#f7ede3",
      footerTop: "#fff2e7",
      footerBottom: "#ebd1bf",
      footerText: "#543020",
      orderIdle: "rgba(124, 84, 69, 0.22)",
      orderDone: "rgba(190, 102, 63, 0.92)",
      orderActive: "rgba(247, 180, 84, 0.96)",
      cardStroke: "#faebdf",
      labelTop: "#fff9f4",
      labelBottom: "#f7e2d1",
      labelStroke: "#e4c4b0",
      soupPatternA: "rgba(255, 216, 144, 0.22)",
      soupPatternB: "rgba(255, 165, 110, 0.16)",
    },
    harbor: {
      frameOuterTop: "#204962",
      frameOuterBottom: "#10293a",
      frameInnerTop: "#2e6987",
      frameInnerBottom: "#173e52",
      stageTop: "#eef9ff",
      stageBottom: "#cfe7f2",
      orderTop: "#f3fbff",
      orderBottom: "#d9edf6",
      panelText: "#21455a",
      meterTrack: "#edf8fb",
      footerTop: "#f3fcff",
      footerBottom: "#cbe3ee",
      footerText: "#234657",
      orderIdle: "rgba(58, 96, 122, 0.2)",
      orderDone: "rgba(76, 166, 186, 0.94)",
      orderActive: "rgba(114, 205, 244, 0.96)",
      cardStroke: "#d3edf8",
      labelTop: "#fbfeff",
      labelBottom: "#e0eef5",
      labelStroke: "#acd4e5",
      soupPatternA: "rgba(213, 243, 255, 0.24)",
      soupPatternB: "rgba(116, 185, 215, 0.16)",
    },
    neon: {
      frameOuterTop: "#4d2c5f",
      frameOuterBottom: "#25162f",
      frameInnerTop: "#70448b",
      frameInnerBottom: "#3a234a",
      stageTop: "#f8f1ff",
      stageBottom: "#e6d7fb",
      orderTop: "#fbf4ff",
      orderBottom: "#ecdffc",
      panelText: "#4b2f5f",
      meterTrack: "#f4ecfb",
      footerTop: "#faf4ff",
      footerBottom: "#e1d3f7",
      footerText: "#472a5a",
      orderIdle: "rgba(96, 73, 121, 0.22)",
      orderDone: "rgba(208, 101, 160, 0.94)",
      orderActive: "rgba(255, 153, 105, 0.96)",
      cardStroke: "#f1e3ff",
      labelTop: "#fff9ff",
      labelBottom: "#f1e4ff",
      labelStroke: "#d1b9ea",
      soupPatternA: "rgba(255, 183, 203, 0.2)",
      soupPatternB: "rgba(167, 110, 255, 0.18)",
    },
    river: {
      frameOuterTop: "#2d5057",
      frameOuterBottom: "#162a2e",
      frameInnerTop: "#44747a",
      frameInnerBottom: "#213f43",
      stageTop: "#eff8f7",
      stageBottom: "#cee5df",
      orderTop: "#f4fbfa",
      orderBottom: "#d8ece7",
      panelText: "#294a4d",
      meterTrack: "#edf7f5",
      footerTop: "#f1fbfa",
      footerBottom: "#cce2de",
      footerText: "#284549",
      orderIdle: "rgba(71, 104, 103, 0.22)",
      orderDone: "rgba(102, 171, 133, 0.94)",
      orderActive: "rgba(132, 210, 180, 0.96)",
      cardStroke: "#d7ece7",
      labelTop: "#fcfefd",
      labelBottom: "#e0eeea",
      labelStroke: "#b5d2cb",
      soupPatternA: "rgba(204, 245, 228, 0.18)",
      soupPatternB: "rgba(117, 190, 170, 0.14)",
    },
    courtyard: {
      frameOuterTop: "#6a4b36",
      frameOuterBottom: "#3a2518",
      frameInnerTop: "#906746",
      frameInnerBottom: "#573821",
      stageTop: "#fbf3ea",
      stageBottom: "#ead9c7",
      orderTop: "#fff8ef",
      orderBottom: "#efe1d2",
      panelText: "#5c402d",
      meterTrack: "#f7efe6",
      footerTop: "#fcf4eb",
      footerBottom: "#e6d5c2",
      footerText: "#56402e",
      orderIdle: "rgba(118, 89, 71, 0.22)",
      orderDone: "rgba(173, 123, 80, 0.94)",
      orderActive: "rgba(243, 190, 114, 0.96)",
      cardStroke: "#efdfd0",
      labelTop: "#fffaf5",
      labelBottom: "#f0e4d8",
      labelStroke: "#d9c2ae",
      soupPatternA: "rgba(255, 229, 184, 0.18)",
      soupPatternB: "rgba(183, 136, 95, 0.14)",
    },
    alley: {
      frameOuterTop: "#64342a",
      frameOuterBottom: "#311712",
      frameInnerTop: "#865040",
      frameInnerBottom: "#4d261d",
      stageTop: "#fbf0ea",
      stageBottom: "#ead5cb",
      orderTop: "#fff7f1",
      orderBottom: "#f0dfd5",
      panelText: "#552e25",
      meterTrack: "#f8eee9",
      footerTop: "#fcf3ee",
      footerBottom: "#e7d1c7",
      footerText: "#543127",
      orderIdle: "rgba(116, 79, 69, 0.22)",
      orderDone: "rgba(181, 96, 86, 0.94)",
      orderActive: "rgba(239, 168, 114, 0.96)",
      cardStroke: "#efdcd4",
      labelTop: "#fff9f4",
      labelBottom: "#f1e0d8",
      labelStroke: "#ddc1b5",
      soupPatternA: "rgba(255, 212, 170, 0.18)",
      soupPatternB: "rgba(165, 105, 80, 0.14)",
    },
    arcade: {
      frameOuterTop: "#6f4a25",
      frameOuterBottom: "#3b2612",
      frameInnerTop: "#996737",
      frameInnerBottom: "#5d3d1f",
      stageTop: "#fff6e5",
      stageBottom: "#f1dfb4",
      orderTop: "#fff9ec",
      orderBottom: "#f2e5c7",
      panelText: "#5e3f1f",
      meterTrack: "#faf1dc",
      footerTop: "#fff8ea",
      footerBottom: "#ead8b4",
      footerText: "#5b4123",
      orderIdle: "rgba(124, 93, 53, 0.2)",
      orderDone: "rgba(192, 144, 66, 0.94)",
      orderActive: "rgba(245, 200, 100, 0.96)",
      cardStroke: "#f3e5be",
      labelTop: "#fffaf0",
      labelBottom: "#f5e7c5",
      labelStroke: "#dfca96",
      soupPatternA: "rgba(255, 231, 155, 0.2)",
      soupPatternB: "rgba(217, 168, 78, 0.14)",
    },
  };

  const style = styles[theme.scene] || styles.lanterns;
  return {
    ...style,
    accentSoft: rgbaFromHex(theme.accent, 0.18),
    accentLine: rgbaFromHex(theme.accent, 0.42),
    accentBold: rgbaFromHex(theme.accent, 0.68),
    orderStroke: rgbaFromHex(theme.accent, 0.24),
    frameGlow: rgbaFromHex(theme.accent, 0.28),
    stageText: shadeColor(theme.accent, -24),
    titleText: style.panelText,
  };
}

function drawSoupSurfaceDecor(theme, visuals) {
  ctx.save();
  roundedRect(ctx, 118, 320, 664, 904, 38);
  ctx.clip();

  if (theme.scene === "harbor") {
    ctx.strokeStyle = visuals.soupPatternA;
    ctx.lineWidth = 6;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.moveTo(136, 430 + i * 92);
      ctx.bezierCurveTo(240, 394 + i * 88, 388, 470 + i * 70, 526, 430 + i * 74);
      ctx.bezierCurveTo(616, 404 + i * 74, 702, 386 + i * 66, 784, 420 + i * 64);
      ctx.stroke();
    }
    ctx.strokeStyle = visuals.soupPatternB;
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(170, 376 + i * 162);
      ctx.lineTo(720, 346 + i * 158);
      ctx.stroke();
    }
  } else if (theme.scene === "neon") {
    ctx.strokeStyle = visuals.soupPatternB;
    ctx.lineWidth = 4;
    for (let i = -4; i < 8; i += 1) {
      ctx.beginPath();
      ctx.moveTo(140 + i * 86, 1218);
      ctx.lineTo(330 + i * 86, 320);
      ctx.stroke();
    }
    ctx.fillStyle = visuals.soupPatternA;
    [
      [192, 406, 124, 36],
      [588, 448, 148, 42],
      [244, 1022, 116, 34],
      [598, 938, 130, 40],
    ].forEach(([x, y, w, h]) => {
      roundedRect(ctx, x, y, w, h, h / 2);
      ctx.fill();
    });
  } else if (theme.scene === "river") {
    ctx.strokeStyle = visuals.soupPatternA;
    ctx.lineWidth = 5;
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(138, 404 + i * 108);
      ctx.bezierCurveTo(262, 452 + i * 26, 388, 358 + i * 22, 512, 402 + i * 18);
      ctx.bezierCurveTo(618, 438 + i * 18, 704, 370 + i * 24, 784, 406 + i * 18);
      ctx.stroke();
    }
    ctx.strokeStyle = visuals.soupPatternB;
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(182, 540 + i * 148);
      ctx.quadraticCurveTo(268, 452 + i * 146, 352, 540 + i * 148);
      ctx.quadraticCurveTo(438, 628 + i * 148, 526, 540 + i * 148);
      ctx.quadraticCurveTo(616, 456 + i * 148, 704, 540 + i * 148);
      ctx.stroke();
    }
  } else if (theme.scene === "courtyard") {
    ctx.strokeStyle = visuals.soupPatternB;
    ctx.lineWidth = 3;
    for (let x = 170; x <= 730; x += 86) {
      ctx.beginPath();
      ctx.moveTo(x, 336);
      ctx.lineTo(x, 1210);
      ctx.stroke();
    }
    for (let y = 360; y <= 1180; y += 96) {
      ctx.beginPath();
      ctx.moveTo(138, y);
      ctx.lineTo(768, y);
      ctx.stroke();
    }
    ctx.fillStyle = visuals.soupPatternA;
    for (let i = 0; i < 16; i += 1) {
      roundedRect(ctx, 152 + (i % 4) * 150, 386 + Math.floor(i / 4) * 188, 52, 28, 10);
      ctx.fill();
    }
  } else if (theme.scene === "alley") {
    ctx.fillStyle = visuals.soupPatternB;
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const offset = row % 2 === 0 ? 0 : 40;
        roundedRect(ctx, 146 + offset + col * 120, 366 + row * 112, 72, 34, 8);
        ctx.fill();
      }
    }
    ctx.strokeStyle = visuals.soupPatternA;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(152, 360);
    ctx.quadraticCurveTo(278, 308, 392, 358);
    ctx.quadraticCurveTo(510, 410, 628, 354);
    ctx.quadraticCurveTo(702, 320, 782, 360);
    ctx.stroke();
  } else if (theme.scene === "arcade") {
    ctx.strokeStyle = visuals.soupPatternB;
    ctx.lineWidth = 5;
    for (let i = 0; i < 4; i += 1) {
      roundedRect(ctx, 154 + i * 146, 374 + (i % 2) * 12, 116, 66, 30);
      ctx.stroke();
      roundedRect(ctx, 154 + i * 146, 922 + (i % 2) * 12, 116, 66, 30);
      ctx.stroke();
    }
    ctx.fillStyle = visuals.soupPatternA;
    for (let i = 0; i < 20; i += 1) {
      ctx.beginPath();
      ctx.arc(172 + (i % 5) * 140, 474 + Math.floor(i / 5) * 180, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = visuals.soupPatternA;
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.arc(168 + (i % 4) * 156, 400 + Math.floor(i / 4) * 246, 34 + (i % 3) * 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = visuals.soupPatternB;
    ctx.lineWidth = 4;
    [214, 450, 686].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 336);
      ctx.lineTo(x, 1210);
      ctx.stroke();
    });
  }

  ctx.restore();
}

function drawBackground() {
  const theme = state.theme;
  const visuals = getThemeSceneStyle(theme);
  const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
  gradient.addColorStop(0, theme.skyTop);
  gradient.addColorStop(0.42, shadeColor(theme.skyBottom, 8));
  gradient.addColorStop(1, shadeColor(theme.accent, -8));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.beginPath();
  ctx.arc(740, 140, 220, 0, Math.PI * 2);
  ctx.fill();
  drawCitySceneDecor(theme);

  const wobbleX = Math.sin(state.screenshotTick * 1.2) * 6 * state.shake;
  const wobbleY = Math.cos(state.screenshotTick * 1.3) * 6 * state.shake;
  ctx.save();
  ctx.translate(wobbleX, wobbleY);

  const outerGradient = ctx.createLinearGradient(0, 250, 0, 1290);
  outerGradient.addColorStop(0, visuals.frameOuterTop);
  outerGradient.addColorStop(1, visuals.frameOuterBottom);
  ctx.fillStyle = outerGradient;
  roundedRect(ctx, 70, 250, 760, 1040, 54);
  ctx.fill();
  ctx.strokeStyle = visuals.frameGlow;
  ctx.lineWidth = 8;
  roundedRect(ctx, 78, 258, 744, 1024, 50);
  ctx.stroke();

  const potGradient = ctx.createLinearGradient(0, 280, 0, 1240);
  potGradient.addColorStop(0, visuals.frameInnerTop);
  potGradient.addColorStop(1, visuals.frameInnerBottom);
  ctx.fillStyle = potGradient;
  roundedRect(ctx, 92, 280, 716, 984, 46);
  ctx.fill();
  ctx.strokeStyle = visuals.accentLine;
  ctx.lineWidth = 5;
  roundedRect(ctx, 100, 288, 700, 968, 42);
  ctx.stroke();

  const soup = ctx.createRadialGradient(450, 760, 180, 450, 760, 420);
  soup.addColorStop(0, theme.soupInner);
  soup.addColorStop(0.58, theme.soupMid);
  soup.addColorStop(1, theme.soupOuter);
  ctx.fillStyle = soup;
  roundedRect(ctx, 118, 320, 664, 904, 38);
  ctx.fill();
  drawSoupSurfaceDecor(theme, visuals);
  ctx.strokeStyle = rgbaFromHex(theme.soupInner, 0.34);
  ctx.lineWidth = 4;
  roundedRect(ctx, 126, 328, 648, 888, 34);
  ctx.stroke();

  for (let i = 0; i < 16; i += 1) {
    const glowX = 130 + ((i * 79) % 620);
    const glowY = 340 + ((i * 137) % 820);
    ctx.fillStyle = theme.glow;
    ctx.beginPath();
    ctx.arc(glowX, glowY, 40 + ((i * 17) % 50), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCitySceneDecor(theme) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (theme.scene === "lanterns") {
    [190, 450, 710].forEach((x, index) => {
      const drop = 34 + index * 6;
      ctx.strokeStyle = "rgba(91, 42, 29, 0.28)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, drop);
      ctx.stroke();

      ctx.fillStyle = index % 2 === 0 ? "rgba(214, 85, 54, 0.36)" : "rgba(245, 184, 83, 0.34)";
      roundedRect(ctx, x - 24, drop, 48, 58, 18);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 247, 233, 0.38)";
      roundedRect(ctx, x - 12, drop + 10, 24, 30, 10);
      ctx.fill();
    });
  } else if (theme.scene === "harbor") {
    ctx.strokeStyle = "rgba(255, 247, 235, 0.32)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(52, 172 + i * 22);
      ctx.bezierCurveTo(180, 142 + i * 18, 360, 210 + i * 12, 522, 184 + i * 10);
      ctx.bezierCurveTo(628, 168 + i * 10, 732, 136 + i * 6, 840, 166 + i * 6);
      ctx.stroke();
    }

    [[120, 70], [168, 50], [744, 84], [784, 60]].forEach(([x, y]) => {
      ctx.strokeStyle = "rgba(255, 249, 240, 0.44)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 8, y - 6, x + 18, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 18, y);
      ctx.quadraticCurveTo(x + 26, y - 6, x + 36, y);
      ctx.stroke();
    });
  } else if (theme.scene === "neon") {
    [
      [118, 62, 74, 22],
      [704, 138, 86, 24],
      [624, 70, 52, 18],
      [176, 146, 48, 16],
    ].forEach(([x, y, w, h], index) => {
      ctx.fillStyle = index % 2 === 0 ? "rgba(255, 236, 178, 0.22)" : "rgba(255, 182, 147, 0.22)";
      roundedRect(ctx, x, y, w, h, h / 2);
      ctx.fill();
      ctx.strokeStyle = index % 2 === 0 ? "rgba(255, 247, 219, 0.46)" : "rgba(255, 215, 196, 0.44)";
      ctx.lineWidth = 3;
      roundedRect(ctx, x, y, w, h, h / 2);
      ctx.stroke();
    });

    ctx.strokeStyle = "rgba(255, 247, 227, 0.28)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(98, 108);
    ctx.lineTo(138, 84);
    ctx.lineTo(122, 126);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(778, 102);
    ctx.lineTo(734, 120);
    ctx.lineTo(760, 82);
    ctx.stroke();
  } else if (theme.scene === "river") {
    ctx.strokeStyle = "rgba(255, 248, 235, 0.34)";
    ctx.lineWidth = 5;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(74 + i * 145, 212);
      ctx.quadraticCurveTo(118 + i * 145, 166, 164 + i * 145, 212);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(90, 172 + i * 18);
      ctx.bezierCurveTo(250, 194 + i * 8, 470, 152 + i * 10, 824, 182 + i * 8);
      ctx.stroke();
    }
  } else if (theme.scene === "courtyard") {
    ctx.fillStyle = "rgba(98, 57, 36, 0.24)";
    ctx.beginPath();
    ctx.moveTo(0, 82);
    ctx.lineTo(84, 42);
    ctx.lineTo(168, 82);
    ctx.lineTo(252, 42);
    ctx.lineTo(336, 82);
    ctx.lineTo(336, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    [612, 686, 760].forEach((x, index) => {
      ctx.fillStyle = index % 2 === 0 ? "rgba(255, 239, 208, 0.2)" : "rgba(205, 98, 67, 0.18)";
      roundedRect(ctx, x, 42 + index * 10, 44, 60, 10);
      ctx.fill();
    });
  } else if (theme.scene === "alley") {
    [
      [78, 58, 62, 24],
      [160, 84, 72, 26],
      [680, 54, 66, 24],
      [744, 90, 52, 22],
    ].forEach(([x, y, w, h], index) => {
      ctx.fillStyle = index % 2 === 0 ? "rgba(110, 56, 36, 0.24)" : "rgba(255, 240, 210, 0.18)";
      roundedRect(ctx, x, y, w, h, 10);
      ctx.fill();
    });

    ctx.strokeStyle = "rgba(255, 245, 224, 0.34)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(62, 34);
    ctx.quadraticCurveTo(176, 18, 286, 42);
    ctx.stroke();
    [104, 138, 172, 206, 240].forEach((x) => {
      ctx.fillStyle = "rgba(255, 233, 168, 0.42)";
      ctx.beginPath();
      ctx.arc(x, 36 + Math.sin(x) * 3, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (theme.scene === "arcade") {
    ctx.fillStyle = "rgba(255, 247, 230, 0.16)";
    for (let i = 0; i < 5; i += 1) {
      roundedRect(ctx, 54 + i * 146, 56 + (i % 2) * 12, 96, 72, 28);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255, 236, 196, 0.34)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(42, 130);
    ctx.lineTo(836, 130);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHeader() {
  const visuals = getThemeSceneStyle(state.theme);
  ctx.fillStyle = visuals.titleText;
  ctx.font = "800 52px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("Midnight Bites", 84, 92);

  ctx.font = "500 24px sans-serif";
  ctx.fillStyle = rgbaFromHex(state.theme.accent, 0.9);
  ctx.fillText(`${state.province} · ${state.theme.market}`, 86, 128);

  ctx.strokeStyle = visuals.accentLine;
  ctx.lineWidth = 4;
  if (state.theme.scene === "harbor" || state.theme.scene === "river") {
    ctx.beginPath();
    ctx.moveTo(86, 144);
    ctx.bezierCurveTo(158, 132, 236, 158, 308, 146);
    ctx.bezierCurveTo(378, 136, 446, 154, 520, 144);
    ctx.stroke();
  } else if (state.theme.scene === "neon") {
    ctx.beginPath();
    ctx.moveTo(86, 144);
    ctx.lineTo(138, 132);
    ctx.lineTo(178, 148);
    ctx.lineTo(236, 134);
    ctx.lineTo(294, 148);
    ctx.lineTo(342, 136);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(86, 144);
    ctx.lineTo(332, 144);
    ctx.stroke();
  }

  roundedRect(ctx, 612, 34, 212, 64, 28);
  const stageGradient = ctx.createLinearGradient(612, 34, 612, 98);
  stageGradient.addColorStop(0, visuals.stageTop);
  stageGradient.addColorStop(1, visuals.stageBottom);
  ctx.fillStyle = stageGradient;
  ctx.fill();
  ctx.strokeStyle = visuals.orderStroke;
  ctx.lineWidth = 3;
  roundedRect(ctx, 612, 34, 212, 64, 28);
  ctx.stroke();
  ctx.fillStyle = visuals.stageText;
  ctx.font = "700 16px sans-serif";
  ctx.fillText(getStageNumberLabel(), 636, 59);
  ctx.fillStyle = visuals.titleText;
  ctx.font = "700 24px sans-serif";
  ctx.fillText(STAGES[state.stageIndex]?.name || "Ready", 636, 84);

  roundedRect(ctx, 612, 104, 212, 42, 21);
  const hintGradient = ctx.createLinearGradient(612, 104, 612, 146);
  hintGradient.addColorStop(0, rgbaFromHex(state.theme.skyTop, 0.92));
  hintGradient.addColorStop(1, rgbaFromHex(state.theme.skyBottom, 0.84));
  ctx.fillStyle = hintGradient;
  ctx.fill();
  ctx.strokeStyle = visuals.orderStroke;
  ctx.lineWidth = 2;
  roundedRect(ctx, 612, 104, 212, 42, 21);
  ctx.stroke();
  ctx.fillStyle = visuals.stageText;
  ctx.font = "700 16px sans-serif";
  ctx.fillText(getStageHint(), 632, 129);

  drawMeter(84, 162, 314, 22, clamp(1 - state.panic / 100, 0, 1), "#6cb36d", visuals.meterTrack, "Focus");
  drawMeter(432, 162, 314, 22, currentOrderCompletion(), "#f4ae49", visuals.meterTrack, "Order");
}

function drawMeter(x, y, width, height, value, fill, background, label) {
  ctx.fillStyle = "rgba(60, 21, 10, 0.76)";
  ctx.font = "700 20px sans-serif";
  ctx.fillText(label, x, y - 12);
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.fillStyle = background;
  ctx.fill();
  roundedRect(ctx, x, y, width * clamp(value, 0, 1), height, height / 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function currentOrderCompletion() {
  const order = state.orders[state.orderIndex];
  if (!order) {
    return state.orders.length > 0 && state.orderIndex >= state.orders.length ? 1 : 0;
  }
  return state.orderStepIndex / order.steps.length;
}

function displayedOrderCounter() {
  if (!state.orders.length) {
    return 0;
  }
  return Math.min(state.orderIndex + 1, state.orders.length);
}

function drawBoard() {
  if (!state.board.length) {
    return;
  }

  const visuals = getThemeSceneStyle(state.theme);
  const order = state.orders[state.orderIndex];
  const expectedType = order ? order.steps[state.orderStepIndex] : null;

  const orderGradient = ctx.createLinearGradient(118, 214, 118, 294);
  orderGradient.addColorStop(0, visuals.orderTop);
  orderGradient.addColorStop(1, visuals.orderBottom);
  ctx.fillStyle = orderGradient;
  roundedRect(ctx, 118, 214, 664, 80, 30);
  ctx.fill();
  ctx.strokeStyle = visuals.orderStroke;
  ctx.lineWidth = 3;
  roundedRect(ctx, 118, 214, 664, 80, 30);
  ctx.stroke();
  ctx.fillStyle = visuals.titleText;
  ctx.font = "700 24px sans-serif";
  ctx.fillText(`Order ${displayedOrderCounter()}/${state.orders.length}`, 144, 264);
  if (order) {
    drawOrderSteps(order, expectedType, visuals);
  } else {
    ctx.fillStyle = shadeColor(state.theme.accent, 10);
    roundedRect(ctx, 324, 228, 174, 52, 20);
    ctx.fill();
    ctx.fillStyle = "#fff8f2";
    ctx.font = "700 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Stage Clear", 411, 261);
    ctx.textAlign = "start";
  }

  state.board.forEach((item, index) => {
    const type = getItem(item.type);
    const pulse = 1 + Math.sin(item.pulse) * 0.02;
    const glowAlpha = item.targetGlow * (0.65 + Math.sin(item.pulse * 1.4) * 0.12);
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.angle);
    ctx.scale(pulse, pulse);

    if (glowAlpha > 0) {
      ctx.fillStyle = rgbaFromHex(state.theme.accent, Math.min(0.36, glowAlpha * 0.5));
      roundedRect(ctx, -item.width * 0.58, -item.height * 0.58, item.width * 1.16, item.height * 1.16, 28);
      ctx.fill();
    }

    const gradient = ctx.createLinearGradient(0, -item.height / 2, 0, item.height / 2);
    gradient.addColorStop(0, shadeColor(type.fill, 18));
    gradient.addColorStop(1, shadeColor(type.fill, -12));
    ctx.fillStyle = gradient;
    roundedRect(ctx, -item.width / 2, -item.height / 2, item.width, item.height, 24);
    ctx.fill();

    ctx.strokeStyle = visuals.cardStroke;
    ctx.lineWidth = 3;
    roundedRect(ctx, -item.width / 2, -item.height / 2, item.width, item.height, 24);
    ctx.stroke();

    ctx.fillStyle = visuals.accentSoft;
    roundedRect(ctx, -item.width / 2 + 5, -item.height / 2 + 5, item.width - 10, item.height - 10, 20);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.22)";
    roundedRect(ctx, -item.width / 2 + 8, -item.height / 2 + 8, item.width * 0.56, item.height * 0.18, 14);
    ctx.fill();

    drawFoodIllustration(ctx, type, item.width, item.height, visuals);

    drawFoodLabel(ctx, type, index, item.height, visuals);
    ctx.restore();
  });

  ctx.textAlign = "start";
  ctx.fillStyle = rgbaFromHex(state.theme.skyTop, 0.94);
  ctx.font = "600 20px sans-serif";
  ctx.fillText("Tip: tap snacks in order. Cities change the whole menu and card set.", 126, 1268);
}

function drawFoodIllustration(context, item, width, height, visuals) {
  context.save();
  context.translate(0, -12);
  const unit = Math.min(width / 132, height / 102);
  context.scale(unit, unit);

  drawPlateBase(context, visuals);

  switch (item.art) {
    case "sausage":
      drawSkewerArt(context, item);
      break;
    case "ricecake":
      drawRicecakeArt(context, item);
      break;
    case "squid":
      drawSquidArt(context, item);
      break;
    case "tofu":
      drawTofuArt(context, item);
      break;
    case "wing":
      drawWingArt(context, item);
      break;
    case "corn":
      drawCornArt(context, item);
      break;
    case "chili":
      drawChiliArt(context, item);
      break;
    case "potato":
      drawPotatoArt(context, item);
      break;
    case "shrimp":
      drawShrimpArt(context, item);
      break;
    case "pancake":
      drawPancakeArt(context, item);
      break;
    case "drink":
      drawDrinkArt(context, item);
      break;
    case "dessert":
      drawDessertArt(context, item);
      break;
    default:
      break;
  }

  context.restore();
}

function drawPlateBase(context, visuals) {
  const plateShadow = context.createRadialGradient(0, 18, 8, 0, 18, 48);
  plateShadow.addColorStop(0, "rgba(122, 68, 33, 0.22)");
  plateShadow.addColorStop(1, "rgba(122, 68, 33, 0)");
  context.fillStyle = plateShadow;
  context.beginPath();
  context.ellipse(0, 20, 42, 16, 0, 0, Math.PI * 2);
  context.fill();

  const plate = context.createLinearGradient(0, -20, 0, 20);
  plate.addColorStop(0, visuals.labelTop);
  plate.addColorStop(1, visuals.labelBottom);
  context.fillStyle = plate;
  context.beginPath();
  context.ellipse(0, 10, 38, 15, 0, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = visuals.labelStroke;
  context.lineWidth = 3;
  context.beginPath();
  context.ellipse(0, 10, 38, 15, 0, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "rgba(255,255,255,0.45)";
  context.beginPath();
  context.ellipse(-10, 3, 16, 6, -0.1, 0, Math.PI * 2);
  context.fill();
}

function makeGradient(context, x0, y0, x1, y1, startColor, endColor) {
  const gradient = context.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}

function drawFoodLabel(context, item, index, height, visuals) {
  const labelGradient = context.createLinearGradient(0, height * 0.08, 0, height * 0.42);
  labelGradient.addColorStop(0, visuals.labelTop);
  labelGradient.addColorStop(1, visuals.labelBottom);
  context.fillStyle = labelGradient;
  roundedRect(context, -44, height * 0.08, 88, height * 0.34, 18);
  context.fill();

  context.strokeStyle = visuals.labelStroke;
  context.lineWidth = 2;
  roundedRect(context, -44, height * 0.08, 88, height * 0.34, 18);
  context.stroke();

  const lines = splitFoodLabel(item.label);
  context.fillStyle = item.accent;
  context.textAlign = "center";
  if (lines.length === 1) {
    const fontSize = item.label.length >= 4 ? 17 : 19;
    context.font = `700 ${fontSize}px sans-serif`;
    context.fillText(lines[0], 0, height * 0.27);
  } else {
    context.font = "700 14px sans-serif";
    context.fillText(lines[0], 0, height * 0.24);
    context.fillText(lines[1], 0, height * 0.37);
  }

  context.fillStyle = rgbaFromHex(item.accent, 0.66);
  context.font = "700 12px sans-serif";
  context.fillText(`#${index + 1}`, 0, height * 0.46);
}

function splitFoodLabel(label) {
  if (label.length <= 10) {
    return [label];
  }
  const words = label.split(" ");
  if (words.length > 1) {
    const lines = ["", ""];
    words.forEach((word) => {
      const target = lines[0].length <= lines[1].length ? 0 : 1;
      lines[target] = lines[target] ? lines[target] + " " + word : word;
    });
    return lines.filter(Boolean);
  }
  const mid = Math.ceil(label.length / 2);
  return [label.slice(0, mid), label.slice(mid)];
}

function drawSkewerArt(context, item) {
  context.strokeStyle = "#8a5933";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(-32, 20);
  context.lineTo(30, -18);
  context.stroke();
  for (let i = 0; i < 3; i += 1) {
    const x = -18 + i * 18;
    const y = 10 - i * 11;
    context.save();
    context.translate(x, y);
    context.rotate(-0.36);
    context.fillStyle = makeGradient(context, -10, -8, 10, 8, shadeColor(item.fill, 24), shadeColor(item.fill, -16));
    roundedRect(context, -12, -8, 24, 16, 8);
    context.fill();
    context.fillStyle = "rgba(255,255,255,0.18)";
    roundedRect(context, -9, -5, 12, 4, 2);
    context.fill();
    context.strokeStyle = "rgba(110, 42, 21, 0.35)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(-6, -5);
    context.lineTo(8, 5);
    context.moveTo(-1, -7);
    context.lineTo(12, 2);
    context.stroke();
    context.restore();
  }
}

function drawRicecakeArt(context, item) {
  [-18, 0, 18].forEach((x, index) => {
    context.save();
    context.translate(x, index % 2 === 0 ? 2 : -4);
    context.rotate(index === 1 ? -0.12 : 0.16);
    context.fillStyle = makeGradient(context, -10, -8, 10, 8, shadeColor(item.fill, 20), shadeColor(item.fill, -12));
    roundedRect(context, -13, -8, 26, 16, 8);
    context.fill();
    context.strokeStyle = "rgba(176, 112, 64, 0.28)";
    context.lineWidth = 1.2;
    roundedRect(context, -13, -8, 26, 16, 8);
    context.stroke();
    context.restore();
  });
  context.fillStyle = "#b5543c";
  for (let i = 0; i < 6; i += 1) {
    context.beginPath();
    context.arc(-20 + i * 8, -8 + (i % 2) * 5, 2.4, 0, Math.PI * 2);
    context.fill();
  }
  context.fillStyle = "rgba(255,255,255,0.18)";
  context.beginPath();
  context.arc(8, -8, 7, 0, Math.PI * 2);
  context.fill();
}

function drawSquidArt(context, item) {
  context.fillStyle = makeGradient(context, -12, -20, 14, 14, shadeColor(item.fill, 20), shadeColor(item.fill, -18));
  context.beginPath();
  context.moveTo(0, -20);
  context.quadraticCurveTo(20, -14, 18, 8);
  context.quadraticCurveTo(0, 18, -18, 8);
  context.quadraticCurveTo(-20, -14, 0, -20);
  context.fill();
  context.strokeStyle = item.accent;
  context.lineWidth = 4;
  [-10, -4, 4, 10].forEach((x) => {
    context.beginPath();
    context.moveTo(x, 8);
    context.quadraticCurveTo(x - 3, 18, x + 2, 24);
    context.stroke();
  });
  context.fillStyle = "rgba(92, 36, 31, 0.22)";
  [-8, 0, 8].forEach((x) => {
    context.beginPath();
    context.arc(x, -2 + (x % 3), 2.2, 0, Math.PI * 2);
    context.fill();
  });
}

function drawTofuArt(context, item) {
  context.fillStyle = makeGradient(context, -14, -12, 14, 16, "#fffaf2", shadeColor(item.fill, -6));
  roundedRect(context, -18, -14, 36, 28, 7);
  context.fill();
  context.fillStyle = makeGradient(context, -12, -12, 12, -1, "#e8c47b", "#c6843f");
  roundedRect(context, -16, -12, 32, 10, 5);
  context.fill();
  context.fillStyle = "#74a365";
  context.beginPath();
  context.arc(-6, -5, 3, 0, Math.PI * 2);
  context.arc(5, 2, 3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#fff5dd";
  context.beginPath();
  context.arc(8, -2, 1.8, 0, Math.PI * 2);
  context.arc(-2, 4, 1.6, 0, Math.PI * 2);
  context.fill();
}

function drawWingArt(context, item) {
  context.fillStyle = makeGradient(context, -20, -12, 22, 12, shadeColor(item.fill, 18), shadeColor(item.fill, -18));
  context.beginPath();
  context.ellipse(-8, 2, 17, 12, -0.4, 0, Math.PI * 2);
  context.ellipse(11, -4, 13, 10, 0.5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(255,255,255,0.24)";
  context.beginPath();
  context.ellipse(-10, -2, 7, 4, -0.5, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(102, 53, 23, 0.25)";
  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(-16, 2);
  context.lineTo(10, -4);
  context.moveTo(-10, 8);
  context.lineTo(12, 0);
  context.stroke();
}

function drawCornArt(context) {
  context.fillStyle = makeGradient(context, -14, -18, 14, 18, "#ffe36f", "#f0b52f");
  roundedRect(context, -14, -18, 28, 36, 14);
  context.fill();
  context.fillStyle = "#6aa55d";
  context.beginPath();
  context.moveTo(-6, 18);
  context.lineTo(-18, 0);
  context.lineTo(-4, 4);
  context.closePath();
  context.fill();
  context.beginPath();
  context.moveTo(6, 18);
  context.lineTo(18, 0);
  context.lineTo(4, 4);
  context.closePath();
  context.fill();
  context.fillStyle = "rgba(255, 245, 199, 0.42)";
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      context.beginPath();
      context.arc(-8 + col * 8, -10 + row * 8, 2.2, 0, Math.PI * 2);
      context.fill();
    }
  }
}

function drawChiliArt(context, item) {
  [-14, 6].forEach((x, index) => {
    context.save();
    context.translate(x, index === 0 ? -2 : 4);
    context.rotate(index === 0 ? -0.5 : 0.45);
    context.fillStyle = makeGradient(context, -10, -8, 10, 8, shadeColor(item.fill, 14), shadeColor(item.fill, -16));
    context.beginPath();
    context.moveTo(-8, -5);
    context.quadraticCurveTo(10, -10, 12, 4);
    context.quadraticCurveTo(2, 10, -7, 6);
    context.closePath();
    context.fill();
    context.restore();
  });
  context.strokeStyle = "#7cb36a";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(-22, -12);
  context.lineTo(-15, -5);
  context.moveTo(4, -4);
  context.lineTo(11, 0);
  context.stroke();
  context.fillStyle = "rgba(255,255,255,0.18)";
  context.beginPath();
  context.ellipse(-10, -6, 6, 2.4, -0.45, 0, Math.PI * 2);
  context.fill();
}

function drawPotatoArt(context, item) {
  [-14, 0, 14].forEach((x, index) => {
    context.save();
    context.translate(x, index % 2 === 0 ? 2 : -4);
    context.rotate(index === 1 ? -0.2 : 0.18);
    context.fillStyle = makeGradient(context, -8, -8, 8, 8, shadeColor(item.fill, 18), shadeColor(item.fill, -14));
    roundedRect(context, -10, -8, 20, 16, 6);
    context.fill();
    context.fillStyle = "rgba(152, 104, 44, 0.22)";
    context.beginPath();
    context.arc(-2, -1, 1.8, 0, Math.PI * 2);
    context.arc(3, 3, 1.6, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function drawShrimpArt(context, item) {
  context.strokeStyle = makeGradient(context, -18, -16, 18, 16, shadeColor(item.fill, 14), shadeColor(item.fill, -16));
  context.lineWidth = 11;
  context.beginPath();
  context.arc(0, 2, 18, 0.3 * Math.PI, 1.8 * Math.PI);
  context.stroke();
  context.strokeStyle = "rgba(153, 86, 74, 0.22)";
  context.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    context.beginPath();
    context.moveTo(-8 + i * 7, -8 + i * 2);
    context.lineTo(-4 + i * 7, 4 + i * 3);
    context.stroke();
  }
  context.fillStyle = item.accent;
  context.beginPath();
  context.arc(15, -6, 2.5, 0, Math.PI * 2);
  context.fill();
}

function drawPancakeArt(context, item) {
  context.fillStyle = makeGradient(context, -20, -10, 18, 12, shadeColor(item.fill, 16), shadeColor(item.fill, -14));
  roundedRect(context, -24, -10, 48, 24, 12);
  context.fill();
  context.fillStyle = shadeColor(item.fill, -18);
  context.beginPath();
  context.moveTo(-6, -8);
  context.lineTo(20, -2);
  context.lineTo(-2, 10);
  context.closePath();
  context.fill();
  context.fillStyle = "#7cb26b";
  context.beginPath();
  context.arc(-10, 2, 4, 0, Math.PI * 2);
  context.arc(-2, -2, 3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#d4633d";
  context.beginPath();
  context.arc(6, 2, 2.4, 0, Math.PI * 2);
  context.fill();
}

function drawDrinkArt(context, item) {
  context.fillStyle = makeGradient(context, -14, -18, 14, 18, shadeColor(item.fill, 12), shadeColor(item.fill, -18));
  roundedRect(context, -14, -18, 28, 36, 9);
  context.fill();
  context.strokeStyle = "#fff3e6";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(0, -24);
  context.lineTo(10, -34);
  context.stroke();
  context.fillStyle = "rgba(255,255,255,0.28)";
  roundedRect(context, -9, -12, 6, 22, 3);
  context.fill();
  context.fillStyle = "rgba(255,255,255,0.2)";
  context.beginPath();
  context.arc(6, -6, 5, 0, Math.PI * 2);
  context.arc(-3, 0, 4, 0, Math.PI * 2);
  context.fill();
}

function drawDessertArt(context, item) {
  context.fillStyle = makeGradient(context, -18, -12, 18, 14, shadeColor(item.fill, 12), shadeColor(item.fill, -16));
  context.beginPath();
  context.moveTo(-20, 10);
  context.quadraticCurveTo(-18, -12, 0, -12);
  context.quadraticCurveTo(18, -12, 20, 10);
  context.closePath();
  context.fill();
  context.fillStyle = "rgba(255,255,255,0.35)";
  context.beginPath();
  context.arc(-6, -2, 4, 0, Math.PI * 2);
  context.arc(6, -4, 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#d35b59";
  context.beginPath();
  context.arc(0, 2, 2.4, 0, Math.PI * 2);
  context.arc(8, 4, 2.1, 0, Math.PI * 2);
  context.fill();
}

function drawOrderSteps(order, expectedType, visuals) {
  const startX = 296;
  const stepWidth = 98;
  order.steps.forEach((typeId, index) => {
    const type = getItem(typeId);
    const x = startX + index * stepWidth;
    const done = index < state.orderStepIndex;
    const active = typeId === expectedType && index === state.orderStepIndex;
    ctx.save();
    ctx.translate(x, 254);
    roundedRect(ctx, -38, -28, 76, 46, 18);
    ctx.fillStyle = done
      ? visuals.orderDone
      : active
        ? visuals.orderActive
        : visuals.orderIdle;
    ctx.fill();
    ctx.strokeStyle = done || active ? rgbaFromHex(state.theme.accent, 0.28) : rgbaFromHex(state.theme.accent, 0.12);
    ctx.lineWidth = 2;
    roundedRect(ctx, -38, -28, 76, 46, 18);
    ctx.stroke();
    ctx.fillStyle = done ? "#fff7f2" : visuals.titleText;
    ctx.font = "700 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(type.short, 0, 4);
    ctx.restore();
  });
  ctx.textAlign = "start";
}

function drawEffects() {
  state.effects.forEach((effect) => {
    ctx.save();
    ctx.globalAlpha = clamp(effect.life, 0, 1);
    ctx.translate(effect.x, effect.y);
    ctx.scale(effect.scale, effect.scale);
    ctx.fillStyle = effect.color;
    ctx.font = "700 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(effect.text, 0, 0);
    ctx.restore();
  });
  ctx.textAlign = "start";
}

function drawFooter() {
  const visuals = getThemeSceneStyle(state.theme);
  const footerGradient = ctx.createLinearGradient(82, 1298, 82, 1352);
  footerGradient.addColorStop(0, visuals.footerTop);
  footerGradient.addColorStop(1, visuals.footerBottom);
  ctx.fillStyle = footerGradient;
  roundedRect(ctx, 82, 1298, 736, 54, 24);
  ctx.fill();
  ctx.strokeStyle = visuals.orderStroke;
  ctx.lineWidth = 2;
  roundedRect(ctx, 82, 1298, 736, 54, 24);
  ctx.stroke();
  ctx.fillStyle = visuals.footerText;
  ctx.font = "700 22px sans-serif";
  const summaryText =
    state.mode === "result" && state.summary
      ? state.summary.cleared
        ? `${state.province} cleared · Score ${state.summary.totalScore} · Best combo ${state.summary.bestCombo}`
        : `Score ${state.summary.totalScore} · Orders ${state.summary.ordersDone}/${state.summary.totalOrders}`
      : `Score ${Math.round(state.score)} · Combo ${state.combo} · City ${state.province}`;
  ctx.fillText(summaryText, 112, 1334);
}

function drawOverlay() {
  if (state.mode === "intermission") {
    drawScreenCard(
      "Warm-up Clear",
      [`Confirm to enter ${STAGES[1].name}.`, "Orders get longer, hints get softer, and pressure rises faster."],
      "Enter Rush Hour"
    );
    return;
  }

  if (state.mode === "revive") {
    drawScreenCard(
      "Pressure Is High",
      ["You have one cooler refill left.", "It lowers pressure once, but there are no more saves after that."],
      "Tap canvas or use Refill"
    );
    return;
  }

  if (state.mode === "paused") {
    drawScreenCard(
      "Paused",
      ["This run is paused.", "Tap the center button to resume, or use the top controls to restart, change city, or adjust sound."],
      "Resume Rush"
    );
    return;
  }

  if (state.mode === "result" && state.summary) {
    const resultTitle = state.summary.cleared ? "Run Cleared" : "Run Over";
    const detail = state.summary.cleared
      ? [`Score ${state.summary.totalScore}`, `Best combo ${state.summary.bestCombo}`, `${state.province} run cleared.`]
      : [
          `Score ${state.summary.totalScore}`,
          `Orders ${state.summary.ordersDone}/${state.summary.totalOrders}`,
          state.summary.nearMiss ? "Only a few orders left to clear the run." : "Reset the rhythm and try another run.",
        ];
    drawScreenCard(resultTitle, detail, "Tap Restart, or tap the canvas for a new run");
  }

  if (state.toastTimer > 0 && state.toast) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, state.toastTimer / 0.5);
    ctx.fillStyle = "rgba(45, 29, 23, 0.78)";
    roundedRect(ctx, 220, 1090, 460, 52, 24);
    ctx.fill();
    ctx.fillStyle = "#fff6ee";
    ctx.font = "700 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.toast, 450, 1123);
    ctx.restore();
    ctx.textAlign = "start";
  }
}

function drawScreenCard(title, lines, actionLabel) {
  ctx.fillStyle = "rgba(27, 14, 10, 0.42)";
  ctx.fillRect(0, 0, state.width, state.height);
  ctx.fillStyle = "rgba(255, 247, 238, 0.96)";
  roundedRect(ctx, 102, 380, 696, 440, 34);
  ctx.fill();

  ctx.fillStyle = "#5b2f18";
  ctx.font = "800 48px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(title, 146, 470);
  ctx.font = "500 24px sans-serif";

  lines.forEach((line, index) => {
    ctx.fillStyle = "rgba(62, 37, 27, 0.85)";
    ctx.fillText(line, 146, 550 + index * 50);
  });

  ctx.fillStyle = state.theme.accent;
  roundedRect(ctx, 146, 696, 610, 72, 24);
  ctx.fill();
  ctx.fillStyle = "#fff8f2";
  ctx.font = "700 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(actionLabel, 451, 741);
  ctx.textAlign = "start";
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function rgbaFromHex(color, alpha) {
  const normalized = color.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;
  const number = Number.parseInt(expanded, 16);
  const r = (number >> 16) & 0xff;
  const g = (number >> 8) & 0xff;
  const b = number & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadeColor(color, amount) {
  const value = color.replace("#", "");
  const number = Number.parseInt(value, 16);
  const r = clamp((number >> 16) + amount, 0, 255);
  const g = clamp(((number >> 8) & 0xff) + amount, 0, 255);
  const b = clamp((number & 0xff) + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

const renderGameToText = () => {
  const order = state.orders[state.orderIndex] || null;
  const layout = getGameplayLayout();
  const payload = {
    mode: state.mode,
    ui_mode: getUiMode(),
    viewport_mode: getViewportMode(),
    coordinate_system: {
      origin: "top-left",
      x_direction: "right",
      y_direction: "down",
      width: state.width,
      height: state.height,
    },
    stage: STAGES[state.stageIndex]?.name ?? null,
    stage_number: state.stageIndex + 1,
    stage_headline: getStageHeadline(),
    city: state.province,
    province: state.province,
    market: state.theme.market,
    theme_scene: state.theme.scene,
    theme_sound: state.theme.sound,
    board_layout: {
      columns: layout.columns,
      item_count: state.board.length,
    },
    score: Math.round(state.score),
    combo: state.combo,
    panic: Number(state.panic.toFixed(2)),
    audio: {
      initialized: Boolean(audioState.ctx),
      state: audioState.ctx?.state ?? "locked",
      drawer_open: state.audioDrawerOpen,
      preset: getAudioPresetName(),
      city_sound: state.theme.sound,
      ambience_scheduled: Number(audioState.ambienceScheduledUntil.toFixed(2)),
      music_scheduled: Number(audioState.musicScheduledUntil.toFixed(2)),
      mix: {
        music: Number(getChannelLevel("music").toFixed(2)),
        ambience: Number(getChannelLevel("ambience").toFixed(2)),
        sfx: Number(getChannelLevel("sfx").toFixed(2)),
      },
      muted: {
        music: isChannelMuted("music"),
        ambience: isChannelMuted("ambience"),
        sfx: isChannelMuted("sfx"),
      },
    },
    current_order: order
      ? {
          index: state.orderIndex + 1,
          total: state.orders.length,
          steps: order.steps.map((typeId, index) => {
            const item = getItem(typeId);
            return {
              type: typeId,
              label: item.label,
              done: index < state.orderStepIndex,
              active: index === state.orderStepIndex,
            };
          }),
        }
      : null,
    board_items: state.board.map((item) => {
      const definition = getItem(item.type);
      return {
        id: item.id,
        type: item.type,
        label: definition.label,
        art: definition.art,
        x: Number(item.x.toFixed(1)),
        y: Number(item.y.toFixed(1)),
        width: Number(item.width.toFixed(1)),
        height: Number(item.height.toFixed(1)),
        highlighted: item.targetGlow > 0,
      };
    }),
    summary: state.summary,
    awaiting_stage_confirm: state.mode === "intermission",
  };
  return JSON.stringify(payload);
};

const advanceGameTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  const delta = ms / 1000 / steps;
  for (let i = 0; i < steps; i += 1) {
    update(delta);
  }
  render();
};

if (new URLSearchParams(window.location.search).get("debug") === "1") {
  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceGameTime;
}
