import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { HookScene } from "./scenes/HookScene";
import { ProductScene } from "./scenes/ProductScene";
import { SavingsScene } from "./scenes/SavingsScene";
import { CTAScene } from "./scenes/CTAScene";
import { HAUL_SCENES, PRODUCTS, T } from "./tokens";

/*
  Voiceover sync map (matches generate-voiceover-haul.mjs script):

  0:00–0:02   Hook — "Okay I'm at Dollar Tree and Dupli just found me four dupes..."
  0:03–0:11   Product 1 (tumbler) — "First — this Aquaflow tumbler..."
  0:12–0:19   Product 2 (serum)   — "Second — B Pure Vitamin C serum capsules..."
  0:20–0:27   Product 3 (body wash) — "Third — Eve St. Claire body wash..."
  0:28–0:34   Product 4 (deodorant) — "Fourth — BPure aluminum-free deodorant..."
  0:35–0:39   Savings card         — "Total savings today — one hundred and fifty-seven dollars..."
  0:40–0:57   CTA                  — "Dupli is the app that finds you these. It's free. Link in bio."
*/

export const HaulVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("voiceover-haul.mp3")} volume={1} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.hook}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.product1}>
          <ProductScene product={PRODUCTS[0]} productNum={1} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.product2}>
          <ProductScene product={PRODUCTS[1]} productNum={2} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.product3}>
          <ProductScene product={PRODUCTS[2]} productNum={3} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.product4}>
          <ProductScene product={PRODUCTS[3]} productNum={4} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.savings}>
          <SavingsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
