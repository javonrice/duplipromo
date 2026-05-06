import React from "react";
import {
  AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { P } from "../tokens";

const { fontFamily: outfit } = loadOutfit("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: figtree } = loadFigtree("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// SVG checkmark that draws itself
const DrawCheckmark: React.FC<{ delay: number; size: number; color: string }> = ({ delay, size, color }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const circleProgress = interpolate(frame, [delay - 8, delay + 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const r = size * 0.45;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - circleProgress);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Circle */}
      <circle
        cx={cx} cy={cy} r={r}
        stroke={color}
        strokeWidth={size * 0.055}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        fill={`${color}12`}
        style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Check path — clip by progress */}
      {progress > 0 && (
        <path
          d={`M ${cx - r * 0.45} ${cy} L ${cx - r * 0.1} ${cy + r * 0.45} L ${cx + r * 0.55} ${cy - r * 0.35}`}
          stroke={color}
          strokeWidth={size * 0.07}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={100}
          strokeDashoffset={100 * (1 - progress)}
        />
      )}
    </svg>
  );
};

// Progress bar to 100%
const ProgressBar: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [delay, delay + 60], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: figtree, fontSize: 26, color: P.textSub, fontWeight: 500 }}>
          Satisfaction
        </span>
        <span style={{
          fontFamily: outfit, fontSize: 32, fontWeight: 800,
          color: P.green, letterSpacing: "-0.02em",
        }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div style={{ height: 18, background: P.greenLight, borderRadius: 9, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${P.green} 0%, #5ECFA0 100%)`,
          borderRadius: 9,
          transition: "none",
        }} />
      </div>
    </div>
  );
};

// Minimal confetti — deterministic via random()
const Confetti: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 14 }, (_, i) => ({
    x: random(`cx${i}`) * 900 + 90,
    startY: -30,
    endY: random(`cy${i}`) * 300 + 100,
    color: [P.purple, P.green, P.gold, P.red][Math.floor(random(`cc${i}`) * 4)],
    size: 8 + random(`cs${i}`) * 10,
    delay: delay + Math.floor(random(`cd${i}`) * 20),
    rotation: random(`cr${i}`) * 360,
  }));

  return (
    <>
      {particles.map((p, i) => {
        const progress = interpolate(frame, [p.delay, p.delay + 40], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const opacity = interpolate(frame, [p.delay + 30, p.delay + 55], [1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        if (progress === 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.startY + (p.endY - p.startY) * progress,
              width: p.size,
              height: p.size * 0.6,
              background: p.color,
              borderRadius: 2,
              opacity,
              transform: `rotate(${p.rotation * progress}deg)`,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

export const Scene5Reward: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
    from: 0.8, to: 1,
  });
  const headlineOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Product focus in
  const productScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
    from: 0.7, to: 1,
  });
  const productOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Trophy
  const trophyScale = spring({
    frame: frame - 95,
    fps,
    config: { damping: 8, stiffness: 280, mass: 0.4 },
    from: 0, to: 1,
  });
  const trophyOpacity = interpolate(frame, [95, 108], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const winTextOpacity = interpolate(frame, [130, 148], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: P.bg,
        display: "flex",
        flexDirection: "column",
        padding: "80px 64px",
        gap: 36,
        overflow: "hidden",
      }}
    >
      <Confetti delay={90} />

      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `scale(${headlineScale})`,
        }}
      >
        <div style={{
          fontFamily: outfit, fontSize: 72, fontWeight: 800,
          color: P.text, letterSpacing: "-0.05em", lineHeight: 1.05,
        }}>
          It feels like{" "}
          <span style={{ color: P.purple }}>winning.</span>
        </div>
      </div>

      {/* Product in focus */}
      <div
        style={{
          opacity: productOpacity,
          transform: `scale(${productScale})`,
          display: "flex",
          alignItems: "center",
          gap: 24,
          background: P.bgCard,
          borderRadius: 28,
          padding: "28px 32px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ fontSize: 64 }}>✨</span>
        <div>
          <div style={{ fontFamily: outfit, fontSize: 38, fontWeight: 800, color: P.purple, letterSpacing: "-0.03em" }}>
            Dupe found
          </div>
          <div style={{ fontFamily: figtree, fontSize: 26, color: P.textSub, marginTop: 4 }}>
            $12 vs $48 original
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar delay={50} />

      {/* Trophy + win */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{
          opacity: trophyOpacity,
          transform: `scale(${trophyScale})`,
          fontSize: 80, lineHeight: 1,
        }}>
          🏆
        </div>
        <div
          style={{
            opacity: winTextOpacity,
            fontFamily: outfit, fontSize: 44, fontWeight: 800,
            color: P.text, letterSpacing: "-0.03em", lineHeight: 1.1,
          }}
        >
          You beat<br />the system.
        </div>
      </div>

      {/* Draw checkmark */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <DrawCheckmark delay={140} size={100} color={P.green} />
      </div>
    </AbsoluteFill>
  );
};
