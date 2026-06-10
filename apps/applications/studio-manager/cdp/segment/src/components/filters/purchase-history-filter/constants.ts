import { SmartlistCreditComparator } from "@bsport/api-cdp/smartlist";

import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import type { NumericComparatorOperator } from "#src/components/primitive-filters/numeric-comparator-filter/types";

/** Default upper bound sent when comparator is not BETWEEN (matches backend model default). */
export const EXPENSES_COMPLETE_DEFAULT_VALUE_SECOND = 50;

export const PURCHASE_HISTORY_COMPARATOR_TO_API: Record<
  NumericComparatorOperator,
  SmartlistCreditComparator
> = {
  [NUMERIC_COMPARATOR_OPERATORS.equal]: SmartlistCreditComparator.EQUAL,
  [NUMERIC_COMPARATOR_OPERATORS.between]: SmartlistCreditComparator.BETWEEN,
  [NUMERIC_COMPARATOR_OPERATORS.lowerOrEqual]: SmartlistCreditComparator.LTE,
  [NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual]: SmartlistCreditComparator.GTE,
} as const;

export const purchaseHistoryApiComparatorToFormOperator = (
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

export const mapPurchaseHistoryComparatorToApi = (
  operator: NumericComparatorOperator,
): SmartlistCreditComparator => PURCHASE_HISTORY_COMPARATOR_TO_API[operator];

export const toPurchaseHistoryNumericApiValue = (
  value: number | null,
): number => (value === null ? 0 : value);
