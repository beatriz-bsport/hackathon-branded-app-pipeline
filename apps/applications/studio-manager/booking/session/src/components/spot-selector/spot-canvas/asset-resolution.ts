import type { SpotType } from "@bsport/api-book";

// Reserved AssetForBlueprint.identifier values the API ships for every
// blueprint that uses the asset system. Held as constants so consumers
// (and tests) can't typo and so the contract is grep-able.
export const SPOT_TAKEN_ASSET_ID = "spot_taken";
export const SPOT_FREE_ASSET_ID = "spot_free";

export type ResolveSpotAssetUrlParams = {
  spotType: SpotType | undefined;
  assetByIdentifier: Map<string, string>;
  assetIdentifier: string | null | undefined;
  taken: boolean;
  selected: boolean;
  /** True when this is the participant's existing booking. Legacy parity:
   *  the "selected_image" ("Mon spot" / yellow) PNG conveys both pending
   *  selection AND "this spot is yours" — we map current to the same asset. */
  isCurrent?: boolean;
};

/**
 * Resolves the spot's body image URL from either of the two systems the API
 * supports:
 *
 *   1. AssetForBlueprint — newer system. The canvas element carries an
 *      `asset_identifier` that maps to an `AssetForBlueprint.identifier`.
 *      Taken/selected spots resolve to the "spot_taken" overlay; otherwise the
 *      element's own identifier (or "spot_free") is used.
 *
 *   2. Personalized SpotType — legacy system still used by many production
 *      blueprints (e.g. room-blueprint 8218 / spot-type 23 "Cycle"). When the
 *      SpotType is `customization: "personalized"`, the state-keyed
 *      `free_image` / `taken_image` / `selected_image` URLs on the SpotType
 *      itself hold the art.
 *
 * Legacy parity (saas-legacy CanvasSpot.component.tsx): customization wins
 * over the `shape` field — a `shape: "circular"` spot still renders the image
 * when `customization === "personalized"`.
 */
export const resolveSpotAssetUrl = ({
  spotType,
  assetByIdentifier,
  assetIdentifier,
  taken,
  selected,
  isCurrent = false,
}: ResolveSpotAssetUrlParams): string | undefined => {
  // Ownership wins over takenness (legacy parity + UX intent): the API
  // reports the participant's own booked spot in `taken_spots` because it
  // IS taken — by them. From their POV it's still "Mon spot" and must
  // render as the yellow `selected_image`, not the black `taken_image`.
  // Pending selection is folded in here for the same reason: clicking your
  // current spot or another free spot both communicate "this is mine
  // (proposed)" via the same yellow art.
  const showsOwnership = isCurrent || selected;

  // Legacy parity (saas-legacy CanvasSpot.component:694 +
  // utils.canvasTransformer): the asset-map render path is consulted ONLY
  // when the element carries its own `asset_identifier` on the wire. The
  // global "spot_free" / "spot_taken" entries are reserved for the LEGEND
  // swatches (which legacy hardcodes via SpotSelectorDialog) — they must
  // not leak into per-element rendering, or every spot in a blueprint that
  // ships those globals will render with the same image (multi-blueprint
  // "SPORT logo on every spot" regression). When the spot is taken and the
  // element has its own asset_identifier, legacy rewrites it to
  // SPOT_TAKEN_ASSET_ID so the canvas pulls the global taken overlay.
  if (assetIdentifier) {
    const lookupKey =
      taken && !showsOwnership ? SPOT_TAKEN_ASSET_ID : assetIdentifier;
    const fromAsset = assetByIdentifier.get(lookupKey);
    if (fromAsset) return fromAsset;
  }

  if (spotType?.customization === "personalized") {
    if (showsOwnership) return spotType.selected_image ?? undefined;
    if (taken) return spotType.taken_image ?? undefined;
    return spotType.free_image ?? undefined;
  }
  return undefined;
};
