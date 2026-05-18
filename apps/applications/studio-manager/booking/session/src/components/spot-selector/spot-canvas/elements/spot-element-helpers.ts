import type { CanvasSpotData, SpotType } from "@bsport/api-book";

import type { SpotVisualState } from "../spot-styles";
import {
  DEFAULT_RADIUS,
  DEFAULT_RECT_H,
  DEFAULT_RECT_W,
  DEFAULT_SQUARE,
  LENGTH_REFERENCE,
  resolveBodySize,
} from "./spot-dimensions";

export type LabelAnchor = { x: number; y: number };
export type RotationCentre = { cx: number; cy: number };

/**
 * Position the spot's label inside its local frame. Legacy parity
 * (saas-legacy `CanvasSpot.component.tsx`).
 *
 * **Note the personalized-spot axis swap** (lines 144-151 in legacy):
 * `textPositionX = height / 2`, `textPositionY = width / 2`. This swap is
 * intentional in the legacy renderer — authored `textOffsetX` /
 * `textOffsetY` values in production data are tuned against the swap, so
 * "fixing" it here would shift every label in every existing studio's
 * blueprint. Triangle adds the legacy `+13` baseline nudge.
 */
export const labelAnchor = (
  shape: SpotType["shape"] | undefined,
  data: CanvasSpotData,
  assetUrl: string | undefined,
): LabelAnchor => {
  const tx = data.textOffsetX ?? 0;
  const ty = data.textOffsetY ?? 0;
  if (assetUrl) {
    return {
      x: tx + (data.height ?? LENGTH_REFERENCE) / 2,
      y: ty + (data.width ?? LENGTH_REFERENCE) / 2,
    };
  }
  switch (shape) {
    case "rectangle":
      return {
        x: tx + (data.width ?? DEFAULT_RECT_W) / 2,
        y: ty + (data.height ?? DEFAULT_RECT_H) / 2,
      };
    case "triangle": {
      const s = resolveBodySize(data, DEFAULT_SQUARE);
      // Legacy `+13` nudges the label below the apex toward the visual
      // centre of an equilateral-ish triangle.
      return { x: tx + s / 2, y: ty + s / 2 + 13 };
    }
    case "square":
    case "personalized":
    case "circular":
    default: {
      const s = resolveBodySize(
        data,
        shape === "square" ? DEFAULT_SQUARE : DEFAULT_RADIUS * 2,
      );
      return { x: tx + s / 2, y: ty + s / 2 };
    }
  }
};

/**
 * Rotation pivot for the spot's body, expressed in the spot's local
 * post-translate frame. Legacy parity (saas-legacy
 * `CanvasSpot.getTransform` / `getTransformRectangle` /
 * `getTransformTriangle`): legacy rotates around the element's CENTRE, not
 * its top-left.
 *
 * For personalized image-bearing spots legacy uses a slightly odd
 * `width ?? height ?? LENGTH_REFERENCE` fallback for the X coordinate —
 * mirrored here for parity with any blueprint that authors only one of the
 * two axes. Triangle picks up the legacy `+13` Y offset to keep rotation
 * around the visual centre.
 */
export const rotationCentre = (
  shape: SpotType["shape"] | undefined,
  data: CanvasSpotData,
  assetUrl: string | undefined,
): RotationCentre => {
  if (assetUrl) {
    return {
      cx: (data.width ?? data.height ?? LENGTH_REFERENCE) / 2,
      cy: (data.height ?? LENGTH_REFERENCE) / 2,
    };
  }
  switch (shape) {
    case "rectangle":
      return {
        cx: (data.width ?? DEFAULT_RECT_W) / 2,
        cy: (data.height ?? DEFAULT_RECT_H) / 2,
      };
    case "triangle": {
      const s = resolveBodySize(data, DEFAULT_SQUARE);
      return { cx: s / 2, cy: s / 2 + 13 };
    }
    case "square":
    case "personalized":
    case "circular":
    default: {
      const s = resolveBodySize(
        data,
        shape === "square" ? DEFAULT_SQUARE : DEFAULT_RADIUS * 2,
      );
      return { cx: s / 2, cy: s / 2 };
    }
  }
};

/**
 * Text colour for the spot's label.
 *
 * The contract follows the IMAGE that's actually rendered, not the broader
 * UI state — `resolveSpotAssetUrl` maps both `selected` (pending click)
 * and `current` (existing booking) to `selected_image`, so they share the
 * same text override (`fontColorOnSelected`). Production data sets that
 * override to `"transparent"` so the label is absorbed into the
 * "Mon spot" yellow art; treating `current` like `taken` instead would
 * paint kaizen's primary-onWeak teal over the yellow image (the
 * "green writing on a black-looking spot" parity bug we shipped a fix for
 * — keep `current` here to prevent regression).
 */
export const resolveSpotTextFill = ({
  visualState,
  data,
  base,
}: {
  visualState: SpotVisualState;
  data: CanvasSpotData;
  base: string;
}): string => {
  if (
    (visualState === "selected" || visualState === "current") &&
    data.fontColorOnSelected
  ) {
    return data.fontColorOnSelected;
  }
  if (visualState === "taken" && data.fontColorOnTaken) {
    return data.fontColorOnTaken;
  }
  if (data.fontColor) return data.fontColor;
  return base;
};
