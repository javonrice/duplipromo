# DupliPromo — Claude + Remotion Skills

This project creates promo videos and motion graphic videos programmatically using **Remotion** (React-based video framework). Claude Code uses this file as the authoritative guide for all video generation work.

---

## Project Purpose

Build high-quality promo videos, product demos, motion graphics, and social media clips programmatically with React + Remotion. All output is deterministic, version-controlled, and renderable to MP4/WebM.

---

## New Project Setup

When starting from an empty workspace with no Remotion project yet:

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
```

Replace `my-video` with a descriptive project name.

---

## Core Remotion Concepts

### Determinism is mandatory

Remotion renders by scrubbing through frames — every frame must produce the **exact same output** each time it is rendered at that frame number.

- **FORBIDDEN**: `Math.random()`, `Date.now()`, `new Date()`, CSS transitions, CSS animations, Tailwind animation classes
- **USE INSTEAD**: `random(seed)` from `remotion` for reproducible randomness; `useCurrentFrame()` for time

### Root composition (`src/Root.tsx`)

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={300}  // 10 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

Common resolutions:
- `1920×1080` — landscape (YouTube, ads)
- `1080×1080` — square (Instagram)
- `1080×1920` — vertical (Reels, Shorts, TikTok)
- `1280×720` — HD landscape

### Key hooks

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();           // current frame (0-based)
const { fps, durationInFrames, width, height } = useVideoConfig();
```

---

## Animation

### `interpolate()` — the primary animation tool

```tsx
import { interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Fade in over first 0.5 seconds
const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1), // ease-out-expo — crisp UI entrance
});
```

**Always clamp** unless you explicitly want extrapolation.

### Easing presets

| Curve | Use case |
|-------|----------|
| `Easing.bezier(0.16, 1, 0.3, 1)` | Crisp UI entrance — slows into rest |
| `Easing.bezier(0.45, 0, 0.55, 1)` | Editorial fade — balanced in/out |
| `Easing.bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot |
| `Easing.out(Easing.cubic)` | Enter animations |
| `Easing.in(Easing.cubic)` | Exit animations |
| `Easing.inOut(Easing.sin)` | Smooth continuous motion |

### `spring()` — physics-based motion

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: { damping: 14, stiffness: 180, mass: 0.5 },
  from: 0,
  to: 1,
});
```

Higher damping = less bounce. Lower stiffness = slower spring.

### Normalized progress pattern

Create one `progress` value (0–1) and derive all animated properties from it. This keeps timing logic in one place:

```tsx
const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});

const opacity = progress;
const translateY = interpolate(progress, [0, 1], [40, 0]);
const scale = interpolate(progress, [0, 1], [0.9, 1]);
```

---

## Layout Components

### `AbsoluteFill`

Full-frame absolute positioned layer. Stack multiple for layered compositions:

```tsx
import { AbsoluteFill } from "remotion";

<AbsoluteFill style={{ backgroundColor: "#0f0f0f" }}>
  <BackgroundLayer />
</AbsoluteFill>
<AbsoluteFill>
  <ContentLayer />
</AbsoluteFill>
```

### `Sequence` — timing control

Delays and limits duration of child elements:

```tsx
import { Sequence } from "remotion";

// Show title starting at frame 30, lasting 60 frames
<Sequence from={30} durationInFrames={60} layout="none">
  <Title />
</Sequence>
```

- `layout="none"` — for inline content (default is AbsoluteFill)
- `from` — start frame (can be negative to trim the beginning)
- `durationInFrames` — clip duration

### `Series` — sequential scenes

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={90}>
    <SceneOne />
  </Series.Sequence>
  <Series.Sequence durationInFrames={90}>
    <SceneTwo />
  </Series.Sequence>
</Series>
```

### `TransitionSeries` — scenes with transitions

```bash
npx remotion add @remotion/transitions
```

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneOne />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={{ durationInFrames: 20 }}
  />
  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneTwo />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Built-in transitions: `fade`, `slide`, `wipe`, `flip`, `clockWipe`.  
Note: transitions overlap scenes — total duration is reduced by the transition length.

---

## Media

### Images

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("logo.png")} style={{ width: 200 }} />
// or remote:
<Img src="https://example.com/image.png" />
```

### Video

```tsx
import { OffthreadVideo, staticFile } from "remotion";

<OffthreadVideo
  src={staticFile("clip.mp4")}
  startFrom={30}     // trim first second (at 30fps)
  endAt={150}        // end at 5 seconds
  volume={0.8}
/>
```

Use `<OffthreadVideo>` (not `<Video>`) for reliable multi-threaded rendering.

### Audio

```tsx
import { Audio, staticFile } from "remotion";

<Audio
  src={staticFile("music.mp3")}
  startFrom={0}
  volume={0.6}
/>
```

Place all assets in `public/` folder. Reference with `staticFile("filename")`.

### GIFs

```bash
npx remotion add @remotion/gif
```

```tsx
import { Gif } from "@remotion/gif";
import { staticFile } from "remotion";

<Gif src={staticFile("animation.gif")} fit="cover" />
```

---

## Text Animations

### Typewriter effect

```tsx
const frame = useCurrentFrame();
const text = "Hello World";
const charsToShow = Math.floor(interpolate(frame, [0, 60], [0, text.length], {
  extrapolateRight: "clamp",
}));
const visible = text.slice(0, charsToShow);

return <div>{visible}<span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>|</span></div>;
```

