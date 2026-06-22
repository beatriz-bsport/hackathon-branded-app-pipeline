import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { BasketAbandonmentFilterFormValue } from "../../types";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "../basket-abandonment-sub-filter-id";

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
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateBetweenRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      durationRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateDurationRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.20.validation.abandonmentDateDurationBetweenRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    },
  });
};
