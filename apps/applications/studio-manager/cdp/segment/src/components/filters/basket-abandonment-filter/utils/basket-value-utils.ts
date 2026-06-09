import {
  type BasketAbandonmentFilter,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type {
  NumericComparatorFilterValue,
  NumericComparatorOperator,
} from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import {
  apiBasketValueToFormAmount,
  formAmountToApiBasketValue,
} from "./money-amount-utils";

/**
 * Maps form numeric comparator operators to API `SmartlistPaymentComparator`.
 */
export const NUMERIC_COMPARATOR_TO_BASKET_API: Record<
  NumericComparatorOperator,
  SmartlistPaymentComparator
> = {
  [NUMERIC_COMPARATOR_OPERATORS.equal]: SmartlistPaymentComparator.EQUAL,
  [NUMERIC_COMPARATOR_OPERATORS.between]: SmartlistPaymentComparator.BETWEEN,
  [NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual]: SmartlistPaymentComparator.LTE,
  [NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual]: SmartlistPaymentComparator.GTE,
};

/**
 * Converts API basket comparator to the form operator value.
 */
export const mapApiBasketComparatorToFormOperator = (
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
 * Maps form operator to API comparator for the basket value filter.
 */
export const mapBasketComparator = (
  comparator: NumericComparatorOperator,
): SmartlistPaymentComparator => {
  return NUMERIC_COMPARATOR_TO_BASKET_API[comparator];
};

/**
 * Serializes nullable form amounts to API integer basket fields.
 */
export const toBasketValueApiField = (amount: number | null): number =>
  formAmountToApiBasketValue(amount ?? 0);

/**
 * Builds the `basketValue` slot from an API filter.
 */
export const toFormBasketValueSection = (
  filter: BasketAbandonmentFilter,
): NumericComparatorFilterValue => ({
  ...defaultNumericComparatorFilterValue,
  operator: mapApiBasketComparatorToFormOperator(filter.comparator),
  firstValue: apiBasketValueToFormAmount(filter.basket_value),
  secondValue:
    filter.basket_value_second != null
      ? apiBasketValueToFormAmount(filter.basket_value_second)
      : null,
});
