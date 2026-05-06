import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { COLORS } from "../brand";

const { fontFamily: outfitFamily } = loadOutfit("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: figtreeFamily } = loadFigtree("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// Animated geometric Dupli icon (SVG-based, deterministic)
const AnimatedIcon: React.FC<{ progress: number; size: number }> = ({ progress, size }) => {
  const rotation = interpolate(progress, [0, 1], [0, 360]);
  const innerScale = interpolate(progress, [0, 0.6, 1], [0, 1.1, 1]);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer arcs, rotating in */}
      <g transform={`rotate(${rotation}, 50, 50)`}>
        <path
          d="M50 8 A42 42 0 0 0 8 50 A42 42 0 0 0 50 92"
          stroke={COLORS.ink}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity={progress}
        />
        <path
          d="M50 17 A33 33 0 0 1 83 50 A33 33 0 0 1 50 83"
          stroke={COLORS.ink}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity={progress * 0.6}
        />
      </g>
      {/* Center dot */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill={COLORS.ink}
        transform={`scale(${innerScale})`}
        style={{ transformOrigin: "50px 50px" }}
      />
      {/* Connectors */}
      <line
        x1="50" y1="8" x2="50" y2="17"
        stroke={COLORS.ink}
        strokeWidth="7"
        strokeLinecap="round"
        opacity={progress}
      />
      <line
        x1="50" y1="83" x2="50" y2="92"
        stroke={COLORS.ink}
        strokeWidth="7"
        strokeLinecap="round"
        opacity={progress}
      />
    </svg>
  );
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.8 },
    from: 0,
    to: 1,
  });

  const wordmarkOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordmarkY = interpolate(frame, [20, 45], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const taglineOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [50, 70], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Floating card hints
  const card1Y = interpolate(frame, [0, 90], [0, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2Y = interpolate(frame, [0, 90], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardsOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.cream,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.creamDark} 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          zIndex: 1,
        }}
      >
        <AnimatedIcon progress={iconProgress} size={120} />

        <div
          style={{
            opacity: wordmarkOpacity,
            transform: `translateY(${wordmarkY}px)`,
            fontFamily: outfitFamily,
            fontSize: 120,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          dupli
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontFamily: figtreeFamily,
            fontSize: 38,
            color: "#7A7068",
            letterSpacing: "0.01em",
            textAlign: "center",
          }}
        >
          Snap any product. Find the dupe.
        </div>
      </div>

      {/* Floating pill badges */}
      <div
        style={{
          position: "absolute",
          opacity: cardsOpacity,
          top: "20%",
          left: "6%",
          transform: `translateY(${card1Y}px)`,
          background: COLORS.white,
          borderRadius: 20,
          padding: "14px 22px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          fontFamily: figtreeFamily,
          fontSize: 26,
          color: COLORS.ink,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>✨</span> Found a dupe!
      </div>

      <div
        style={{
          position: "absolute",
          opacity: cardsOpacity,
          bottom: "22%",
          right: "6%",
          transform: `translateY(${card2Y}px)`,
          background: COLORS.white,
          borderRadius: 20,
          padding: "14px 22px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          fontFamily: figtreeFamily,
          fontSize: 26,
          color: COLORS.success,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>💸</span> Save 73%
      </div>
    </AbsoluteFill>
  );
};
