// Psychology video design tokens

export const P = {
  // Background
  bg: "#F9F8F5",
  bgCard: "#FFFFFF",
  bgDark: "#111111",

  // Text
  text: "#111111",
  textSub: "#666666",
  textMuted: "#AAAAAA",

  // Accents
  purple: "#6C5EF7",
  purpleLight: "#EEECfe",
  green: "#3EBF7E",
  greenLight: "#E6F7EF",
  red: "#E85D4A",
  redLight: "#FDECEA",
  gold: "#F0B429",
  goldLight: "#FEF7E0",

  // Typography
  fontDisplay: "'Outfit', sans-serif",
  fontBody: "'Figtree', sans-serif",
};

// Scene durations (frames at 30fps)
export const PSYCH_SCENES = {
  hook: 90,            // 3s
  priceAnchoring: 210, // 7s
  lossAversion: 240,   // 8s
  smartShopper: 240,   // 8s
  reward: 180,         // 6s
  brand: 210,          // 7s
};

export const PSYCH_TRANSITION = 12;

export const PSYCH_TOTAL =
  Object.values(PSYCH_SCENES).reduce((a, b) => a + b, 0) -
  (Object.keys(PSYCH_SCENES).length - 1) * PSYCH_TRANSITION;
