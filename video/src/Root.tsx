import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { DupliPromo } from "./DupliPromo";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./brand";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DupliPromo"
        component={DupliPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
