import type { CanvasElement, CanvasSpotData } from "@bsport/api-book";

import type { SpotVisualState } from "../spot-canvas/spot-styles";

/**
 * Pure helpers for `SpotStatusLegend`. Kept out of the .tsx so unit tests can
 * import them without pulling in the i18n / React-component dependency tree.
 */

// Body size of every legend chip in SVG units; consumers should also set
// the surrounding `<svg>` width/height in pixels to match the chip footprint.
export const SWATCH_BODY = 16;

/**
 * Builds a swatch-sized element for the single-SpotType case. Pins the
 * dimensions to a fixed swatch box so the chip stays the same physical size
 * regardless of how the SpotType is authored on the canvas. `fontSize: 0`
 * suppresses the index label.
 */
export const sampleSwatchElement = (
  state: SpotVisualState,
  spotTypeId: number,
): CanvasElement<CanvasSpotData> => ({
  id: `swatch-${state}-${spotTypeId}`,
  type: "spot",
  data: {
    index: 0,
    indexType: 0,
    spotTypeId,
    taken: state === "taken",
    selected: false,
    // No own asset_identifier: the chip follows the same asset-resolution
    // path as a real canvas spot that doesn't carry one — i.e. it skips the
    // global asset map (legacy parity) and falls through to the SpotType's
    // personalized free/taken/selected_image.
    asset_identifier: null,
    x: 0,
    y: 0,
    width: SWATCH_BODY,
    height: SWATCH_BODY,
    fontSize: 0,
  },
});

/**
 * Builds a swatch element from a real on-canvas spot. Inherits the spot's
 * `data.asset_identifier` / spotTypeId / taken so asset resolution matches
 * the canvas exactly, but pins (x, y, rotation, width, height) so the chip
 * size and orientation stay legible.
 */
export const swatchFromElement = (
  source: CanvasElement<CanvasSpotData>,
): CanvasElement<CanvasSpotData> => ({
  ...source,
  data: {
    ...source.data,
    x: 0,
    y: 0,
    rotation: 0,
    width: SWATCH_BODY,
    height: SWATCH_BODY,
    fontSize: 0,
  },
});
