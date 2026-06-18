import { z } from "zod";

import { ALL_EXPENSES_COMPLETE_BUYABLE_IDS } from "@bsport/api-cdp/smartlist";

import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "./sub-filters/purchase-history-sub-filter-id";
import { REGISTERED_PURCHASE_HISTORY_SUB_FILTERS } from "./sub-filters/registry";
import type { PurchaseHistoryFilterFormValue } from "./types";

const allowedBuyableIdSet = new Set<number>(ALL_EXPENSES_COMPLETE_BUYABLE_IDS);

const totalSpentValueSchema: z.ZodType<NumericComparatorFilterValue> = z.object(
  {
    operator: z.enum([
      NUMERIC_COMPARATOR_OPERATORS.equal,
      NUMERIC_COMPARATOR_OPERATORS.between,
      NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    ]),
    firstValue: z.number().int().nonnegative().nullable(),
    secondValue: z.number().int().nonnegative().nullable(),
  },
);

const refineTotalSpent = (
  value: PurchaseHistoryFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (value.totalSpent.firstValue === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["totalSpent", "firstValue"],
      message: i18nInstance.t("filters.24.validation.totalSpentValueRequired", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    });
  }

  if (
    value.totalSpent.operator === NUMERIC_COMPARATOR_OPERATORS.between &&
    value.totalSpent.secondValue === null
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["totalSpent", "secondValue"],
      message: i18nInstance.t(
        "filters.24.validation.totalSpentSecondValueRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }

  if (
    value.totalSpent.operator === NUMERIC_COMPARATOR_OPERATORS.between &&
    value.totalSpent.firstValue !== null &&
    value.totalSpent.secondValue !== null &&
    value.totalSpent.firstValue > value.totalSpent.secondValue
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["totalSpent", "secondValue"],
      message: i18nInstance.t(
        "filters.24.validation.totalSpentSecondValueGreaterThanFirst",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }
};

const refineSpentOn = (
  value: PurchaseHistoryFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (value.spentOn.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["spentOn"],
      message: i18nInstance.t("filters.24.validation.spentOnRequired", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    });
    return;
  }

  const hasInvalidId = value.spentOn.some(
    (buyableId) => !allowedBuyableIdSet.has(buyableId),
  );
  if (hasInvalidId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["spentOn"],
      message: i18nInstance.t("filters.24.validation.spentOnInvalid", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    });
  }
};

/**
 * Validation schema for the purchase history filter.
 */
export const purchaseHistoryFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    totalSpent: totalSpentValueSchema,
    spentOn: z.array(z.number().int()),
    subFilters: z.array(
      z.literal(PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate),
    ),
    purchaseDate: dateFilterValueSchema,
  })
  .superRefine((value, context) => {
    refineTotalSpent(value, context);
    refineSpentOn(value, context);
    for (const subFilterModule of REGISTERED_PURCHASE_HISTORY_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<PurchaseHistoryFilterFormValue>;
