import { z } from "zod";

import { firstPurchaseStatusToApi } from "#src/components/filters/first-purchase-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { FirstPurchaseFilterFormValue } from "../../types";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "../first-purchase-sub-filter-id";

/**
 * Zod fragment for the `purchaseAmount` slot (first purchase price comparator).
 */
export const purchaseAmountValueSchema: z.ZodType<NumericComparatorFilterValue> =
  z.object({
    operator: z.enum([
      NUMERIC_COMPARATOR_OPERATORS.equal,
      NUMERIC_COMPARATOR_OPERATORS.between,
      NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    ]),
    firstValue: z.number().nullable(),
    secondValue: z.number().nullable(),
  });

/**
 * Adds conditional validation when the purchase amount sub-filter is active.
 */
export const refinePurchaseAmountSubFilter = (
  value: FirstPurchaseFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !firstPurchaseStatusToApi(value.firstPurchaseStatus) ||
    !value.subFilters.includes(FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount)
  ) {
    return;
  }

  if (value.purchaseAmount.firstValue === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["purchaseAmount", "firstValue"],
      message: i18nInstance.t(
        "filters.28.validation.purchaseAmountValueRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }

  if (
    value.purchaseAmount.operator === NUMERIC_COMPARATOR_OPERATORS.between &&
    value.purchaseAmount.secondValue === null
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["purchaseAmount", "secondValue"],
      message: i18nInstance.t(
        "filters.28.validation.purchaseAmountSecondValueRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }
};
