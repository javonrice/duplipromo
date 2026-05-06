import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface KineticTextProps {
  text: string;
  style?: React.CSSProperties;
  wordDelay?: number;   // frames between words
  startFrame?: number;
  mode?: "words" | "chars";
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  style = {},
  wordDelay = 6,
  startFrame = 0,
  mode = "words",
}) => {
  const frame = useCurrentFrame();
  const tokens = mode === "words" ? text.split(" ") : text.split("");

  return (
    <span style={{ display: "inline" }}>
      {tokens.map((token, i) => {
        const start = startFrame + i * wordDelay;
        const opacity = interpolate(frame, [start, start + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [start, start + 12], [14, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <span
            key={i}
            style={{
              ...style,
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
              marginRight: mode === "words" ? "0.22em" : 0,
            }}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
};
