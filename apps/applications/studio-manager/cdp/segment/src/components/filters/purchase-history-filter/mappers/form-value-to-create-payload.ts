import {
  type CreateExpensesCompleteFilterPayload,
  SmartlistDateFilterType,
  buyableIdsToApi,
} from "@bsport/api-cdp/smartlist";

import { getDefaultApiDate } from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";

import {
  mapPurchaseHistoryComparatorToApi,
  toPurchaseHistoryNumericApiValue,
} from "../constants";
import { REGISTERED_PURCHASE_HISTORY_SUB_FILTERS } from "../sub-filters/registry";
import type { PurchaseHistoryFilterFormValue } from "../types";
import { toPurchaseHistoryValueSecond } from "../utils/total-spent-utils";

/**
 * Builds the `POST /expenses_complete/` payload from a form value.
 */
export const createPurchaseHistoryFilterPayload = (
  value: PurchaseHistoryFilterFormValue,
): CreateExpensesCompleteFilterPayload => {
  const subFilterSlices = REGISTERED_PURCHASE_HISTORY_SUB_FILTERS.reduce<
    Partial<CreateExpensesCompleteFilterPayload>
  >(
    (accumulator, subFilterModule) => ({
      ...accumulator,
      ...subFilterModule.appendCreatePayloadSlice(value),
    }),
    {},
  );

  return {
    smartlist: value.smartlist,
    buyable_identifiers: buyableIdsToApi(value.spentOn),
    comparator: mapPurchaseHistoryComparatorToApi(value.totalSpent.operator),
    value: toPurchaseHistoryNumericApiValue(value.totalSpent.firstValue),
    value_second: toPurchaseHistoryValueSecond(value.totalSpent),
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_EXACT,
    date: getDefaultApiDate(),
    date_second: getDefaultApiDate(),
    duration: 0,
    duration_second: 0,
    ...subFilterSlices,
  };
};
