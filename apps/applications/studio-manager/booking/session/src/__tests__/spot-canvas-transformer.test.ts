import { describe, expect, it } from "vitest";

import type {
  CanvasElement,
  CanvasSpotData,
  RoomBlueprint,
} from "@bsport/api-book";

import {
  applyTakenState,
  isSpotElement,
  translateRotate,
} from "#src/components/spot-selector/spot-canvas/canvas-transformer";

const spot = (index: number, extra: Partial<CanvasSpotData> = {}) =>
  ({
    id: `spot-${index}`,
    type: "spot",
    data: {
      index,
      indexType: index,
      spotTypeId: 1,
      taken: false,
      selected: false,
      asset_identifier: null,
      x: 0,
      y: 0,
      ...extra,
    },
  }) satisfies CanvasElement<CanvasSpotData>;

const blueprint = (elements: CanvasElement<unknown>[]): RoomBlueprint => ({
  id: 1,
  disabled: false,
  name: "BP",
  company: 1,
  establishment: 1,
  canvas: { coachHeight: 1, elements },
});

describe("applyTakenState", () => {
  it("marks taken spots", () => {
    const out = applyTakenState({
      roomBlueprint: blueprint([spot(1), spot(2), spot(3)]),
      takenSpots: [2],
    });
    const spots = out.filter(isSpotElement);
    expect(spots.find((s) => s.data.index === 2)?.data.taken).toBe(true);
    expect(spots.find((s) => s.data.index === 1)?.data.taken).toBe(false);
  });

  it("passes non-spot elements through unchanged", () => {
    const screen = {
      id: "screen-1",
      type: "screen" as const,
      data: { x: 0, y: 0, width: 10, height: 5 },
    };
    const out = applyTakenState({
      roomBlueprint: blueprint([screen, spot(1)]),
      takenSpots: [1],
    });
    expect(out[0]).toBe(screen);
  });

  it("preserves input element order (no sorting)", () => {
    const elements: CanvasElement<unknown>[] = [
      spot(1),
      { id: "line-1", type: "line", data: { x1: 0, y1: 0, x2: 1, y2: 1 } },
      spot(2),
    ];
    const out = applyTakenState({
      roomBlueprint: blueprint(elements),
      takenSpots: [2],
    });
    expect(out.map((e) => e.id)).toEqual(["spot-1", "line-1", "spot-2"]);
  });

  it("rewrites asset_identifier to 'spot_taken' for taken personalized spots", () => {
    const out = applyTakenState({
      roomBlueprint: blueprint([spot(1, { asset_identifier: "custom" })]),
      takenSpots: [1],
    });
    const s = out.filter(isSpotElement)[0];
    expect(s.data.asset_identifier).toBe("spot_taken");
  });

  it("leaves asset_identifier untouched on free spots", () => {
    const out = applyTakenState({
      roomBlueprint: blueprint([spot(1, { asset_identifier: "custom" })]),
      takenSpots: [],
    });
    const s = out.filter(isSpotElement)[0];
    expect(s.data.asset_identifier).toBe("custom");
  });

  it("returns the same element reference when taken state is unchanged", () => {
    const elements = [spot(1), spot(2)];
    const out = applyTakenState({
      roomBlueprint: blueprint(elements),
      takenSpots: [],
    });
    // Stable refs let React.memo on <SpotElement> short-circuit re-renders.
    expect(out[0]).toBe(elements[0]);
    expect(out[1]).toBe(elements[1]);
  });

  it("returns the same outer array when nothing changed", () => {
    const elements = [spot(1), spot(2)];
    const bp = blueprint(elements);
    const out = applyTakenState({ roomBlueprint: bp, takenSpots: [] });
    // Outer-array stability lets the canvas useMemo on viewBox short-circuit
    // when a refetch produces an equal-but-fresh takenSpots array.
    expect(out).toBe(bp.canvas.elements);
  });
});

describe("translateRotate", () => {
  it("emits translate only when rotation is absent or zero", () => {
    expect(translateRotate({ x: 1, y: 2 })).toBe("translate(1 2)");
    expect(translateRotate({ x: 1, y: 2, rotation: 0 })).toBe("translate(1 2)");
  });

  it("appends rotate when rotation is non-zero", () => {
    expect(translateRotate({ x: 1, y: 2, rotation: 45 })).toBe(
      "translate(1 2) rotate(45)",
    );
  });
});
