import {
  type PaymentPackFilter,
  SmartlistCreditComparator,
} from "@bsport/api-cdp/smartlist";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type {
  NumericComparatorFilterValue,
  NumericComparatorOperator,
} from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

/**
 * Maps form numeric comparator operators to API `SmartlistCreditComparator`.
 */
export const NUMERIC_COMPARATOR_TO_API: Record<
  NumericComparatorOperator,
  SmartlistCreditComparator
> = {
  [NUMERIC_COMPARATOR_OPERATORS.equal]: SmartlistCreditComparator.EQUAL,
  [NUMERIC_COMPARATOR_OPERATORS.between]: SmartlistCreditComparator.BETWEEN,
  [NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual]: SmartlistCreditComparator.LTE,
  [NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual]: SmartlistCreditComparator.GTE,
} as const;

/**
 * Converts API credit comparator to the form operator value.
 */
export const mapApiCreditComparatorToFormOperator = (
  comparator: SmartlistCreditComparator,
): NumericComparatorOperator => {
  if (comparator === SmartlistCreditComparator.EQUAL) {
    return NUMERIC_COMPARATOR_OPERATORS.equal;
  }
  if (comparator === SmartlistCreditComparator.BETWEEN) {
    return NUMERIC_COMPARATOR_OPERATORS.between;
  }
  if (comparator === SmartlistCreditComparator.LTE) {
    return NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual;
  }
  return NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual;
};

/**
 * Maps form operator to API comparator for the credit filter.
 */
export const mapCreditComparator = (
  comparator: NumericComparatorOperator,
): SmartlistCreditComparator => {
  return NUMERIC_COMPARATOR_TO_API[comparator];
};

/**
 * Serializes a nullable numeric form value to the API integer field.
 */
export const toNumericApiValue = (value: number | null): number =>
  value === null ? 0 : value;

/**
 * Builds the `creditLeft` slot from an API filter (inactive filters still
 * populate shape with defaults + stored comparator values).
 */
export const toFormCreditSection = (
  filter: PaymentPackFilter,
): NumericComparatorFilterValue => ({
  ...defaultNumericComparatorFilterValue,
  operator: mapApiCreditComparatorToFormOperator(filter.credit_comparator),
  firstValue: filter.credit_value != null ? Number(filter.credit_value) : null,
  secondValue:
    filter.credit_value_second != null
      ? Number(filter.credit_value_second)
      : null,
});
