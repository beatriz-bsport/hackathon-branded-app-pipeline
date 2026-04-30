import type React from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  SPOT_RING_STROKE,
  SPOT_STATE_STYLE,
  type SpotVisualState,
} from "../spot-canvas/spot-styles";

export type SpotStatusLegendProps = {
  /** Number of free spots; shown as a count badge. */
  freeCount: number;
  /** Number of taken spots; shown as a count badge. */
  takenCount: number;
  /** True while the user has a spot selected; just highlights the swatch. */
  isSelectionActive?: boolean;
  /** True when the participant already holds a spot; surfaces the "Current spot" item. */
  hasCurrent?: boolean;
};

const SWATCH_SIZE = 16;

// Swatch stroke widths are tuned for the 16px legend chip and don't reuse
// SPOT_STATE_STYLE.strokeWidth (which targets the much larger canvas spots).
const SWATCH_STROKE: Record<SpotVisualState, number> = {
  free: 1.5,
  taken: 1.5,
  current: 2,
  selected: 1.5,
};

const StatusSwatch: React.FC<{ state: SpotVisualState }> = ({ state }) => {
  const style = SPOT_STATE_STYLE[state];
  const dashedRing = state === "selected";
  const opacity = state === "taken" ? 0.55 : 1;
  return (
    <svg
      width={SWATCH_SIZE}
      height={SWATCH_SIZE}
      viewBox="-12 -12 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      {dashedRing ? (
        <circle
          r={10}
          fill="none"
          stroke={SPOT_RING_STROKE}
          strokeWidth={1.5}
          strokeDasharray="2.5 2"
        />
      ) : null}
      <circle
        r={7}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={SWATCH_STROKE[state]}
        opacity={opacity}
      />
    </svg>
  );
};

export const SpotStatusLegend: React.FC<SpotStatusLegendProps> = ({
  freeCount,
  takenCount,
  isSelectionActive,
  hasCurrent,
}) => {
  const { t } = useTranslation("sessionManagement");

  return (
    <div
      className="flex flex-wrap items-center gap-md"
      role="list"
      aria-label={t("spotSelector.legend.title")}
    >
      <LegendItem
        state="free"
        label={t("spotSelector.legend.free")}
        count={freeCount}
      />
      <LegendItem
        state="taken"
        label={t("spotSelector.legend.taken")}
        count={takenCount}
      />
      {hasCurrent ? (
        <LegendItem state="current" label={t("spotSelector.legend.current")} />
      ) : null}
      <LegendItem
        state="selected"
        label={t("spotSelector.legend.selected")}
        emphasized={isSelectionActive}
      />
    </div>
  );
};

const LegendItem: React.FC<{
  state: SpotVisualState;
  label: string;
  count?: number;
  emphasized?: boolean;
}> = ({ state, label, count, emphasized }) => (
  <div role="listitem" className="flex items-center gap-2xs">
    <StatusSwatch state={state} />
    <Body size="sm" weight={emphasized ? "strong" : "weak"} color="default">
      {label}
    </Body>
    {typeof count === "number" ? (
      <Body size="sm" weight="weak" color="weak">
        {count}
      </Body>
    ) : null}
  </div>
);
