import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { i18nInstance } from "#src/utils/i18n";

import type { BasketAbandonmentFilterFormValue } from "../../types";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "../basket-abandonment-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Adds conditional validation when the abandonment date sub-filter is active.
 */
export const refineAbandonmentDateSubFilter = (
  value: BasketAbandonmentFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive: value.subFilters.includes(
      BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate,
    ),
    fieldPath: "abandonmentDate",
    dateValue: value.abandonmentDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateRequired",
        { ns: I18N_NAMESPACE },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateDurationBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
    },
  });
};
