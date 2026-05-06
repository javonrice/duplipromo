import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { BW } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "800"], subsets: ["latin"] });

export const Scene6Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "dupli" scales in
  const wordScale = spring({ frame, fps, config: { damping: 11, stiffness: 220, mass: 0.6 }, from: 0, to: 1 });

  // Underline draws left to right
  const lineW = interpolate(frame, [18, 50], [0, 780], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Tagline rises up
  const tagOp = interpolate(frame, [35, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [35, 60], [30, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // CTA line fades in
  const ctaOp = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Download prompt bounces in
  const dlScale = spring({ frame: frame - 100, fps, config: { damping: 12, stiffness: 200, mass: 0.7 }, from: 0, to: 1 });
  const dlOp = interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scan icon — two lines forming a phone outline
  const scanOp = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: BW.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Camera/scan icon above wordmark */}
      <svg width={120} height={120} viewBox="0 0 120 120" fill="none"
        style={{ opacity: scanOp, marginBottom: 24 }}>
        {/* Phone outline */}
        <rect x="28" y="14" width="64" height="92" rx="10"
          stroke={BW.fgDim} strokeWidth="2.5" fill="none" />
        {/* Lens ring */}
        <circle cx="60" cy="54" r="18" stroke={BW.fg} strokeWidth="2.5" fill="none" />
        <circle cx="60" cy="54" r="7" fill={BW.fg} />
        {/* Corner scan brackets */}
        <path d="M 44 38 L 44 30 L 52 30" stroke={BW.fg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 76 38 L 76 30 L 68 30" stroke={BW.fg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Brand wordmark */}
      <div style={{ transform: `scale(${wordScale})`, position: "relative", textAlign: "center" }}>
        <div style={{
          fontFamily: outfit, fontSize: 200, fontWeight: 800,
          color: BW.fg, letterSpacing: "-0.06em", lineHeight: 1,
        }}>
          dupli
        </div>
        {/* Underline */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          height: 4, width: lineW, background: BW.fg, borderRadius: 2,
        }} />
      </div>

      {/* Tagline */}
      <div style={{
        opacity: tagOp, transform: `translateY(${tagY}px)`,
        fontFamily: outfit, fontSize: 38, fontWeight: 300,
        color: BW.fgDim, letterSpacing: "0.14em", textTransform: "uppercase",
        marginTop: 48, textAlign: "center",
      }}>
        snap any product. find the dupe.
      </div>

      {/* Sub copy */}
      <div style={{
        opacity: ctaOp,
        fontFamily: outfit, fontSize: 32, fontWeight: 300,
        color: BW.fgVeryDim, letterSpacing: "0.08em",
        marginTop: 24, textAlign: "center",
      }}>
        ai-powered price intelligence
      </div>

      {/* Download CTA */}
      <div style={{
        opacity: dlOp, transform: `scale(${dlScale})`,
        marginTop: 80,
        border: `2px solid ${BW.fg}`,
        borderRadius: 60,
        padding: "24px 64px",
        fontFamily: outfit, fontSize: 40, fontWeight: 800,
        color: BW.fg, letterSpacing: "0.04em", textTransform: "uppercase",
      }}>
        get the app
      </div>
    </AbsoluteFill>
  );
};
