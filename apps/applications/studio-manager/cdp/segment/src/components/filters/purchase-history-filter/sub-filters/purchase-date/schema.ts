import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { i18nInstance } from "#src/utils/i18n";

import type { PurchaseHistoryFilterFormValue } from "../../types";
import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "../purchase-history-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Conditional validation for the purchase date sub-filter when it is active.
 */
export const refinePurchaseDateSubFilter = (
  value: PurchaseHistoryFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive: value.subFilters.includes(
      PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate,
    ),
    fieldPath: "purchaseDate",
    dateValue: value.purchaseDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.24.validation.purchaseDateRequired",
        {
          ns: I18N_NAMESPACE,
        },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.24.validation.purchaseDateBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationRequired: i18nInstance.t(
        "filters.24.validation.purchaseDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.24.validation.purchaseDateDurationBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
    },
  });
};
