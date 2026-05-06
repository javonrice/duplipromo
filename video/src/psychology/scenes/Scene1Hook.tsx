import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { BW } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["800"], subsets: ["latin"] });

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "DUPE" scales in from center
  const dupeScale = spring({ frame, fps, config: { damping: 11, stiffness: 220, mass: 0.6 }, from: 0, to: 1 });

  // Underline draws left to right
  const lineW = interpolate(frame, [18, 50], [0, 1080], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Subtitle rises up
  const subOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [30, 55], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Price tags drop in
  const p1Y = interpolate(frame, [50, 72], [-80, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const p1Op = interpolate(frame, [50, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const p2Y = interpolate(frame, [62, 82], [-80, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const p2Op = interpolate(frame, [62, 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Strike-through line on $48
  const strikeW = interpolate(frame, [70, 85], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ background: BW.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* Main word */}
      <div style={{ transform: `scale(${dupeScale})`, position: "relative", textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: outfit, fontSize: 220, fontWeight: 800, color: BW.fg, letterSpacing: "-0.06em" }}>
          DUPE
        </div>
        {/* Underline */}
        <div style={{ position: "absolute", bottom: -8, left: 0, height: 4, width: lineW, background: BW.fg, borderRadius: 2 }} />
      </div>

      {/* Subtitle */}
      <div style={{
        opacity: subOpacity, transform: `translateY(${subY}px)`,
        fontFamily: outfit, fontSize: 42, fontWeight: 400, color: BW.fgDim,
        marginTop: 40, letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        why does it feel so good?
      </div>

      {/* Price comparison */}
      <div style={{ display: "flex", alignItems: "center", gap: 60, marginTop: 100 }}>
        {/* $48 with strikethrough */}
        <div style={{ opacity: p1Op, transform: `translateY(${p1Y}px)`, position: "relative", textAlign: "center" }}>
          <div style={{ fontFamily: outfit, fontSize: 110, fontWeight: 800, color: BW.fgDim, letterSpacing: "-0.04em" }}>
            $48
          </div>
          {/* Strike line */}
          <div style={{
            position: "absolute", top: "50%", left: 0,
            height: 5, width: `${strikeW}%`, background: BW.fg,
            borderRadius: 2,
          }} />
        </div>

        {/* Arrow */}
        <div style={{ opacity: p2Op }}>
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            <line x1="0" y1="20" x2="45" y2="20" stroke={BW.fg} strokeWidth="3" strokeLinecap="round" />
            <path d="M38 8 L55 20 L38 32" stroke={BW.fg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* $12 */}
        <div style={{ opacity: p2Op, transform: `translateY(${p2Y}px)`, textAlign: "center" }}>
          <div style={{ fontFamily: outfit, fontSize: 110, fontWeight: 800, color: BW.fg, letterSpacing: "-0.04em" }}>
            $12
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
