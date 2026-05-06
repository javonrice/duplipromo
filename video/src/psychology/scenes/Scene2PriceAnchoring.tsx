import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { BW } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "800"], subsets: ["latin"] });

// Pendulum that swings and settles — pure physics via Math.cos
const Pendulum: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const pivotX = 540;
  const pivotY = 80;
  const L = 700; // pendulum length

  // Decaying oscillation: amplitude shrinks over time
  const t = frame / fps;
  const maxAngle = 38 * Math.exp(-t * 0.55); // damping
  const angle = maxAngle * Math.cos(t * 3.2); // oscillation speed
  const rad = (angle * Math.PI) / 180;

  const ballX = pivotX + L * Math.sin(rad);
  const ballY = pivotY + L * Math.cos(rad);

  // "$48" text position
  const tag48X = ballX;
  const tag48Y = ballY + 10;

  // Anchor at rest position (straight down = $12)
  const anchorOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {/* Pivot mount lines */}
      <line x1={pivotX - 60} y1={pivotY} x2={pivotX + 60} y2={pivotY}
        stroke={BW.fgVeryDim} strokeWidth="2" strokeLinecap="round" />
      {/* Vertical mount */}
      <line x1={pivotX} y1={0} x2={pivotX} y2={pivotY}
        stroke={BW.fgVeryDim} strokeWidth="2" />

      {/* String */}
      <line x1={pivotX} y1={pivotY} x2={ballX} y2={ballY}
        stroke={BW.fg} strokeWidth="2.5" strokeLinecap="round" />

      {/* Ball */}
      <circle cx={ballX} cy={ballY} r={48} fill={BW.bg} stroke={BW.fg} strokeWidth="3" />

      {/* $48 label on ball */}
      <text x={tag48X} y={tag48Y + 14} textAnchor="middle"
        fontFamily={outfit} fontSize="38" fontWeight="800" fill={BW.fg}>
        $48
      </text>

      {/* Rest position indicator — $12 */}
      <g opacity={anchorOpacity}>
        <circle cx={pivotX} cy={pivotY + L} r={48} fill={BW.bg} stroke={BW.fgDim} strokeWidth="2" strokeDasharray="8 5" />
        <text x={pivotX} y={pivotY + L + 14} textAnchor="middle"
          fontFamily={outfit} fontSize="38" fontWeight="800" fill={BW.fgDim}>
          $12
        </text>
        {/* Small anchor icon */}
        <text x={pivotX + 80} y={pivotY + L + 14} textAnchor="middle"
          fontSize="48" fill={BW.fgDim} opacity="0.6">⚓</text>
      </g>
    </svg>
  );
};

export const Scene2PriceAnchoring: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOp = interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [100, 122], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subOp = interpolate(frame, [130, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BW.bg }}>
      <Pendulum frame={frame} fps={fps} />

      {/* Text at bottom */}
      <div style={{
        position: "absolute", bottom: 180, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      }}>
        <div style={{
          opacity: labelOp, transform: `translateY(${labelY}px)`,
          fontFamily: outfit, fontSize: 72, fontWeight: 800,
          color: BW.fg, letterSpacing: "-0.04em", textAlign: "center",
        }}>
          price anchoring
        </div>
        <div style={{
          opacity: subOp,
          fontFamily: outfit, fontSize: 38, fontWeight: 300,
          color: BW.fgDim, letterSpacing: "0.06em", textAlign: "center",
        }}>
          the first number sets the scale
        </div>
      </div>
    </AbsoluteFill>
  );
};
