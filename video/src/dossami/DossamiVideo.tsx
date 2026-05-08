import React from "react";
import {
  AbsoluteFill, Audio, Easing, interpolate, Sequence,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { STYLE_TOKENS, type DossamiStyle } from "./tokens";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

// Split script into display segments (by sentence or double-newline)
function splitScript(script: string): string[] {
  return script
    .split(/\n\n+/)
    .flatMap((para) => para.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

// Distribute frames across segments proportional to word count
function buildSegments(segments: string[], totalFrames: number) {
  const words = segments.map((s) => s.split(/\s+/).length);
  const total = words.reduce((a, b) => a + b, 0) || 1;
  let cursor = 0;
  return segments.map((text, i) => {
    const frames = Math.round((words[i] / total) * totalFrames);
    const from = cursor;
    cursor += frames;
    return { text, from, durationInFrames: frames };
  });
}

// Single text segment with entrance animation
const TextSegment: React.FC<{ text: string; style: DossamiStyle; durationInFrames: number }> = ({
  text, style, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const tok = STYLE_TOKENS[style];

  const enterDur = Math.min(18, Math.floor(durationInFrames * 0.2));
  const exitStart = durationInFrames - Math.min(12, Math.floor(durationInFrames * 0.15));

  const opacity = interpolate(
    frame,
    [0, enterDur, exitStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );

  const y = interpolate(frame, [0, enterDur], [style === "bold" ? 60 : 30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const letterSpacing = style === "cinematic" ? "0.18em" : style === "bold" ? "-0.02em" : "0.01em";
  const textTransform = style === "cinematic" ? "uppercase" as const : "none" as const;
  const textAlign = style === "bold" ? "left" as const : "center" as const;

  return (
    <AbsoluteFill style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: style === "bold" ? "0 80px" : "0 72px",
    }}>
      <div style={{
        opacity, transform: `translateY(${y}px)`,
        fontFamily, fontSize: tok.fontSize, fontWeight: tok.fontWeight,
        color: tok.text, lineHeight: 1.25, letterSpacing, textTransform, textAlign,
        maxWidth: 900,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Background layer per style
const Background: React.FC<{ style: DossamiStyle }> = ({ style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tok = STYLE_TOKENS[style];

  if (style === "cinematic") {
    const vignette = "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%)";
    return (
      <AbsoluteFill style={{ background: tok.bg }}>
        <AbsoluteFill style={{ background: vignette }} />
        {/* Slow horizontal scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 1,
          top: interpolate(frame, [0, durationInFrames], [0, 1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          background: `linear-gradient(to right, transparent, ${tok.accent}44, transparent)`,
        }} />
      </AbsoluteFill>
    );
  }

  if (style === "bold") {
    const pulse = interpolate(frame % 60, [0, 30, 60], [0, 0.06, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 40%, ${tok.accent}${Math.round(pulse * 255).toString(16).padStart(2, "0")} 0%, ${tok.bg} 70%)`,
      }} />
    );
  }

  // minimal
  return <AbsoluteFill style={{ background: tok.bg }} />;
};

// Accent line decoration
const AccentLine: React.FC<{ style: DossamiStyle }> = ({ style }) => {
  const tok = STYLE_TOKENS[style];
  if (style === "minimal") {
    return (
      <div style={{
        position: "absolute", bottom: 120, left: "50%", transform: "translateX(-50%)",
        width: 40, height: 2, background: tok.accent, borderRadius: 1,
      }} />
    );
  }
  return null;
};

export interface DossamiVideoProps {
  script: string;
  style: DossamiStyle;
  size: "9:16" | "16:9";
}

export const DossamiVideo: React.FC<DossamiVideoProps> = ({ script, style }) => {
  const { durationInFrames } = useVideoConfig();
  const segments = splitScript(script);
  const built = buildSegments(segments, durationInFrames);

  return (
    <AbsoluteFill>
      <Background style={style} />
      <AccentLine style={style} />
      <Audio src={staticFile("voiceover-dossami.mp3")} volume={1} />
      {built.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.durationInFrames} layout="none">
          <AbsoluteFill>
            <TextSegment text={seg.text} style={style} durationInFrames={seg.durationInFrames} />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
