import { describe, expect, it } from "vitest";

import type { CanvasElement, CanvasSpotData } from "@bsport/api-book";

import {
  FALLBACK_VIEWBOX,
  VIEWBOX_PADDING,
  computeViewBox,
  elementBounds,
} from "#src/components/spot-selector/spot-canvas/view-box";

const spot = (
  extra: Partial<CanvasSpotData>,
): CanvasElement<CanvasSpotData> => ({
  id: "spot-1",
  type: "spot",
  data: {
    index: 1,
    indexType: 1,
    spotTypeId: 1,
    taken: false,
    selected: false,
    asset_identifier: null,
    x: 0,
    y: 0,
    ...extra,
  },
});

describe("elementBounds", () => {
  it("uses both endpoints for a line", () => {
    // Both endpoints contribute to the bounds so the full span of a line
    // stays inside the computed viewBox, no matter how long it is.
    const b = elementBounds(
      { id: "l", type: "line", data: { x1: 0, y1: 0, x2: 1000, y2: 200 } },
      1,
    );
    expect(b).toEqual({ minX: 0, minY: 0, maxX: 1000, maxY: 200 });
  });

  it("expands rect/screen by half-width and half-height around the centre", () => {
    // Rect/screen (x, y) is the centroid in the renderer, so bounds extend
    // half the width/height in each direction to keep the full footprint
    // inside the viewBox.
    const rect = elementBounds(
      {
        id: "r",
        type: "rect",
        data: { x: 100, y: 50, width: 200, height: 80 },
      },
      1,
    );
    expect(rect).toEqual({ minX: 0, minY: 10, maxX: 200, maxY: 90 });

    const screen = elementBounds(
      {
        id: "s",
        type: "screen",
        data: { x: 0, y: 0, width: 60, height: 40 },
      },
      1,
    );
    expect(screen).toEqual({ minX: -30, minY: -20, maxX: 30, maxY: 20 });
  });

  it("uses explicit width/height for spot when set", () => {
    expect(
      elementBounds(spot({ x: 10, y: 20, width: 60, height: 30 }), 1),
    ).toEqual({ minX: -20, minY: 5, maxX: 40, maxY: 35 });
  });

  it("falls back to radius * 2 for spot when width/height are absent", () => {
    expect(elementBounds(spot({ x: 0, y: 0, radius: 25 }), 1)).toEqual({
      minX: -25,
      minY: -25,
      maxX: 25,
      maxY: 25,
    });
  });

  it("uses the default 40-unit extent for spot when no dimensions are set", () => {
    // Matches the renderer's largest default (square / personalized image).
    expect(elementBounds(spot({ x: 0, y: 0 }), 1)).toEqual({
      minX: -20,
      minY: -20,
      maxX: 20,
      maxY: 20,
    });
  });

  it("sizes the teacher element to coachHeight", () => {
    const b = elementBounds(
      { id: "t", type: "teacher", data: { x: 0, y: 0 } },
      80,
    );
    expect(b).toEqual({ minX: -40, minY: -40, maxX: 40, maxY: 40 });
  });

  it("uses the door's hardcoded 20 x 10 footprint", () => {
    // DoorElement renders a path spanning ±10 × ±5; bounds must match.
    const b = elementBounds(
      { id: "d", type: "door", data: { x: 100, y: 100 } },
      1,
    );
    expect(b).toEqual({ minX: 90, minY: 95, maxX: 110, maxY: 105 });
  });

  it("uses a bounding circle for rotated rects", () => {
    // Conservative: a rotated rect's true AABB is bounded by the circle whose
    // radius is the half-diagonal of the unrotated rect.
    const b = elementBounds(
      {
        id: "r",
        type: "rect",
        data: { x: 0, y: 0, width: 6, height: 8, rotation: 45 },
      },
      1,
    );
    const r = Math.sqrt(3 * 3 + 4 * 4);
    expect(b).toEqual({ minX: -r, minY: -r, maxX: r, maxY: r });
  });

  it("returns null for unsupported element types", () => {
    expect(
      elementBounds(
        {
          id: "x",
          type: "unknown",
          data: {},
        } as unknown as CanvasElement<unknown>,
        1,
      ),
    ).toBeNull();
  });
});

describe("computeViewBox", () => {
  it("returns the fallback viewBox when there are no measurable elements", () => {
    expect(computeViewBox([], 1)).toBe(FALLBACK_VIEWBOX);
  });

  it("encloses every element with VIEWBOX_PADDING on each side", () => {
    const elements: CanvasElement<unknown>[] = [
      // Line spans x ∈ [0, 100], y ∈ [-20, 0].
      { id: "l", type: "line", data: { x1: 0, y1: -20, x2: 100, y2: 0 } },
      // Spot spans x ∈ [40, 60], y ∈ [40, 60].
      spot({ x: 50, y: 50, radius: 10 }),
    ];
    // Union: x ∈ [0, 100], y ∈ [-20, 60].
    const expectedMinX = 0 - VIEWBOX_PADDING;
    const expectedMinY = -20 - VIEWBOX_PADDING;
    const expectedW = 100 - 0 + VIEWBOX_PADDING * 2;
    const expectedH = 60 - -20 + VIEWBOX_PADDING * 2;
    expect(computeViewBox(elements, 1)).toBe(
      `${expectedMinX} ${expectedMinY} ${expectedW} ${expectedH}`,
    );
  });
});
