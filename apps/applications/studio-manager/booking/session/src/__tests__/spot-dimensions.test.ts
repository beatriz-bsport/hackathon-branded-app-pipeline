import { describe, expect, it } from "vitest";

import type { CanvasSpotData } from "@bsport/api-book";

import { smallestDim } from "#src/components/spot-selector/spot-canvas/elements/spot-dimensions";

const data = (extra: Partial<CanvasSpotData> = {}): CanvasSpotData => ({
  index: 1,
  indexType: 1,
  spotTypeId: 1,
  taken: false,
  selected: false,
  asset_identifier: null,
  x: 0,
  y: 0,
  ...extra,
});

describe("smallestDim", () => {
  describe("personalized", () => {
    // The body geometry for a personalized spot with an asset renders at a
    // fixed PERSONALIZED_IMAGE_SIZE box — label fontSize and selection ring
    // offset must follow that fixed size, not data.radius.
    it("returns the fixed image size when an asset is present, regardless of radius", () => {
      expect(smallestDim("personalized", data({ radius: 30 }), "asset")).toBe(
        40,
      );
      expect(smallestDim("personalized", data({ radius: 5 }), "asset")).toBe(
        40,
      );
    });

    it("falls back to radius*2 when no asset is available", () => {
      // The personalized branch in shapeGeometry renders a circle of radius
      // when there's no asset — smallestDim must mirror that.
      expect(smallestDim("personalized", data({ radius: 30 }), undefined)).toBe(
        60,
      );
      expect(smallestDim("personalized", data(), undefined)).toBe(40);
    });
  });

  it("uses width for square", () => {
    expect(smallestDim("square", data({ width: 50 }), undefined)).toBe(50);
    expect(smallestDim("square", data(), undefined)).toBe(40);
  });

  it("uses min(width, height) for rectangle", () => {
    expect(
      smallestDim("rectangle", data({ width: 80, height: 30 }), undefined),
    ).toBe(30);
  });

  it("uses width for triangle", () => {
    expect(smallestDim("triangle", data({ width: 50 }), undefined)).toBe(50);
  });

  it("uses radius*2 for circular regardless of asset", () => {
    expect(smallestDim("circular", data({ radius: 15 }), undefined)).toBe(30);
    expect(smallestDim("circular", data({ radius: 15 }), "asset")).toBe(30);
  });
});
