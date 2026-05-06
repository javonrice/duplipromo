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

// Thought bubble with text
const ThoughtBubble: React.FC<{ text: string; delay: number; dismissAt: number }> = ({
  text, delay, dismissAt,
}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dismiss = interpolate(frame, [dismissAt, dismissAt + 12], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(appear, dismiss);
  const scale = interpolate(frame, [delay, delay + 12], [0.85, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: P.redLight,
        border: `1.5px solid ${P.red}30`,
        borderRadius: 20,
        padding: "16px 22px",
        fontFamily: figtree,
        fontSize: 28,
        color: P.red,
        fontWeight: 600,
        maxWidth: 480,
        textAlign: "center",
        position: "relative",
      }}
    >
      {text}
      {/* Tail */}
      <div style={{
        position: "absolute", bottom: -14, left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderTop: `14px solid ${P.red}30`,
      }} />
    </div>
  );
};

// Shield / checkmark reveal
const Shield: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: frame - delay, fps,
    config: { damping: 11, stiffness: 220, mass: 0.5 },
    from: 0, to: 1,
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity, transform: `scale(${scale})`,
        width: 72, height: 72,
        background: P.greenLight,
        border: `2px solid ${P.green}40`,
        borderRadius: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36,
      }}
    >
      🛡️
    </div>
  );
};

export const Scene3LossAversion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [0, 18], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Face transitions: stressed (20) → relieved (120)
  const faceExpression = frame < 120 ? "stressed" : "relieved";
  const faceTransFrom = frame >= 120 ? "stressed" : undefined;

  // Expensive product stress indicators pulse
  const stressPulse = interpolate(
    (frame - 20) % 40,
    [0, 20, 40],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stressVisible = frame > 20 && frame < 115;

  // Dupe slides in at frame 110
  const dupeSlide = interpolate(frame, [110, 130], [60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dupeOpacity = interpolate(frame, [110, 126], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Insight card
  const insightOpacity = interpolate(frame, [175, 190], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
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
          background: P.red, color: "#fff", fontFamily: outfit, fontSize: 26,
          fontWeight: 700, padding: "8px 18px", borderRadius: 100,
        }}>2</div>
        <span style={{ fontFamily: outfit, fontSize: 44, fontWeight: 800, color: P.text, letterSpacing: "-0.03em" }}>
          Loss aversion
        </span>
      </div>

      <div style={{
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        fontFamily: figtree, fontSize: 32, color: P.textSub, lineHeight: 1.5,
      }}>
        People hate the feeling of{" "}
        <span style={{ color: P.text, fontWeight: 600 }}>wasting money.</span>
      </div>

      {/* Face + products row */}
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 8 }}>
        <AbstractFace
          expression={faceExpression}
          transitionFrom={faceTransFrom}
          transitionStart={120}
          size={110}
          color={P.text}
        />

        {/* Expensive product */}
        <div
          style={{
            transform: stressVisible ? `scale(${stressPulse})` : "scale(1)",
            background: stressVisible ? P.redLight : P.bgCard,
            border: `2px solid ${stressVisible ? P.red + "40" : "#eee"}`,
            borderRadius: 22,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            minWidth: 140,
          }}
        >
          <span style={{ fontSize: 44 }}>🧴</span>
          <span style={{ fontFamily: outfit, fontSize: 34, fontWeight: 800, color: stressVisible ? P.red : P.textSub, letterSpacing: "-0.02em" }}>$48</span>
          <span style={{ fontFamily: figtree, fontSize: 22, color: P.textMuted }}>Original</span>
        </div>

        {/* Thought bubble */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
          <ThoughtBubble text="What if it's not worth it? 😰" delay={30} dismissAt={105} />
        </div>
      </div>

      {/* Dupe option slides in */}
      <div
        style={{
          opacity: dupeOpacity,
          transform: `translateX(${dupeSlide}px)`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: P.greenLight,
          border: `1.5px solid ${P.green}40`,
          borderRadius: 22,
          padding: "20px 28px",
        }}
      >
        <Shield delay={115} />
        <div>
          <div style={{ fontFamily: outfit, fontSize: 34, fontWeight: 800, color: P.green, letterSpacing: "-0.02em" }}>
            $12 dupe
          </div>
          <div style={{ fontFamily: figtree, fontSize: 26, color: P.textSub }}>
            Lower risk. Less regret.
          </div>
        </div>
      </div>

      {/* Insight */}
      <div
        style={{
          opacity: insightOpacity,
          transform: `scale(${insightScale})`,
          background: P.redLight,
          borderRadius: 24,
          padding: "24px 28px",
          border: `1.5px solid ${P.red}25`,
        }}
      >
        <div style={{ fontFamily: outfit, fontSize: 32, fontWeight: 700, color: P.red, letterSpacing: "-0.02em" }}>
          Cheaper = less to lose.
        </div>
      </div>
    </AbsoluteFill>
  );
};
