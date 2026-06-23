import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

import type { PurchaseHistoryFilterFormValue } from "./types";

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
    firstValue: 1,
    secondValue: null,
  },
  spentOn: [],
  subFilters: [],
  purchaseDate: createDefaultDateFilterValue(),
});
