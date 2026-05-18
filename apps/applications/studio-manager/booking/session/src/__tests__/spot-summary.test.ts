import { describe, expect, it } from "vitest";

import type { RoomBlueprint, SpotType } from "@bsport/api-book";

import {
  baseSpotType,
  rectElement,
  spotElement,
} from "#src/components/spot-selector/__fixtures__/canvas-elements";
import { summarizeSpots } from "#src/components/spot-selector/spot-canvas/spot-summary";

const cycleType: SpotType = { ...baseSpotType, id: 1, name: "Cycle" };
const vipType: SpotType = { ...baseSpotType, id: 2, name: "VIP" };
const orphanType: SpotType = { ...baseSpotType, id: 99, name: "Orphan" };

const blueprint = (...elements: ReturnType<typeof spotElement>[]) =>
  ({
    id: 1,
    disabled: false,
    name: "test",
    company: 1,
    establishment: 1,
    canvas: { coachHeight: 1, elements },
  }) as RoomBlueprint;

describe("summarizeSpots", () => {
  it("returns zeroed summary when blueprint is undefined", () => {
    expect(
      summarizeSpots({
        roomBlueprint: undefined,
        takenSpots: [1, 2],
        spotTypes: [cycleType],
      }),
    ).toEqual({
      freeCount: 0,
      takenCount: 0,
      totalCount: 0,
      usedSpotTypes: [],
    });
  });

  it("counts taken spots from the takenSpots set against canvas indices", () => {
    const bp = blueprint(
      spotElement(1, 0, 0, cycleType.id),
      spotElement(2, 0, 0, cycleType.id),
      spotElement(3, 0, 0, cycleType.id),
    );
    const out = summarizeSpots({
      roomBlueprint: bp,
      takenSpots: [2],
      spotTypes: [cycleType],
    });
    expect(out.totalCount).toBe(3);
    expect(out.takenCount).toBe(1);
    expect(out.freeCount).toBe(2);
  });

  it("ignores non-spot elements when counting", () => {
    const bp = blueprint(
      spotElement(1, 0, 0, cycleType.id),
      // Decorative rect should not contribute to counts.
      rectElement("rect-1", 0, 0, 50, 50) as never,
    );
    const out = summarizeSpots({
      roomBlueprint: bp,
      takenSpots: [],
      spotTypes: [cycleType],
    });
    expect(out.totalCount).toBe(1);
  });

  it("filters out SpotTypes that no spot on the canvas references", () => {
    // Orphan SpotType is in the API response (e.g. company-wide) but no
    // spot references it — must not appear in usedSpotTypes.
    const bp = blueprint(spotElement(1, 0, 0, cycleType.id));
    const out = summarizeSpots({
      roomBlueprint: bp,
      takenSpots: [],
      spotTypes: [cycleType, orphanType],
    });
    expect(out.usedSpotTypes).toEqual([cycleType]);
  });

  it("returns every referenced SpotType when multiple are in use", () => {
    const bp = blueprint(
      spotElement(1, 0, 0, cycleType.id),
      spotElement(2, 0, 0, vipType.id),
    );
    const out = summarizeSpots({
      roomBlueprint: bp,
      takenSpots: [],
      spotTypes: [cycleType, vipType, orphanType],
    });
    expect(out.usedSpotTypes).toEqual([cycleType, vipType]);
  });

  it("returns empty usedSpotTypes when the API ships no SpotType records", () => {
    // Production blueprint 38 case: 9 default-styled spots, no SpotType
    // records. `usedSpotTypes` is empty; the legend's `length <= 1` branch
    // still renders the chip with default SpotElement styling.
    const bp = blueprint(spotElement(1, 0, 0, -1), spotElement(2, 0, 0, -1));
    const out = summarizeSpots({
      roomBlueprint: bp,
      takenSpots: [],
      spotTypes: [],
    });
    expect(out.usedSpotTypes).toEqual([]);
    expect(out.totalCount).toBe(2);
  });

  it("handles an undefined elements array (defensive)", () => {
    const bp = {
      ...blueprint(),
      canvas: { coachHeight: 1, elements: undefined },
    } as unknown as RoomBlueprint;
    const out = summarizeSpots({
      roomBlueprint: bp,
      takenSpots: [],
      spotTypes: [cycleType],
    });
    expect(out.totalCount).toBe(0);
    expect(out.usedSpotTypes).toEqual([]);
  });
});
