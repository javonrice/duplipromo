import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

interface ProductCardProps {
  name: string;
  category: string;
  trePrice: string;         // e.g. "$1.25"
  dupeOf: string;           // e.g. "Stanley Quencher"
  dupePrice: string;        // e.g. "$45"
  reactionText: string;     // e.g. "WAIT 😭"
  bgColor: string;
  photoEmoji: string;       // stand-in for photo
  showDupliScan?: boolean;  // show the Dupli scan moment
  scanDelay?: number;       // frame to trigger scan
}

// Dupli scan overlay — phone UI mockup
const DupliScanOverlay: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200, mass: 0.7 }, from: 0, to: 1 });
  const op = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scan line sweeps
  const scanY = interpolate(frame, [delay + 10, delay + 50], [0, 220], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Result appears
  const resultOp = interpolate(frame, [delay + 55, delay + 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 520,
      background: H.white,
      borderRadius: "40px 40px 0 0",
      opacity: op,
      transform: `translateY(${(1 - slideUp) * 100}%)`,
      padding: "32px 48px",
      boxShadow: "0 -8px 60px rgba(0,0,0,0.12)",
    }}>
      {/* Handle bar */}
      <div style={{ width: 48, height: 5, background: "#E5E7EB", borderRadius: 3, margin: "0 auto 28px" }} />

      {/* Dupli wordmark */}
      <div style={{ fontFamily: outfit, fontSize: 28, fontWeight: 800, color: H.dupliPurple, marginBottom: 20 }}>
        dupli
      </div>

      {/* Scan viewfinder */}
      <div style={{
        width: "100%", height: 220,
        background: H.dupliLight, borderRadius: 20,
        position: "relative", overflow: "hidden",
        border: `2px solid ${H.dupliPurple}22`,
        marginBottom: 24,
      }}>
        {/* Corner brackets */}
        {[{t:12,l:12},{t:12,r:12},{b:12,l:12},{b:12,r:12}].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos as React.CSSProperties,
            width: 28, height: 28,
            borderTop: i < 2 ? `3px solid ${H.dupliPurple}` : "none",
            borderBottom: i >= 2 ? `3px solid ${H.dupliPurple}` : "none",
            borderLeft: i % 2 === 0 ? `3px solid ${H.dupliPurple}` : "none",
            borderRight: i % 2 === 1 ? `3px solid ${H.dupliPurple}` : "none",
          }} />
        ))}
        {/* Scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: scanY, height: 2,
          background: `linear-gradient(to right, transparent, ${H.dupliPurple}, transparent)`,
          opacity: 0.8,
        }} />
        {/* Center text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: outfit, fontSize: 22, color: H.dupliPurple, opacity: 0.5,
        }}>
          scanning...
        </div>
      </div>

      {/* Result */}
      <div style={{ opacity: resultOp }}>
        <div style={{ fontFamily: outfit, fontSize: 20, color: H.inkLight, marginBottom: 8 }}>
          dupe found ✓
        </div>
        <div style={{
          background: H.greenLight, borderRadius: 16, padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: outfit, fontSize: 28, fontWeight: 800, color: H.ink }}>
              saves you
            </div>
            <div style={{ fontFamily: outfit, fontSize: 44, fontWeight: 800, color: H.green }}>
              ~$30–40
            </div>
          </div>
          <div style={{
            fontFamily: outfit, fontSize: 18, color: H.green,
            background: H.white, borderRadius: 12, padding: "10px 18px",
            fontWeight: 400,
          }}>
            same quality
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductScene: React.FC<ProductCardProps> = ({
  name, category, trePrice, dupeOf, dupePrice,
  reactionText, bgColor, photoEmoji, showDupliScan = false, scanDelay = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Photo card swoops in
  const cardScale = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.8 }, from: 0.85, to: 1 });
  const cardOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardRot = interpolate(frame, [0, 20], [-4, -1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Category chip
  const chipOp = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Price tag drops in
  const priceY = interpolate(frame, [25, 45], [-60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const priceOp = interpolate(frame, [25, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Reaction text pops
  const reactScale = spring({ frame: frame - 45, fps, config: { damping: 7, stiffness: 400, mass: 0.4 }, from: 0, to: 1 });
  const reactOp = interpolate(frame, [45, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Dupe comparison slides in
  const compOp = interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const compX = interpolate(frame, [70, 88], [40, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ background: H.bg }}>

      {/* Product photo card — polaroid style */}
      <div style={{
        position: "absolute", top: 200, left: 80, right: 80,
        opacity: cardOp,
        transform: `scale(${cardScale}) rotate(${cardRot}deg)`,
        transformOrigin: "center center",
      }}>
        <div style={{
          background: H.white,
          borderRadius: 24,
          padding: "20px 20px 60px",
          boxShadow: "0 12px 60px rgba(0,0,0,0.12)",
        }}>
          {/* Photo area */}
          <div style={{
            background: bgColor,
            borderRadius: 16,
            height: 640,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {/* Big emoji as product stand-in */}
            <div style={{ fontSize: 180, lineHeight: 1, marginBottom: 16 }}>
              {photoEmoji}
            </div>
            <div style={{
              fontFamily: outfit, fontSize: 38, fontWeight: 800,
              color: H.ink, textAlign: "center", padding: "0 32px",
            }}>
              {name}
            </div>
          </div>
          {/* Polaroid label */}
          <div style={{
            fontFamily: outfit, fontSize: 26, fontWeight: 300,
            color: H.inkLight, textAlign: "center", marginTop: 20,
          }}>
            {category}
          </div>
        </div>
      </div>

      {/* Category chip */}
      <div style={{
        position: "absolute", top: 140, left: 80,
        opacity: chipOp,
        background: H.ink, borderRadius: 40,
        padding: "12px 28px",
        fontFamily: outfit, fontSize: 26, color: H.white,
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {category}
      </div>

      {/* Dollar Tree price tag */}
      <div style={{
        position: "absolute", top: 200, right: 60,
        opacity: priceOp, transform: `translateY(${priceY}px)`,
        background: H.green, borderRadius: 20,
        padding: "18px 28px",
        boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
      }}>
        <div style={{ fontFamily: outfit, fontSize: 18, color: H.white, opacity: 0.8 }}>
          Dollar Tree
        </div>
        <div style={{ fontFamily: outfit, fontSize: 54, fontWeight: 800, color: H.white, lineHeight: 1 }}>
          {trePrice}
        </div>
      </div>

      {/* Reaction text */}
      <div style={{
        position: "absolute", bottom: showDupliScan ? 560 : 400, left: 80,
        opacity: reactOp, transform: `scale(${reactScale})`,
        transformOrigin: "left center",
        fontFamily: outfit, fontSize: 64, fontWeight: 800, color: H.orange,
      }}>
        {reactionText}
      </div>

      {/* Dupe comparison */}
      <div style={{
        position: "absolute", bottom: showDupliScan ? 380 : 220, left: 80, right: 80,
        opacity: compOp, transform: `translateX(${compX}px)`,
      }}>
        <div style={{
          background: H.orangeLight, borderRadius: 20,
          padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: outfit, fontSize: 22, color: H.inkLight, marginBottom: 4 }}>
              dupe of
            </div>
            <div style={{ fontFamily: outfit, fontSize: 32, fontWeight: 800, color: H.ink }}>
              {dupeOf}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: outfit, fontSize: 44, fontWeight: 800,
              color: H.orange, textDecoration: "line-through", opacity: 0.6,
            }}>
              {dupePrice}
            </div>
            <div style={{ fontFamily: outfit, fontSize: 32, fontWeight: 800, color: H.green }}>
              → {trePrice}
            </div>
          </div>
        </div>
      </div>

      {/* Dupli scan overlay */}
      {showDupliScan && <DupliScanOverlay delay={scanDelay} />}
    </AbsoluteFill>
  );
};
