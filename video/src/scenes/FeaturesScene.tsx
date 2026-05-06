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

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  startFrame: number;
  accent?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  emoji,
  title,
  description,
  startFrame,
  accent = COLORS.ink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.6 },
    from: 0.8,
    to: 1,
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideY = interpolate(frame, [startFrame, startFrame + 20], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${cardScale}) translateY(${slideY}px)`,
        background: COLORS.white,
        borderRadius: 28,
        padding: "28px 28px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: `${accent}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div>
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: figtreeFamily,
            fontSize: 26,
            color: "#7A7068",
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

// Animated ingredient match bar (standalone)
const IngredientMatch: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(frame, [startFrame + 15, startFrame + 60], [0, 89], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const numOpacity = interpolate(frame, [startFrame + 50, startFrame + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        background: COLORS.white,
        borderRadius: 28,
        padding: "28px 28px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: "-0.02em",
          }}
        >
          🧬 Ingredient Match
        </div>
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.success,
            opacity: numOpacity,
          }}
        >
          89%
        </div>
      </div>

      {/* Bar */}
      <div
        style={{
          height: 16,
          background: COLORS.creamDark,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${COLORS.success} 0%, #5ECFA0 100%)`,
            borderRadius: 8,
          }}
        />
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        {["In both ✓", "Unique to original", "Unique to dupe"].map((label, i) => (
          <div
            key={label}
            style={{
              fontFamily: figtreeFamily,
              fontSize: 22,
              color: i === 0 ? COLORS.success : "#9A9188",
              fontWeight: i === 0 ? 600 : 400,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FeaturesScene: React.FC = () => {
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

  return (
    <AbsoluteFill
      style={{
        background: COLORS.cream,
        display: "flex",
        flexDirection: "column",
        padding: "70px 48px 60px",
        gap: 24,
      }}
    >
      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 68,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          More than just a match.
        </div>
        <div
          style={{
            fontFamily: figtreeFamily,
            fontSize: 32,
            color: "#7A7068",
            marginTop: 8,
          }}
        >
          Dupli goes deep on every dupe
        </div>
      </div>

      {/* Feature cards */}
      <IngredientMatch startFrame={20} />

      <FeatureCard
        emoji="🏷️"
        title="Verdict badges"
        description='"Worth the hype", "Mixed", "Skip" — instant clarity'
        startFrame={40}
        accent="#8B5CF6"
      />

      <FeatureCard
        emoji="🛍️"
        title="Shop the dupe"
        description="Links to verified retailers with live pricing"
        startFrame={65}
        accent={COLORS.success}
      />

      <FeatureCard
        emoji="⚠️"
        title="Risk assessment"
        description="Missing actives, safety notes, lower vs higher risk"
        startFrame={90}
        accent={COLORS.warning}
      />
    </AbsoluteFill>
  );
};
