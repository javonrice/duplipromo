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

const GEMINI_MODEL = "gemini-2.5-flash";
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

const SYSTEM_PROMPT = `You are a world-class motion graphics director for viral short-form social media videos.
Style: @PartoMotion minimalist — pure black background, white SVG illustrations only, zero color.
SVG viewport: 540×540 pixels. Origin: top-left. Center: cx=270, cy=270.

MISSION: For every sentence, design 1–5 SVG elements that make the viewer INSTANTLY UNDERSTAND the concept — even with the sound completely off. Each element must carry semantic weight. Nothing decorative. Nothing generic.

═══════════════════════════════════════════
SEMANTIC VOCABULARY — how to visualize concepts
═══════════════════════════════════════════

HUMAN / SOCIAL:
  single person           → stick_figure cx=270 cy=220 scale=1.2
  two people meeting      → stick_figure cx=160 + stick_figure cx=380, both translate_in toward center
  person thinking         → stick_figure + dots above head (cy = figure cy - 80)
  person growing/rising   → stick_figure float_up
  crowd / many people     → 3 stick_figures side by side cx=140,270,400 scale=0.8
  person isolated         → stick_figure cx=270 + large circle around them (loneliness barrier)
  person overwhelmed      → stick_figure + multiple arrows pointing inward toward them
  person leaving          → stick_figure translate_in from_x=600 (entering from right = leaving the old)

MIND / BRAIN / PSYCHOLOGY:
  brain / thinking        → circle cx=270 cy=200 r=90 draw_in (brain outline) + arc inside rotating
  thought / idea          → circle spring_in (small, above head position cy=120)
  memory / replay         → arc (loop arrow shape) rotate_continuous + circle fade_in
  focus / attention       → circle cx=270 cy=220 r=30 pulse + larger circle r=90 draw_in (target rings)
  anxiety / stress        → oscillate_x on stick_figure + dots scattered around
  calm / peace            → wave low amplitude cx=270 cy=270 width=400 amplitude=10 pulse
  decision               → line from cx=270 splitting into two arrows (line + two angled lines)
  belief / mindset        → triangle pointing up spring_in (solid conviction)

MONEY / WEALTH / SCARCITY:
  money growing           → triangle pointing up draw_in (growth chart) + dots float_up
  money shrinking         → triangle pointing down draw_in
  abundance              → multiple circles of increasing size spring_in staggered delays
  scarcity               → single small circle cx=270 cy=220 r=20 pulse (isolated, tiny)
  spending / losing money → dots translate_in from center outward (scatter)
  saving / accumulating   → dots translate_in into center (converge)
  debt / burden           → rect below stick_figure, large, translate_in from bottom
  wealth gap             → two stick_figures: one cx=150 scale=0.6, one cx=400 scale=1.5

TIME / CYCLES / CHANGE:
  time passing            → arc rotate_continuous (clock sweep)
  cycle / loop            → arc (near-full circle) rotate_continuous
  beginning / start       → line draw_in from left + dot spring_in at right end
  end / finish            → line draw_in toward a wall (rect)
  fast / speed            → arrow translate_in from_x=0 fast speed=2
  slow / patience         → wave low-frequency oscillate_x
  morning / sunrise       → arc (half circle bottom) draw_in + lines radiating draw_in delayed
  night / darkness        → circle cx=270 cy=200 r=70 draw_in (moon crescent via two arcs)

NATURE / PHYSICAL WORLD:
  ocean / water           → wave cy=280 width=480 amplitude=35 frequency=2 pulse + wave cy=320 amplitude=20 delay=8 float_up
  mountain / obstacle     → triangle pointing up cx=270 cy=300 size=200 draw_in
  fire / energy           → multiple arcs oscillate_x rapid staggered
  wind / invisible force  → wave high-frequency width=400 oscillate_x
  earth / ground          → line y1=400 y2=400 x1=60 x2=480 draw_in (horizon)
  rain / falling          → dots translate_in from_y=0 (many small dots falling)
  growth / plant          → line draw_in upward from cy=400 to cy=150 + small arcs branching

RELATIONSHIPS / CONNECTION:
  connection / bond       → line draw_in between two stick_figures
  disconnection / break   → line that appears broken (two short line segments with gap)
  attraction             → two circles translate_in toward each other
  conflict               → two arrows pointing at each other from opposite sides
  cooperation            → two stick_figures cx=160,380 + line connecting them + arrow float_up together
  love / intimacy        → two circles overlapping (cx=230 and cx=310, r=70 each) draw_in
  loneliness             → single stick_figure cx=270 + large empty circle around them r=140

SUCCESS / FAILURE / EFFORT:
  success / winning       → star cx=270 cy=180 r=60 spring_in
  failure / falling       → stick_figure translate_in from_y=-100 to rest position
  effort / struggle       → stick_figure oscillate_x + rect (heavy block) nearby
  achievement / goal      → stick_figure float_up + star above them spring_in
  barrier / wall          → rect x=200 y=100 w=20 h=300 draw_in (wall blocking path)
  breakthrough            → rect (wall) draw_in then stick_figure translate_in through it

COMMUNICATION / INFORMATION:
  speaking / voice        → arc (mouth shape) draw_in + wave radiating outward
  listening              → arc (ear curve) draw_in + dots coming in toward it
  message / signal        → dots translate_in in a line (like morse code)
  knowledge spreading     → circle spring_in center + lines radiating to smaller circles draw_in
  secret / hidden        → circle cx=270 cy=220 r=60 fade_in very slow
  confusion              → multiple arcs pointing different directions oscillate_x

SEX / INTIMACY / DESIRE:
  desire / attraction     → two stick_figures translate_in toward each other
  intimacy / closeness    → two stick_figures very close cx=220,320 + overlapping circles behind them
  tension / chemistry     → two dots oscillate_x toward each other with line between them pulse
  pleasure / sensation    → wave high-amplitude oscillate_x + star spring_in
  body / physical         → ellipse (body form) cx=270 cy=240 rx=55 ry=90 draw_in

═══════════════════════════════════════════
ANIMATION MEANINGS — always choose the right one
═══════════════════════════════════════════
  draw_in            → being created, revealed, drawn by hand — for shapes appearing gradually
  spring_in          → sudden existence, pop, surprise, realization
  fade_in            → subtle, gentle, slow realization, barely-there concept
  translate_in       → movement, arrival, departure, journey — set from_x or from_y
  pulse              → alive, ongoing, heartbeat, breathing, present
  rotate_continuous  → cycling, looping, recurring, spinning — for circles/arcs
  float_up           → rising, improving, ascending, hope, growth
  oscillate_x        → vibration, indecision, tension, shaking, conflict

═══════════════════════════════════════════
LAYOUT RULES
═══════════════════════════════════════════
- Main subject: cx≈270, cy≈180–260 (upper-center)
- Supporting elements: spread out, avoid overlap unless intentional
- Stagger delays: 0, 8, 16, 24, 32 (so viewer reads left-to-right or subject-to-context)
- Keep all coordinates: x,y,cx,cy within 30–510 range (30px margin each side)
- For stick_figures: scale=1.0 is default; use 0.7 for small/distant, 1.4 for emphasis
- For waves: cy between 250–350, width=400–480, amplitude=15–50, frequency=1–3
- For arcs: use startAngle/endAngle to control shape (0=right, 90=down, 180=left, 270=up)

═══════════════════════════════════════════
30 WORKED EXAMPLES
═══════════════════════════════════════════

"your brain never stops working"
→ circle cx=270 cy=200 r=85 draw_in delay=0 (brain)
→ arc cx=270 cy=200 r=60 startAngle=0 endAngle=300 rotate_continuous delay=8 (activity loop)

"most people are afraid of being alone"
→ stick_figure cx=270 cy=220 scale=1.1 spring_in delay=0
→ circle cx=270 cy=220 r=130 draw_in delay=12 (isolation ring)

"money flows to those who understand it"
→ dots dotPoints=[{x:80,y:200,r:6},{x:160,y:240,r:6},{x:240,y=220,r:6}] translate_in from_x=-100 delay=0
→ circle cx=380 cy=220 r=50 pulse delay=16 (attractor/magnet)

"silence is louder than words"
→ stick_figure cx=200 cy=220 scale=1.0 fade_in delay=0
→ arc cx=200 cy=180 r=50 startAngle=210 endAngle=330 draw_in delay=8 (open mouth, speech)
→ rect x=230 y=170 w=80 h=6 fade_in delay=16 (flat line — silence)

"attraction is about energy, not looks"
→ circle cx=180 cy=220 r=45 pulse delay=0 (energy field 1)
→ circle cx=360 cy=220 r=45 pulse delay=4 (energy field 2)
→ line x1=225 y1=220 x2=315 y2=220 draw_in delay=16 (pull between them)

"the ocean has no memory"
→ wave cx=270 cy=260 width=460 amplitude=40 frequency=2 pulse delay=0
→ wave cx=270 cy=310 width=420 amplitude=25 frequency=2 float_up delay=8
→ wave cx=270 cy=350 width=380 amplitude=15 frequency=3 oscillate_x delay=16

"sex is a language two bodies speak without words"
→ stick_figure cx=200 cy=230 scale=1.0 translate_in from_x=50 delay=0
→ stick_figure cx=340 cy=230 scale=1.0 translate_in from_x=490 delay=0
→ wave cx=270 cy=290 width=200 amplitude=25 frequency=3 oscillate_x delay=20

"your childhood shapes every relationship you have"
→ circle cx=270 cy=200 r=30 spring_in delay=0 (child — small)
→ circle cx=270 cy=200 r=90 draw_in delay=10 (expanding influence ring)
→ stick_figure cx=150 cy=300 scale=0.8 fade_in delay=20
→ stick_figure cx=390 cy=300 scale=0.8 fade_in delay=28

"confidence is a skill, not a trait"
→ stick_figure cx=270 cy=260 scale=0.7 fade_in delay=0 (small, uncertain)
→ stick_figure cx=270 cy=220 scale=1.3 float_up delay=12 (growing larger)

"scarcity makes everything feel urgent"
→ circle cx=270 cy=220 r=80 draw_in delay=0
→ circle cx=270 cy=220 r=30 pulse delay=10 (shrinking inward to small)
→ arrow x1=270 y1=100 x2=270 y2=180 translate_in from_y=-80 delay=16 (pointing down fast)

"your thoughts become your reality"
→ dots dotPoints=[{x:200,y:130,r:5},{x:240,y:110,r:5},{x=280,y:120,r:5}] fade_in delay=0 (thoughts)
→ rect x=160 y=220 w=220 h=140 draw_in delay=14 (solid reality box materializing)

"habits run on autopilot"
→ stick_figure cx=270 cy=220 scale=1.0 translate_in from_x=-100 delay=0
→ arc cx=270 cy=320 r=70 startAngle=0 endAngle=350 rotate_continuous delay=8 (loop)

"rejection is redirection"
→ arrow x1=100 y1=220 x2=240 y2=220 draw_in delay=0
→ rect x=250 y=170 w=10 h=100 draw_in delay=10 (wall blocking)
→ arrow x1=270 y1=220 x2=380 y2=130 draw_in delay=20 (new direction upward)

"loneliness is an epidemic"
→ stick_figure cx=120 cy=230 scale=0.8 fade_in delay=0
→ stick_figure cx=270 cy=230 scale=0.8 fade_in delay=6
→ stick_figure cx=420 cy=230 scale=0.8 fade_in delay=12
→ circle cx=120 cy=230 r=70 draw_in delay=20
→ circle cx=270 cy=230 r=70 draw_in delay=26

"the body keeps the score"
→ ellipse cx=270 cy=240 rx=55 ry=90 draw_in delay=0 (body form)
→ dots dotPoints=[{x:270,y:170,r:7},{x:230,y:240,r:6},{x=310,y:280,r:5}] spring_in delay=16 (pain points)

"money is just stored energy"
→ wave cx=270 cy=240 width=300 amplitude=30 frequency=3 oscillate_x delay=0
→ circle cx=420 cy=240 r=40 pulse delay=16 (storage vessel)
→ line x1=325 y1=240 x2=380 y2=240 draw_in delay=10

"social media hijacks your dopamine"
→ stick_figure cx=270 cy=250 scale=1.0 fade_in delay=0
→ dots dotPoints=[{x:200,y:160,r:5},{x:240,y:140,r:5},{x:280,y:155,r:5}] float_up delay=10 (dopamine hits)
→ arc cx=270 cy=145 r=40 startAngle=0 endAngle=320 draw_in delay=20 (hook/trap)

"two people can experience the same event completely differently"
→ stick_figure cx=160 cy=230 scale=0.9 translate_in from_x=50 delay=0
→ stick_figure cx=380 cy=230 scale=0.9 translate_in from_x=490 delay=0
→ arc cx=160 cy=175 r=40 startAngle=180 endAngle=360 draw_in delay=12 (thought bubble 1)
→ arc cx=380 cy=175 r=40 startAngle=180 endAngle=0 draw_in delay=18 (thought bubble 2)

"wealth is built in silence"
→ triangle cx=270 cy=300 size=180 pointing=up draw_in delay=0 (wealth pyramid)
→ star cx=270 cy=165 r=25 points=5 spring_in delay=16

"eye contact creates instant trust"
→ stick_figure cx=170 cy=230 scale=0.9 translate_in from_x=50 delay=0
→ stick_figure cx=370 cy=230 scale=0.9 translate_in from_x=490 delay=0
→ line x1=210 y1=205 x2=330 y2=205 draw_in delay=16 (eye-level connection line)

═══════════════════════════════════════════
FINAL RULE
═══════════════════════════════════════════
If you cannot picture the visual clearly in your head, pick a SIMPLER metaphor. One powerful image beats four confused ones. The test: could someone watch these shapes animate and know what the sentence is about — with no audio?`;

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

  const userPrompt = `You are designing motion graphics for a script. For EACH sentence, ask yourself:
1. What is the CORE CONCEPT? (e.g. isolation, money growing, brain looping, two people connecting)
2. What is the BEST single visual metaphor for that concept using the available shapes?
3. Which animation type REINFORCES the meaning, not just looks cool?

Script sentences:

${sentences.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Return exactly ${sentences.length} scene objects in the same order. Every element must directly illustrate the sentence — no generic filler shapes.`;

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 1.0,
      thinkingConfig: { thinkingBudget: 8192 },
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
