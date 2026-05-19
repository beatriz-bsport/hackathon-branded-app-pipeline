import type { ValueOf } from "#src/components/filters/shared/sub-filter-id";

export const TOTAL_BOOKING_SUB_FILTER_IDS = {
  activity: "activity",
  establishment: "establishment",
  coach: "coach",
  paymentPack: "paymentPack",
  bookingDate: "bookingDate",
  bookingHourRange: "bookingHourRange",
  level: "level",
} as const;

export type TotalBookingSubFilterId = ValueOf<
  typeof TOTAL_BOOKING_SUB_FILTER_IDS
>;

export const totalBookingSubFilterFieldMap = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: "activity",
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: "establishment",
  [TOTAL_BOOKING_SUB_FILTER_IDS.coach]: "coach",
  [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack]: "paymentPack",
  [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate]: "bookingDate",
  [TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange]: "bookingHourRange",
  [TOTAL_BOOKING_SUB_FILTER_IDS.level]: "level",
} as const;

export type TotalBookingSubFilterField = ValueOf<
  typeof totalBookingSubFilterFieldMap
>;
