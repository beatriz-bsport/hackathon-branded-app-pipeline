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
    it("uses authored width/height when an asset is present (legacy parity)", () => {
      // saas-legacy CanvasSpot renders the image at authored width × height
      // (62×62 fallback). smallestDim returns the smaller axis so the default
      // font size stays legible inside tall benches.
      expect(
        smallestDim("personalized", data({ width: 75, height: 150 }), "asset"),
      ).toBe(75);
      expect(
        smallestDim("personalized", data({ width: 90, height: 90 }), "asset"),
      ).toBe(90);
    });

    it("falls back to LENGTH_REFERENCE per axis when an asset is present but dims are absent", () => {
      // saas-legacy SPOT_IMAGE_WIDTH/SPOT_IMAGE_HEIGHT = LENGTH_REFERENCE = 62.
      expect(smallestDim("personalized", data(), "asset")).toBe(62);
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

  it("uses data.height for square (legacy wire format)", () => {
    expect(smallestDim("square", data({ height: 50 }), undefined)).toBe(50);
    expect(smallestDim("square", data(), undefined)).toBe(40);
  });

  it("uses min(width, height) for rectangle", () => {
    expect(
      smallestDim("rectangle", data({ width: 80, height: 30 }), undefined),
    ).toBe(30);
  });

  it("uses data.height for triangle (legacy wire format)", () => {
    expect(smallestDim("triangle", data({ height: 50 }), undefined)).toBe(50);
  });

  it("uses data.height as diameter for circular when no asset is available", () => {
    expect(smallestDim("circular", data({ height: 30 }), undefined)).toBe(30);
  });

  it("falls back to data.radius * 2 for circular when height is absent", () => {
    expect(smallestDim("circular", data({ radius: 15 }), undefined)).toBe(30);
  });

  it("uses authored width/height for circular when an asset is resolved", () => {
    // Production SpotTypes report `shape: "circular"` alongside
    // `customization: "personalized"` and supply free/taken/selected image
    // URLs. Image overrides shape; size follows authored width × height.
    expect(
      smallestDim("circular", data({ width: 90, height: 90 }), "asset"),
    ).toBe(90);
  });
});
