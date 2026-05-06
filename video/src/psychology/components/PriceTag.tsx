import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "../tokens";

interface PriceTagProps {
  price: string;
  label: string;
  delay?: number;
  accentColor?: string;
  bgColor?: string;
  size?: "sm" | "md" | "lg";
  fromDir?: "left" | "right" | "bottom";
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  label,
  delay = 0,
  accentColor = P.text,
  bgColor = P.bgCard,
  size = "md",
  fromDir = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
    from: 0.7,
    to: 1,
  });

  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const offset = fromDir === "left" ? -40 : fromDir === "right" ? 40 : 30;
  const axis = fromDir === "bottom" ? "Y" : "X";
  const translate = interpolate(frame, [delay, delay + 18], [offset, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const sizes = {
    sm: { price: 44, label: 20, pad: "14px 22px", radius: 18 },
    md: { price: 64, label: 24, pad: "20px 32px", radius: 24 },
    lg: { price: 88, label: 28, pad: "26px 40px", radius: 28 },
  };
  const s = sizes[size];

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translate${axis}(${translate}px)`,
        background: bgColor,
        borderRadius: s.radius,
        padding: s.pad,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 2px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: `2px solid ${accentColor}20`,
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontFamily: P.fontBody,
          fontSize: s.label,
          color: P.textSub,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: P.fontDisplay,
          fontSize: s.price,
          fontWeight: 800,
          color: accentColor,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {price}
      </div>
    </div>
  );
};
