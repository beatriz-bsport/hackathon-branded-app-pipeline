import type { CreateTotalBookingFilterPayload } from "@bsport/api-cdp/smartlist";

import type {
  BookingMilestoneFilterCreatePayload,
  BookingMilestoneFilterFormValue,
} from "#src/components/filters/booking-milestone/types";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "#src/components/filters/total-booking/sub-filters/registry";

/**
 * Builds the POST payload for a new milestone filter. Sub-filter slices come
 * from the shared total-booking sub-filter modules (`appendCreatePayloadSlice`)
 * since the API field shapes are identical; the comparator-only fields
 * (`comparator`, `value_second`) from the total-booking shape are dropped.
 */
export const createBookingMilestonePayload = (
  value: BookingMilestoneFilterFormValue,
): BookingMilestoneFilterCreatePayload => {
  const subFilterAccumulator: Partial<CreateTotalBookingFilterPayload> = {};
  for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
    Object.assign(
      subFilterAccumulator,
      subFilterModule.appendCreatePayloadSlice(value),
    );
  }

  return {
    smartlist: value.smartlist,
    value: value.value,
    is_v2: true,
    activity_filter_active:
      subFilterAccumulator.activity_filter_active ?? false,
    select_all_activities: subFilterAccumulator.select_all_activities ?? true,
    meta_activities: subFilterAccumulator.meta_activities ?? [],
    establishment_filter_active:
      subFilterAccumulator.establishment_filter_active ?? false,
    select_all_establishments:
      subFilterAccumulator.select_all_establishments ?? true,
    establishments: subFilterAccumulator.establishments ?? [],
    payment_pack_filter_active:
      subFilterAccumulator.payment_pack_filter_active ?? false,
    select_all_payment_packs:
      subFilterAccumulator.select_all_payment_packs ?? true,
    payment_packs: subFilterAccumulator.payment_packs ?? [],
    coach_filter_active: subFilterAccumulator.coach_filter_active ?? false,
    select_all_coaches: subFilterAccumulator.select_all_coaches ?? true,
    coaches: subFilterAccumulator.coaches ?? [],
    level_filter_active: subFilterAccumulator.level_filter_active ?? false,
    level: subFilterAccumulator.level ?? [],
    date_filter_active: subFilterAccumulator.date_filter_active ?? false,
    date_filter_type: subFilterAccumulator.date_filter_type ?? 3,
    date: subFilterAccumulator.date ?? null,
    date_second: subFilterAccumulator.date_second ?? null,
    duration: subFilterAccumulator.duration ?? null,
    duration_second: subFilterAccumulator.duration_second ?? null,
    hour_filter_active: subFilterAccumulator.hour_filter_active ?? null,
    hour: subFilterAccumulator.hour ?? null,
    hour_second: subFilterAccumulator.hour_second ?? null,
    attendance_filter_active:
      subFilterAccumulator.attendance_filter_active ?? null,
    attendance: subFilterAccumulator.attendance ?? null,
  };
};
