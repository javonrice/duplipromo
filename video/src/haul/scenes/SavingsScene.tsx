import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H, PRODUCTS } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

export const SavingsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [-24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Animate the savings total counting up
  const counterProgress = interpolate(frame, [30, 110], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const counterNum = Math.round(counterProgress * 157);

  const totalScale = spring({ frame: frame - 110, fps, config: { damping: 9, stiffness: 280, mass: 0.5 }, from: 0.8, to: 1 });
  const totalOp = interpolate(frame, [110, 126], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile("haul/bg-aisle.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(0.4)" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: "100px 60px", display: "flex", flexDirection: "column" }}>

        {/* Title */}
        <div style={{
          opacity: titleOp, transform: `translateY(${titleY}px)`,
          fontFamily: outfit, fontSize: 52, fontWeight: 800,
          color: H.white, textAlign: "center", marginBottom: 48,
        }}>
          today's haul 🛒
        </div>

        {/* Product rows */}
        {PRODUCTS.map((p, i) => {
          const rowOp = interpolate(frame, [20 + i * 14, 38 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const rowX = interpolate(frame, [20 + i * 14, 38 + i * 14], [-40, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div key={p.dtName} style={{
              opacity: rowOp, transform: `translateX(${rowX}px)`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.1)", borderRadius: 20,
              padding: "20px 28px", marginBottom: 16,
              backdropFilter: "blur(8px)",
            }}>
              <div>
                <div style={{ fontFamily: outfit, fontSize: 26, fontWeight: 800, color: H.white }}>
                  {p.dtName}
                </div>
                <div style={{ fontFamily: outfit, fontSize: 20, color: "rgba(255,255,255,0.6)" }}>
                  vs {p.brandName} {p.brandPrice}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: outfit, fontSize: 36, fontWeight: 800, color: "#86efac" }}>
                  {p.dtPrice}
                </div>
                <div style={{ fontFamily: outfit, fontSize: 18, color: H.green }}>
                  save {p.saving}
                </div>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div style={{
          opacity: totalOp, transform: `scale(${totalScale})`,
          marginTop: 32,
          background: H.green, borderRadius: 24,
          padding: "32px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 8px 40px rgba(22,163,74,0.5)",
        }}>
          <div>
            <div style={{ fontFamily: outfit, fontSize: 28, color: H.white, opacity: 0.85 }}>total saved</div>
            <div style={{ fontFamily: outfit, fontSize: 80, fontWeight: 800, color: H.white, lineHeight: 1 }}>
              ${counterNum}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: outfit, fontSize: 22, color: H.white, opacity: 0.8 }}>spent</div>
            <div style={{ fontFamily: outfit, fontSize: 52, fontWeight: 800, color: H.white }}>$8.75</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
