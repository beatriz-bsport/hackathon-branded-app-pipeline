import { z } from "zod";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";

/**
 * Zod fragment for the `creditLeft` slot (remaining credits comparator).
 */
export const creditLeftValueSchema: z.ZodType<NumericComparatorFilterValue> =
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
 * Adds conditional validation when the credits sub-filter is active.
 */
export const refineCreditLeftSubFilter = (
  value: PassesFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(PASS_SUB_FILTER_IDS.creditLeft)) {
    return;
  }

  if (value.creditLeft.firstValue === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["creditLeft", "firstValue"],
      message: i18nInstance.t("filters.19.validation.creditValueRequired", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    });
  }

  if (
    value.creditLeft.operator === NUMERIC_COMPARATOR_OPERATORS.between &&
    value.creditLeft.secondValue === null
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["creditLeft", "secondValue"],
      message: i18nInstance.t(
        "filters.19.validation.creditSecondValueRequired",
        { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
      ),
    });
  }
};
