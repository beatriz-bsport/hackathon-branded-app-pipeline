import { z } from "zod";

import { isReferredStatusToApi } from "#src/components/filters/referred-members-filter/constants";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { i18nInstance } from "#src/utils/i18n";

import type { ReferredMembersFilterFormValue } from "../../types";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "../referred-members-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Zod fragment for the `moneyObtained` slot (referral earnings comparator).
 */
export const moneyObtainedValueSchema: z.ZodType<NumericComparatorFilterValue> =
  z.object({
    operator: z.enum([
      NUMERIC_COMPARATOR_OPERATORS.equal,
      NUMERIC_COMPARATOR_OPERATORS.between,
      NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual,
      NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    ]),
    firstValue: z.number().int().nullable(),
    secondValue: z.number().int().nullable(),
  });

/**
 * Adds conditional validation when the money obtained sub-filter is active.
 */
export const refineMoneyObtainedSubFilter = (
  value: ReferredMembersFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !isReferredStatusToApi(value.referredStatus) ||
    !value.subFilters.includes(REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained)
  ) {
    return;
  }

  if (value.moneyObtained.firstValue === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["moneyObtained", "firstValue"],
      message: i18nInstance.t(
        "filters.30.validation.moneyObtainedValueRequired",
        { ns: I18N_NAMESPACE },
      ),
    });
  }

  if (
    value.moneyObtained.operator === NUMERIC_COMPARATOR_OPERATORS.between &&
    value.moneyObtained.secondValue === null
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["moneyObtained", "secondValue"],
      message: i18nInstance.t(
        "filters.30.validation.moneyObtainedSecondValueRequired",
        { ns: I18N_NAMESPACE },
      ),
    });
  }

  if (
    value.moneyObtained.operator === NUMERIC_COMPARATOR_OPERATORS.between &&
    value.moneyObtained.firstValue !== null &&
    value.moneyObtained.secondValue !== null &&
    value.moneyObtained.firstValue > value.moneyObtained.secondValue
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["moneyObtained", "secondValue"],
      message: i18nInstance.t(
        "filters.30.validation.moneyObtainedBetweenRangeInvalid",
        { ns: I18N_NAMESPACE },
      ),
    });
  }
};
