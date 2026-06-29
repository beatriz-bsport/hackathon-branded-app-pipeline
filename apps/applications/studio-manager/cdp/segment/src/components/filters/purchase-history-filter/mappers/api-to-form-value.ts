import {
  type ExpensesCompleteFilter,
  buyableIdsFromFetch,
} from "@bsport/api-cdp/smartlist";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { REGISTERED_PURCHASE_HISTORY_SUB_FILTERS } from "../sub-filters/registry";
import type { PurchaseHistoryFilterFormValue } from "../types";
import { toFormTotalSpentSection } from "../utils/total-spent-utils";

/**
 * Converts a server-side `ExpensesCompleteFilter` into the UI form value.
 */
export const mapPurchaseHistoryFilterToFormValue = (
  filter: ExpensesCompleteFilter,
): PurchaseHistoryFilterFormValue => {
  const subFilters: PurchaseHistoryFilterFormValue["subFilters"] = [];
  const partialForm: Partial<PurchaseHistoryFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_PURCHASE_HISTORY_SUB_FILTERS) {
    const readResult = subFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    totalSpent: toFormTotalSpentSection(filter),
    spentOn: buyableIdsFromFetch(filter.buyable_identifiers),
    subFilters,
    purchaseDate: partialForm.purchaseDate ?? createDefaultDateFilterValue(),
  };
};
