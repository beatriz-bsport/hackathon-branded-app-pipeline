import type { TemporalityType, TimeUnitType } from "./types";

export function isTimeUnitTypeCorrect(
  timeUnit: string,
): timeUnit is TimeUnitType {
  return timeUnit === "hour" || timeUnit === "day";
}

export function isTemporalityTypeCorrect(
  TemporalityType: string,
): TemporalityType is TemporalityType {
  return TemporalityType === "before" || TemporalityType === "after";
}
