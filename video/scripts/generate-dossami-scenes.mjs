/**
 * Calls Gemini Flash to generate per-sentence SVG scene descriptors.
 * Reads DOSSAMI_SCRIPT from env, writes public/dossami-scenes.json.
 *
 * Each scene: { sentence, elements[] }
 * Elements are simple geometric specs interpreted by DossamiVideo's SVG renderer.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "..", "public", "dossami-scenes.json");

const GEMINI_MODEL = "gemini-2.0-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── Split script into sentences (mirrors DossamiVideo.tsx splitScript) ────────
function splitScript(script) {
  return script
    .split(/\n\n+/)
    .flatMap((p) => p.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Gemini structured output schema ──────────────────────────────────────────
const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    required: ["sentence", "elements"],
    properties: {
      sentence: { type: "STRING" },
      elements: {
        type: "ARRAY",
        minItems: 1,
        maxItems: 5,
        items: {
          type: "OBJECT",
          required: ["type", "animation", "delay"],
          properties: {
            type: {
              type: "STRING",
              enum: ["circle","ellipse","line","rect","triangle","arc","stick_figure","arrow","wave","dots","star"],
            },
            animation: {
              type: "STRING",
              enum: ["draw_in","spring_in","fade_in","translate_in","pulse","rotate_continuous","float_up","oscillate_x"],
            },
            delay: { type: "INTEGER", minimum: 0, maximum: 50 },
            // circle / ellipse / arc / star
            cx: { type: "NUMBER" },
            cy: { type: "NUMBER" },
            r:  { type: "NUMBER" },
            rx: { type: "NUMBER" },
            ry: { type: "NUMBER" },
            // arc angles (degrees, 0 = right, 90 = down)
            startAngle: { type: "NUMBER" },
            endAngle:   { type: "NUMBER" },
            // line / arrow
            x1: { type: "NUMBER" },
            y1: { type: "NUMBER" },
            x2: { type: "NUMBER" },
            y2: { type: "NUMBER" },
            // rect
            x: { type: "NUMBER" },
            y: { type: "NUMBER" },
            w: { type: "NUMBER" },
            h: { type: "NUMBER" },
            // triangle
            size:     { type: "NUMBER" },
            pointing: { type: "STRING", enum: ["up","down","left","right"] },
            // wave
            width:     { type: "NUMBER" },
            amplitude: { type: "NUMBER" },
            frequency: { type: "NUMBER" },
            // stick_figure
            scale: { type: "NUMBER" },
            // star
            points: { type: "INTEGER" },
            // dots
            dotPoints: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  x: { type: "NUMBER" },
                  y: { type: "NUMBER" },
                  r: { type: "NUMBER" },
                },
              },
            },
            // translate_in source position
            from_x: { type: "NUMBER" },
            from_y: { type: "NUMBER" },
            // animation speed multiplier
            speed: { type: "NUMBER" },
          },
        },
      },
    },
  },
};

const SYSTEM_PROMPT = `You are a motion graphics director for short-form social media videos.
Style: @PartoMotion minimalist — pure black background, white SVG illustrations, no color.
SVG viewport: 540×540. Center of canvas: cx=270, cy=270. Coordinate origin: top-left.

For each sentence you receive, design 1–5 SVG elements that VISUALLY EXPLAIN what the sentence means.
The viewer must understand the concept with sound off.

RULES:
- Every element must help explain the idea. No decorative filler.
- Use stick_figure for human characters (set cx, cy, scale).
- Use circles, arcs, lines, triangles for abstract concepts.
- Keep everything within the 540×540 viewport (0–540 for x and y).
- Place main subjects near the center (cx≈270, cy≈200–300).
- Use staggered delays (0, 8, 16, 24…) so elements animate in sequence.
- Choose animations that reinforce meaning:
    draw_in   → something being created, drawn, appearing
    spring_in → something popping into existence, surprise
    fade_in   → gentle appearance, subtle concept
    translate_in → something moving into frame (set from_x/from_y)
    pulse     → something alive, breathing, ongoing
    rotate_continuous → spinning, cycling, recurring
    float_up  → rising, improving, ascending
    oscillate_x → swinging, back-and-forth, pendulum

EXAMPLES:
- "your brain replays embarrassing moments"
  → circle(brain outline) draw_in + arc(loop arrow) rotate_continuous
- "humans are wired for connection"
  → stick_figure(left, cx=160) translate_in from_x=50 + stick_figure(right, cx=380) + line(connecting them) draw_in
- "a single smile can change your day"
  → arc(smile shape, half-circle) draw_in + circle(face) spring_in delay=0
- "most people are too busy thinking about themselves"
  → stick_figure(cx=140) + dots(thought bubble above it) fade_in + stick_figure(cx=270) + dots + stick_figure(cx=400) + dots
- "the ocean is vast and ancient"
  → wave(cx=270 cy=300 width=400 amplitude=30 frequency=2) pulse + wave(cx=270 cy=340 width=380 amplitude=20 frequency=2) float_up delay=8`;

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not set");
    process.exit(1);
  }

  const script = process.env.DOSSAMI_SCRIPT;
  if (!script?.trim()) {
    console.error("❌ DOSSAMI_SCRIPT not set");
    process.exit(1);
  }

  const sentences = splitScript(script);
  console.log(`🎨 Generating scenes for ${sentences.length} sentences via Gemini Flash…`);

  const userPrompt = `Generate motion graphics scene descriptions for each of these sentences:\n\n${
    sentences.map((s, i) => `${i + 1}. ${s}`).join("\n")
  }\n\nReturn one scene object per sentence in the same order.`;

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7,
    },
  };

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Gemini API error ${res.status}: ${err}`);
    process.exit(1);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("❌ Unexpected Gemini response shape:", JSON.stringify(data).slice(0, 500));
    process.exit(1);
  }

  let scenes;
  try {
    scenes = JSON.parse(text);
  } catch (e) {
    console.error("❌ Failed to parse Gemini JSON:", e.message);
    console.error("Raw:", text.slice(0, 500));
    process.exit(1);
  }

  // Ensure we have one scene per sentence (fill any missing with a fallback)
  const filled = sentences.map((sentence, i) => {
    const s = scenes[i];
    if (s?.elements?.length) return { sentence: s.sentence ?? sentence, elements: s.elements };
    return { sentence, elements: [{ type: "circle", cx: 270, cy: 220, r: 80, animation: "spring_in", delay: 0 }] };
  });

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(filled, null, 2));
  console.log(`✅ Wrote ${filled.length} scenes → ${OUT_FILE}`);
  filled.forEach((s, i) =>
    console.log(`  ${i + 1}. "${s.sentence.slice(0, 50)}…" → ${s.elements.length} elements`)
  );
}

run().catch((e) => { console.error(e); process.exit(1); });
