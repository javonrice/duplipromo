/**
 * Generates the Dupli Haul voiceover via ElevenLabs.
 * Run via GitHub Actions — requires ELEVENLABS_API_KEY secret.
 *
 * Voice: Elli (MF3mGyEYCl7XYWbV9V6O) — young, energetic, authentic creator tone
 */

import fs from "fs";
import path from "path";

const VOICE_ID = "MF3mGyEYCl7XYWbV9V6O"; // Elli — upbeat, young, relatable
const MODEL_ID = "eleven_turbo_v2";

const SCRIPT = `Okay I literally just walked into Dollar Tree and I am on a mission today.

They just got a whole new shipment and I am looking for dupes.

First thing I see — these tumblers. A dollar twenty-five. A DOLLAR TWENTY-FIVE.
I paid forty-five dollars for my Stanley. Let me check Dupli real quick.
Okay Dupli says this compares to the Hydrapeak at thirty-five dollars.
Same insulation, same size, one dollar and twenty-five cents. I'm getting five.

Next — vitamin C serum. I've seen this exact formula at Sephora for twenty-eight dollars.
Dupli confirmed it. One twenty-five versus twenty-eight. Done.

This is why I never leave Dollar Tree without spending forty dollars.
I've been using Dupli on every single shopping trip now.
You just snap any product and it instantly finds you cheaper versions.
Found me like two hundred dollars in savings just this week.

Look at this whole haul — cable organizers, sheet masks, storage jars, candles, ceramic pots.
All duped. All a dollar twenty-five.

Dupli is free. Link in bio. You are so welcome.`;

async function generate() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("❌ ELEVENLABS_API_KEY not set");
    process.exit(1);
  }

  console.log("🎙  Generating haul voiceover...");

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
          stability: 0.35,
          similarity_boost: 0.80,
          style: 0.45,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    console.error("❌ ElevenLabs error:", await res.text());
    process.exit(1);
  }

  const out = path.join(process.cwd(), "public", "voiceover-haul.mp3");
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`✅ Saved to ${out}`);
}

generate();
