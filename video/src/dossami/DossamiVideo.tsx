import React from "react";
import {
  AbsoluteFill, Audio, Easing, interpolate, Sequence,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";

const { fontFamily } = loadFont("italic", { weights: ["300", "400"], subsets: ["latin"] });

// ── Types ─────────────────────────────────────────────────────────────────────

type AnimationType =
  | "draw_in" | "spring_in" | "fade_in" | "translate_in"
  | "pulse" | "rotate_continuous" | "float_up" | "oscillate_x";

export interface ElementSpec {
  type: "circle" | "ellipse" | "line" | "rect" | "triangle" | "arc"
      | "stick_figure" | "arrow" | "wave" | "dots" | "star";
  animation: AnimationType;
  delay: number;
  cx?: number; cy?: number; r?: number; rx?: number; ry?: number;
  startAngle?: number; endAngle?: number;
  x1?: number; y1?: number; x2?: number; y2?: number;
  x?: number; y?: number; w?: number; h?: number;
  size?: number; pointing?: "up" | "down" | "left" | "right";
  width?: number; amplitude?: number; frequency?: number;
  scale?: number; points?: number;
  dotPoints?: Array<{ x: number; y: number; r: number }>;
  from_x?: number; from_y?: number;
  speed?: number;
}

export interface SceneData {
  sentence: string;
  elements: ElementSpec[];
}

// ── Script helpers ────────────────────────────────────────────────────────────

function splitScript(script: string): string[] {
  return script
    .split(/\n\n+/)
    .flatMap((p) => p.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildSegments(
  sentences: string[],
  scenes: SceneData[],
  totalFrames: number,
) {
  const counts = sentences.map((s) => Math.max(1, s.split(/\s+/).length));
  const totalWords = counts.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return sentences.map((text, i) => {
    const isLast = i === sentences.length - 1;
    const frames = isLast
      ? Math.max(1, totalFrames - cursor)
      : Math.max(24, Math.round((counts[i] / totalWords) * totalFrames));
    const from = cursor;
    cursor += frames;
    return { text, from, durationInFrames: frames, index: i, elements: scenes[i]?.elements ?? [] };
  });
}

// ── SVG geometry helpers ──────────────────────────────────────────────────────

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(startDeg));
  const sy = cy + r * Math.sin(toRad(startDeg));
  const ex = cx + r * Math.cos(toRad(endDeg));
  const ey = cy + r * Math.sin(toRad(endDeg));
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
}

function trianglePath(cx: number, cy: number, size: number, pointing: string): string {
  const h = (size * Math.sqrt(3)) / 2;
  if (pointing === "down")
    return `M ${cx} ${cy + h * 0.667} L ${cx - size / 2} ${cy - h * 0.333} L ${cx + size / 2} ${cy - h * 0.333} Z`;
  if (pointing === "left")
    return `M ${cx - h * 0.667} ${cy} L ${cx + h * 0.333} ${cy - size / 2} L ${cx + h * 0.333} ${cy + size / 2} Z`;
  if (pointing === "right")
    return `M ${cx + h * 0.667} ${cy} L ${cx - h * 0.333} ${cy - size / 2} L ${cx - h * 0.333} ${cy + size / 2} Z`;
  return `M ${cx} ${cy - h * 0.667} L ${cx - size / 2} ${cy + h * 0.333} L ${cx + size / 2} ${cy + h * 0.333} Z`;
}

function starPath(cx: number, cy: number, outerR: number, numPoints: number): string {
  const innerR = outerR * 0.4;
  const pts: string[] = [];
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

function wavePoints(cx: number, cy: number, width: number, amplitude: number, frequency: number): string {
  const n = 60;
  return Array.from({ length: n }, (_, i) => {
    const px = cx - width / 2 + (i / (n - 1)) * width;
    const py = cy + amplitude * Math.sin((i / (n - 1)) * frequency * Math.PI * 2);
    return `${px},${py}`;
  }).join(" ");
}

function elementLength(el: ElementSpec): number {
  switch (el.type) {
    case "circle": return 2 * Math.PI * (el.r ?? 50);
    case "ellipse": {
      const a = el.rx ?? 50, b = el.ry ?? 30;
      return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    }
    case "arc": {
      const span = Math.abs((el.endAngle ?? 300) - (el.startAngle ?? 0));
      return (span * Math.PI / 180) * (el.r ?? 50);
    }
    case "line":
    case "arrow": {
      const dx = (el.x2 ?? 340) - (el.x1 ?? 200);
      const dy = (el.y2 ?? 270) - (el.y1 ?? 270);
      return Math.sqrt(dx * dx + dy * dy);
    }
    case "rect": return 2 * ((el.w ?? 100) + (el.h ?? 80));
    case "triangle": return (el.size ?? 80) * 3;
    case "wave": return el.width ?? 300;
    case "star": return (el.points ?? 5) * 2 * (el.r ?? 50);
    default: return 200;
  }
}

// ── SVG shape renderer ────────────────────────────────────────────────────────

const SW = 1.5;

interface DashProps {
  strokeDasharray?: string;
  strokeDashoffset?: number;
}

function renderShape(el: ElementSpec, dash: DashProps): React.ReactNode {
  switch (el.type) {
    case "circle":
      return (
        <circle
          cx={el.cx ?? 270} cy={el.cy ?? 270} r={el.r ?? 60}
          stroke="white" strokeWidth={SW} fill="none"
          {...dash}
        />
      );

    case "ellipse":
      return (
        <ellipse
          cx={el.cx ?? 270} cy={el.cy ?? 270} rx={el.rx ?? 70} ry={el.ry ?? 40}
          stroke="white" strokeWidth={SW} fill="none"
          {...dash}
        />
      );

    case "line":
      return (
        <line
          x1={el.x1 ?? 150} y1={el.y1 ?? 270} x2={el.x2 ?? 390} y2={el.y2 ?? 270}
          stroke="white" strokeWidth={SW} strokeLinecap="round"
          {...dash}
        />
      );

    case "rect":
      return (
        <rect
          x={el.x ?? 170} y={el.y ?? 190} width={el.w ?? 200} height={el.h ?? 160} rx={el.rx ?? 8}
          stroke="white" strokeWidth={SW} fill="none"
          {...dash}
        />
      );

    case "triangle":
      return (
        <path
          d={trianglePath(el.cx ?? 270, el.cy ?? 240, el.size ?? 120, el.pointing ?? "up")}
          stroke="white" strokeWidth={SW} fill="none" strokeLinejoin="round"
          {...dash}
        />
      );

    case "arc":
      return (
        <path
          d={arcPath(el.cx ?? 270, el.cy ?? 270, el.r ?? 60, el.startAngle ?? 0, el.endAngle ?? 270)}
          stroke="white" strokeWidth={SW} fill="none" strokeLinecap="round"
          {...dash}
        />
      );

    case "stick_figure": {
      const s = el.scale ?? 1;
      const cx = el.cx ?? 270;
      const cy = el.cy ?? 270;
      const hr = 18 * s;
      return (
        <g stroke="white" strokeWidth={SW} fill="none" strokeLinecap="round">
          <circle cx={cx} cy={cy - hr * 2.5} r={hr} />
          <line x1={cx} y1={cy - hr * 1.5} x2={cx} y2={cy + hr * 1.2} />
          <line x1={cx - hr * 1.8} y1={cy - hr * 0.8} x2={cx + hr * 1.8} y2={cy - hr * 0.8} />
          <line x1={cx} y1={cy + hr * 1.2} x2={cx - hr * 1.4} y2={cy + hr * 3} />
          <line x1={cx} y1={cy + hr * 1.2} x2={cx + hr * 1.4} y2={cy + hr * 3} />
        </g>
      );
    }

    case "arrow": {
      const x1 = el.x1 ?? 150, y1 = el.y1 ?? 270;
      const x2 = el.x2 ?? 390, y2 = el.y2 ?? 270;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const hs = 14;
      return (
        <g stroke="white" strokeWidth={SW} fill="none" strokeLinecap="round">
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
          <line x1={x2} y1={y2} x2={x2 - hs * Math.cos(angle - Math.PI / 7)} y2={y2 - hs * Math.sin(angle - Math.PI / 7)} />
          <line x1={x2} y1={y2} x2={x2 - hs * Math.cos(angle + Math.PI / 7)} y2={y2 - hs * Math.sin(angle + Math.PI / 7)} />
        </g>
      );
    }

    case "wave":
      return (
        <polyline
          points={wavePoints(el.cx ?? 270, el.cy ?? 270, el.width ?? 360, el.amplitude ?? 30, el.frequency ?? 2)}
          stroke="white" strokeWidth={SW} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          {...dash}
        />
      );

    case "dots":
      return (
        <>
          {(el.dotPoints ?? [{ x: 270, y: 260, r: 8 }, { x: 295, y: 242, r: 6 }, { x: 315, y: 230, r: 4 }]).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} stroke="white" strokeWidth={SW} fill="none" />
          ))}
        </>
      );

    case "star":
      return (
        <path
          d={starPath(el.cx ?? 270, el.cy ?? 270, el.r ?? 60, el.points ?? 5)}
          stroke="white" strokeWidth={SW} fill="none"
          {...dash}
        />
      );

    default:
      return null;
  }
}

