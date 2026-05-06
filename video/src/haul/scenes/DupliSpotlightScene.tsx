import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

// Animated phone mockup showing the Dupli app
const AppMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: { damping: 14, stiffness: 180, mass: 0.8 }, from: 0.8, to: 1 });
  const phoneOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scan animation inside phone
  const scanProgress = interpolate(frame, [40, 90], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const scanY = scanProgress * 280;

  // Results slide in after scan
  const resultOp = interpolate(frame, [95, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultY = interpolate(frame, [95, 115], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Savings badge pops
  const badgeScale = spring({ frame: frame - 110, fps, config: { damping: 8, stiffness: 350, mass: 0.4 }, from: 0, to: 1 });

  return (
    <div style={{
      opacity: phoneOp,
      transform: `scale(${phoneScale})`,
      width: 380, height: 720,
      background: H.white,
      borderRadius: 48,
      border: `3px solid #E5E7EB`,
      overflow: "hidden",
      boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
      position: "relative",
      flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{ height: 44, background: H.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 120, height: 28, background: H.ink, borderRadius: 20 }} />
      </div>

      {/* App header */}
      <div style={{
        background: H.white, padding: "12px 24px 16px",
        borderBottom: "1px solid #F3F4F6",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ fontFamily: outfit, fontSize: 28, fontWeight: 800, color: H.dupliPurple }}>dupli</div>
        <div style={{ flex: 1 }} />
        <div style={{
          background: H.dupliLight, borderRadius: 20, padding: "6px 16px",
          fontFamily: outfit, fontSize: 16, color: H.dupliPurple,
        }}>snap</div>
      </div>

      {/* Camera/scan area */}
      <div style={{
        background: "#111", height: 280, position: "relative", overflow: "hidden",
      }}>
        {/* Product being scanned */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 96,
        }}>
          🧴
        </div>

        {/* Scan corners */}
        {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos as React.CSSProperties,
            width: 28, height: 28,
            borderTop: i < 2 ? "2px solid #fff" : "none",
            borderBottom: i >= 2 ? "2px solid #fff" : "none",
            borderLeft: i % 2 === 0 ? "2px solid #fff" : "none",
            borderRight: i % 2 === 1 ? "2px solid #fff" : "none",
            opacity: 0.9,
          }} />
        ))}

        {/* Scan line */}
        <div style={{
          position: "absolute", left: 16, right: 16,
          top: scanY + 16, height: 2,
          background: "linear-gradient(to right, transparent, #6366F1, transparent)",
          opacity: 0.9,
        }} />
      </div>

      {/* Results panel */}
      <div style={{ padding: "16px 20px", opacity: resultOp, transform: `translateY(${resultY}px)` }}>
        <div style={{ fontFamily: outfit, fontSize: 16, color: H.inkLight, marginBottom: 10 }}>
          3 dupes found ✓
        </div>

        {[
          { name: "Dollar Tree Vitamin C", price: "$1.25", save: "save $27" },
          { name: "e.l.f. Serum", price: "$12", save: "save $16" },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", marginBottom: 8,
            background: i === 0 ? H.greenLight : H.bg,
            borderRadius: 12,
            border: i === 0 ? `1px solid ${H.green}44` : "1px solid #E5E7EB",
          }}>
            <div style={{ fontFamily: outfit, fontSize: 14, color: H.ink, fontWeight: i === 0 ? 800 : 400 }}>
              {item.name}
            </div>
            <div>
              <div style={{ fontFamily: outfit, fontSize: 16, fontWeight: 800, color: H.ink }}>{item.price}</div>
              <div style={{ fontFamily: outfit, fontSize: 12, color: H.green }}>{item.save}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings badge */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        transform: `scale(${badgeScale})`,
        width: 110, height: 110,
        background: H.orange, borderRadius: "50%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(234,88,12,0.4)",
      }}>
        <div style={{ fontFamily: outfit, fontSize: 14, color: H.white, opacity: 0.9 }}>saves</div>
        <div style={{ fontFamily: outfit, fontSize: 28, fontWeight: 800, color: H.white, lineHeight: 1 }}>$200</div>
        <div style={{ fontFamily: outfit, fontSize: 12, color: H.white, opacity: 0.8 }}>this week</div>
      </div>
    </div>
  );
};

export const DupliSpotlightScene: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const bgOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Top label
  const topOp = interpolate(frame, [5, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topY = interpolate(frame, [5, 22], [-20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Copy lines stagger in after phone settles
  const line1Op = interpolate(frame, [130, 148], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Op = interpolate(frame, [148, 166], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Op = interpolate(frame, [166, 184], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineY = (startFrame: number) => interpolate(frame, [startFrame, startFrame + 18], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ background: H.dupliLight, opacity: bgOp }}>
      {/* Purple gradient at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 600,
        background: `linear-gradient(to bottom, ${H.dupliPurple}18, transparent)`,
      }} />

      {/* Top label */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0, textAlign: "center",
        opacity: topOp, transform: `translateY(${topY}px)`,
      }}>
        <div style={{
          display: "inline-block",
          background: H.dupliPurple, borderRadius: 40,
          padding: "14px 40px",
          fontFamily: outfit, fontSize: 30, fontWeight: 400,
          color: H.white, letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          meet dupli
        </div>
      </div>

      {/* Centered phone */}
      <div style={{
        position: "absolute", top: 220, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <AppMockup />
      </div>

      {/* Feature bullets */}
      <div style={{
        position: "absolute", bottom: 100, left: 80, right: 80,
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        {[
          { icon: "📸", text: "snap any product", op: line1Op, delay: 130 },
          { icon: "🔍", text: "find cheaper dupes instantly", op: line2Op, delay: 148 },
          { icon: "💸", text: "free to download", op: line3Op, delay: 166 },
        ].map((item) => (
          <div key={item.text} style={{
            opacity: item.op,
            transform: `translateY(${lineY(item.delay)}px)`,
            display: "flex", alignItems: "center", gap: 20,
            background: H.white, borderRadius: 20, padding: "18px 28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            <span style={{ fontSize: 36 }}>{item.icon}</span>
            <span style={{ fontFamily: outfit, fontSize: 32, fontWeight: 400, color: H.ink }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
