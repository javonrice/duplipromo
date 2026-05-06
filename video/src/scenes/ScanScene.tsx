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
import { PhoneMockup } from "../components/PhoneMockup";

const { fontFamily: outfitFamily } = loadOutfit("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: figtreeFamily } = loadFigtree("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// Animated scanning line inside the phone
const ScanningScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scanning line sweeps down then loops
  const scanY = interpolate(frame % (fps * 2), [0, fps * 2], [10, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cornerOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#111",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Simulated product image */}
      <div
        style={{
          width: "70%",
          height: "55%",
          borderRadius: 16,
          background: "linear-gradient(135deg, #f5f0ea 0%, #e8e0d5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
          position: "relative",
          overflow: "hidden",
        }}
      >
        🧴
        {/* Scanning line */}
        <div
          style={{
            position: "absolute",
            top: `${scanY}%`,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, #A78BFA 30%, #8B5CF6 50%, #A78BFA 70%, transparent 100%)",
            boxShadow: "0 0 12px 3px rgba(139, 92, 246, 0.6)",
          }}
        />
        {/* Scan overlay gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, transparent ${scanY - 5}%, rgba(139,92,246,0.08) ${scanY}%, transparent ${scanY + 5}%)`,
          }}
        />
      </div>

      {/* Corner brackets */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => {
        const isTop = pos.includes("top");
        const isLeft = pos.includes("left");
        return (
          <div
            key={pos}
            style={{
              position: "absolute",
              opacity: cornerOpacity,
              [isTop ? "top" : "bottom"]: "22%",
              [isLeft ? "left" : "right"]: "15%",
              width: 24,
              height: 24,
              borderTop: isTop ? "3px solid #A78BFA" : "none",
              borderBottom: !isTop ? "3px solid #A78BFA" : "none",
              borderLeft: isLeft ? "3px solid #A78BFA" : "none",
              borderRight: !isLeft ? "3px solid #A78BFA" : "none",
            }}
          />
        );
      })}

      {/* Status text */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: textOpacity,
          textAlign: "center",
          width: "90%",
        }}
      >
        <div
          style={{
            fontFamily: figtreeFamily,
            fontSize: 18,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 6,
          }}
        >
          Finding the dupe…
        </div>
        <div
          style={{
            fontFamily: figtreeFamily,
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.4,
          }}
        >
          Reading the label and scanning ingredients
        </div>
      </div>
    </div>
  );
};

export const ScanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headingY = interpolate(frame, [0, 25], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const phoneScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.9 },
    from: 0.7,
    to: 1,
  });

  // Step labels animate in sequentially
  const steps = [
    { label: "Snap a photo", emoji: "📸", frame: 30 },
    { label: "AI scans ingredients", emoji: "🧬", frame: 60 },
    { label: "Get your dupe", emoji: "✨", frame: 90 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.cream,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 50px 60px",
        gap: 40,
      }}
    >
      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: outfitFamily,
            fontSize: 70,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          Just snap it.
        </div>
        <div
          style={{
            fontFamily: figtreeFamily,
            fontSize: 34,
            color: "#7A7068",
            marginTop: 10,
          }}
        >
          Dupli does the rest
        </div>
      </div>

      {/* Phone mockup */}
      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneMockup scale={0.85} delay={0}>
          <ScanningScreen />
        </PhoneMockup>
      </div>

      {/* Step pills */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
        }}
      >
        {steps.map(({ label, emoji, frame: startFrame }) => {
          const stepOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const stepX = interpolate(frame, [startFrame, startFrame + 20], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          return (
            <div
              key={label}
              style={{
                opacity: stepOpacity,
                transform: `translateX(${stepX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: COLORS.white,
                borderRadius: 20,
                padding: "18px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ fontSize: 34 }}>{emoji}</span>
              <span
                style={{
                  fontFamily: figtreeFamily,
                  fontSize: 30,
                  fontWeight: 600,
                  color: COLORS.ink,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
