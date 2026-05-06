import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["400", "800"], subsets: ["latin"] });

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 75], [1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chipOp = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipY = interpolate(frame, [8, 22], [-24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const headScale = spring({ frame: frame - 16, fps, config: { damping: 11, stiffness: 220, mass: 0.7 }, from: 0.85, to: 1 });
  const headOp = interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subOp = interpolate(frame, [38, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [38, 54], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill>
      {/* Real Dollar Tree aisle background, slow zoom */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("haul/bg-aisle.jpg")}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${bgScale})`, transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* Dark overlay */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.58)" }} />

      {/* Content */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>

        {/* Location chip */}
        <div style={{
          opacity: chipOp, transform: `translateY(${chipY}px)`,
          background: H.green, borderRadius: 40,
          padding: "14px 36px", marginBottom: 48,
          fontFamily: outfit, fontSize: 30, fontWeight: 400,
          color: H.white, letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          📍 Dollar Tree
        </div>

        {/* Headline */}
        <div style={{
          opacity: headOp, transform: `scale(${headScale})`,
          fontFamily: outfit, fontSize: 104, fontWeight: 800,
          color: H.white, lineHeight: 1.05, textAlign: "center",
          letterSpacing: "-0.03em",
        }}>
          Dupli found me<br />
          <span style={{ color: "#86efac" }}>4 dupes</span><br />
          I can't believe
        </div>

        {/* Sub */}
        <div style={{
          opacity: subOp, transform: `translateY(${subY}px)`,
          fontFamily: outfit, fontSize: 38, fontWeight: 400,
          color: "rgba(255,255,255,0.75)", marginTop: 40, textAlign: "center",
          lineHeight: 1.5,
        }}>
          $157 saved for under $10
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
