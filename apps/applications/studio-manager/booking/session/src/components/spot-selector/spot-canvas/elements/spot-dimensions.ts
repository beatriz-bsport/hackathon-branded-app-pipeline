import type { CanvasSpotData, SpotType } from "@bsport/api-book";

export const DEFAULT_RADIUS = 20;
export const DEFAULT_SQUARE = 40;
export const DEFAULT_RECT_W = 60;
export const DEFAULT_RECT_H = 30;
// Legacy parity: personalized spot images render at a fixed 40×40 box
// regardless of `data.radius`.
export const PERSONALIZED_IMAGE_SIZE = 40;

export const smallestDim = (
  shape: SpotType["shape"] | undefined,
  data: CanvasSpotData,
  assetUrl: string | undefined,
) => {
  switch (shape) {
    case "square":
      return data.width ?? DEFAULT_SQUARE;
    case "rectangle":
      return Math.min(
        data.width ?? DEFAULT_RECT_W,
        data.height ?? DEFAULT_RECT_H,
      );
    case "triangle":
      return data.width ?? DEFAULT_SQUARE;
    case "personalized":
      // Mirror shapeGeometry: with an asset the body renders at a fixed
      // PERSONALIZED_IMAGE_SIZE box; without one it falls back to a circle of
      // `radius`. Using the radius unconditionally drifts the label fontSize
      // and selection ring offset away from the actual image footprint.
      return assetUrl
        ? PERSONALIZED_IMAGE_SIZE
        : (data.radius ?? DEFAULT_RADIUS) * 2;
    case "circular":
    default:
      return (data.radius ?? DEFAULT_RADIUS) * 2;
  }
};
