export const DOSSAMI_FPS = 30;

export type DossamiStyle = "minimal" | "bold" | "cinematic";
export type DossamiSize = "9:16" | "16:9";

export const DOSSAMI_DIMS: Record<DossamiSize, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
};

export const STYLE_TOKENS: Record<DossamiStyle, {
  bg: string; text: string; accent: string; textDim: string; fontSize: number; fontWeight: number;
}> = {
  minimal: {
    bg: "#080808", text: "#F5F5F5", accent: "#6366F1",
    textDim: "#777777", fontSize: 72, fontWeight: 300,
  },
  bold: {
    bg: "#0D0D0D", text: "#FFFFFF", accent: "#F59E0B",
    textDim: "#AAAAAA", fontSize: 96, fontWeight: 800,
  },
  cinematic: {
    bg: "#000000", text: "#E8E0D0", accent: "#C084FC",
    textDim: "#888880", fontSize: 60, fontWeight: 300,
  },
};
