import { BookingStatusCode } from "@bsport/api-book";
import type { BookingFilterParams } from "@bsport/api-book";

import {
  BookingAttendanceFilter,
  BookingStatusFilter,
} from "#src/stores/session-management/types";
import type { BookingFilters } from "#src/stores/session-management/types";

const CANCELLED_STATUS_CODES = [
  BookingStatusCode.CANCELLED_BY_MANAGER,
  BookingStatusCode.CANCELLED_BY_CONSUMER,
  BookingStatusCode.CANCELLED_BY_SESSION,
].join(",");

export const getBookingParamsFromFilters = (
  filters: BookingFilters,
): Partial<BookingFilterParams> => {
  const params: Partial<BookingFilterParams> = {};

  if (filters.status === BookingStatusFilter.BOOKED) {
    params.booking_status_code = BookingStatusCode.OK;
  } else if (filters.status === BookingStatusFilter.CANCELLED) {
    params.booking_status_code__in = CANCELLED_STATUS_CODES;
    // If the status is cancelled, the attendance filter is not relevant, we can ignore it
    return params;
  }

  if (filters.attendance === BookingAttendanceFilter.PRESENT) {
    params.attendance = true;
  } else if (filters.attendance === BookingAttendanceFilter.ABSENT) {
    params.attendance = false;
  }

  return params;
};
