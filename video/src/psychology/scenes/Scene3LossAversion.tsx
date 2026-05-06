import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { BW } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "800"], subsets: ["latin"] });

// Full-screen stick figure — white lines on black
// Phases: 0=stressed, 1=relieved
const StickFigure: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const cx = 540;
  const headY = 480;
  const headR = 80;
  const neckY = headY + headR;
  const shoulderY = neckY + 80;
  const hipY = shoulderY + 320;
  const footY = hipY + 340;

  // Phase transition at frame 130
  const phase = interpolate(frame, [120, 160], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Arms: stressed = raised-tense (up-wide), relieved = down-relaxed
  const leftArmX2 = cx - 200 + phase * (-20); // stressed: wide out, relieved: closer in
  const leftArmY2 = shoulderY + 120 - phase * 60; // stressed: up-tense, relieved: lower
  const rightArmX2 = cx + 200 - phase * 20;
  const rightArmY2 = shoulderY + 120 - phase * 60;

  // Stress shake — small horizontal tremor when stressed
  const shake = (1 - phase) * 8 * Math.sin(frame * 1.5);

  // Money bag position — hangs from left hand
  const bagX = leftArmX2 + shake;
  const bagY = leftArmY2 + 60;
  const bagOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Stress lines radiate from figure when stressed
  const stressOp = 1 - phase;

  // Mouth curve: frown when stressed → smile when relieved
  const mouthCurve = -25 + phase * 50; // -25 = frown, +25 = smile

  // $48 label on bag fades out, $12 fades in
  const bag48Op = 1 - phase;
  const bag12Op = phase;

  const sw = BW.stroke;

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {/* Stress radiating lines */}
      {[0, 45, 90, 135, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 120, r2 = 180;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(rad)} y1={headY + r1 * Math.sin(rad)}
            x2={cx + r2 * Math.cos(rad)} y2={headY + r2 * Math.sin(rad)}
            stroke={BW.fg} strokeWidth="2" strokeLinecap="round"
            opacity={stressOp * 0.5}
          />
        );
      })}

      {/* Head */}
      <circle cx={cx + shake * 0.3} cy={headY} r={headR} stroke={BW.fg} strokeWidth={sw} fill="none" />

      {/* Eyes */}
      <circle cx={cx - 28 + shake * 0.3} cy={headY - 15} r={8} fill={BW.fg} />
      <circle cx={cx + 28 + shake * 0.3} cy={headY - 15} r={8} fill={BW.fg} />

      {/* Mouth — curved based on phase */}
      <path
        d={`M ${cx - 35 + shake * 0.3} ${headY + 25} Q ${cx + shake * 0.3} ${headY + 25 + mouthCurve} ${cx + 35 + shake * 0.3} ${headY + 25}`}
        stroke={BW.fg} strokeWidth={sw} fill="none" strokeLinecap="round"
      />

      {/* Neck + body */}
      <line x1={cx + shake * 0.2} y1={neckY} x2={cx + shake * 0.1} y2={hipY}
        stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />

      {/* Left arm */}
      <line x1={cx + shake * 0.1} y1={shoulderY} x2={leftArmX2 + shake} y2={leftArmY2}
        stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />
      {/* Right arm */}
      <line x1={cx + shake * 0.1} y1={shoulderY} x2={rightArmX2 + shake} y2={rightArmY2}
        stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />

      {/* Legs */}
      <line x1={cx} y1={hipY} x2={cx - 160} y2={footY} stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />
      <line x1={cx} y1={hipY} x2={cx + 160} y2={footY} stroke={BW.fg} strokeWidth={sw} strokeLinecap="round" />

      {/* Money bag */}
      <g opacity={bagOpacity}>
        <circle cx={bagX} cy={bagY} r={55} stroke={BW.fg} strokeWidth="2.5" fill="none" />
        <text x={bagX} y={bagY - 8} textAnchor="middle"
          fontFamily={outfit} fontSize="32" fontWeight="800" fill={BW.fg}
          opacity={bag48Op}>$48</text>
        <text x={bagX} y={bagY - 8} textAnchor="middle"
          fontFamily={outfit} fontSize="32" fontWeight="800" fill={BW.fg}
          opacity={bag12Op}>$12</text>
        {/* Bag knot */}
        <line x1={bagX} y1={bagY - 55} x2={leftArmX2 + shake} y2={leftArmY2}
          stroke={BW.fg} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
      </g>

      {/* Relief checkmark when relaxed */}
      <g opacity={phase}>
        <path d={`M ${cx + 180} ${headY - 80} L ${cx + 220} ${headY - 30} L ${cx + 300} ${headY - 140}`}
          stroke={BW.fg} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="200" strokeDashoffset={200 * (1 - phase)}
        />
      </g>
    </svg>
  );
};

export const Scene3LossAversion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const label1Op = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label2Op = interpolate(frame, [140, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BW.bg }}>
      <StickFigure frame={frame} fps={fps} />

      {/* Top label */}
      <div style={{
        position: "absolute", top: 120, left: 0, right: 0, textAlign: "center",
        opacity: label1Op,
        fontFamily: outfit, fontSize: 52, fontWeight: 300,
        color: BW.fgDim, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        loss aversion
      </div>

      {/* Bottom text */}
      <div style={{
        position: "absolute", bottom: 180, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      }}>
        <div style={{
          opacity: label2Op,
          fontFamily: outfit, fontSize: 70, fontWeight: 800,
          color: BW.fg, letterSpacing: "-0.04em", textAlign: "center",
          lineHeight: 1.1,
        }}>
          cheaper = less<br />to lose
        </div>
      </div>
    </AbsoluteFill>
  );
};
