import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../brand";

interface DupliLogoProps {
  size?: number;
  color?: string;
  showWordmark?: boolean;
  delay?: number;
}

// Geometric icon — two overlapping D-shapes forming a "dupe" symbol
const DupliIcon: React.FC<{ size: number; color: string; scale: number }> = ({
  size,
  color,
  scale,
}) => {
  const s = size * scale;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring segment — left */}
      <path
        d="M50 10 A40 40 0 0 0 10 50 A40 40 0 0 0 50 90"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Outer ring segment — right, offset */}
      <path
        d="M50 18 A32 32 0 0 1 82 50 A32 32 0 0 1 50 82"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Center dot */}
      <circle cx="50" cy="50" r="7" fill={color} />
      {/* Top connector */}
      <line x1="50" y1="10" x2="50" y2="18" stroke={color} strokeWidth="8" strokeLinecap="round" />
      {/* Bottom connector */}
      <line x1="50" y1="82" x2="50" y2="90" stroke={color} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
};

export const DupliLogo: React.FC<DupliLogoProps> = ({
  size = 80,
  color = COLORS.ink,
  showWordmark = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.6 },
    from: 0,
    to: 1,
  });

  const wordmarkOpacity = interpolate(
    frame,
    [delay + 15, delay + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wordmarkX = interpolate(
    frame,
    [delay + 15, delay + 35],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.2,
      }}
    >
      <DupliIcon size={size} color={color} scale={iconScale} />
      {showWordmark && (
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: size * 0.9,
            fontWeight: 700,
            color,
            opacity: wordmarkOpacity,
            transform: `translateX(${wordmarkX}px)`,
            letterSpacing: "-0.03em",
          }}
        >
          dupli
        </span>
      )}
    </div>
  );
};
