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
  cardBg: "#F5F0E8",
  stroke: 3,
};

export const HAUL_FPS = 30;
export const HAUL_WIDTH = 1080;
export const HAUL_HEIGHT = 1920;

// Scene durations in frames at 30fps
export const HAUL_SCENES = {
  hook: 90,          // 3s
  product1: 270,     // 9s
  product2: 240,     // 8s
  dupliSpot: 330,    // 11s
  product3: 210,     // 7s
  quickFinds: 210,   // 7s
  cta: 210,          // 7s
};

export const HAUL_TOTAL = Object.values(HAUL_SCENES).reduce((a, b) => a + b, 0);

// Voiceover script for ElevenLabs
export const HAUL_VOICEOVER = `
Okay I literally just walked into Dollar Tree and I am on a mission today.
They got a whole new shipment and I'm looking for dupes.
First thing I see — these tumblers. A dollar. A DOLLAR.
I paid forty-five for my Stanley. Let me check Dupli real quick.
Okay Dupli says this compares to the Hydrapeak at thirty-five dollars.
Same insulation, same size. For one dollar. I'm getting five.
Next — vitamin C serum. I've seen this exact formula at Sephora for twenty-eight dollars.
Dupli confirmed it. One dollar versus twenty-eight. Done.
This is why I can't leave Dollar Tree without spending forty dollars.
I've been using Dupli on every single shopping trip.
You just snap any product and it finds you cheaper versions instantly.
Found me like two hundred dollars in savings just this week.
Look at this haul — cable organizers, sheet masks, storage jars, candles.
All duped. All a dollar.
Dupli is free. Link in bio. You are so welcome.
`.trim();
