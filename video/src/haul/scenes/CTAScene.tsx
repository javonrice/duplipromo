import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { H } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["300", "400", "800"], subsets: ["latin"] });

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo springs in
  const logoScale = spring({ frame, fps, config: { damping: 11, stiffness: 220, mass: 0.6 }, from: 0, to: 1 });

  // Tagline rises
  const tagOp = interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [22, 40], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // CTA button bounces in
  const btnScale = spring({ frame: frame - 45, fps, config: { damping: 9, stiffness: 280, mass: 0.6 }, from: 0, to: 1 });
  const btnOp = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Social proof line
  const proofOp = interpolate(frame, [80, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Link in bio
  const linkOp = interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const linkScale = spring({ frame: frame - 100, fps, config: { damping: 10, stiffness: 260, mass: 0.5 }, from: 0.8, to: 1 });

  // Savings counter
  const savingsProgress = interpolate(frame, [60, 130], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const savingsNum = Math.round(savingsProgress * 200);

  return (
    <AbsoluteFill style={{
      background: H.dupliPurple,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Subtle grid pattern */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.06 }} width={1080} height={1920}>
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={1920} stroke="white" strokeWidth="1" />
        ))}
        {Array.from({ length: 38 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 52} x2={1080} y2={i * 52} stroke="white" strokeWidth="1" />
        ))}
      </svg>

      {/* Wordmark */}
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 32, textAlign: "center" }}>
        <div style={{
          fontFamily: outfit, fontSize: 160, fontWeight: 800,
          color: H.white, letterSpacing: "-0.06em", lineHeight: 1,
        }}>
          dupli
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: tagOp, transform: `translateY(${tagY}px)`,
        fontFamily: outfit, fontSize: 38, fontWeight: 300,
        color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: 72, textAlign: "center",
      }}>
        snap any product. find the dupe.
      </div>

      {/* Savings counter */}
      <div style={{
        opacity: btnOp,
        background: "rgba(255,255,255,0.12)", borderRadius: 24,
        padding: "24px 52px", marginBottom: 48, textAlign: "center",
      }}>
        <div style={{ fontFamily: outfit, fontSize: 30, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
          saved me this week
        </div>
        <div style={{ fontFamily: outfit, fontSize: 80, fontWeight: 800, color: H.white, lineHeight: 1 }}>
          ${savingsNum}
        </div>
      </div>

      {/* CTA button */}
      <div style={{
        opacity: btnOp, transform: `scale(${btnScale})`,
        background: H.white, borderRadius: 60,
        padding: "28px 80px", marginBottom: 40,
        fontFamily: outfit, fontSize: 44, fontWeight: 800,
        color: H.dupliPurple, letterSpacing: "0.02em",
      }}>
        get the app — it's free
      </div>

      {/* Social proof */}
      <div style={{
        opacity: proofOp,
        fontFamily: outfit, fontSize: 28, fontWeight: 300,
        color: "rgba(255,255,255,0.65)", textAlign: "center",
        marginBottom: 32,
      }}>
        join 50k+ smart shoppers
      </div>

      {/* Link in bio */}
      <div style={{
        opacity: linkOp, transform: `scale(${linkScale})`,
        display: "flex", alignItems: "center", gap: 16,
        background: "rgba(255,255,255,0.15)", borderRadius: 40,
        padding: "16px 36px",
      }}>
        <div style={{ fontSize: 32 }}>👆</div>
        <div style={{
          fontFamily: outfit, fontSize: 32, fontWeight: 800,
          color: H.white, letterSpacing: "0.04em",
        }}>
          link in bio
        </div>
      </div>
    </AbsoluteFill>
  );
};
