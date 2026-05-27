import { z } from "zod";

import { firstPurchaseStatusToApi } from "#src/components/filters/first-purchase-filter/constants";
import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { i18nInstance } from "#src/utils/i18n";

import type { FirstPurchaseFilterFormValue } from "../../types";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "../first-purchase-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Conditional validation for the purchase date sub-filter when it is active.
 */
export const refinePurchaseDateSubFilter = (
  value: FirstPurchaseFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive:
      firstPurchaseStatusToApi(value.firstPurchaseStatus) &&
      value.subFilters.includes(FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate),
    fieldPath: "purchaseDate",
    dateValue: value.purchaseDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.28.validation.purchaseDateRequired",
        {
          ns: I18N_NAMESPACE,
        },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.28.validation.purchaseDateBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationRequired: i18nInstance.t(
        "filters.28.validation.purchaseDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.28.validation.purchaseDateDurationBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
    },
  });
};
