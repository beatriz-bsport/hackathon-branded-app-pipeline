import type { CanvasSpotData, SpotType } from "@bsport/api-book";

export const DEFAULT_RADIUS = 20;
export const DEFAULT_SQUARE = 40;
export const DEFAULT_RECT_W = 60;
export const DEFAULT_RECT_H = 30;
// Legacy parity (saas-legacy CanvasSpot.component.tsx SPOT_IMAGE_WIDTH /
// SPOT_IMAGE_HEIGHT / LENGTH_REFERENCE): personalized spots fall back to a
// 62×62 box on each axis only when the wire data ships no width/height.
// Production blueprints (e.g. company 2443 / blueprint 922) author explicit
// width × height per spot (75×150 benches, 90×90 circles).
export const LENGTH_REFERENCE = 62;

/**
 * Resolve the diameter (or square side) used by a circular/square/triangle
 * body. Legacy parity: `data.height` is the authored dimension on the wire
 * for these shapes. `data.radius` is honored for compatibility with any
 * older synthetic data.
 */
const resolveBodySize = (data: CanvasSpotData, fallback: number): number => {
  if (data.height != null) return data.height;
  if (data.radius != null) return data.radius * 2;
  return fallback;
};

export const smallestDim = (
  shape: SpotType["shape"] | undefined,
  data: CanvasSpotData,
  assetUrl: string | undefined,
) => {
  // Legacy parity: image-bearing spots render at authored `width × height`
  // (per-axis LENGTH_REFERENCE fallback). Returning the smaller dimension
  // keeps the default font size legible inside tall benches.
  if (assetUrl) {
    return Math.min(
      data.width ?? LENGTH_REFERENCE,
      data.height ?? LENGTH_REFERENCE,
    );
  }
  switch (shape) {
    case "square":
      return resolveBodySize(data, DEFAULT_SQUARE);
    case "rectangle":
      return Math.min(
        data.width ?? DEFAULT_RECT_W,
        data.height ?? DEFAULT_RECT_H,
      );
    case "triangle":
      return resolveBodySize(data, DEFAULT_SQUARE);
    case "personalized":
    case "circular":
    default:
      return resolveBodySize(data, DEFAULT_RADIUS * 2);
  }
};

export { resolveBodySize };
