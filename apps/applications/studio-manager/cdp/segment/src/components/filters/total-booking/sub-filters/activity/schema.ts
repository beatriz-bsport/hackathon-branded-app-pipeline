import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

export const refineActivitySubFilter = (
  value: TotalBookingNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.activity)) {
    return;
  }

  if (
    !value.activity.selectAllActivities &&
    value.activity.selectedMetaActivityIds.length === 0
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["activity", "selectedMetaActivityIds"],
      message: i18nInstance.t(
        "filters.22.validation.selectedActivitiesRequired",
        {
          ns: I18N_NAMESPACE,
        },
      ),
    });
  }
};
