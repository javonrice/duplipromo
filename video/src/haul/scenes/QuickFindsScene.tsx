import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

const FINDS = [
  { emoji: "🕯️", name: "Candles", trePrice: "$1.25", dupePrice: "$18", color: "#FEF9C3" },
  { emoji: "🧴", name: "Vitamin C Serum", trePrice: "$1.25", dupePrice: "$28", color: "#DCFCE7" },
  { emoji: "💊", name: "Sheet Masks", trePrice: "$1.25", dupePrice: "$22", color: "#FCE7F3" },
  { emoji: "🔌", name: "USB-C Cables", trePrice: "$1.25", dupePrice: "$15", color: "#DBEAFE" },
  { emoji: "🫙", name: "Storage Jars", trePrice: "$1.25", dupePrice: "$12", color: "#FEF3C7" },
  { emoji: "🪴", name: "Ceramic Pots", trePrice: "$1.25", dupePrice: "$20", color: "#F0FDF4" },
];

const FindCard: React.FC<{
  emoji: string; name: string; trePrice: string; dupePrice: string;
  color: string; delay: number; index: number;
}> = ({ emoji, name, trePrice, dupePrice, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 280, mass: 0.5 }, from: 0, to: 1 });
  const op = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      opacity: op, transform: `scale(${scale})`,
      background: H.white, borderRadius: 20,
      padding: "20px 16px",
      display: "flex", flexDirection: "column", alignItems: "center",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    }}>
      <div style={{
        width: "100%", height: 160, background: color,
        borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 72, marginBottom: 12,
      }}>
        {emoji}
      </div>
      <div style={{ fontFamily: outfit, fontSize: 22, fontWeight: 800, color: H.ink, textAlign: "center", lineHeight: 1.2, marginBottom: 8 }}>
        {name}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: outfit, fontSize: 18, color: H.inkLight, textDecoration: "line-through" }}>
          {dupePrice}
        </span>
        <span style={{ fontFamily: outfit, fontSize: 24, fontWeight: 800, color: H.green }}>
          {trePrice}
        </span>
      </div>
    </div>
  );
};

export const QuickFindsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [-20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const totalOp = interpolate(frame, [150, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: H.bg, padding: "80px 48px" }}>

      {/* Title */}
      <div style={{
        opacity: titleOp, transform: `translateY(${titleY}px)`,
        fontFamily: outfit, fontSize: 52, fontWeight: 800,
        color: H.ink, marginBottom: 40, textAlign: "center",
      }}>
        the full haul 🛒
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 20, flex: 1,
      }}>
        {FINDS.map((find, i) => (
          <FindCard key={find.name} {...find} delay={20 + i * 18} index={i} />
        ))}
      </div>

      {/* Total savings */}
      <div style={{
        opacity: totalOp, marginTop: 36,
        background: H.green, borderRadius: 24,
        padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontFamily: outfit, fontSize: 28, fontWeight: 400, color: H.white }}>
          total spent
        </div>
        <div>
          <div style={{ fontFamily: outfit, fontSize: 22, color: H.white, opacity: 0.8, textDecoration: "line-through" }}>
            $115 retail
          </div>
          <div style={{ fontFamily: outfit, fontSize: 44, fontWeight: 800, color: H.white }}>
            $7.50
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
