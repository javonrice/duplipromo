import React from "react";
import "./index.css";
import { Composition, CalculateMetadataFunction } from "remotion";
import { DupliPromo } from "./DupliPromo";
import { PsychologyVideo } from "./psychology/PsychologyVideo";
import { HaulVideo } from "./haul/HaulVideo";
import { DossamiVideo, type DossamiVideoProps, type SceneData } from "./dossami/DossamiVideo";
import { TOTAL_FRAMES, FPS, WIDTH, HEIGHT } from "./brand";
import { PSYCH_TOTAL } from "./psychology/tokens";
import { HAUL_TOTAL, HAUL_FPS, HAUL_WIDTH, HAUL_HEIGHT } from "./haul/tokens";
import { DOSSAMI_FPS, DOSSAMI_DIMS } from "./dossami/tokens";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dossamiMetadata: CalculateMetadataFunction<any> = async ({ props }) => {
  const p = props as DossamiVideoProps;
  const dims = DOSSAMI_DIMS[p.size] ?? DOSSAMI_DIMS["9:16"];

  // Load AI-generated scene data produced by generate-dossami-scenes.mjs
  let _scenes: SceneData[] = [];
  try {
    const res = await fetch(staticFile("dossami-scenes.json"));
    if (res.ok) _scenes = await res.json() as SceneData[];
  } catch { /* no scenes file — component falls back to splitScript */ }

  try {
    const secs = await getAudioDurationInSeconds(staticFile("voiceover-dossami.mp3"));
    return { durationInFrames: Math.ceil(secs * DOSSAMI_FPS), ...dims, props: { ...p, _scenes } };
  } catch {
    const words = (p.script ?? "").trim().split(/\s+/).length;
    const secs = Math.max(5, (words / 150) * 60);
    return { durationInFrames: Math.ceil(secs * DOSSAMI_FPS), ...dims, props: { ...p, _scenes } };
  }
};

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
      <Composition
        id="DossamiVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={DossamiVideo as any}
        calculateMetadata={dossamiMetadata}
        durationInFrames={300}
        fps={DOSSAMI_FPS}
        width={1080}
        height={1920}
        defaultProps={{
          script: "Your script goes here.",
          style: "minimal",
          size: "9:16",
        }}
      />
    </>
  );
};
