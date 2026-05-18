import type React from "react";

import type {
  AssetForBlueprint,
  CanvasElement,
  CanvasSpotData,
  SpotType,
} from "@bsport/api-book";
import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { resolveSpotAssetUrl } from "../spot-canvas/asset-resolution";
import { SpotElement } from "../spot-canvas/elements/spot-element";
import type { SpotVisualState } from "../spot-canvas/spot-styles";
import {
  SWATCH_BODY,
  sampleSwatchElement,
  swatchFromElement,
} from "./spot-status-legend-helpers";

export type SpotStatusLegendProps = {
  /** SpotTypes referenced by the blueprint. When exactly one type is in use
   *  we render its real free/taken swatches; otherwise we use a generic
   *  outlined/filled-circle pair because no single SpotType image accurately
   *  represents the whole set. */
  spotTypes: SpotType[];
  /** AssetForBlueprint records — needed so the single-type swatch's asset
   *  resolution matches the canvas's. */
  assets: AssetForBlueprint[];
  /** Total free / taken spots across the blueprint, shown as count badges. */
  freeCount: number;
  takenCount: number;
  /** The participant's existing-booking spot element, if any. Rendered as
   *  the real swatch in the "Current spot" chip so users see their actual
   *  spot's appearance, not a representative SpotType. */
  currentSpotElement?: CanvasElement<CanvasSpotData> | null;
  /** The element the user has actively selected, if any. Rendered with the
   *  dashed selection ring overlay in the "Selected" chip. */
  selectedSpotElement?: CanvasElement<CanvasSpotData> | null;
};

const SWATCH_SIZE = 20;
// `SpotElement` paints the body edge-to-edge inside an `SWATCH_BODY`-sized
// box (e.g. circle radius `s/2` centred at `(s/2, s/2)`), so half the stroke
// width spills outside that box. Without padding the stroke top/bottom/left/
// right get clipped — visible as flat caps on the Current-spot circle.
// `SWATCH_BODY_PADDING` reserves enough room for the typical 2-unit stroke
// plus a small safety margin, matching the 20×20 viewBox used by
// `GenericStateGlyph` and `SpotLegend` so adjacent chips read at the same
// visual size. The Selected chip additionally needs `SWATCH_RING_PADDING`
// for the dashed ring offset 5px outside the body.
const SWATCH_BODY_PADDING = 2;
const SWATCH_RING_PADDING = 6;
const SWATCH_VIEWBOX_BODY_ONLY = `${-SWATCH_BODY_PADDING} ${-SWATCH_BODY_PADDING} ${SWATCH_BODY + SWATCH_BODY_PADDING * 2} ${SWATCH_BODY + SWATCH_BODY_PADDING * 2}`;
const SWATCH_VIEWBOX_WITH_RING = `${-SWATCH_RING_PADDING} ${-SWATCH_RING_PADDING} ${SWATCH_BODY + SWATCH_RING_PADDING * 2} ${SWATCH_BODY + SWATCH_RING_PADDING * 2}`;

const SampleSwatch: React.FC<{
  state: SpotVisualState;
  /** When undefined, the chip renders the canvas's default SpotElement
   *  styling (SPOT_STATE_STYLE) — used when the blueprint ships no
   *  SpotTypes and every spot falls back to the default circle. */
  spotType: SpotType | undefined;
  assetByIdentifier: Map<string, string>;
}> = ({ state, spotType, assetByIdentifier }) => {
  const taken = state === "taken";
  const selected = state === "selected";
  const isCurrent = state === "current";
  const assetUrl = resolveSpotAssetUrl({
    spotType,
    assetByIdentifier,
    // Pass null so the swatch follows the same resolution path as a real
    // canvas spot that has no own asset_identifier — picks up the SpotType's
    // personalized images, not the global "spot_free"/"spot_taken" overlay.
    assetIdentifier: null,
    taken,
    selected,
    isCurrent,
  });
  // `SampleSwatch` is only used for Free/Taken — neither paints a ring, so
  // the tighter body-only viewBox keeps the swatch the same physical size as
  // adjacent `GenericStateGlyph` / `SpotLegend` chips.
  return (
    <svg
      width={SWATCH_SIZE}
      height={SWATCH_SIZE}
      viewBox={SWATCH_VIEWBOX_BODY_ONLY}
      aria-hidden="true"
      className="shrink-0"
    >
      <SpotElement
        element={sampleSwatchElement(state, spotType?.id ?? -1)}
        spotType={spotType}
        assetUrl={assetUrl}
        selected={selected}
        isCurrent={isCurrent}
      />
    </svg>
  );
};

/** Outlined/filled circle used when the blueprint has multiple SpotTypes —
 *  no single SpotType visual accurately represents the aggregate, so we
 *  fall back to a universal seat-selector idiom. */
