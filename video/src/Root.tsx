import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { DupliPromo } from "./DupliPromo";
import { PsychologyVideo } from "./psychology/PsychologyVideo";
import { HaulVideo } from "./haul/HaulVideo";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./brand";
import { PSYCH_TOTAL } from "./psychology/tokens";
import { HAUL_TOTAL, HAUL_FPS, HAUL_WIDTH, HAUL_HEIGHT } from "./haul/tokens";

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
      <Composition
        id="DollarTreeHaul"
        component={HaulVideo}
        durationInFrames={HAUL_TOTAL}
        fps={HAUL_FPS}
        width={HAUL_WIDTH}
        height={HAUL_HEIGHT}
      />
    </>
  );
};
