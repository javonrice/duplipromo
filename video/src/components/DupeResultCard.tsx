import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../brand";

interface DupeResultCardProps {
  originalName: string;
  originalBrand: string;
  originalPrice: string;
  dupeName: string;
  dupeBrand: string;
  dupePrice: string;
  savings: string;
  matchPercent: number;
  verdict: "Worth the hype" | "Mixed" | "Comparable";
  delay?: number;
  scale?: number;
}

const VerdictBadge: React.FC<{ verdict: string; opacity: number }> = ({ verdict, opacity }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    "Worth the hype": { bg: "#D4EDDA", text: "#1A6B35" },
    Mixed: { bg: "#FFF3CD", text: "#856404" },
    Comparable: { bg: "#D1ECF1", text: "#0C5460" },
  };
  const c = colors[verdict] ?? colors["Comparable"];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: c.bg,
        color: c.text,
        padding: "6px 14px",
        borderRadius: 100,
        fontFamily: FONTS.body,
        fontSize: 22,
        fontWeight: 600,
        opacity,
      }}
    >
      <span>✓</span>
      {verdict}
    </div>
  );
};

const MatchMeter: React.FC<{ percent: number; animated: number }> = ({
  percent,
  animated,
}) => (
  <div style={{ width: "100%" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: FONTS.body,
        fontSize: 22,
        color: COLORS.ink,
        marginBottom: 8,
        fontWeight: 600,
      }}
    >
      <span>Ingredient match</span>
      <span style={{ color: COLORS.success }}>{percent}%</span>
    </div>
    <div
      style={{
        height: 10,
        background: COLORS.creamDark,
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${animated * percent}%`,
          background: `linear-gradient(90deg, ${COLORS.success}, #5ECFA0)`,
          borderRadius: 5,
        }}
      />
    </div>
  </div>
);

export const DupeResultCard: React.FC<DupeResultCardProps> = ({
  originalName,
  originalBrand,
  originalPrice,
  dupeName,
  dupeBrand,
  dupePrice,
  savings,
  matchPercent,
  verdict,
  delay = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 160, mass: 0.7 },
    from: 0.85,
    to: 1,
  });

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const meterProgress = interpolate(frame, [delay + 30, delay + 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const savingsScale = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
    from: 0,
    to: 1,
  });

  const badgeOpacity = interpolate(frame, [delay + 40, delay + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fs = scale;

  return (
    <div
      style={{
        transform: `scale(${cardScale})`,
        opacity,
        background: COLORS.white,
        borderRadius: 28 * fs,
        padding: `${28 * fs}px`,
        boxShadow: "0 4px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 20 * fs,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 26 * fs,
              fontWeight: 700,
              color: COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            We found the dupe
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 18 * fs,
              color: "#888",
              marginTop: 2,
            }}
          >
            AI-verified match
          </div>
        </div>
        <div
          style={{
            transform: `scale(${savingsScale})`,
            background: COLORS.ink,
            color: COLORS.cream,
            padding: `${10 * fs}px ${16 * fs}px`,
            borderRadius: 16 * fs,
            fontFamily: FONTS.display,
            fontSize: 22 * fs,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14 * fs, opacity: 0.7, fontWeight: 400 }}>Save</div>
          <div>{savings}</div>
        </div>
      </div>

      {/* Product comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 12 * fs,
          alignItems: "center",
        }}
      >
        {/* Original */}
        <div
          style={{
            background: COLORS.cream,
            borderRadius: 18 * fs,
            padding: `${14 * fs}px`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64 * fs,
              height: 64 * fs,
              borderRadius: 14 * fs,
              background: COLORS.creamDark,
              margin: "0 auto 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28 * fs,
            }}
          >
            🧴
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 13 * fs, color: "#888" }}>
            {originalBrand}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 15 * fs,
              fontWeight: 600,
              color: COLORS.ink,
            }}
          >
            {originalName}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 18 * fs,
              fontWeight: 700,
              color: COLORS.ink,
              marginTop: 4,
            }}
          >
            {originalPrice}
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 18 * fs,
            fontWeight: 700,
            color: "#bbb",
            textAlign: "center",
          }}
        >
          VS
        </div>

        {/* Dupe */}
        <div
          style={{
            background: `${COLORS.success}18`,
            border: `2px solid ${COLORS.success}40`,
            borderRadius: 18 * fs,
            padding: `${14 * fs}px`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64 * fs,
              height: 64 * fs,
              borderRadius: 14 * fs,
              background: `${COLORS.success}20`,
              margin: "0 auto 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28 * fs,
            }}
          >
            ✨
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 13 * fs, color: "#888" }}>
            {dupeBrand}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 15 * fs,
              fontWeight: 600,
              color: COLORS.ink,
            }}
          >
            {dupeName}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 18 * fs,
              fontWeight: 700,
              color: COLORS.success,
              marginTop: 4,
            }}
          >
            {dupePrice}
          </div>
        </div>
      </div>

      {/* Ingredient match */}
      <MatchMeter percent={matchPercent} animated={meterProgress} />

      {/* Verdict */}
      <VerdictBadge verdict={verdict} opacity={badgeOpacity} />
    </div>
  );
};
