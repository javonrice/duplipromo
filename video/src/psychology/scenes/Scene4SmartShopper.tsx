import React from "react";
import {
  AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { P } from "../tokens";
import { AbstractFace } from "../components/AbstractFace";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: figtree } = loadFigtree("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Animated "similar" connecting dots between products
const SimilarityDots: React.FC<{ count: number; startDelay: number }> = ({ count, startDelay }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const delay = startDelay + i * 10;
        const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const scale = interpolate(frame, [delay, delay + 16], [0.4, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity }}>
            <div style={{
              transform: `scale(${scale})`,
              width: 10, height: 10, borderRadius: "50%",
              background: P.green, opacity: 0.7,
            }} />
            <div style={{
              fontFamily: figtree, fontSize: 20, color: P.green,
              fontWeight: 600, transform: `scale(${scale})`,
            }}>
              similar
            </div>
            <div style={{
              transform: `scale(${scale})`,
              width: 10, height: 10, borderRadius: "50%",
              background: P.green, opacity: 0.7,
            }} />
          </div>
        );
      })}
    </div>
  );
};

// "Smart find" badge
const SmartBadge: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: frame - delay, fps,
    config: { damping: 10, stiffness: 260, mass: 0.4 },
    from: 0, to: 1,
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity, transform: `scale(${scale})`,
        background: P.gold,
        borderRadius: 100,
        padding: "10px 24px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 20px rgba(240,180,41,0.3)",
      }}
    >
      <span style={{ fontSize: 26 }}>⭐</span>
      <span style={{
        fontFamily: outfit, fontSize: 30, fontWeight: 700,
        color: "#fff", letterSpacing: "-0.01em",
      }}>
        Smart find
      </span>
    </div>
  );
};

export const Scene4SmartShopper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [0, 18], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Products appear
  const prod1Opacity = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const prod1X = interpolate(frame, [25, 42], [-40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const prod2Opacity = interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const prod2X = interpolate(frame, [35, 52], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Insight
  const insightOpacity = interpolate(frame, [175, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const insightScale = spring({
    frame: frame - 175, fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
    from: 0.85, to: 1,
  });

  return (
    <AbsoluteFill
      style={{
        background: P.bg,
        display: "flex",
        flexDirection: "column",
        padding: "80px 64px",
        gap: 28,
      }}
    >
      {/* Label */}
      <div style={{ opacity: labelOpacity, transform: `translateY(${labelY}px)`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          background: P.gold, color: "#fff", fontFamily: outfit, fontSize: 26,
          fontWeight: 700, padding: "8px 18px", borderRadius: 100,
        }}>3</div>
        <span style={{ fontFamily: outfit, fontSize: 44, fontWeight: 800, color: P.text, letterSpacing: "-0.03em" }}>
          Smart shopper effect
        </span>
      </div>

      <div style={{
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        fontFamily: figtree, fontSize: 32, color: P.textSub, lineHeight: 1.5,
      }}>
        Finding a close match makes you feel{" "}
        <span style={{ color: P.text, fontWeight: 600 }}>resourceful.</span>
      </div>

      {/* Products side by side with similarity connectors */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", marginTop: 8 }}>
        {/* Original */}
        <div
          style={{
            opacity: prod1Opacity, transform: `translateX(${prod1X}px)`,
            background: P.bgCard, borderRadius: 24,
            padding: "24px", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)", minWidth: 160,
          }}
        >
          <span style={{ fontSize: 52 }}>🧴</span>
          <div style={{ fontFamily: figtree, fontSize: 22, color: P.textMuted }}>Original</div>
          <div style={{ fontFamily: outfit, fontSize: 30, fontWeight: 700, color: P.textSub, letterSpacing: "-0.02em" }}>$48</div>
        </div>

        {/* Similarity dots */}
        <SimilarityDots count={4} startDelay={60} />

        {/* Dupe */}
        <div
          style={{
            opacity: prod2Opacity, transform: `translateX(${prod2X}px)`,
            background: P.greenLight, borderRadius: 24,
            padding: "24px", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10,
            border: `1.5px solid ${P.green}40`, minWidth: 160,
          }}
        >
          <span style={{ fontSize: 52 }}>✨</span>
          <div style={{ fontFamily: figtree, fontSize: 22, color: P.green }}>Dupe</div>
          <div style={{ fontFamily: outfit, fontSize: 30, fontWeight: 700, color: P.green, letterSpacing: "-0.02em" }}>$12</div>
        </div>
      </div>

      {/* Face + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 4 }}>
        <AbstractFace expression="confident" transitionFrom="neutral" transitionStart={115} size={90} color={P.text} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SmartBadge delay={130} />
          <div style={{
            opacity: interpolate(frame, [150, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily: figtree, fontSize: 28, color: P.textSub, fontWeight: 500,
          }}>
            You didn't just save money.
          </div>
        </div>
      </div>

      {/* Insight */}
      <div
        style={{
          opacity: insightOpacity, transform: `scale(${insightScale})`,
          background: P.goldLight, borderRadius: 24,
          padding: "24px 28px", border: `1.5px solid ${P.gold}40`,
        }}
      >
        <div style={{ fontFamily: outfit, fontSize: 32, fontWeight: 700, color: "#8B6000", letterSpacing: "-0.02em" }}>
          You feel clever. 🧠
        </div>
      </div>
    </AbsoluteFill>
  );
};
