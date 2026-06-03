import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

export const refineCoachSubFilter = (
  value: TotalAppointmentsNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach)) {
    return;
  }

  if (
    !value.coach.selectAllCoaches &&
    value.coach.selectedCoachIds.length === 0
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["coach", "selectedCoachIds"],
      message: i18nInstance.t("filters.26.validation.selectedCoachesRequired", {
        ns: I18N_NAMESPACE,
      }),
    });
  }
};
