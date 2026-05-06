import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { COLORS } from "../brand";
import { DupeResultCard } from "../components/DupeResultCard";

const { fontFamily: outfitFamily } = loadOutfit("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: figtreeFamily } = loadFigtree("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Confetti-like floating dots
  const dots = [
    { x: 8, y: 12, size: 18, delay: 10 },
    { x: 88, y: 8, size: 14, delay: 20 },
    { x: 92, y: 72, size: 10, delay: 35 },
    { x: 5, y: 68, size: 16, delay: 15 },
    { x: 50, y: 5, size: 12, delay: 25 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.cream,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "70px 48px 60px",
        gap: 36,
      }}
    >
      {/* Decorative dots */}
      {dots.map((dot, i) => {
        const dotOpacity = interpolate(frame, [dot.delay, dot.delay + 20], [0, 0.35], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const floatY = interpolate(frame, [0, 150], [0, -8 * (i % 2 === 0 ? 1 : -1)], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: COLORS.ink,
              opacity: dotOpacity,
              transform: `translateY(${floatY}px)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          You found a steal 💸
        </div>
        <div
          style={{
            fontFamily: figtreeFamily,
            fontSize: 34,
            color: "#7A7068",
            marginTop: 10,
          }}
        >
          Same formula. Way less money.
        </div>
      </div>

      {/* Dupe card */}
      <div style={{ width: "100%", zIndex: 1 }}>
        <DupeResultCard
          originalName="Vitamin C Serum"
          originalBrand="SkinCeuticals"
          originalPrice="$166"
          dupeName="Vitamin C Serum"
          dupeBrand="TruSkin"
          dupePrice="$21"
          savings="$145"
          matchPercent={89}
          verdict="Worth the hype"
          delay={15}
          scale={1}
        />
      </div>

      {/* Bottom note */}
      <div
        style={{
          opacity: interpolate(frame, [80, 100], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: figtreeFamily,
          fontSize: 26,
          color: "#9A9188",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        Verified by AI ingredient analysis
      </div>
    </AbsoluteFill>
  );
};
