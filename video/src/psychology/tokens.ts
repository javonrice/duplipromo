// Black & white minimalist design tokens

export const BW = {
  bg: "#080808",
  fg: "#F5F5F5",
  fgDim: "#777777",
  fgVeryDim: "#333333",
  stroke: 3,
};

export const PSYCH_SCENES = {
  hook: 90,
  priceAnchoring: 210,
  lossAversion: 240,
  smartShopper: 210,
  reward: 180,
  brand: 180,
};

export const PSYCH_TRANSITION = 10;

export const PSYCH_TOTAL =
  Object.values(PSYCH_SCENES).reduce((a, b) => a + b, 0) -
  (Object.keys(PSYCH_SCENES).length - 1) * PSYCH_TRANSITION;
