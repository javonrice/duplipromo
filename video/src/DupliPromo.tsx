import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HookScene } from "./scenes/HookScene";
import { IntroScene } from "./scenes/IntroScene";
import { ScanScene } from "./scenes/ScanScene";
import { ResultsScene } from "./scenes/ResultsScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { CTAScene } from "./scenes/CTAScene";
import { SCENES, TRANSITION_FRAMES } from "./brand";

export const DupliPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/*
        Voiceover audio — place your generated MP3 at public/voiceover.mp3
        Run: node scripts/generate-voiceover.mjs (requires ELEVENLABS_API_KEY)
      */}
      {/* <Audio src={staticFile("voiceover.mp3")} volume={0.9} /> */}

      <TransitionSeries>
        {/* Scene 1 — Hook: "Snap any product. Find the dupe." */}
        <TransitionSeries.Sequence durationInFrames={SCENES.hook}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 2 — Intro: Dupli logo reveal */}
        <TransitionSeries.Sequence durationInFrames={SCENES.intro}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 3 — Scan: Phone mockup + scanning animation */}
        <TransitionSeries.Sequence durationInFrames={SCENES.scan}>
          <ScanScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 4 — Results: Dupe card + savings */}
        <TransitionSeries.Sequence durationInFrames={SCENES.results}>
          <ResultsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 5 — Features: Ingredient match + verdict callouts */}
        <TransitionSeries.Sequence durationInFrames={SCENES.features}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 6 — CTA: Download Dupli */}
        <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
