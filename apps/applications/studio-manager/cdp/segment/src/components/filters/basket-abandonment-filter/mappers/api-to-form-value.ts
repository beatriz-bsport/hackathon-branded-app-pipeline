import type { BasketAbandonmentFilter } from "@bsport/api-cdp/smartlist";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS } from "../sub-filters/registry";
import type { BasketAbandonmentFilterFormValue } from "../types";
import { toFormBasketValueSection } from "../utils/basket-value-utils";

/**
 * Converts a server-side `BasketAbandonmentFilter` payload into the UI form value.
 */
export const mapBasketAbandonmentFilterToFormValue = (
  filter: BasketAbandonmentFilter,
): BasketAbandonmentFilterFormValue => {
  const subFilters: BasketAbandonmentFilterFormValue["subFilters"] = [];
  const partialForm: Partial<BasketAbandonmentFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS) {
    const readResult = subFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    subFilters,
    basketValue: toFormBasketValueSection(filter),
    abandonmentDate:
      partialForm.abandonmentDate ?? createDefaultDateFilterValue(),
  };
};
