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
  weights: ["400", "500"],
  subsets: ["latin"],
});

const Word: React.FC<{ word: string; startFrame: number; color?: string; size: number }> = ({
  word,
  startFrame,
  color = COLORS.cream,
  size,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [startFrame, startFrame + 18], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px)`,
        color,
        fontFamily: outfitFamily,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.04em",
        marginRight: "0.2em",
        lineHeight: 1.1,
      }}
    >
      {word}
    </span>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline slide in
  const tagY = interpolate(frame, [75, 95], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Emoji bounce
  const emojiScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
    from: 0,
    to: 1,
  });

  const line1Words = ["Snap", "any", "product."];
  const line2Words = ["Find", "the", "dupe."];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${COLORS.inkDeep} 0%, #2E2840 60%, #1C2030 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
      }}
    >
      {/* Subtle grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 20%, rgba(150,120,255,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Emoji */}
      <div
        style={{
          fontSize: 120,
          transform: `scale(${emojiScale})`,
          marginBottom: 40,
          lineHeight: 1,
        }}
      >
        📸
      </div>

      {/* Line 1 */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        {line1Words.map((word, i) => (
          <Word key={word} word={word} startFrame={i * 10} size={110} />
        ))}
      </div>

      {/* Line 2 — accent color on "dupe" */}
      <div style={{ textAlign: "center" }}>
        {line2Words.map((word, i) => (
          <Word
            key={word}
            word={word}
            startFrame={30 + i * 10}
            size={110}
            color={word === "dupe." ? "#A78BFA" : COLORS.cream}
          />
        ))}
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 60,
          opacity: subtitleOpacity,
          transform: `translateY(${tagY}px)`,
          fontFamily: figtreeFamily,
          fontSize: 38,
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          letterSpacing: "0.01em",
          fontWeight: 400,
        }}
      >
        AI-powered product dupe finder
      </div>
    </AbsoluteFill>
  );
};
