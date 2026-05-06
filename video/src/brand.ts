// Dupli brand tokens — sourced from app's styles.css design system

export const COLORS = {
  // Backgrounds
  cream: "#F7F3ED",       // oklch(0.972 0.005 90) — warm paper
  creamDark: "#EDE8DF",   // oklch(0.93 0.006 80) — warm border/secondary

  // Ink / foreground
  ink: "#1C1A22",         // oklch(0.18 0.005 270) — near-black
  inkDeep: "#141316",     // oklch(0.16 0 0) — deep ink black

  // Accents
  white: "#FFFFFF",
  offWhite: "#FAF8F5",

  // Semantic
  success: "#3A9E72",     // oklch(0.55 0.13 155) — green
  warning: "#D4960A",     // oklch(0.72 0.16 70) — amber
  danger: "#C04020",      // oklch(0.55 0.21 27) — red

  // Gradient stops
  gradientTop: "#1C1A22",
  gradientBottom: "#2E2A3A",
};

// Fonts — loaded via @remotion/google-fonts
export const FONTS = {
  display: "'Outfit', sans-serif",
  body: "'Figtree', sans-serif",
};

// Video dimensions — TikTok / Reels vertical 9:16
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

// Scene durations in frames
export const SCENES = {
  hook: 120,          // 4s  — "Snap any product. Find the dupe."
  intro: 90,          // 3s  — Dupli logo + wordmark reveal
  scan: 180,          // 6s  — phone mockup + scanning animation
  results: 150,       // 5s  — dupe card reveal + savings
  features: 150,      // 5s  — ingredient match + verdict callouts
  cta: 150,           // 5s  — download CTA
};

export const TRANSITION_FRAMES = 20;

export const TOTAL_FRAMES =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  (Object.keys(SCENES).length - 1) * TRANSITION_FRAMES;
