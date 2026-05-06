export const H = {
  bg: "#FFFDF7",
  ink: "#1A1A1A",
  inkLight: "#555555",
  green: "#16A34A",
  greenLight: "#DCFCE7",
  orange: "#EA580C",
  orangeLight: "#FFF7ED",
  dupliPurple: "#6366F1",
  dupliLight: "#EEF2FF",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.52)",
};

export const HAUL_FPS = 30;
export const HAUL_WIDTH = 1080;
export const HAUL_HEIGHT = 1920;

// Scene durations (frames @ 30fps)
// Total: ~57s — fits comfortably in a 60s Reel
export const HAUL_SCENES = {
  hook: 75,       // 2.5s
  product1: 270,  // 9s  — tumbler
  product2: 240,  // 8s  — serum
  product3: 225,  // 7.5s — body wash
  product4: 210,  // 7s  — deodorant
  savings: 150,   // 5s  — total savings card
  cta: 240,       // 8s  — dupli outro
};

// Transition length (frames)
export const T = 10;

export const HAUL_TOTAL = Object.values(HAUL_SCENES).reduce((a, b) => a + b, 0);

// ── Product data ──────────────────────────────────────────────────────────────
export interface Product {
  dtName: string;
  dtPrice: string;
  dtImg: string;       // staticFile path
  brandName: string;
  brandPrice: string;
  brandImg: string;    // staticFile path
  saving: string;
  reaction: string;
}

export const PRODUCTS: Product[] = [
  {
    dtName: "Aquaflow Tumbler 40oz",
    dtPrice: "$5",
    dtImg: "haul/dt-tumbler.jpg",
    brandName: "Stanley Quencher",
    brandPrice: "$45",
    brandImg: "haul/brand-stanley.jpg",
    saving: "$40",
    reaction: "SAME TUMBLER??",
  },
  {
    dtName: "B Pure Vitamin C Serum",
    dtPrice: "$1.25",
    dtImg: "haul/dt-serum.jpg",
    brandName: "Drunk Elephant C-Firma",
    brandPrice: "$68",
    brandImg: "haul/brand-serum.jpg",
    saving: "$67",
    reaction: "NO WAY 😭",
  },
  {
    dtName: "Eve St. Claire Body Wash",
    dtPrice: "$1.25",
    dtImg: "haul/dt-bodywash.jpg",
    brandName: "Sol de Janeiro Bum Bum",
    brandPrice: "$39",
    brandImg: "haul/brand-soldejan.jpg",
    saving: "$38",
    reaction: "SAME SMELL 💀",
  },
  {
    dtName: "BPure Aluminum-Free Deodorant",
    dtPrice: "$1.25",
    dtImg: "haul/dt-deodorant.jpg",
    brandName: "Native Deodorant",
    brandPrice: "$13",
    brandImg: "haul/brand-native.jpg",
    saving: "$12",
    reaction: "IT EVEN SAYS IT",
  },
];

// Voiceover script (ElevenLabs — Elli voice)
// Timing notes match scene durations above
export const HAUL_VOICEOVER = `
Okay I'm at Dollar Tree and Dupli just found me four dupes I actually can't believe.

First — this Aquaflow tumbler. Forty ounces. Same size as the Stanley Quencher.
Five dollars versus forty-five. Dupli brought us here.

Second — B Pure Vitamin C serum capsules. Dupli matched these to Drunk Elephant C-Firma.
One twenty-five versus sixty-eight dollars. Identical ingredients.

Third — Eve St. Claire body wash. Dupli flagged this as a Sol de Janeiro Bum Bum dupe.
I literally smell it right now. One twenty-five versus thirty-nine dollars.

Fourth — BPure aluminum-free deodorant. It literally says compare to Native on the bottle.
One twenty-five versus thirteen dollars.

Total savings today — one hundred and fifty-seven dollars.
For less than ten bucks.

Dupli is the app that finds you these. It's free. Link in bio.
`.trim();
