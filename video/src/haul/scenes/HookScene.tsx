import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

// Animated dollar sign that bounces in
const DollarBurst: React.FC<{ x: number; y: number; delay: number; size: number }> = ({ x, y, delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 300, mass: 0.5 }, from: 0, to: 1 });
  const rot = interpolate(frame - delay, [0, 8], [-15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      fontSize: size, transform: `scale(${s}) rotate(${rot}deg)`,
      transformOrigin: "center",
      fontFamily: outfit, fontWeight: 800, color: H.green,
      opacity: s,
    }}>$</div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "DOLLAR TREE" label slides in
  const labelOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [0, 14], [-40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Main headline bursts in
  const headScale = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 240, mass: 0.6 }, from: 0.4, to: 1 });
  const headOp = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sub text rises
  const subOp = interpolate(frame, [28, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [28, 45], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Tag line
  const tagOp = interpolate(frame, [48, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: H.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* Scattered dollar signs for energy */}
      <DollarBurst x={60} y={180} delay={15} size={72} />
      <DollarBurst x={880} y={240} delay={20} size={56} />
      <DollarBurst x={40} y={1580} delay={25} size={64} />
      <DollarBurst x={900} y={1500} delay={18} size={48} />
      <DollarBurst x={480} y={120} delay={30} size={40} />

      {/* Store label chip */}
      <div style={{
        opacity: labelOp, transform: `translateY(${labelY}px)`,
        background: H.green, borderRadius: 40,
        padding: "14px 36px", marginBottom: 48,
        fontFamily: outfit, fontSize: 32, fontWeight: 400,
        color: H.white, letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        Dollar Tree Haul
      </div>

      {/* Main hook line */}
      <div style={{
        opacity: headOp, transform: `scale(${headScale})`,
        fontFamily: outfit, fontSize: 108, fontWeight: 800,
        color: H.ink, letterSpacing: "-0.04em", textAlign: "center",
        lineHeight: 1.05, padding: "0 60px",
      }}>
        I spent $40<br />
        <span style={{ color: H.green }}>and saved</span><br />
        $200+
      </div>

      {/* Sub */}
      <div style={{
        opacity: subOp, transform: `translateY(${subY}px)`,
        fontFamily: outfit, fontSize: 42, fontWeight: 300,
        color: H.inkLight, textAlign: "center", marginTop: 40,
        lineHeight: 1.4, padding: "0 80px",
      }}>
        finding dupes on everything
      </div>

      {/* Tag */}
      <div style={{
        opacity: tagOp,
        fontFamily: outfit, fontSize: 32, fontWeight: 400,
        color: H.green, marginTop: 32, letterSpacing: "0.06em",
      }}>
        here's what I found →
      </div>
    </AbsoluteFill>
  );
};
