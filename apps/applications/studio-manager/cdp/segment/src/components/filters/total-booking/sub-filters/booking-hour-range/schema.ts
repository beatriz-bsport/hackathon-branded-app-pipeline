import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

const BOOKING_HOUR_RANGE_REQUIRED_MESSAGE = i18nInstance.t(
  "filters.22.validation.bookingHourRangeRequired",
  { ns: I18N_NAMESPACE },
);

const TIME_HH_MM_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Parses an `HH:mm` string into minutes from midnight for range comparison.
 *
 * @param time - Time string in 24-hour `HH:mm` format.
 */
const parseTimeToMinutes = (time: string): number => {
  const [hoursString, minutesString] = time.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  return hours * 60 + minutes;
};

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

  if (!hour || !TIME_HH_MM_PATTERN.test(hour)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hour"],
      message: BOOKING_HOUR_RANGE_REQUIRED_MESSAGE,
    });
    return;
  }

  if (!hourSecond || !TIME_HH_MM_PATTERN.test(hourSecond)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hourSecond"],
      message: BOOKING_HOUR_RANGE_REQUIRED_MESSAGE,
    });
    return;
  }

  if (parseTimeToMinutes(hour) > parseTimeToMinutes(hourSecond)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hourSecond"],
      message: i18nInstance.t(
        "filters.22.validation.bookingHourRangeOrderInvalid",
        { ns: I18N_NAMESPACE },
      ),
    });
  }
};