const GenericStateGlyph: React.FC<{ taken: boolean }> = ({ taken }) => (
  <svg
    width={SWATCH_SIZE}
    height={SWATCH_SIZE}
    viewBox="0 0 20 20"
    aria-hidden="true"
    className="shrink-0"
  >
    <circle
      cx={10}
      cy={10}
      r={7}
      fill={
        taken
          ? "var(--kz-color-surface-disabled-default)"
          : "var(--kz-color-surface-default)"
      }
      stroke="var(--kz-color-stroke-default)"
      strokeWidth={1.25}
    />
  </svg>
);

const ActualSpotSwatch: React.FC<{
  element: CanvasElement<CanvasSpotData>;
  spotType: SpotType | undefined;
  assetByIdentifier: Map<string, string>;
  selected?: boolean;
  isCurrent?: boolean;
}> = ({ element, spotType, assetByIdentifier, selected, isCurrent }) => {
  const swatch = swatchFromElement(element);
  const assetUrl = resolveSpotAssetUrl({
    spotType,
    assetByIdentifier,
    assetIdentifier: element.data.asset_identifier,
    taken: element.data.taken,
    selected: selected ?? false,
    isCurrent: isCurrent ?? false,
  });
  // Only the "Selected" chip paints a dashed ring; everything else can use
  // the tighter body-only viewBox so the body fills the chip.
  const viewBox = selected
    ? SWATCH_VIEWBOX_WITH_RING
    : SWATCH_VIEWBOX_BODY_ONLY;
  return (
    <svg
      width={SWATCH_SIZE}
      height={SWATCH_SIZE}
      viewBox={viewBox}
      aria-hidden="true"
      className="shrink-0"
    >
      <SpotElement
        element={swatch}
        spotType={spotType}
        assetUrl={assetUrl}
        selected={selected}
        isCurrent={isCurrent}
      />
    </svg>
  );
};

export const SpotStatusLegend: React.FC<SpotStatusLegendProps> = ({
  spotTypes,
  assets,
  freeCount,
  takenCount,
  currentSpotElement,
  selectedSpotElement,
}) => {
  const { t } = useTranslation("sessionManagement");
  const assetByIdentifier = new Map(assets.map((a) => [a.identifier, a.asset]));
  // 0 SpotTypes (blueprint ships no SpotType records — every spot falls back
  // to the canvas default) or exactly 1 SpotType: render a real swatch via
  // `SampleSwatch`. This keeps the Free/Taken chips in lockstep with the
  // canvas because both paths go through `SpotElement` and `SPOT_STATE_STYLE`.
  // Only ≥2 distinct SpotTypes fall to `GenericStateGlyph`, since at that
  // point no single SpotType visual fairly represents the aggregate.
  const useSampleSwatch = spotTypes.length <= 1;
  const sampleSpotType = spotTypes[0];
  const spotTypeById = new Map(spotTypes.map((st) => [st.id, st]));

  // `display: contents` lets the items flow into the parent flex container
  // (set up in SpotSelectorModal) so the status + type legends share one
  // wrapping row — no orphan chips on narrow viewports.
  return (
    <div
      className="contents"
      role="list"
      aria-label={t("spotSelector.legend.title")}
    >
      <div role="listitem" className="flex items-center gap-2xs">
        {useSampleSwatch ? (
          <SampleSwatch
            state="free"
            spotType={sampleSpotType}
            assetByIdentifier={assetByIdentifier}
          />
        ) : (
          <GenericStateGlyph taken={false} />
        )}
        <Body size="sm" weight="weak" color="default">
          {t("spotSelector.legend.free")}
        </Body>
        <Body size="sm" weight="weak" color="weak">
          {freeCount}
        </Body>
      </div>

      <div role="listitem" className="flex items-center gap-2xs">
        {useSampleSwatch ? (
          <SampleSwatch
            state="taken"
            spotType={sampleSpotType}
            assetByIdentifier={assetByIdentifier}
          />
        ) : (
          <GenericStateGlyph taken={true} />
        )}
        <Body size="sm" weight="weak" color="default">
          {t("spotSelector.legend.taken")}
        </Body>
        <Body size="sm" weight="weak" color="weak">
          {takenCount}
        </Body>
      </div>

      {currentSpotElement ? (
        <div role="listitem" className="flex items-center gap-2xs">
          <ActualSpotSwatch
            element={currentSpotElement}
            spotType={spotTypeById.get(currentSpotElement.data.spotTypeId)}
            assetByIdentifier={assetByIdentifier}
            isCurrent={true}
          />
          <Body size="sm" weight="weak" color="default">
            {t("spotSelector.legend.current")}
          </Body>
        </div>
      ) : null}

      {selectedSpotElement ? (
        <div role="listitem" className="flex items-center gap-2xs">
          <ActualSpotSwatch
            element={selectedSpotElement}
            spotType={spotTypeById.get(selectedSpotElement.data.spotTypeId)}
            assetByIdentifier={assetByIdentifier}
            selected={true}
          />
          <Body size="sm" weight="strong" color="default">
            {t("spotSelector.legend.selected")}
          </Body>
        </div>
      ) : null}
    </div>
  );
};
