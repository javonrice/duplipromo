/**
 * Generates a voiceover for Dossami from a user-supplied script.
 * Script is read from the DOSSAMI_SCRIPT env variable.
 * Voice is chosen based on DOSSAMI_STYLE:
 *   minimal   → Rachel (calm, authoritative)
 *   bold      → Elli   (energetic)
 *   cinematic → Antoni (deep, cinematic)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VOICES = {
  minimal:   "21m00Tcm4TlvDq8ikWAM", // Rachel
  bold:      "MF3mGyEYCl7XYWbV9V6O", // Elli
  cinematic: "ErXwobaYiN019PkySvjV", // Antoni
};

const VOICE_SETTINGS = {
  minimal:   { stability: 0.45, similarity_boost: 0.85, style: 0.2,  use_speaker_boost: true },
  bold:      { stability: 0.35, similarity_boost: 0.80, style: 0.45, use_speaker_boost: true },
  cinematic: { stability: 0.55, similarity_boost: 0.90, style: 0.15, use_speaker_boost: true },
};

async function generate() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) { console.error("❌ ELEVENLABS_API_KEY not set"); process.exit(1); }

  const script = process.env.DOSSAMI_SCRIPT;
  if (!script?.trim()) { console.error("❌ DOSSAMI_SCRIPT not set"); process.exit(1); }

  const style = (process.env.DOSSAMI_STYLE || "minimal").toLowerCase();
  const voiceId = VOICES[style] || VOICES.minimal;
  const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.minimal;

  console.log(`🎙  Generating voiceover — style: ${style}, voice: ${voiceId}`);
  console.log(`📝  Script (${script.split(/\s+/).length} words)`);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_turbo_v2",
      voice_settings: settings,
    }),
  });

  if (!res.ok) { console.error("❌ ElevenLabs error:", await res.text()); process.exit(1); }

  const out = path.join(__dirname, "..", "public", "voiceover-dossami.mp3");
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`✅ Saved to ${out}`);
}

generate();
