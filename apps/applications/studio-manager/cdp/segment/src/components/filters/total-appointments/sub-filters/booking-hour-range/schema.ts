import { z } from "zod";

import {
  isBookingHourRangeOrderInvalid,
  isInvalidHourRangeTimeInput,
  normalizeBookingHourRangeFormValue,
} from "#src/components/filters/shared/booking-hour-range/normalize-booking-hour-range";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import {
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../../constants";
import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";

/**
 * Zod refinement for the appointment hour-range sub-filter when it is
 * present in `subFilters` (requires both bounds and sensible ordering).
 */
export const refineBookingHourRangeSubFilter = (
  value: TotalAppointmentsNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !value.subFilters.includes(
      TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange,
    )
  ) {
    return;
  }

  const { hour, hourSecond } = value.bookingHourRange;

  if (isInvalidHourRangeTimeInput(hour)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hour"],
      message: i18nInstance.t(
        "filters.26.validation.appointmentHourRangeRequired",
        {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        },
      ),
    });
    return;
  }

  if (isInvalidHourRangeTimeInput(hourSecond)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingHourRange", "hourSecond"],
      message: i18nInstance.t(
        "filters.26.validation.appointmentHourRangeRequired",
        {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        },
      ),
    });
    return;
  }

  const normalizedBookingHourRange = normalizeBookingHourRangeFormValue(
    value.bookingHourRange,
    {
      hour: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
      hourSecond: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
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
        "filters.26.validation.appointmentHourRangeOrderInvalid",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }
};
