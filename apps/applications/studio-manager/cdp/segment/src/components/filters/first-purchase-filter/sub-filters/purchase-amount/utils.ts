import {
  type FirstPurchaseFilter,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type {
  NumericComparatorFilterValue,
  NumericComparatorOperator,
} from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

/**
 * Maps form numeric comparator operators to API `SmartlistPaymentComparator`.
 */
export const NUMERIC_COMPARATOR_TO_PAYMENT_API: Record<
  NumericComparatorOperator,
  SmartlistPaymentComparator
> = {
  [NUMERIC_COMPARATOR_OPERATORS.equal]: SmartlistPaymentComparator.EQUAL,
  [NUMERIC_COMPARATOR_OPERATORS.between]: SmartlistPaymentComparator.BETWEEN,
  [NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual]: SmartlistPaymentComparator.LTE,
  [NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual]: SmartlistPaymentComparator.GTE,
} as const;

/**
 * Converts API payment comparator to the form operator value.
 */
export const mapApiPaymentComparatorToFormOperator = (
  comparator: SmartlistPaymentComparator,
): NumericComparatorOperator => {
  if (comparator === SmartlistPaymentComparator.EQUAL) {
    return NUMERIC_COMPARATOR_OPERATORS.equal;
  }
  if (comparator === SmartlistPaymentComparator.BETWEEN) {
    return NUMERIC_COMPARATOR_OPERATORS.between;
  }
  if (comparator === SmartlistPaymentComparator.LTE) {
    return NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual;
  }
  return NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual;
};

/**
 * Maps form operator to API comparator for the purchase amount filter.
 */
export const mapPaymentComparator = (
  comparator: NumericComparatorOperator,
): SmartlistPaymentComparator => {
  return NUMERIC_COMPARATOR_TO_PAYMENT_API[comparator];
};

/**
 * Serializes a nullable numeric form value to the API integer field.
 */
export const toNumericApiValue = (value: number | null): number =>
  value === null ? 0 : value;

/**
 * Builds the `purchaseAmount` slot from an API filter.
 */
export const toFormPurchaseAmountSection = (
  filter: FirstPurchaseFilter,
): NumericComparatorFilterValue => ({
  ...defaultNumericComparatorFilterValue,
  operator: mapApiPaymentComparatorToFormOperator(filter.comparator_payment),
  firstValue:
    filter.value_payment != null ? Number(filter.value_payment) : null,
  secondValue:
    filter.value_second_payment != null
      ? Number(filter.value_second_payment)
      : null,
});
