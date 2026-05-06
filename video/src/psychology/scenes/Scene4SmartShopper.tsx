import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { BW } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "800"], subsets: ["latin"] });

// Victory stick figure — arms raise up triumphantly
const VictoryFigure: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cx = 540;
  const headY = 520;
  const headR = 80;
  const neckY = headY + headR;
  const shoulderY = neckY + 80;
  const hipY = shoulderY + 320;
  const footY = hipY + 340;
  const sw = BW.stroke;

  // Arms raise progressively
  const armRaise = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 180, mass: 0.7 }, from: 0, to: 1 });

  // Neutral arms: (cx±220, shoulderY+140) → Victory: (cx±180, shoulderY-180)
  const leftArmX2 = cx - 220 + armRaise * 40;
  const leftArmY2 = shoulderY + 140 - armRaise * 320;
  const rightArmX2 = cx + 220 - armRaise * 40;
  const rightArmY2 = shoulderY + 140 - armRaise * 320;

  // Slight bounce in body
  const bounce = spring({ frame: frame - 30, fps, config: { damping: 8, stiffness: 300, mass: 0.4 }, from: 0, to: 1 });
  const bodyY = -bounce * 30 * Math.max(0, 1 - (frame - 30) / 40);

  // Big smile
  const smileProgress = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 200, mass: 0.5 }, from: 0, to: 1 });

  // Stars burst from hands when arms fully raised
  const starOp = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {/* Stars at hands */}
      {[
        { x: leftArmX2 - 30, y: leftArmY2 - 30, size: 32 },
        { x: leftArmX2 + 20, y: leftArmY2 - 60, size: 22 },
        { x: rightArmX2 + 30, y: rightArmY2 - 30, size: 32 },
        { x: rightArmX2 - 20, y: rightArmY2 - 60, size: 22 },
      ].map((s, i) => (
        <text key={i} x={s.x} y={s.y} textAnchor="middle" fontSize={s.size} opacity={starOp}>✦</text>
      ))}

      {/* Head */}
      <circle cx={cx} cy={headY + bodyY} r={headR} stroke={BW.fg} strokeWidth={sw} fill="none" />
      {/* Eyes — happy narrow */}
      <path d={`M ${cx - 38} ${headY + bodyY - 18} Q ${cx - 28} ${headY + bodyY - 32} ${cx - 18} ${headY + bodyY - 18}`}
        stroke={BW.fg} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={`M ${cx + 18} ${headY + bodyY - 18} Q ${cx + 28} ${headY + bodyY - 32} ${cx + 38} ${headY + bodyY - 18}`}
        stroke={BW.fg} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Big smile */}
      <path d={`M ${cx - 42} ${headY + bodyY + 22} Q ${cx} ${headY + bodyY + 22 + 40 * smileProgress} ${cx + 42} ${headY + bodyY + 22}`}
        stroke={BW.fg} strokeWidth={sw} fill="none" strokeLinecap="round" />

      {/* Body */}
      <line x1={cx} y1={neckY + bodyY} x2={cx} y2={hipY + bodyY}
        stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />

      {/* Arms */}
      <line x1={cx} y1={shoulderY + bodyY} x2={leftArmX2} y2={leftArmY2 + bodyY}
        stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />
      <line x1={cx} y1={shoulderY + bodyY} x2={rightArmX2} y2={rightArmY2 + bodyY}
        stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />

      {/* Legs — slight spread for stable stance */}
      <line x1={cx} y1={hipY + bodyY} x2={cx - 180} y2={footY} stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />
      <line x1={cx} y1={hipY + bodyY} x2={cx + 180} y2={footY} stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

export const Scene4SmartShopper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bottomOp = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bottomY = interpolate(frame, [80, 100], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const sub2Op = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BW.bg }}>
      <VictoryFigure frame={frame} fps={fps} />

      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", opacity: topOp }}>
        <div style={{
          fontFamily: outfit, fontSize: 52, fontWeight: 300,
          color: BW.fgDim, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          smart shopper effect
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 160, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        <div style={{
          opacity: bottomOp, transform: `translateY(${bottomY}px)`,
          fontFamily: outfit, fontSize: 90, fontWeight: 800,
          color: BW.fg, letterSpacing: "-0.05em", textAlign: "center",
        }}>
          you feel clever
        </div>
        <div style={{
          opacity: sub2Op,
          fontFamily: outfit, fontSize: 40, fontWeight: 300,
          color: BW.fgDim, letterSpacing: "0.06em", textAlign: "center",
        }}>
          resourceful. in control.
        </div>
      </div>
    </AbsoluteFill>
  );
};
