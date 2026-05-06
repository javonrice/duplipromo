/**
 * Generates the Dupli Psychology voiceover via ElevenLabs.
 * Run via GitHub Actions — requires ELEVENLABS_API_KEY secret.
 *
 * Voice: Rachel (21m00Tcm4TlvDq8ikWAM) — calm, authoritative, smart tone
 */

import fs from "fs";
import path from "path";

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const MODEL_ID = "eleven_turbo_v2";

const SCRIPT = `Why does finding a dupe feel weirdly satisfying?

First, your brain compares the cheaper product to the expensive one. That expensive price becomes the anchor.

Second, people hate the feeling of wasting money. A dupe feels safer because it lowers the risk of regret.

And when the cheaper option still feels close enough, it gives you something else — the feeling that you made a smart move.

That's why a great dupe doesn't just feel cheaper. It feels like winning.

That's the psychology behind dupes. And that's exactly why Dupli exists.`;

async function generate() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY not set");
    process.exit(1);
  }

  console.log("🎙  Generating psychology voiceover...");

  const res = await fetch(
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
          stability: 0.4,
          similarity_boost: 0.85,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    console.error("❌ ElevenLabs error:", await res.text());
    process.exit(1);
  }

  const out = path.join(process.cwd(), "public", "voiceover-psychology.mp3");
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`✅ Saved to ${out}`);
}

generate();
