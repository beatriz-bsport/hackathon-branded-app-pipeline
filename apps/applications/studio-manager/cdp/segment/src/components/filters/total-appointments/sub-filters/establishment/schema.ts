import { z } from "zod";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";

export const refineEstablishmentSubFilter = (
  value: TotalAppointmentsNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment)
  ) {
    return;
  }

  if (
    !value.establishment.selectAllEstablishments &&
    value.establishment.selectedEstablishmentIds.length === 0 &&
    !value.establishment.atHome
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["establishment", "selectedEstablishmentIds"],
      message: i18nInstance.t(
        "filters.26.validation.selectedEstablishmentsRequired",
        {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        },
      ),
    });
  }
};
