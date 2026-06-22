import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";

/**
 * Conditional validation for the booking session date sub-filter when it is
 * listed in `subFilters`.
 */
export const refineBookingDateSubFilter = (
  value: TotalBookingNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive: value.subFilters.includes(
      TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate,
    ),
    fieldPath: "bookingDate",
    dateValue: value.bookingDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.22.validation.bookingDateRequired",
        {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.22.validation.bookingDateBetweenRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      durationRequired: i18nInstance.t(
        "filters.22.validation.bookingDateDurationRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.22.validation.bookingDateDurationBetweenRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    },
  });
};
