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
  it("expands bounds to enclose every authored point on a polyline", () => {
    // Walls/lines use the polyline wire format. Every authored point must
    // contribute to the bounds so multi-segment walls stay inside the viewBox.
    const b = elementBounds(
      {
        id: "l",
        type: "line",
        data: {
          points: [
            [0, 0],
            [500, 100],
            [1000, 200],
          ],
        },
      },
      1,
    );
    expect(b).toEqual({ minX: 0, minY: 0, maxX: 1000, maxY: 200 });
  });

  it("anchors rect bounds at (x, y) (top-left, saas-legacy parity)", () => {
    // Legacy CanvasRect renders the rect with `<rect x={x} y={y} width=w
    // height=h>` — `(x, y)` is the top-left corner, not the centroid.
    const rect = elementBounds(
      {
        id: "r",
        type: "rect",
        data: { x: 100, y: 50, width: 200, height: 80 },
      },
      1,
    );
    expect(rect).toEqual({ minX: 100, minY: 50, maxX: 300, maxY: 130 });
  });

  it("keeps screen bounds centred on (x, y) (matches our ScreenElement)", () => {
    // ScreenElement renders the polyline symmetrically around (x, y); the
    // viewBox mirrors that convention. Diverges from saas-legacy CanvasScreen.
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

  it("falls back to screen default extent when width/height are omitted", () => {
    // Legacy parity: the screen tool ships only x/y/rotation/colors. The
    // viewBox must reserve the renderer's default polyline footprint so the
    // chalkboard doesn't get clipped.
    const screen = elementBounds(
      { id: "s", type: "screen", data: { x: 0, y: 0 } },
      1,
    );
    expect(screen).toEqual({ minX: -50, minY: -7.5, maxX: 50, maxY: 7.5 });
  });

  it("anchors spot bounds at (x, y) (top-left, saas-legacy parity)", () => {
    // Legacy CanvasSpot translates by (x, y) and draws the body from (0, 0)
    // outward. The viewBox follows the same convention.
    expect(
      elementBounds(spot({ x: 10, y: 20, width: 60, height: 30 }), 1),
    ).toEqual({ minX: 10, minY: 20, maxX: 70, maxY: 50 });
  });

  it("falls back to radius * 2 for spot when width/height are absent", () => {
    expect(elementBounds(spot({ x: 0, y: 0, radius: 25 }), 1)).toEqual({
      minX: 0,
      minY: 0,
      maxX: 50,
      maxY: 50,
    });
  });

  it("uses the default 40-unit extent for spot when no dimensions are set", () => {
    // Matches the renderer's largest default (square / personalized image).
    expect(elementBounds(spot({ x: 0, y: 0 }), 1)).toEqual({
      minX: 0,
      minY: 0,
      maxX: 40,
      maxY: 40,
    });
  });

  it("offsets teacher bounds by the legacy avatar quarter-inset", () => {
    // Legacy CanvasTeacher offsets the inner <svg> by -avatarSize/4 in both
    // axes, so the avatar's top-left lands at (x - s/4, y - s/4) and the
    // footprint spans avatarSize in each axis from there.
    const b = elementBounds(
      { id: "t", type: "teacher", data: { x: 0, y: 0 } },
      1,
    );
    expect(b).toEqual({ minX: -20, minY: -20, maxX: 60, maxY: 60 });
  });

  it("honors teacher data.height as a per-element avatar size override", () => {
    const b = elementBounds(
      { id: "t", type: "teacher", data: { x: 0, y: 0, height: 100 } },
      2,
    );
    // avatarSize = 100 * 2 = 200; TL = (-50, -50); spans 200 from there.
    expect(b).toEqual({ minX: -50, minY: -50, maxX: 150, maxY: 150 });
  });

  it("uses the door's architectural-symbol footprint (±17.5 around centre)", () => {
    // DoorElement renders a slab + swing arc spanning ±DOOR_HALF; bounds match.
    const b = elementBounds(
      { id: "d", type: "door", data: { x: 100, y: 100 } },
      1,
    );
    expect(b).toEqual({ minX: 82.5, minY: 82.5, maxX: 117.5, maxY: 117.5 });
  });

  it("uses a bounding circle for rotated rects", () => {
    // Conservative: a rotated rect's true AABB is bounded by the circle whose
    // radius is the half-diagonal, drawn around the rect's centre — which is
    // (x + w/2, y + h/2) under the top-left convention.
    const b = elementBounds(
      {
        id: "r",
        type: "rect",
        data: { x: 0, y: 0, width: 6, height: 8, rotation: 45 },
      },
      1,
    );
    const r = Math.sqrt(3 * 3 + 4 * 4);
    expect(b).toEqual({ minX: 3 - r, minY: 4 - r, maxX: 3 + r, maxY: 4 + r });
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
      {
        id: "l",
        type: "line",
        data: {
          points: [
            [0, -20],
            [100, 0],
          ],
        },
      },
      // Spot top-left at (50, 50), 20×20 (radius:10 → diameter 20), so spans
      // x ∈ [50, 70], y ∈ [50, 70].
      spot({ x: 50, y: 50, radius: 10 }),
    ];
    // Union: x ∈ [0, 100], y ∈ [-20, 70].
    const expectedMinX = 0 - VIEWBOX_PADDING;
    const expectedMinY = -20 - VIEWBOX_PADDING;
    const expectedW = 100 - 0 + VIEWBOX_PADDING * 2;
    const expectedH = 70 - -20 + VIEWBOX_PADDING * 2;
    expect(computeViewBox(elements, 1)).toBe(
      `${expectedMinX} ${expectedMinY} ${expectedW} ${expectedH}`,
    );
  });
});
