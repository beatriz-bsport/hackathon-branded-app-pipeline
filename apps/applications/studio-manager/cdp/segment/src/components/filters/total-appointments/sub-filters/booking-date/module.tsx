import { DateTime } from "luxon";

import {
  type CreatePrivateBookingsFilterPayload,
  type PrivateBookingsFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import {
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/passes-filter/sub-filters/purchase-date/utils";
import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "../total-appointments-sub-filter-module-contract";
import { BookingDateSubFilterSection } from "./component";
import { refineBookingDateSubFilter } from "./schema";

const BOOKING_DATE_INACTIVE_API_SLICE: Partial<CreatePrivateBookingsFilterPayload> =
  {
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_AFTER,
    date: DateTime.now().toFormat("yyyy-MM-dd"),
    date_second: DateTime.now().toFormat("yyyy-MM-dd"),
    duration: 0,
    duration_second: 0,
  };

const toBookingDateApiSlice = (
  value: TotalAppointmentsNumberFilterFormValue,
): Partial<CreatePrivateBookingsFilterPayload> => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate)
  ) {
    return BOOKING_DATE_INACTIVE_API_SLICE;
  }

  const bookingDateType = mapDateFilterType(value.bookingDate);
  const bookingDateSection = toApiDateSection(
    value.bookingDate,
    bookingDateType,
  );

  return {
    date_filter_active: true,
    date_filter_type: bookingDateType,
    date: bookingDateSection.fromDate,
    date_second: bookingDateSection.toDate,
    duration: bookingDateSection.firstDurationValue,
    duration_second: bookingDateSection.secondDurationValue,
  };
};

export const bookingDateTotalAppointmentsSubFilterModule: TotalAppointmentsSubFilterModule =
  {
    id: TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate,
    labelKey: "filters.26.subFilters.appointmentDate",
    Section: BookingDateSubFilterSection,
    refine: refineBookingDateSubFilter,
    readFromApi: (filter: PrivateBookingsFilter) => ({
      isActive: filter.date_filter_active === true,
      partial: {
        bookingDate: toFormDateSection(
          filter.date_filter_type,
          filter.date ?? "",
          filter.date_second ?? "",
          filter.duration,
          filter.duration_second,
        ),
      },
    }),
    appendCreatePayloadSlice: (value) => toBookingDateApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const bookingDateDirty = hasNestedDirty(dirtyFields.bookingDate);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !bookingDateDirty && !subFiltersTouched) {
        return {};
      }
      return toBookingDateApiSlice(value);
    },
  };
