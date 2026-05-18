import type { ValueOf } from "#src/components/filters/shared/sub-filter-id";

export const TOTAL_BOOKING_SUB_FILTER_IDS = {
  activity: "activity",
} as const;

export type TotalBookingSubFilterId = ValueOf<
  typeof TOTAL_BOOKING_SUB_FILTER_IDS
>;

export const totalBookingSubFilterFieldMap = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: "activity",
} as const;

export type TotalBookingSubFilterField = ValueOf<
  typeof totalBookingSubFilterFieldMap
>;
