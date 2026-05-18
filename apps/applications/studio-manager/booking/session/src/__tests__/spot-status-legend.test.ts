import { describe, expect, it } from "vitest";

import type { CanvasElement, CanvasSpotData } from "@bsport/api-book";

import {
  sampleSwatchElement,
  swatchFromElement,
} from "#src/components/spot-selector/spot-selector-modal/spot-status-legend-helpers";

const SWATCH_BODY = 16;

const baseSpot: CanvasElement<CanvasSpotData> = {
  id: "spot-7",
  type: "spot",
  data: {
    index: 7,
    indexType: 3,
    spotTypeId: 23,
    taken: true,
    selected: false,
    asset_identifier: "bike",
    x: 412,
    y: 998,
    rotation: 90,
    width: 80,
    height: 80,
    fontSize: 24,
    fill: "#abcdef",
  },
};

describe("sampleSwatchElement", () => {
  it("marks the element as taken iff state is 'taken'", () => {
    expect(sampleSwatchElement("free", 23).data.taken).toBe(false);
    expect(sampleSwatchElement("taken", 23).data.taken).toBe(true);
    expect(sampleSwatchElement("current", 23).data.taken).toBe(false);
    expect(sampleSwatchElement("selected", 23).data.taken).toBe(false);
  });

  it("pins the swatch geometry to the chip size", () => {
    const out = sampleSwatchElement("free", 23);
    expect(out.data.x).toBe(0);
    expect(out.data.y).toBe(0);
    expect(out.data.width).toBe(SWATCH_BODY);
    expect(out.data.height).toBe(SWATCH_BODY);
    // fontSize: 0 suppresses the index label inside the chip — legacy parity
    // with renderRowLegend, which also strips the label from legend samples.
    expect(out.data.fontSize).toBe(0);
  });

  it("propagates the spotTypeId so the chip resolves the right SpotType", () => {
    expect(sampleSwatchElement("free", 23).data.spotTypeId).toBe(23);
    expect(sampleSwatchElement("free", 99).data.spotTypeId).toBe(99);
  });

  it("does not carry an asset_identifier — falls through to SpotType images", () => {
    // The sample swatch must follow the same asset-resolution path as a
    // real canvas spot that has no own asset_identifier: skip the global
    // asset map and use the SpotType's free/taken/selected_image. If we
    // hardcoded an identifier here the swatch would diverge from what the
    // canvas paints.
    expect(sampleSwatchElement("free", 23).data.asset_identifier).toBeNull();
  });

  it("emits a unique id per (state, spotTypeId)", () => {
    expect(sampleSwatchElement("free", 23).id).not.toBe(
      sampleSwatchElement("taken", 23).id,
    );
    expect(sampleSwatchElement("free", 23).id).not.toBe(
      sampleSwatchElement("free", 24).id,
    );
  });
});

describe("swatchFromElement", () => {
  it("inherits data fields that drive asset resolution", () => {
    const out = swatchFromElement(baseSpot);
    expect(out.data.asset_identifier).toBe("bike");
    expect(out.data.spotTypeId).toBe(23);
    expect(out.data.taken).toBe(true);
  });

  it("inherits the original element id so React reconciliation stays stable", () => {
    expect(swatchFromElement(baseSpot).id).toBe("spot-7");
  });

  it("pins position and rotation so the chip stays upright and centred", () => {
    const out = swatchFromElement(baseSpot);
    expect(out.data.x).toBe(0);
    expect(out.data.y).toBe(0);
    expect(out.data.rotation).toBe(0);
  });

  it("pins width/height to the chip size, overriding the on-canvas dimensions", () => {
    const out = swatchFromElement(baseSpot);
    expect(out.data.width).toBe(SWATCH_BODY);
    expect(out.data.height).toBe(SWATCH_BODY);
  });

  it("suppresses the index label inside the chip", () => {
    expect(swatchFromElement(baseSpot).data.fontSize).toBe(0);
  });

  it("preserves arbitrary style fields the SpotType doesn't drive (e.g. per-element fill)", () => {
    // Per-element style overrides like `fill` must survive the swatch
    // transform — they're part of "what this spot looks like on the canvas"
    // and the legend chip should match.
    expect(swatchFromElement(baseSpot).data.fill).toBe("#abcdef");
  });

  it("does not mutate the source element", () => {
    const sourceClone = JSON.parse(JSON.stringify(baseSpot));
    swatchFromElement(baseSpot);
    expect(baseSpot).toEqual(sourceClone);
  });
});
