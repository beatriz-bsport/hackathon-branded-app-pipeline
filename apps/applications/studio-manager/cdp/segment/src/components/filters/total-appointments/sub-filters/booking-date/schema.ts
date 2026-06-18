import { z } from "zod";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { mapDateFilterType } from "#src/components/filters/passes-filter/sub-filters/purchase-date/utils";
import {
  ABSOLUTE_DATE_OPERATOR_BETWEEN,
  DATE_FILTER_TYPE_ABSOLUTE,
} from "#src/components/primitive-filters/date-filter/constants";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";

/**
 * Conditional validation for the appointment date sub-filter when it is
 * listed in `subFilters` (same matrix as pass purchase / expiration dates).
 */
export const refineBookingDateSubFilter = (
  value: TotalAppointmentsNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate)
  ) {
    return;
  }

  const dateFilterType = mapDateFilterType(value.bookingDate);

  if (value.bookingDate.dateType === DATE_FILTER_TYPE_ABSOLUTE) {
    const { operator, fromDate, toDate } = value.bookingDate.absolute;
    if (
      operator === ABSOLUTE_DATE_OPERATOR_BETWEEN &&
      (!fromDate || !toDate || fromDate.trim() === "" || toDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bookingDate", "absolute", "toDate"],
        message: i18nInstance.t(
          "filters.26.validation.appointmentDateBetweenRequired",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
      return;
    }
    if (
      operator !== ABSOLUTE_DATE_OPERATOR_BETWEEN &&
      (!fromDate || fromDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bookingDate", "absolute", "fromDate"],
        message: i18nInstance.t(
          "filters.26.validation.appointmentDateRequired",
          {
            ns: I18N_SEGMENT_NAMESPACES.FILTERS,
          },
        ),
      });
    }
    return;
  }

  const { firstDays, secondDays } = value.bookingDate.relative;

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    if (firstDays === null || secondDays === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bookingDate", "relative", "secondDays"],
        message: i18nInstance.t(
          "filters.26.validation.appointmentDateDurationBetweenRequired",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
    }
    return;
  }

  if (firstDays === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bookingDate", "relative", "firstDays"],
      message: i18nInstance.t(
        "filters.26.validation.appointmentDateDurationRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }
};
