import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

import type { PurchaseHistoryFilterFormValue } from "./types";

const DEFAULT_TOTAL_SPENT_FIRST_VALUE = 1;
const DEFAULT_TOTAL_SPENT_SECOND_VALUE = DEFAULT_TOTAL_SPENT_FIRST_VALUE + 1;

/**
 * Default UI state for a new purchase history filter card.
 * Matches backend defaults: GTE, value 1, all product types selected.
 */
export const createDefaultPurchaseHistoryFilter = (
  smartlistId: number,
): PurchaseHistoryFilterFormValue => ({
  smartlist: smartlistId,
  totalSpent: {
    operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
    firstValue: DEFAULT_TOTAL_SPENT_FIRST_VALUE,
    secondValue: DEFAULT_TOTAL_SPENT_SECOND_VALUE,
  },
  spentOn: [],
  subFilters: [],
  purchaseDate: createDefaultDateFilterValue(),
});
