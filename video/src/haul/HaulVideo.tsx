import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { HookScene } from "./scenes/HookScene";
import { ProductScene } from "./scenes/ProductScene";
import { DupliSpotlightScene } from "./scenes/DupliSpotlightScene";
import { QuickFindsScene } from "./scenes/QuickFindsScene";
import { CTAScene } from "./scenes/CTAScene";
import { HAUL_SCENES } from "./tokens";
import { H } from "./tokens";

const T = 12; // transition length in frames

/*
  Voiceover timing (for ElevenLabs):
  0:00  "Okay I literally just walked into Dollar Tree and I am on a mission."
  0:03  [Product 1 — tumbler] "They got a whole new shipment. First thing I see — these tumblers. A dollar."
  0:12  [Product 2 — serum]  "Next — vitamin C serum. I've seen this exact formula at Sephora for $28."
  0:20  [Dupli spotlight]    "This is where it gets good. I've been using this app called Dupli..."
  0:31  [Quick finds]        "Look at this haul — cables, masks, candles, jars. All a dollar."
  0:38  [CTA]                "Dupli is free. Link in bio. You are so welcome."
*/

export const HaulVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: H.bg }}>
      <TransitionSeries>

        {/* 1. Hook */}
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.hook}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* 2. Product 1 — Tumbler (Stanley dupe) */}
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.product1}>
          <ProductScene
            name="Insulated Tumbler"
            category="Drinkware"
            trePrice="$1.25"
            dupeOf="Stanley Quencher"
            dupePrice="$45"
            reactionText="WAIT. $1.25 ??"
            bgColor="#DBEAFE"
            photoEmoji="🥤"
            showDupliScan
            scanDelay={100}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* 3. Product 2 — Serum (Sephora dupe) */}
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.product2}>
          <ProductScene
            name="Vitamin C Serum"
            category="Skincare"
            trePrice="$1.25"
            dupeOf="Skinceuticals CE Ferulic"
            dupePrice="$28"
            reactionText="NO WAY 😭"
            bgColor="#DCFCE7"
            photoEmoji="🧴"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* 4. Dupli spotlight — app reveal */}
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.dupliSpot}>
          <DupliSpotlightScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* 5. Quick finds grid */}
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.quickFinds}>
          <QuickFindsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* 6. CTA */}
        <TransitionSeries.Sequence durationInFrames={HAUL_SCENES.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};
