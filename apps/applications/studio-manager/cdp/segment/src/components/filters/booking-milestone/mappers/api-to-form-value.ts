import type {
  BookingMilestoneFilter,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";
import { SmartlistTotalBookingComparator } from "@bsport/api-cdp/smartlist";

import { BOOKING_MILESTONE_MIN_VALUE } from "#src/components/filters/booking-milestone/constants";
import type { BookingMilestoneFilterFormValue } from "#src/components/filters/booking-milestone/types";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "#src/components/filters/total-booking/sub-filters/registry";

/**
 * The booking-milestone API filter is structurally a subset of the
 * total-booking one (no `comparator` / `value_second`). The shared sub-filter
 * modules only read fields that are present on both shapes, so we lift the
 * milestone DTO into a total-booking DTO shell (with default comparator
 * fields) and reuse the same `readFromApi` slices.
 */
const liftToTotalBookingShape = (
  filter: BookingMilestoneFilter,
): TotalBookingFilter => ({
  ...filter,
  comparator: SmartlistTotalBookingComparator.GTE,
  value_second: 0,
});

export const mapBookingMilestoneFilterToFormValue = (
  filter: BookingMilestoneFilter,
): BookingMilestoneFilterFormValue => {
  const subFilters: BookingMilestoneFilterFormValue["subFilters"] = [];
  const partialFromModules: Partial<BookingMilestoneFilterFormValue> = {};
  const liftedFilter = liftToTotalBookingShape(filter);

  for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
    const moduleResult = subFilterModule.readFromApi(liftedFilter);
    if (moduleResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialFromModules, moduleResult.partial);
  }

  return {
    ...createDefaultTotalBookingNumberFilter(filter.smartlist),
    id: filter.id,
    smartlist: filter.smartlist,
    value: filter.value ?? BOOKING_MILESTONE_MIN_VALUE,
    subFilters,
    ...partialFromModules,
  };
};
