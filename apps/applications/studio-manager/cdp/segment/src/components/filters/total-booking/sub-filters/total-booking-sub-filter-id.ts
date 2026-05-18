import type { ValueOf } from "#src/components/filters/shared/sub-filter-id";

export const TOTAL_BOOKING_SUB_FILTER_IDS = {
  activity: "activity",
  establishment: "establishment",
  coach: "coach",
} as const;

export type TotalBookingSubFilterId = ValueOf<
  typeof TOTAL_BOOKING_SUB_FILTER_IDS
>;

export const totalBookingSubFilterFieldMap = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: "activity",
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: "establishment",
  [TOTAL_BOOKING_SUB_FILTER_IDS.coach]: "coach",
} as const;

export type TotalBookingSubFilterField = ValueOf<
  typeof totalBookingSubFilterFieldMap
>;
