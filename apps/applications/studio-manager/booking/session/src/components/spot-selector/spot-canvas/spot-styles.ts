export type SpotVisualState = "free" | "taken" | "current" | "selected";

export type SpotStateStyle = {
  fill: string;
  stroke: string;
  textColor: string;
  /** Width for the body stroke. Selected/current use a thicker outline. */
  strokeWidth: number;
};

export const SPOT_STATE_STYLE: Record<SpotVisualState, SpotStateStyle> = {
  free: {
    fill: "var(--kz-color-surface-default)",
    stroke: "var(--kz-color-luna-grey-500)",
    textColor: "var(--kz-color-onsurface-default)",
    strokeWidth: 1,
  },
  taken: {
    fill: "var(--kz-color-luna-grey-300)",
    stroke: "var(--kz-color-luna-grey-500)",
    textColor: "var(--kz-color-onsurface-weak)",
    strokeWidth: 1,
  },
  current: {
    fill: "var(--kz-color-surface-main-weak)",
    stroke: "var(--kz-color-surface-main-strong)",
    textColor: "var(--kz-color-onsurface-main-onweak)",
    strokeWidth: 2,
  },
  selected: {
    fill: "var(--kz-color-surface-main-strong)",
    stroke: "var(--kz-color-surface-main-strong)",
    textColor: "var(--kz-color-onsurface-main-onstrong)",
    strokeWidth: 2,
  },
};

export const SPOT_RING_STROKE = "var(--kz-color-stroke-action-main-selected)";

export const SPOT_STATE_LABEL_KEY = {
  free: "spotSelector.legend.free",
  taken: "spotSelector.legend.taken",
  current: "spotSelector.legend.current",
  selected: "spotSelector.legend.selected",
} as const satisfies Record<SpotVisualState, string>;

export const resolveSpotState = ({
  selected,
  isCurrent,
  taken,
}: {
  selected: boolean;
  isCurrent: boolean;
  taken: boolean;
}): SpotVisualState => {
  if (selected) return "selected";
  if (isCurrent) return "current";
  if (taken) return "taken";
  return "free";
};
