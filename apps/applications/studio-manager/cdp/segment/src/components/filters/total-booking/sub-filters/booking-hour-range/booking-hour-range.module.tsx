import {
  type CreateTotalBookingFilterPayload,
  type TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import {
  BOOKING_HOUR_RANGE_DEFAULT_HOUR,
  BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../../constants";
import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { BookingHourRangeSubFilterSection } from "./booking-hour-range.component";
import { refineBookingHourRangeSubFilter } from "./schema";

const BOOKING_HOUR_RANGE_INACTIVE_API_SLICE =
  (): Partial<CreateTotalBookingFilterPayload> => ({
    hour_filter_active: false,
    hour: null,
    hour_second: null,
  });

const toBookingHourRangeApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (
    !value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange)
  ) {
    return BOOKING_HOUR_RANGE_INACTIVE_API_SLICE();
  }

  return {
    hour_filter_active: true,
    hour: value.bookingHourRange.hour,
    hour_second: value.bookingHourRange.hourSecond,
  };
};

const toFormBookingHourRangeSection = (filter: TotalBookingFilter) => ({
  hour: filter.hour ?? BOOKING_HOUR_RANGE_DEFAULT_HOUR,
  hourSecond: filter.hour_second ?? BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
});

export const bookingHourRangeTotalBookingSubFilterModule: TotalBookingSubFilterModule =
  {
    id: TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange,
    labelKey: "filters.22.subFilters.bookingHourRange",
    Section: BookingHourRangeSubFilterSection,
    refine: refineBookingHourRangeSubFilter,
    readFromApi: (filter: TotalBookingFilter) => ({
      isActive: filter.hour_filter_active === true,
      partial: {
        bookingHourRange: toFormBookingHourRangeSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toBookingHourRangeApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const bookingHourRangeDirty = hasNestedDirty(
        dirtyFields.bookingHourRange,
      );
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !bookingHourRangeDirty && !subFiltersTouched) {
        return {};
      }
      return toBookingHourRangeApiSlice(value);
    },
  };
