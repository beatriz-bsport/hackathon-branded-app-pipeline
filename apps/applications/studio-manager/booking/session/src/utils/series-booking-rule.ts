import type { Series } from "#src/types";

export type SeriesBookingRule = "fullSeries" | "openSeries" | "singleClass";

export type SeriesBookingRuleChipColor = "info" | "positive" | "warning";

export const SERIES_BOOKING_RULE_CHIP_COLORS: Record<
  SeriesBookingRule,
  SeriesBookingRuleChipColor
> = {
  fullSeries: "warning",
  openSeries: "positive",
  singleClass: "info",
};

export const getSeriesBookingRule = (
  series: Pick<Series, "allow_booking_after_start" | "full_booking_only">,
): SeriesBookingRule => {
  if (!series.full_booking_only) {
    return "singleClass";
  }

  return series.allow_booking_after_start ? "openSeries" : "fullSeries";
};
