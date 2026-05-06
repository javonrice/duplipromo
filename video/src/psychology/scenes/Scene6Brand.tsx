import React from "react";
import {
  AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { P } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: figtree } = loadFigtree("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Minimal phone outline with simple UI suggestion
const MinimalPhone: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay, fps,
    config: { damping: 16, stiffness: 160, mass: 0.8 },
    from: 0.8, to: 1,
  });
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Three step icons inside phone appear sequentially
  const steps = [
    { icon: "📸", label: "Snap", delay: delay + 25 },
    { icon: "🔍", label: "Compare", delay: delay + 42 },
    { icon: "✅", label: "Save smarter", delay: delay + 59 },
  ];

  return (
    <div
      style={{
        opacity, transform: `scale(${scale})`,
        width: 300, height: 520,
        border: `3px solid ${P.text}`,
        borderRadius: 40,
        position: "relative",
        background: P.bgCard,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        padding: "40px 24px",
      }}
    >
      {/* Dynamic island */}
      <div style={{
        position: "absolute", top: 14,
        width: 80, height: 22,
        background: P.text, borderRadius: 11,
      }} />

      {/* Steps */}
      {steps.map(({ icon, label, delay: sd }) => {
        const stepOpacity = interpolate(frame, [sd, sd + 12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const stepX = interpolate(frame, [sd, sd + 16], [-20, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div
            key={label}
            style={{
              opacity: stepOpacity,
              transform: `translateX(${stepX}px)`,
              display: "flex", alignItems: "center", gap: 14,
              background: P.bg, borderRadius: 16,
              padding: "14px 18px", width: "100%",
            }}
          >
            <span style={{ fontSize: 28 }}>{icon}</span>
            <span style={{
              fontFamily: figtree, fontSize: 24, fontWeight: 600, color: P.text,
            }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const Scene6Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heading — psychology wrap-up
  const wrapOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const wrapY = interpolate(frame, [0, 22], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Dupli wordmark
  const logoScale = spring({
    frame: frame - 120, fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
    from: 0, to: 1,
  });
  const logoOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Final tagline
  const tagOpacity = interpolate(frame, [155, 170], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [155, 170], [16, 0], {
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
        padding: "70px 60px 60px",
        gap: 36,
      }}
    >
      {/* Wrap-up text */}
      <div style={{
        opacity: wrapOpacity, transform: `translateY(${wrapY}px)`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: outfit, fontSize: 52, fontWeight: 800,
          color: P.text, letterSpacing: "-0.04em", lineHeight: 1.1,
        }}>
          That's the psychology<br />behind dupes.
        </div>
        <div style={{
          fontFamily: figtree, fontSize: 32, color: P.textSub,
          marginTop: 12, lineHeight: 1.5,
        }}>
          And that's exactly why
        </div>
      </div>

      {/* Phone */}
      <MinimalPhone delay={20} />

      {/* Dupli wordmark */}
      <div style={{
        opacity: logoOpacity, transform: `scale(${logoScale})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{
          fontFamily: outfit, fontSize: 96, fontWeight: 800,
          color: P.text, letterSpacing: "-0.05em", lineHeight: 1,
        }}>
          dupli
        </div>
        <div style={{
          fontFamily: figtree, fontSize: 26, color: P.textSub,
          letterSpacing: "0.01em",
        }}>
          exists.
        </div>
      </div>

      {/* Final tagline */}
      <div style={{
        opacity: tagOpacity, transform: `translateY(${tagY}px)`,
        background: P.text, borderRadius: 100,
        padding: "18px 40px",
        fontFamily: outfit, fontSize: 32, fontWeight: 700,
        color: P.bg, letterSpacing: "-0.01em",
      }}>
        Snap. Compare. Save smarter.
      </div>
    </AbsoluteFill>
  );
};
