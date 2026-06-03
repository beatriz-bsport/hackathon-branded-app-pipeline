import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import { normalizeBookingHourRangeFormValue } from "#src/components/filters/shared/booking-hour-range/normalize-booking-hour-range";
import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import {
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../../constants";
import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { BookingHourRangeSubFilterSection } from "./component";
import { refineBookingHourRangeSubFilter } from "./schema";

const BOOKING_HOUR_RANGE_INACTIVE_API_SLICE: Partial<CreatePrivateBookingsFilterPayload> =
  {
    hour_filter_active: false,
    hour: null,
    hour_second: null,
  };

const toBookingHourRangeApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (
    !value.subFilters.includes(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange,
    )
  ) {
    return BOOKING_HOUR_RANGE_INACTIVE_API_SLICE;
  }

  const normalizedBookingHourRange = normalizeBookingHourRangeFormValue(
    value.bookingHourRange,
    {
      hour: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
      hourSecond: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
    },
  );

  return {
    hour_filter_active: true,
    hour: normalizedBookingHourRange.hour,
    hour_second: normalizedBookingHourRange.hourSecond,
  };
};

const toFormBookingHourRangeSection = (filter: PrivateBookingsFilter) =>
  normalizeBookingHourRangeFormValue(
    {
      hour: filter.hour,
      hourSecond: filter.hour_second,
    },
    {
      hour: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
      hourSecond: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
    },
  );

export const bookingHourRangeTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange,
    labelKey: "filters.26.subFilters.appointmentHourRange",
    Section: BookingHourRangeSubFilterSection,
    refine: refineBookingHourRangeSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
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
