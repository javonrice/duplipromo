import React from "react";
import {
  AbsoluteFill, Audio, Easing, interpolate, Sequence,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "800"], subsets: ["latin"] });

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#F5F3EE",
  text: "#1C1C1E",
  accents: ["#4A7AC7", "#E07B5B", "#6EA87A", "#D4A832", "#B84848"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function splitScript(script: string): string[] {
  return script
    .split(/\n\n+/)
    .flatMap((p) => p.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildSegments(sentences: string[], totalFrames: number) {
  const counts = sentences.map((s) => Math.max(1, s.split(/\s+/).length));
  const totalWords = counts.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return sentences.map((text, i) => {
    const isLast = i === sentences.length - 1;
    const frames = isLast
      ? Math.max(1, totalFrames - cursor)
      : Math.max(24, Math.round((counts[i] / totalWords) * totalFrames));
    const from = cursor;
    cursor += frames;
    return { text, from, durationInFrames: frames, index: i };
  });
}

function isAccent(word: string, i: number): boolean {
  const w = word.replace(/[^a-zA-Z]/g, "");
  if (i === 0) return true;
  if (w.length >= 2 && w === w.toUpperCase()) return true;
  if (w.length >= 9) return true;
  return false;
}

// ── Animated word ─────────────────────────────────────────────────────────────
const Word: React.FC<{
  word: string; delay: number; accent: boolean; color: string; size: number;
}> = ({ word, delay, accent, color, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 300, mass: 0.5 },
    from: 0, to: 1,
  });

  const op = interpolate(frame - delay, [0, 6], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scale = interpolate(s, [0, 1], [0.65, 1]);
  const y = interpolate(s, [0, 1], [18, 0]);

  return (
    <span style={{
      display: "inline-block",
      opacity: op,
      transform: `scale(${scale}) translateY(${y}px)`,
      transformOrigin: "center bottom",
      color: accent ? color : C.text,
      fontWeight: accent ? 800 : 400,
      fontSize: accent ? size * 1.08 : size,
      marginRight: "0.22em",
      lineHeight: 1.25,
    }}>
      {word}
    </span>
  );
};

// ── Background variants ───────────────────────────────────────────────────────

// Soft glowing circle behind text
const SpotlightBg: React.FC<{ color: string; frame: number; duration: number }> = ({ color, frame, duration }) => {
  const pulse = interpolate(frame, [0, duration * 0.5, duration], [0.9, 1.08, 0.93], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 640, height: 640, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}28 0%, ${color}06 60%, transparent 80%)`,
        transform: `scale(${pulse})`,
      }} />
    </AbsoluteFill>
  );
};

// Rounded card that scales in on the X axis
const CardBg: React.FC<{ color: string; frame: number; width: number; height: number }> = ({ color, frame, width, height }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 220 }, from: 0, to: 1 });
  const cardW = width * 0.82;
  const cardH = height * 0.3;
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: cardW * s, height: cardH,
        borderRadius: 28,
        background: `${color}10`,
        border: `2px solid ${color}20`,
      }} />
    </AbsoluteFill>
  );
};

// Horizontal rule that draws across
const BarBg: React.FC<{ color: string; frame: number; width: number; height: number }> = ({ color, frame, width, height }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 22, stiffness: 280 }, from: 0, to: 1 });
  const y = height * 0.5 - 100;
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", top: y, left: width * 0.09,
        width: width * 0.82 * s, height: 3,
        background: color, borderRadius: 2,
        opacity: 0.55,
      }} />
    </AbsoluteFill>
  );
};

// Floating soft circles
const FloatBg: React.FC<{ color: string; frame: number; duration: number; width: number; height: number }> = ({
  color, frame, duration, width, height,
}) => {
  const shapes = [
    { rx: 0.16, ry: 0.3, r: 36, d: 0 },
    { rx: 0.84, ry: 0.28, r: 24, d: 5 },
    { rx: 0.13, ry: 0.7, r: 18, d: 10 },
    { rx: 0.87, ry: 0.72, r: 30, d: 3 },
    { rx: 0.5, ry: 0.16, r: 14, d: 7 },
  ];
  return (
    <AbsoluteFill>
      {shapes.map((sh, i) => {
        const op = interpolate(frame - sh.d, [0, 12], [0, 0.3], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const floatY = interpolate(frame, [0, duration], [sh.ry * height, sh.ry * height - 28], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.sin),
        });
        return (
          <div key={i} style={{
            position: "absolute",
            left: sh.rx * width - sh.r,
            top: floatY - sh.r,
            width: sh.r * 2, height: sh.r * 2,
            borderRadius: "50%",
            background: color,
            opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Corner bracket accent
const BracketBg: React.FC<{ color: string; frame: number; width: number; height: number }> = ({ color, frame, width, height }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 260 }, from: 0, to: 1 });
  const len = 60 * s;
  const m = 80;
  const thick = 3;
  const corners = [
    { x: m, y: m },
    { x: width - m, y: m },
    { x: m, y: height - m },
    { x: width - m, y: height - m },
  ];
  return (
    <AbsoluteFill>
      {corners.map((c, i) => {
        const flipX = i % 2 === 1 ? -1 : 1;
        const flipY = i >= 2 ? -1 : 1;
        return (
          <React.Fragment key={i}>
            <div style={{
              position: "absolute",
              left: c.x, top: c.y - thick / 2,
              width: len * flipX, height: thick,
              background: color, opacity: 0.45,
              borderRadius: 2,
            }} />
            <div style={{
              position: "absolute",
              left: c.x - thick / 2, top: c.y,
              width: thick, height: len * flipY,
              background: color, opacity: 0.45,
              borderRadius: 2,
            }} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────
const VARIANTS = ["spotlight", "card", "bar", "float", "bracket"] as const;
type Variant = typeof VARIANTS[number];

const Scene: React.FC<{ text: string; index: number; durationInFrames: number }> = ({
  text, index, durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const color = C.accents[index % C.accents.length];
  const variant: Variant = VARIANTS[index % VARIANTS.length];
  const words = text.split(/\s+/);
  const STAGGER = 6;
  const base = words.length <= 5 ? 82 : words.length <= 9 ? 68 : words.length <= 14 ? 56 : 46;

  const exitStart = durationInFrames - 12;
  const exitOp = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {variant === "spotlight" && <SpotlightBg color={color} frame={frame} duration={durationInFrames} />}
      {variant === "card"      && <CardBg color={color} frame={frame} width={width} height={height} />}
      {variant === "bar"       && <BarBg color={color} frame={frame} width={width} height={height} />}
      {variant === "float"     && <FloatBg color={color} frame={frame} duration={durationInFrames} width={width} height={height} />}
      {variant === "bracket"   && <BracketBg color={color} frame={frame} width={width} height={height} />}

      <AbsoluteFill style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: `0 ${width * 0.11}px`,
        opacity: exitOp,
      }}>
        <div style={{ textAlign: "center", fontFamily, maxWidth: width * 0.78 }}>
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              delay={i * STAGGER}
              accent={isAccent(word, i)}
              color={color}
              size={base}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const w = (frame / durationInFrames) * width;
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0,
      width: w, height: 2,
      background: C.accents[0],
      opacity: 0.35,
    }} />
  );
};

// ── Root component ────────────────────────────────────────────────────────────
export interface DossamiVideoProps {
  script: string;
  style: string;
  size: "9:16" | "16:9";
}

export const DossamiVideo: React.FC<DossamiVideoProps> = ({ script }) => {
  const { durationInFrames } = useVideoConfig();
  const sentences = splitScript(script);
  const segments = buildSegments(sentences, durationInFrames);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Audio src={staticFile("voiceover-dossami.mp3")} volume={1} />
      {segments.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.durationInFrames} layout="none">
          <AbsoluteFill>
            <Scene text={seg.text} index={i} durationInFrames={seg.durationInFrames} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <ProgressBar />
    </AbsoluteFill>
  );
};