Always use **string slicing** for typewriter — never per-character opacity.

### Word-by-word reveal

```tsx
const words = "Great promo videos start here".split(" ");

return (
  <div>
    {words.map((word, i) => {
      const wordStart = i * 8; // stagger by 8 frames per word
      const wordOpacity = interpolate(frame, [wordStart, wordStart + 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return (
        <span key={i} style={{ opacity: wordOpacity, marginRight: 8 }}>
          {word}
        </span>
      );
    })}
  </div>
);
```

---

## Google Fonts

```bash
npm i @remotion/google-fonts
```

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });

<div style={{ fontFamily }}>Promo Text</div>
```

Call `loadFont()` at the **top level** of the module (not inside render).

---

## 3D Content (Three.js + React Three Fiber)

```bash
npx remotion add @remotion/three
```

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const rotation = frame * 0.05;

<ThreeCanvas width={1920} height={1080}>
  <ambientLight intensity={0.4} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  <mesh rotation={[0, rotation, 0]}>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="#6366f1" />
  </mesh>
</ThreeCanvas>
```

**Rules for 3D in Remotion:**
- NEVER use `useFrame()` from R3F — causes flickering
- Control all animation through `useCurrentFrame()`
- Always set `layout="none"` on `<Sequence>` inside `<ThreeCanvas>`

---

## Parameterized Videos (Zod Schema)

```bash
npm i zod
```

```tsx
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { Composition } from "remotion";

const schema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accentColor: zColor(),
  durationSeconds: z.number().min(1).max(60),
});

type Props = z.infer<typeof schema>;

export const MyVideo: React.FC<Props> = ({ title, subtitle, accentColor }) => {
  // ...
};

// In Root.tsx:
<Composition
  id="MyVideo"
  component={MyVideo}
  schema={schema}
  defaultProps={{
    title: "Your Product Name",
    subtitle: "The tagline goes here",
    accentColor: "#6366f1",
    durationSeconds: 15,
  }}
  durationInFrames={450}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

## Dynamic Duration with `calculateMetadata`

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  return {
    durationInFrames: Math.ceil(props.durationSeconds * 30),
    props,
  };
};

<Composition calculateMetadata={calculateMetadata} ... />
```

---

## Audio Visualization

```tsx
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile } from "remotion";

const audioData = useWindowedAudioData({
  src: staticFile("music.mp3"),
  frame,
  fps,
  windowInSeconds: 1 / fps,
});

const frequencies = audioData
  ? visualizeAudio({ audioData, numberOfSamples: 64, frame, fps })
  : new Array(64).fill(0);

// Bass reactivity
const bass = frequencies.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
```

---

## AI Voiceover (ElevenLabs)

Generate MP3 files via ElevenLabs API and place them in `public/`. Use `calculateMetadata` to auto-size the composition to match audio duration:

```tsx
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const duration = await getAudioDurationInSeconds(staticFile("voiceover.mp3"));
  return { durationInFrames: Math.ceil(duration * 30), props };
};
```

Environment variable required: `ELEVENLABS_API_KEY`

---

## Promo Video Patterns

### Hero title reveal
1. Solid or gradient background (`AbsoluteFill`)
2. Logo/brand mark scales in with `spring()`
3. Headline slides up + fades in via `Sequence from={fps * 0.5}`
4. Subtitle appears with typewriter effect
5. CTA button bounces in at `Sequence from={fps * 2}`

### Product demo scene
1. Device mockup enters from bottom
2. Screen content fades in inside mockup
3. Feature callouts animate in with staggered delays
4. Text badges slide in from sides

### Lower thirds / captions
- Use `Sequence` to time appearance precisely
- Slide in from left with `translateX` interpolation
- Background bar scales width from 0 → full

### Scene transitions
- Crossfade: `TransitionSeries` + `fade()` at 20 frames
- Directional slide: `slide({ direction: "from-right" })`
- Hard cut: just use `Series` with no transition

---

## Studio & Rendering

```bash
# Start preview studio
npx remotion studio

# Single-frame check (1-second mark)
npx remotion still MyVideo --scale=0.25 --frame=30

# Render full video
npx remotion render MyVideo out/promo.mp4

# Render with custom props
npx remotion render MyVideo out/promo.mp4 --props='{"title":"Launch Day"}'
```

---

## Quality Checklist Before Rendering

- [ ] No `Math.random()`, `Date.now()`, or CSS animations
- [ ] All assets in `public/` referenced with `staticFile()`
- [ ] All `interpolate()` calls have `extrapolateLeft/Right: "clamp"` where needed
- [ ] `<Sequence>` uses `layout="none"` for inline content
- [ ] 3D content uses `useCurrentFrame()` not `useFrame()`
- [ ] Fonts loaded at module top level with `loadFont()`
- [ ] Composition `durationInFrames` matches intended video length
- [ ] Preview checked in Remotion Studio before final render

---

## Sources

- [Remotion GitHub](https://github.com/remotion-dev/remotion)
- [Remotion Official Skills](https://github.com/remotion-dev/skills)
- [Remotion Docs](https://www.remotion.dev/docs)
- [ThariqS Remotion CLAUDE.md Gist](https://gist.github.com/ThariqS/3d446e7c7aa9eb94f468194deb73028f)
