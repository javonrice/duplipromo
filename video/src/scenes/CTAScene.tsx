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

// Animated SVG Dupli icon
const DupliIconAnimated: React.FC<{ size: number; color: string; frame: number; delay: number }> = ({
  size,
  color,
  frame,
  delay,
}) => {
  const progress = interpolate(frame, [delay, delay + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rotate = interpolate(frame, [delay, delay + 60], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g transform={`rotate(${rotate}, 50, 50)`} opacity={progress}>
        <path
          d="M50 8 A42 42 0 0 0 8 50 A42 42 0 0 0 50 92"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 17 A33 33 0 0 1 83 50 A33 33 0 0 1 50 83"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </g>
      <circle cx="50" cy="50" r="8" fill={color} opacity={progress} />
      <line
        x1="50" y1="8" x2="50" y2="17"
        stroke={color} strokeWidth="7" strokeLinecap="round"
        opacity={progress}
      />
      <line
        x1="50" y1="83" x2="50" y2="92"
        stroke={color} strokeWidth="7" strokeLinecap="round"
        opacity={progress}
      />
    </svg>
  );
};

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
    from: 0,
    to: 1,
  });

  const taglineOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [35, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const ctaScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
    from: 0,
    to: 1,
  });

  const socialProofOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const orbitAngle = interpolate(frame, [0, 150], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating deal pills
  const deals = [
    { label: "Saved $145", emoji: "💸", angle: orbitAngle },
    { label: "89% match", emoji: "🧬", angle: orbitAngle + 120 },
    { label: "Worth it ✓", emoji: "✅", angle: orbitAngle + 240 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity: bgOpacity,
        background: `linear-gradient(170deg, ${COLORS.inkDeep} 0%, #2E2840 55%, #1A1F35 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
        gap: 0,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <DupliIconAnimated size={100} color={COLORS.cream} frame={frame} delay={5} />
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 110,
            fontWeight: 800,
            color: COLORS.cream,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          dupli
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontFamily: figtreeFamily,
          fontSize: 38,
          color: "rgba(255,255,255,0.60)",
          textAlign: "center",
          marginBottom: 60,
          lineHeight: 1.4,
        }}
      >
        Snap any product.{"\n"}Find the dupe.
      </div>

      {/* CTA button */}
      <div
        style={{
          transform: `scale(${ctaScale})`,
          background: COLORS.cream,
          color: COLORS.ink,
          fontFamily: outfitFamily,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: "-0.02em",
          padding: "28px 72px",
          borderRadius: 100,
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <span style={{ fontSize: 36 }}>⬇️</span>
        Download Dupli
      </div>

      {/* Social proof */}
      <div
        style={{
          opacity: socialProofOpacity,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {deals.map(({ label, emoji }) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 100,
              padding: "10px 20px",
              fontFamily: figtreeFamily,
              fontSize: 26,
              color: "rgba(255,255,255,0.80)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{emoji}</span>
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
