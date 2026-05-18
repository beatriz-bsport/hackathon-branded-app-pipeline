import { describe, expect, it } from "vitest";

import type { CanvasSpotData } from "@bsport/api-book";

import { LENGTH_REFERENCE } from "#src/components/spot-selector/spot-canvas/elements/spot-dimensions";
import {
  labelAnchor,
  resolveSpotTextFill,
  rotationCentre,
} from "#src/components/spot-selector/spot-canvas/elements/spot-element-helpers";

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

describe("labelAnchor", () => {
  // Personalized (image-bearing) spots — note the deliberate height-for-X /
  // width-for-Y axis swap that mirrors saas-legacy. Production data's
  // `textOffsetX` / `textOffsetY` values are tuned to this swap; "correcting"
  // it here would silently shift every authored label.

  it("uses height/2 for X and width/2 for Y when an asset is present (personalized swap)", () => {
    // Bench: 75×150 with textOffsetX=-35, textOffsetY=40 (production values).
    // Result: x = -35 + 150/2 = 40; y = 40 + 75/2 = 77.5.
    expect(
      labelAnchor(
        "circular",
        data({ width: 75, height: 150, textOffsetX: -35, textOffsetY: 40 }),
        "bench.png",
      ),
    ).toEqual({ x: 40, y: 77.5 });
  });

  it("falls back to LENGTH_REFERENCE for the axis swap when dimensions are absent", () => {
    expect(labelAnchor("circular", data(), "asset.png")).toEqual({
      x: LENGTH_REFERENCE / 2,
      y: LENGTH_REFERENCE / 2,
    });
  });

  it("uses width/2 for X and height/2 for Y on non-personalized rectangles", () => {
    expect(
      labelAnchor("rectangle", data({ width: 80, height: 40 }), undefined),
    ).toEqual({ x: 40, y: 20 });
  });

  it("centres the label inside non-personalized square / circular bodies (height drives both axes)", () => {
    expect(labelAnchor("square", data({ height: 60 }), undefined)).toEqual({
      x: 30,
      y: 30,
    });
    expect(labelAnchor("circular", data({ height: 90 }), undefined)).toEqual({
      x: 45,
      y: 45,
    });
  });

  it("adds the legacy +13 baseline offset for triangles", () => {
    // Triangle Y pivot offset compensates for the apex-at-top geometry.
    expect(labelAnchor("triangle", data({ height: 70 }), undefined)).toEqual({
      x: 35,
      y: 48,
    });
  });

  it("threads textOffsetX / textOffsetY through unchanged", () => {
    expect(
      labelAnchor(
        "rectangle",
        data({ width: 80, height: 40, textOffsetX: 5, textOffsetY: -3 }),
        undefined,
      ),
    ).toEqual({ x: 45, y: 17 });
  });
});

describe("rotationCentre", () => {
  // Legacy parity (saas-legacy `CanvasSpot.getTransform` /
  // `getTransformRectangle` / `getTransformTriangle`): rotation pivots
  // around the body's centre, NOT the top-left of the local frame.

  it("centres rotation on (width/2, height/2) for personalized image-bearing spots", () => {
    expect(
      rotationCentre("circular", data({ width: 75, height: 150 }), "bench.png"),
    ).toEqual({ cx: 37.5, cy: 75 });
  });

  it("uses legacy's width-or-height fallback for the X axis on personalized spots", () => {
    // Legacy `getTransform` uses `width ?? height ?? LENGTH_REFERENCE` for the
    // X pivot. When only height is authored, X falls back to height/2.
    expect(
      rotationCentre("circular", data({ height: 90 }), "circle.png"),
    ).toEqual({ cx: 45, cy: 45 });
  });

  it("centres rotation on (width/2, height/2) for non-personalized rectangles", () => {
    expect(
      rotationCentre("rectangle", data({ width: 80, height: 40 }), undefined),
    ).toEqual({ cx: 40, cy: 20 });
  });

  it("centres rotation on (h/2, h/2) for square / circular bodies", () => {
    expect(rotationCentre("square", data({ height: 60 }), undefined)).toEqual({
      cx: 30,
      cy: 30,
    });
    expect(rotationCentre("circular", data({ height: 90 }), undefined)).toEqual(
      { cx: 45, cy: 45 },
    );
  });

  it("adds the legacy +13 Y offset for triangles", () => {
    // Same +13 nudge legacy `getTransformTriangle` applies to keep rotation
    // around the visual centre of the apex-at-top triangle.
    expect(rotationCentre("triangle", data({ height: 70 }), undefined)).toEqual(
      { cx: 35, cy: 48 },
    );
  });
});

describe("resolveSpotTextFill", () => {
  const base = "var(--kz-color-onsurface-default)";

  it("uses fontColorOnTaken for taken spots", () => {
    expect(
      resolveSpotTextFill({
        visualState: "taken",
        data: data({ fontColorOnTaken: "#ffffff" }),
        base,
      }),
    ).toBe("#ffffff");
  });

  it("uses fontColorOnSelected for selected (pending) spots", () => {
    expect(
      resolveSpotTextFill({
        visualState: "selected",
        data: data({ fontColorOnSelected: "transparent" }),
        base,
      }),
    ).toBe("transparent");
  });

  it("uses fontColorOnSelected for 'current' too (legacy parity for Mon spot)", () => {
    // `resolveSpotAssetUrl` paints `selected_image` for BOTH selected and
    // isCurrent, so the text contract must match — otherwise kaizen's
    // primary-onWeak teal would leak through over the yellow art.
    expect(
      resolveSpotTextFill({
        visualState: "current",
        data: data({ fontColorOnSelected: "transparent" }),
        base,
      }),
    ).toBe("transparent");
  });

  it("falls back to fontColor when no state-specific override is set", () => {
    expect(
      resolveSpotTextFill({
        visualState: "free",
        data: data({ fontColor: "#1F4F4D" }),
        base,
      }),
    ).toBe("#1F4F4D");
  });

  it("falls back to base when no state-specific override and no fontColor", () => {
    expect(
      resolveSpotTextFill({
        visualState: "free",
        data: data(),
        base,
      }),
    ).toBe(base);
  });

  it("ignores fontColorOnTaken for 'current' (visualState mismatch)", () => {
    // Defensive: a personalized SpotType that only ships `fontColorOnTaken`
    // (no `fontColorOnSelected`) should NOT colour the current spot with
    // the taken override — current uses selected_image, not taken_image.
    expect(
      resolveSpotTextFill({
        visualState: "current",
        data: data({ fontColorOnTaken: "#ffffff" }),
        base,
      }),
    ).toBe(base);
  });
});
