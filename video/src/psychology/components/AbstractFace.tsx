import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { P } from "../tokens";

type Expression = "neutral" | "stressed" | "relieved" | "confident";

interface AbstractFaceProps {
  expression: Expression;
  transitionFrom?: Expression;
  transitionStart?: number;
  size?: number;
  color?: string;
}

// Simple face using SVG paths — deterministic, no CSS animations
export const AbstractFace: React.FC<AbstractFaceProps> = ({
  expression,
  transitionFrom,
  transitionStart = 0,
  size = 80,
  color = P.text,
}) => {
  const frame = useCurrentFrame();

  const progress = transitionFrom
    ? interpolate(frame, [transitionStart, transitionStart + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Mouth curves: y control point for cubic bezier
  // neutral: flat (0), stressed: frown (-10), relieved: smile (10), confident: big smile (15)
  const mouthCurves: Record<Expression, number> = {
    neutral: 0,
    stressed: -12,
    relieved: 12,
    confident: 18,
  };

  const fromCurve = transitionFrom ? mouthCurves[transitionFrom] : mouthCurves[expression];
  const toCurve = mouthCurves[expression];
  const mouthCurve = fromCurve + (toCurve - fromCurve) * progress;

  // Eye shape: stressed = squint (squish), confident = wide
  const eyeScaleY: Record<Expression, number> = {
    neutral: 1,
    stressed: 0.5,
    relieved: 1,
    confident: 1.2,
  };
  const fromEye = transitionFrom ? eyeScaleY[transitionFrom] : eyeScaleY[expression];
  const toEye = eyeScaleY[expression];
  const eyeScale = fromEye + (toEye - fromEye) * progress;

  // Stress marks (only for stressed)
  const stressOpacity = interpolate(
    mouthCurve,
    [-12, 0],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const eyeR = size * 0.07;
  const eyeY = cy - r * 0.25;
  const eyeX = cx - r * 0.3;
  const mouthY = cy + r * 0.28;
  const mouthHalf = r * 0.4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Head circle */}
      <circle cx={cx} cy={cy} r={r} fill={`${color}12`} stroke={color} strokeWidth={size * 0.03} />

      {/* Eyes */}
      <ellipse
        cx={eyeX}
        cy={eyeY}
        rx={eyeR}
        ry={eyeR * eyeScale}
        fill={color}
      />
      <ellipse
        cx={cx + r * 0.3}
        cy={eyeY}
        rx={eyeR}
        ry={eyeR * eyeScale}
        fill={color}
      />

      {/* Mouth */}
      <path
        d={`M ${cx - mouthHalf} ${mouthY} Q ${cx} ${mouthY + mouthCurve} ${cx + mouthHalf} ${mouthY}`}
        stroke={color}
        strokeWidth={size * 0.035}
        strokeLinecap="round"
        fill="none"
      />

      {/* Stress marks */}
      <g opacity={stressOpacity}>
        <line x1={cx - r * 0.1} y1={eyeY - eyeR * 2} x2={cx + r * 0.1} y2={eyeY - eyeR * 3}
          stroke={P.red} strokeWidth={size * 0.025} strokeLinecap="round" />
        <line x1={cx + r * 0.45} y1={eyeY - eyeR * 1.5} x2={cx + r * 0.65} y2={eyeY - eyeR * 2.5}
          stroke={P.red} strokeWidth={size * 0.025} strokeLinecap="round" />
      </g>

      {/* Confidence star-sparkle */}
      {expression === "confident" && progress > 0.5 && (
        <g opacity={(progress - 0.5) * 2}>
          <circle cx={cx + r * 0.85} cy={cy - r * 0.7} r={size * 0.04} fill={P.gold} />
          <circle cx={cx + r * 0.7} cy={cy - r * 0.95} r={size * 0.025} fill={P.gold} />
        </g>
      )}
    </svg>
  );
};
