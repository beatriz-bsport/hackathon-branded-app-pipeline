import {
  type ExpensesCompleteFilter,
  SmartlistCreditComparator,
} from "@bsport/api-cdp/smartlist";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import {
  EXPENSES_COMPLETE_DEFAULT_VALUE_SECOND,
  purchaseHistoryApiComparatorToFormOperator,
  toPurchaseHistoryNumericApiValue,
} from "../constants";

/**
 * Builds the `totalSpent` form slot from an API filter row.
 */
export const toFormTotalSpentSection = (
  filter: ExpensesCompleteFilter,
): NumericComparatorFilterValue => ({
  ...defaultNumericComparatorFilterValue,
  operator: purchaseHistoryApiComparatorToFormOperator(filter.comparator),
  firstValue: filter.value != null ? Number(filter.value) : null,
  secondValue:
    filter.comparator === SmartlistCreditComparator.BETWEEN &&
    filter.value_second != null
      ? Number(filter.value_second)
      : null,
});

/**
 * Resolves `value_second` for create/update payloads.
 */
export const toPurchaseHistoryValueSecond = (
  totalSpent: NumericComparatorFilterValue,
): number => {
  if (totalSpent.operator === NUMERIC_COMPARATOR_OPERATORS.between) {
    return toPurchaseHistoryNumericApiValue(totalSpent.secondValue);
  }

  return EXPENSES_COMPLETE_DEFAULT_VALUE_SECOND;
};