// ── Animated element ──────────────────────────────────────────────────────────

const DRAW_FRAMES = 25;

const SceneElement: React.FC<{ el: ElementSpec }> = ({ el }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - el.delay);

  const cx = el.cx ?? el.x1 ?? 270;
  const cy = el.cy ?? el.y1 ?? 270;

  let opacity = 1;
  let transform = "";
  let strokeDasharray: string | undefined;
  let strokeDashoffset: number | undefined;
  const transformOrigin = `${cx}px ${cy}px`;

  switch (el.animation) {
    case "fade_in": {
      opacity = interpolate(f, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      break;
    }
    case "spring_in": {
      const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 220, mass: 0.5 }, from: 0, to: 1 });
      opacity = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      transform = `scale(${s})`;
      break;
    }
    case "draw_in": {
      if (el.type === "stick_figure" || el.type === "dots" || el.type === "arrow") {
        opacity = interpolate(f, [0, DRAW_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      } else {
        const len = elementLength(el);
        strokeDasharray = `${len}`;
        strokeDashoffset = interpolate(f, [0, DRAW_FRAMES], [len, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
      }
      break;
    }
    case "translate_in": {
      const fromX = el.from_x ?? cx - 80;
      const fromY = el.from_y ?? cy;
      const p = interpolate(f, [0, 20], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      transform = `translate(${(fromX - cx) * (1 - p)}px, ${(fromY - cy) * (1 - p)}px)`;
      opacity = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      break;
    }
    case "pulse": {
      const s = 1 + 0.06 * Math.sin((f / fps) * Math.PI * 2);
      opacity = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      transform = `scale(${s})`;
      break;
    }
    case "rotate_continuous": {
      const speed = el.speed ?? 1;
      const deg = (f / fps) * 360 * speed;
      opacity = interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      transform = `rotate(${deg}deg)`;
      break;
    }
    case "float_up": {
      const drift = 14 * Math.sin((f / fps) * Math.PI);
      opacity = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      transform = `translateY(${-drift}px)`;
      break;
    }
    case "oscillate_x": {
      const amp = el.amplitude ?? 60;
      const spd = el.speed ?? 1;
      const dx = amp * Math.sin((f / fps) * Math.PI * 2 * spd);
      opacity = interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      transform = `translateX(${dx}px)`;
      break;
    }
  }

  const dash: DashProps = {};
  if (strokeDasharray !== undefined) dash.strokeDasharray = strokeDasharray;
  if (strokeDashoffset !== undefined) dash.strokeDashoffset = strokeDashoffset;

  const shape = renderShape(el, dash);
  if (!shape) return null;

  return (
    <g
      style={{
        opacity,
        transform,
        transformOrigin,
        filter: "drop-shadow(0 0 12px rgba(255,255,255,0.25))",
      }}
    >
      {shape}
    </g>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────

const Scene: React.FC<{
  text: string;
  elements: ElementSpec[];
  durationInFrames: number;
}> = ({ text, elements, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const exitStart = durationInFrames - 12;
  const exitOp = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const textOp = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [0, 18], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const words = text.split(/\s+/).length;
  const fontSize = words <= 5 ? 72 : words <= 9 ? 60 : words <= 14 ? 50 : 42;

  const svgSize = Math.min(width * 0.72, 540);
  const svgTop = height * 0.08;

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      {/* Illustration — top 60% */}
      <div style={{
        position: "absolute",
        top: svgTop,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: exitOp,
      }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 540 540"
          style={{ overflow: "visible" }}
        >
          {elements.map((el, i) => (
            <SceneElement key={i} el={el} />
          ))}
        </svg>
      </div>

      {/* Text — bottom 30% */}
      <AbsoluteFill style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: height * 0.12,
        paddingLeft: width * 0.1,
        paddingRight: width * 0.1,
        opacity: exitOp,
      }}>
        <div style={{
          opacity: textOp,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
          fontFamily,
          fontSize,
          fontStyle: "italic",
          fontWeight: 300,
          color: "#ffffff",
          lineHeight: 1.3,
          letterSpacing: "0.02em",
        }}>
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const w = (frame / durationInFrames) * width;
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0,
      width: w, height: 2,
      background: "white",
      opacity: 0.2,
    }} />
  );
};

// ── Root component ────────────────────────────────────────────────────────────

export interface DossamiVideoProps {
  script: string;
  style: string;
  size: "9:16" | "16:9";
  _scenes?: SceneData[];
}

export const DossamiVideo: React.FC<DossamiVideoProps> = ({ script, _scenes }) => {
  const { durationInFrames } = useVideoConfig();

  const sentences = _scenes?.length
    ? _scenes.map((s) => s.sentence)
    : splitScript(script);

  const scenesData: SceneData[] = _scenes?.length
    ? _scenes
    : sentences.map((sentence) => ({ sentence, elements: [] }));

  const segments = buildSegments(sentences, scenesData, durationInFrames);

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <Audio src={staticFile("voiceover-dossami.mp3")} volume={1} />
      {segments.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.durationInFrames} layout="none">
          <AbsoluteFill>
            <Scene
              text={seg.text}
              elements={seg.elements}
              durationInFrames={seg.durationInFrames}
            />
          </AbsoluteFill>
        </Sequence>
      ))}
      <ProgressBar />
    </AbsoluteFill>
  );
};
