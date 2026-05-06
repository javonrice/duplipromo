import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";

interface PhoneMockupProps {
  children?: React.ReactNode;
  scale?: number;
  delay?: number;
  accentColor?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  scale = 1,
  delay = 0,
  accentColor = COLORS.ink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = interpolate(frame, [delay, delay + fps * 0.8], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [delay, delay + fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // iPhone 14 Pro-ish proportions: 390 × 844 → ratio ≈ 2.165
  const phoneW = 340 * scale;
  const phoneH = phoneW * 2.165;
  const borderR = 44 * scale;
  const notchW = 110 * scale;
  const notchH = 34 * scale;
  const sideInset = 10 * scale;
  const screenInset = 12 * scale;

  return (
    <div
      style={{
        transform: `translateY(${slideUp}px)`,
        opacity,
        position: "relative",
        width: phoneW,
        height: phoneH,
        flexShrink: 0,
      }}
    >
      {/* Phone body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: borderR,
          background: `linear-gradient(160deg, #2a2830 0%, #18171e 100%)`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)`,
        }}
      />

      {/* Side buttons — volume */}
      <div
        style={{
          position: "absolute",
          left: -sideInset * 0.6,
          top: phoneH * 0.22,
          width: sideInset * 0.6,
          height: phoneH * 0.06,
          background: "#333",
          borderRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -sideInset * 0.6,
          top: phoneH * 0.30,
          width: sideInset * 0.6,
          height: phoneH * 0.06,
          background: "#333",
          borderRadius: 3,
        }}
      />
      {/* Power button */}
      <div
        style={{
          position: "absolute",
          right: -sideInset * 0.6,
          top: phoneH * 0.26,
          width: sideInset * 0.6,
          height: phoneH * 0.09,
          background: "#333",
          borderRadius: 3,
        }}
      />

      {/* Screen area */}
      <div
        style={{
          position: "absolute",
          top: screenInset,
          left: screenInset,
          right: screenInset,
          bottom: screenInset,
          borderRadius: borderR - screenInset,
          overflow: "hidden",
          background: COLORS.cream,
        }}
      >
        {children}

        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 12 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: notchW,
            height: notchH,
            background: "#0a0a0a",
            borderRadius: notchH,
            zIndex: 10,
          }}
        />
      </div>

      {/* Screen glare */}
      <div
        style={{
          position: "absolute",
          top: screenInset,
          left: screenInset,
          right: screenInset,
          height: phoneH * 0.25,
          borderRadius: `${borderR - screenInset}px ${borderR - screenInset}px 60% 60%`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
