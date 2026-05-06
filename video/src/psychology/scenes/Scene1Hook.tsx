import React from "react";
import {
  AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { P } from "../tokens";
import { PriceTag } from "../components/PriceTag";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: figtree } = loadFigtree("normal", { weights: ["500"], subsets: ["latin"] });

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "DUPE" pops in
  const dupeScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 260, mass: 0.5 },
    from: 0,
    to: 1,
  });

  // Question fades in after DUPE
  const questionOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const questionY = interpolate(frame, [18, 35], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Screen snap reaction on second price tag reveal (frame 55)
  const snapScale = interpolate(
    frame,
    [55, 58, 61, 64],
    [1, 0.98, 1.015, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Accent underline draws under "DUPE"
  const underlineW = interpolate(frame, [12, 30], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: P.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
        gap: 0,
        transform: `scale(${snapScale})`,
      }}
    >
      {/* DUPE word */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div
          style={{
            fontFamily: outfit,
            fontSize: 160,
            fontWeight: 800,
            color: P.text,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            transform: `scale(${dupeScale})`,
            display: "inline-block",
          }}
        >
          DUPE
        </div>
        {/* Purple underline */}
        <div
          style={{
            position: "absolute",
            bottom: -4,
            left: 0,
            height: 8,
            width: `${underlineW}%`,
            background: P.purple,
            borderRadius: 4,
          }}
        />
      </div>

      {/* Question */}
      <div
        style={{
          opacity: questionOpacity,
          transform: `translateY(${questionY}px)`,
          fontFamily: figtree,
          fontSize: 38,
          color: P.textSub,
          textAlign: "center",
          lineHeight: 1.4,
          marginBottom: 56,
          maxWidth: 700,
        }}
      >
        Why does finding one feel<br />
        <span style={{ color: P.text, fontWeight: 600 }}>weirdly satisfying?</span>
      </div>

      {/* Price tags */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <PriceTag
          price="$48"
          label="Original"
          delay={40}
          accentColor={P.textSub}
          fromDir="left"
          size="md"
        />
        <div
          style={{
            opacity: interpolate(frame, [48, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily: outfit,
            fontSize: 36,
            color: P.textMuted,
            fontWeight: 700,
          }}
        >
          →
        </div>
        <PriceTag
          price="$12"
          label="Dupe"
          delay={52}
          accentColor={P.purple}
          bgColor={P.purpleLight}
          fromDir="right"
          size="md"
        />
      </div>
    </AbsoluteFill>
  );
};
