import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";
import { i18nInstance } from "#src/utils/i18n";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Zod fragment for the `expirationDate` slot (identical shape to purchase date).
 */
export const expirationDateValueSchema = dateFilterValueSchema;

/**
 * Adds conditional validation for the pass expiration date sub-filter when it is
 * active (`subFilters` contains `expiration_date`).
 */
export const refineExpirationDateSubFilter = (
  value: PassesFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive: value.subFilters.includes(PASS_SUB_FILTER_IDS.expirationDate),
    fieldPath: "expirationDate",
    dateValue: value.expirationDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.19.validation.expirationDateRequired",
        { ns: I18N_NAMESPACE },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.19.validation.expirationDateBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationRequired: i18nInstance.t(
        "filters.19.validation.expirationDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.19.validation.expirationDateDurationBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
    },
  });
};
