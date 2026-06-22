import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";

/** @deprecated Use `dateFilterValueSchema` from the shared smartlist date filter module. */
export const purchaseDateValueSchema = dateFilterValueSchema;

export { dateFilterValueSchema };

/**
 * Adds conditional validation for the pass purchase date sub-filter when it is
 * active (`subFilters` contains `purchase_date`).
 */
export const refinePurchaseDateSubFilter = (
  value: PassesFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive: value.subFilters.includes(PASS_SUB_FILTER_IDS.purchaseDate),
    fieldPath: "purchaseDate",
    dateValue: value.purchaseDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.19.validation.purchaseDateRequired",
        {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.19.validation.purchaseDateBetweenRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      durationRequired: i18nInstance.t(
        "filters.19.validation.purchaseDateDurationRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.19.validation.purchaseDateDurationBetweenRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    },
  });
};
