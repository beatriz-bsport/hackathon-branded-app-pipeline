import { z } from "zod";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";

export const refineLevelSubFilter = (
  value: TotalBookingNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.level)) {
    return;
  }

  if (value.level.selectedLevelIds.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["level", "selectedLevelIds"],
      message: i18nInstance.t("filters.22.validation.selectedLevelsRequired", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    });
  }
};
