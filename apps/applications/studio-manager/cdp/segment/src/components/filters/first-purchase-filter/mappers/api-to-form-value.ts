import type { FirstPurchaseFilter } from "@bsport/api-cdp/smartlist";

import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import { firstPurchaseStatusFromApi } from "../constants";
import { REGISTERED_FIRST_PURCHASE_SUB_FILTERS } from "../sub-filters/registry";
import type { FirstPurchaseFilterFormValue } from "../types";

/**
 * Converts a server-side `FirstPurchaseFilter` payload into the UI form value.
 */
export const mapFirstPurchaseFilterToFormValue = (
  filter: FirstPurchaseFilter,
): FirstPurchaseFilterFormValue => {
  const subFilters: FirstPurchaseFilterFormValue["subFilters"] = [];
  const partialForm: Partial<FirstPurchaseFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_FIRST_PURCHASE_SUB_FILTERS) {
    const readResult = subFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    firstPurchaseStatus: firstPurchaseStatusFromApi(
      filter.first_payment_is_done,
    ),
    subFilters,
    purchaseDate: partialForm.purchaseDate ?? defaultDateFilterValue,
    purchaseAmount:
      partialForm.purchaseAmount ?? defaultNumericComparatorFilterValue,
  };
};
