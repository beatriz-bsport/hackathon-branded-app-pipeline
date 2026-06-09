import {
  type ReferredMemberFilter,
  SmartlistReferralMoneyComparator,
} from "@bsport/api-cdp/smartlist";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type {
  NumericComparatorFilterValue,
  NumericComparatorOperator,
} from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

/**
 * Maps form numeric comparator operators to API `money_obtained_comparator`.
 */
export const NUMERIC_COMPARATOR_TO_REFERRAL_MONEY_API: Record<
  NumericComparatorOperator,
  SmartlistReferralMoneyComparator
> = {
  [NUMERIC_COMPARATOR_OPERATORS.equal]: SmartlistReferralMoneyComparator.EQUAL,
  [NUMERIC_COMPARATOR_OPERATORS.between]:
    SmartlistReferralMoneyComparator.BETWEEN,
  [NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual]:
    SmartlistReferralMoneyComparator.LTE,
  [NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual]:
    SmartlistReferralMoneyComparator.GTE,
} as const;

/**
 * Converts API money comparator to the form operator value.
 */
export const mapApiReferralMoneyComparatorToFormOperator = (
  comparator: SmartlistReferralMoneyComparator,
): NumericComparatorOperator => {
  if (comparator === SmartlistReferralMoneyComparator.EQUAL) {
    return NUMERIC_COMPARATOR_OPERATORS.equal;
  }
  if (comparator === SmartlistReferralMoneyComparator.BETWEEN) {
    return NUMERIC_COMPARATOR_OPERATORS.between;
  }
  if (comparator === SmartlistReferralMoneyComparator.LTE) {
    return NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual;
  }
  return NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual;
};

/**
 * Maps form operator to API comparator for referral earnings.
 */
export const mapReferralMoneyComparator = (
  comparator: NumericComparatorOperator,
): SmartlistReferralMoneyComparator =>
  NUMERIC_COMPARATOR_TO_REFERRAL_MONEY_API[comparator];

/**
 * Serializes a nullable numeric form value to the API integer field.
 */
export const toNumericApiValue = (value: number | null): number =>
  value === null ? 0 : value;

/**
 * Builds the `moneyObtained` slot from an API filter.
 */
export const toFormMoneyObtainedSection = (
  filter: ReferredMemberFilter,
): NumericComparatorFilterValue => ({
  ...defaultNumericComparatorFilterValue,
  operator: mapApiReferralMoneyComparatorToFormOperator(
    filter.money_obtained_comparator,
  ),
  firstValue:
    filter.money_obtained != null ? Number(filter.money_obtained) : null,
  secondValue:
    filter.money_obtained_second != null
      ? Number(filter.money_obtained_second)
      : null,
});
