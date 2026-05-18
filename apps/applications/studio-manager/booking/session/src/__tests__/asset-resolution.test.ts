import { describe, expect, it } from "vitest";

import type { SpotType } from "@bsport/api-book";

import { resolveSpotAssetUrl } from "#src/components/spot-selector/spot-canvas/asset-resolution";

const personalizedSpotType: SpotType = {
  id: 23,
  name: "Cycle",
  prefix: "",
  suffix: "",
  shape: "circular",
  customization: "personalized",
  fill_color: "",
  stroke_color: "black",
  free_image: "free.png",
  taken_image: "taken.png",
  selected_image: "selected.png",
};

const predefinedSpotType: SpotType = {
  ...personalizedSpotType,
  customization: "predefined",
  free_image: null,
  taken_image: null,
  selected_image: null,
};

const emptyAssetMap = new Map<string, string>();

describe("resolveSpotAssetUrl", () => {
  describe("AssetForBlueprint path", () => {
    it("resolves the element's asset_identifier on free spots", () => {
      const out = resolveSpotAssetUrl({
        spotType: predefinedSpotType,
        assetByIdentifier: new Map([["bike", "bike.svg"]]),
        assetIdentifier: "bike",
        taken: false,
        selected: false,
      });
      expect(out).toBe("bike.svg");
    });

    it("swaps the lookup to 'spot_taken' for taken spots when the element carries its own asset_identifier", () => {
      // Legacy parity (saas-legacy `utils.canvasTransformer`): when an
      // element has a wire `asset_identifier` AND becomes taken, the
      // identifier is rewritten to 'spot_taken' so the canvas pulls the
      // global "taken overlay" art instead of the per-element image.
      const out = resolveSpotAssetUrl({
        spotType: predefinedSpotType,
        assetByIdentifier: new Map([
          ["bike", "bike.svg"],
          ["spot_taken", "taken.svg"],
        ]),
        assetIdentifier: "bike",
        taken: true,
        selected: false,
      });
      expect(out).toBe("taken.svg");
    });

    it("keeps the element's own asset for selected (free) spots", () => {
      // Legacy parity: selected-but-free spots keep their own asset. The
      // selection state is signalled by the dashed ring and the highlight
      // overlay — not by swapping the body image to "spot_taken".
      const out = resolveSpotAssetUrl({
        spotType: predefinedSpotType,
        assetByIdentifier: new Map([
          ["bike", "bike.svg"],
          ["spot_taken", "taken.svg"],
        ]),
        assetIdentifier: "bike",
        taken: false,
        selected: true,
      });
      expect(out).toBe("bike.svg");
    });

    it("does NOT consult the asset map when the element has no own asset_identifier", () => {
      // Legacy parity (saas-legacy CanvasSpot.component:694): the asset-map
      // render path requires `this.props.asset_identifier` to be truthy on
      // the element itself. Without it, the global "spot_free"/"spot_taken"
      // entries (used by the LEGEND swatches in legacy SpotSelectorDialog
      // via hardcoded prop) must not bleed into per-element rendering — that
      // was the source of the multi-blueprint "every spot shows the same
      // global SPORT image" regression.
      const out = resolveSpotAssetUrl({
        spotType: predefinedSpotType,
        assetByIdentifier: new Map([
          ["spot_free", "free.svg"],
          ["spot_taken", "taken.svg"],
        ]),
        assetIdentifier: null,
        taken: false,
        selected: false,
      });
      expect(out).toBeUndefined();
    });

    it("does NOT consult the asset map for taken spots without asset_identifier", () => {
      // Same as above for the taken path. Legacy's `spot_taken` rewrite
      // only kicks in if the element already carries an asset_identifier;
      // otherwise the spot falls through to shape rendering.
      const out = resolveSpotAssetUrl({
        spotType: predefinedSpotType,
        assetByIdentifier: new Map([["spot_taken", "taken.svg"]]),
        assetIdentifier: null,
        taken: true,
        selected: false,
      });
      expect(out).toBeUndefined();
    });
  });

  describe("Personalized SpotType path", () => {
    // Regression: room-blueprint 8218 / spot-type 23 "Cycle" returns
    // shape: "circular" + customization: "personalized" with free/taken/
    // selected_image URLs. AssetForBlueprint is empty. The renderer must
    // still surface the image.
    it("uses free_image when no AssetForBlueprint match and the spot is free", () => {
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: false,
        selected: false,
      });
      expect(out).toBe("free.png");
    });

    it("uses taken_image for taken spots", () => {
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: true,
        selected: false,
      });
      expect(out).toBe("taken.png");
    });

    it("uses selected_image for selected (but not taken) spots", () => {
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: false,
        selected: true,
      });
      expect(out).toBe("selected.png");
    });

    it("uses selected_image for the participant's current spot", () => {
      // Legacy parity: the `selected_image` ("Mon spot" yellow PNG) marks
      // "this spot is yours" — current bookings render with it too, with
      // the dashed ring around the actively-selected one disambiguating
      // pending-vs-existing.
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: false,
        selected: false,
        isCurrent: true,
      });
      expect(out).toBe("selected.png");
    });

    it("isCurrent wins over taken — the participant's own booking is always 'Mon spot' (yellow)", () => {
      // The API marks the participant's own spot in `taken_spots` (it IS
      // taken — by them). From their POV it's still "theirs". Legacy parity:
      // legacy's "selected" semantic covers both pending + existing, and
      // always renders the `selected_image`. Our `isCurrent` is the
      // equivalent — it must override `taken` for asset selection.
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: true,
        selected: false,
        isCurrent: true,
      });
      expect(out).toBe("selected.png");
    });

    it("isCurrent wins over taken even via the asset-map path", () => {
      // The asset-map's `spot_taken` overlay must NOT preempt the
      // participant's-own-spot render. With an element-level
      // asset_identifier of "bike", the taken→spot_taken swap is bypassed
      // for isCurrent and the element resolves to "bike" — but that key
      // isn't in the map, so we fall through to the SpotType's selected_image.
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: new Map([["spot_taken", "taken-overlay.svg"]]),
        assetIdentifier: "bike",
        taken: true,
        selected: false,
        isCurrent: true,
      });
      expect(out).toBe("selected.png");
    });

    it("returns undefined when the state-keyed image URL is null", () => {
      const out = resolveSpotAssetUrl({
        spotType: { ...personalizedSpotType, free_image: null },
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: false,
        selected: false,
      });
      expect(out).toBeUndefined();
    });
  });

  describe("predefined SpotType", () => {
    it("returns undefined when neither system yields a URL", () => {
      const out = resolveSpotAssetUrl({
        spotType: predefinedSpotType,
        assetByIdentifier: emptyAssetMap,
        assetIdentifier: null,
        taken: false,
        selected: false,
      });
      expect(out).toBeUndefined();
    });
  });

  describe("AssetForBlueprint wins over SpotType", () => {
    // When BOTH the element has its own asset_identifier AND the SpotType
    // ships personalized images, the asset map takes precedence (legacy
    // CanvasSpot.component prefers `oldVersionSpotType` built from the
    // asset map for asset-identified elements).
    it("prefers the asset map over the SpotType's free_image when assetIdentifier is set", () => {
      const out = resolveSpotAssetUrl({
        spotType: personalizedSpotType,
        assetByIdentifier: new Map([["bike", "asset.svg"]]),
        assetIdentifier: "bike",
        taken: false,
        selected: false,
      });
      expect(out).toBe("asset.svg");
    });
  });
});
