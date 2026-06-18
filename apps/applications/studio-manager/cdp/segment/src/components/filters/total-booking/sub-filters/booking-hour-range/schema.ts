import { z } from "zod";

import {
  isBookingHourRangeOrderInvalid,
  isInvalidHourRangeTimeInput,
  normalizeBookingHourRangeFormValue,
} from "#src/components/filters/shared/booking-hour-range/normalize-booking-hour-range";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import {
  BOOKING_HOUR_RANGE_DEFAULT_HOUR,
  BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../../constants";
import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";

const BOOKING_HOUR_RANGE_REQUIRED_MESSAGE = i18nInstance.t(
  "filters.22.validation.bookingHourRangeRequired",
  { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
);

/**
 * Zod refinement for the booking session hour-range sub-filter when it is
 * present in `subFilters` (requires both bounds and sensible ordering).
 */
export const refineBookingHourRangeSubFilter = (
  value: TotalBookingNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange)
  ) {
    return;
  }

  const { hour, hourSecond } = value.bookingHourRange;

  if (isInvalidHourRangeTimeInput(hour)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hour"],
      message: BOOKING_HOUR_RANGE_REQUIRED_MESSAGE,
    });
    return;
  }

  if (isInvalidHourRangeTimeInput(hourSecond)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hourSecond"],
      message: BOOKING_HOUR_RANGE_REQUIRED_MESSAGE,
    });
    return;
  }

  const normalizedBookingHourRange = normalizeBookingHourRangeFormValue(
    value.bookingHourRange,
    {
      hour: BOOKING_HOUR_RANGE_DEFAULT_HOUR,
      hourSecond: BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
    },
  );

  if (
    isBookingHourRangeOrderInvalid(
      normalizedBookingHourRange.hour,
      normalizedBookingHourRange.hourSecond,
    )
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hourSecond"],
      message: i18nInstance.t(
        "filters.22.validation.bookingHourRangeOrderInvalid",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }
};
