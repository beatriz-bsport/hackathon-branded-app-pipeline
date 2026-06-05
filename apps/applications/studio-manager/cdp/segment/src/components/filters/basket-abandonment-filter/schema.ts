import { z } from "zod";

import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { i18nInstance } from "#src/utils/i18n";

import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "./sub-filters/basket-abandonment-sub-filter-id";
import { REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS } from "./sub-filters/registry";
import type { BasketAbandonmentFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

const subFilterIdSchema = z.array(
  z.literal(BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate),
);

export const basketValueValueSchema: z.ZodType<NumericComparatorFilterValue> =
  z.object({
    operator: z.enum([
      NUMERIC_COMPARATOR_OPERATORS.equal,
      NUMERIC_COMPARATOR_OPERATORS.between,
      NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    ]),
    firstValue: z.number().int().min(0).nullable(),
    secondValue: z.number().int().min(0).nullable(),
  });

const refineBasketValue = (
  value: BasketAbandonmentFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (value.basketValue.firstValue === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["basketValue", "firstValue"],
      message: i18nInstance.t("filters.20.validation.basketValueRequired", {
        ns: I18N_NAMESPACE,
      }),
    });
  }

  if (value.basketValue.operator === NUMERIC_COMPARATOR_OPERATORS.between) {
    if (value.basketValue.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["basketValue", "secondValue"],
        message: i18nInstance.t(
          "filters.20.validation.basketValueSecondRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
      return;
    }

    if (
      value.basketValue.firstValue !== null &&
      value.basketValue.secondValue < value.basketValue.firstValue
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["basketValue", "secondValue"],
        message: i18nInstance.t(
          "filters.20.validation.basketValueSecondGreaterThanFirst",
          { ns: I18N_NAMESPACE },
        ),
      });
    }
  }
};

/**
 * Validation schema for the abandoned basket filter (base fields + registered sub-filters).
 */
export const basketAbandonmentFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    subFilters: subFilterIdSchema,
    basketValue: basketValueValueSchema,
    abandonmentDate: dateFilterValueSchema,
  })
  .superRefine((value, context) => {
    refineBasketValue(value, context);
    for (const subFilterModule of REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<BasketAbandonmentFilterFormValue>;
