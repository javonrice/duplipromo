/**
 * Generates the Dupli promo voiceover using ElevenLabs TTS.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your_key node scripts/generate-voiceover.mjs
 *
 * Output: public/voiceover.mp3
 *
 * After generating, uncomment the <Audio> line in src/DupliPromo.tsx.
 *
 * Recommended voices:
 *   - "Rachel"  (calm, authoritative female) — good for beauty/lifestyle
 *   - "Adam"    (clear male narrator)
 *   - "Bella"   (soft, friendly female)
 * Find voice IDs at: https://api.elevenlabs.io/v1/voices
 */

import fs from "fs";
import path from "path";

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel (default)
const MODEL_ID = "eleven_turbo_v2";

const SCRIPT = `
Stop overpaying for your favorite products.

Introducing Dupli — the AI-powered dupe finder that actually works.

Just snap any product. Dupli reads the label, scans the ingredients, and finds you the best dupe — in seconds.

89% ingredient match. 145 dollars saved. Verified.

Same formula. Way less money.

Get the dupe you deserve. Download Dupli.
`.trim();

async function generateVoiceover() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY is not set.");
    process.exit(1);
  }

  console.log("🎙  Generating voiceover...");
  console.log("Script:\n" + SCRIPT + "\n");

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: SCRIPT,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.85,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("❌ ElevenLabs API error:", err);
    process.exit(1);
  }

  const buffer = await response.arrayBuffer();
  const outPath = path.join(process.cwd(), "public", "voiceover.mp3");
  fs.writeFileSync(outPath, Buffer.from(buffer));
  console.log(`✅ Voiceover saved to ${outPath}`);
  console.log(
    '👉 Now uncomment the <Audio> line in src/DupliPromo.tsx to enable it.'
  );
}

generateVoiceover();
