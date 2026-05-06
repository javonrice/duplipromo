import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { DupliPromo } from "./DupliPromo";
import { PsychologyVideo } from "./psychology/PsychologyVideo";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./brand";
import { PSYCH_TOTAL } from "./psychology/tokens";

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
      <Composition
        id="DupliPsychology"
        component={PsychologyVideo}
        durationInFrames={PSYCH_TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
