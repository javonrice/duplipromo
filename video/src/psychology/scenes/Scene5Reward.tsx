import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { BW } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "800"], subsets: ["latin"] });

// Brain with dopamine burst — minimal SVG line art
const BrainBurst: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cx = 540;
  const cy = 820;

  const brainScale = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.6 }, from: 0, to: 1 });

  const burstOp = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burstScale = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 280, mass: 0.4 }, from: 0, to: 1 });

  const dotOp = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const checkProgress = interpolate(frame, [55, 90], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const sw = BW.stroke;
  const rays = [0, 40, 80, 120, 160, 200, 240, 280, 320];

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {/* Burst rays */}
      <g opacity={burstOp}>
        {rays.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r1 = 180, r2 = 260 + (i % 3) * 30;
          return (
            <line key={i}
              x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
              stroke={BW.fg} strokeWidth={2.5 * burstScale} strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}
      </g>

      {/* Brain outline — simplified lobed shape */}
      <g transform={`translate(${cx} ${cy}) scale(${brainScale})`}>
        {/* Left lobe */}
        <path
          d="M -30 -60 C -140 -100 -160 -20 -110 30 C -80 60 -50 50 -30 40"
          stroke={BW.fg} strokeWidth={sw} fill="none" strokeLinecap="round"
        />
        {/* Right lobe */}
        <path
          d="M 30 -60 C 140 -100 160 -20 110 30 C 80 60 50 50 30 40"
          stroke={BW.fg} strokeWidth={sw} fill="none" strokeLinecap="round"
        />
        {/* Center join top and bottom */}
        <path
          d="M -30 -60 Q 0 -80 30 -60 M -30 40 Q 0 55 30 40"
          stroke={BW.fg} strokeWidth={sw} fill="none" strokeLinecap="round"
        />
        {/* Bottom curve */}
        <path
          d="M -110 30 Q -80 100 0 110 Q 80 100 110 30"
          stroke={BW.fg} strokeWidth={sw} fill="none" strokeLinecap="round"
        />
        {/* Center divider */}
        <line x1={0} y1={-60} x2={0} y2={110} stroke={BW.fgDim} strokeWidth="1.5" strokeDasharray="8 6" />

        {/* Checkmark */}
        <path
          d="M -45 20 L -10 55 L 55 -30"
          stroke={BW.fg} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="180" strokeDashoffset={180 * (1 - checkProgress)}
        />
      </g>

      {/* Floating dots */}
      {[
        { x: cx - 250, y: cy - 200, r: 12 },
        { x: cx + 270, y: cy - 160, r: 18 },
        { x: cx - 300, y: cy + 80, r: 10 },
        { x: cx + 240, y: cy + 120, r: 14 },
        { x: cx - 180, y: cy - 310, r: 8 },
        { x: cx + 200, y: cy - 280, r: 10 },
      ].map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r}
          fill="none" stroke={BW.fg} strokeWidth="2"
          opacity={dotOp * (0.4 + i * 0.07)}
        />
      ))}
    </svg>
  );
};

export const Scene5Reward: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const headlineOp = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [90, 110], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subOp = interpolate(frame, [115, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BW.bg }}>
      <BrainBurst frame={frame} fps={fps} />

      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", opacity: topOp }}>
        <div style={{
          fontFamily: outfit, fontSize: 52, fontWeight: 300,
          color: BW.fgDim, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          reward response
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 160, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        <div style={{
          opacity: headlineOp, transform: `translateY(${headlineY}px)`,
          fontFamily: outfit, fontSize: 88, fontWeight: 800,
          color: BW.fg, letterSpacing: "-0.05em", textAlign: "center",
          lineHeight: 1.05,
        }}>
          dopamine hit
        </div>
        <div style={{
          opacity: subOp,
          fontFamily: outfit, fontSize: 40, fontWeight: 300,
          color: BW.fgDim, letterSpacing: "0.06em", textAlign: "center",
        }}>
          every dupe find is a win.
        </div>
      </div>
    </AbsoluteFill>
  );
};
