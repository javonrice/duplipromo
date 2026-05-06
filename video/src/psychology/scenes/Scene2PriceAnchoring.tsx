import React from "react";
import {
  AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { P } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: figtree } = loadFigtree("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Animated bar — fills from 0 to targetPct
const Bar: React.FC<{
  label: string; price: string; pct: number; color: string;
  delay: number; maxW: number;
}> = ({ label, price, pct, color, delay, maxW }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 45], [0, pct * maxW], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const numOpacity = interpolate(frame, [delay + 35, delay + 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: figtree, fontSize: 28, color: P.textSub, fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: outfit, fontSize: 38, fontWeight: 800,
            color, opacity: numOpacity, letterSpacing: "-0.03em",
          }}
        >
          {price}
        </span>
      </div>
      <div style={{ height: 20, background: `${color}18`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: w, background: color,
          borderRadius: 10, minWidth: 20,
        }} />
      </div>
    </div>
  );
};

// Arrow connecting two items
const ConnectArrow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 25], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <svg width={60} height={30} viewBox="0 0 60 30" fill="none" style={{ overflow: "visible" }}>
      <line
        x1="0" y1="15" x2={60 * progress} y2="15"
        stroke={P.purple} strokeWidth="3" strokeLinecap="round"
      />
      {progress > 0.85 && (
        <path d="M 48 8 L 60 15 L 48 22" stroke={P.purple} strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </svg>
  );
};

export const Scene2PriceAnchoring: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSlide = interpolate(frame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // "$48 sets the anchor" callout
  const anchor1Opacity = interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const anchor2Opacity = interpolate(frame, [130, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bottom insight text
  const insightScale = spring({
    frame: frame - 160,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
    from: 0.8, to: 1,
  });
  const insightOpacity = interpolate(frame, [160, 175], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: P.bg,
        display: "flex",
        flexDirection: "column",
        padding: "80px 64px",
        gap: 32,
      }}
    >
      {/* Section label */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelSlide}px)`,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            background: P.purple,
            color: "#fff",
            fontFamily: outfit,
            fontSize: 26,
            fontWeight: 700,
            padding: "8px 18px",
            borderRadius: 100,
            letterSpacing: "0.02em",
          }}
        >
          1
        </div>
        <span style={{ fontFamily: outfit, fontSize: 44, fontWeight: 800, color: P.text, letterSpacing: "-0.03em" }}>
          Price anchoring
        </span>
      </div>

      {/* Explanation */}
      <div
        style={{
          opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontFamily: figtree, fontSize: 32, color: P.textSub, lineHeight: 1.5, maxWidth: 800,
        }}
      >
        Your brain uses the expensive price as a{" "}
        <span style={{ color: P.text, fontWeight: 600 }}>reference point.</span>
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
        <Bar label="Original" price="$48" pct={1} color={P.textSub} delay={30} maxW={820} />
        <Bar label="Dupe" price="$12" pct={0.25} color={P.purple} delay={75} maxW={820} />
      </div>

      {/* Arrow connector label */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
        <ConnectArrow delay={85} />
        <div
          style={{
            opacity: anchor1Opacity,
            fontFamily: figtree, fontSize: 28, color: P.textSub, fontWeight: 500,
          }}
        >
          <span style={{ color: P.text, fontWeight: 700 }}>$48</span> sets the anchor
        </div>
      </div>

      <div
        style={{
          opacity: anchor2Opacity,
          fontFamily: figtree, fontSize: 28, color: P.textSub, fontWeight: 500,
        }}
      >
        <span style={{ color: P.purple, fontWeight: 700 }}>$12</span> feels like a steal
      </div>

      {/* Insight card */}
      <div
        style={{
          opacity: insightOpacity,
          transform: `scale(${insightScale})`,
          background: P.purpleLight,
          borderRadius: 24,
          padding: "24px 28px",
          marginTop: 8,
          border: `1.5px solid ${P.purple}30`,
        }}
      >
        <div style={{ fontFamily: outfit, fontSize: 32, fontWeight: 700, color: P.purple, letterSpacing: "-0.02em" }}>
          The anchor makes the dupe feel bigger.
        </div>
      </div>
    </AbsoluteFill>
  );
};
