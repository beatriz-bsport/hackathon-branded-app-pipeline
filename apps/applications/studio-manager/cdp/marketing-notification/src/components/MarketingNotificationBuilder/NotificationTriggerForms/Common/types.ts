export const TEMPORALITY_BEFORE = "before";
export const TEMPORALITY_AFTER = "after";

export const TIME_UNIT_HOUR = "hour";
export const TIME_UNIT_DAY = "day";

export type TemporalityType =
  | typeof TEMPORALITY_BEFORE
  | typeof TEMPORALITY_AFTER;

export type TimeUnitType = typeof TIME_UNIT_HOUR | typeof TIME_UNIT_DAY;

export const DEFAULT_TIMING_VALUE = 0;
