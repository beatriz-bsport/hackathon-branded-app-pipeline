import {
  type CreateBasketAbandonmentFilterPayload,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS } from "../sub-filters/registry";
import type { BasketAbandonmentFilterFormValue } from "../types";
import {
  mapBasketComparator,
  toBasketValueApiField,
} from "../utils/basket-value-utils";

/**
 * Builds the `POST /basket_abandonment/` payload from a form value.
 */
export const createBasketAbandonmentFilterPayload = (
  value: BasketAbandonmentFilterFormValue,
): CreateBasketAbandonmentFilterPayload => {
  const subFilterSlices = REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS.reduce<
    Partial<CreateBasketAbandonmentFilterPayload>
  >(
    (accumulator, subFilterModule) => ({
      ...accumulator,
      ...subFilterModule.appendCreatePayloadSlice(value),
    }),
    {},
  );

  return {
    smartlist: value.smartlist,
    comparator: mapBasketComparator(value.basketValue.operator),
    basket_value: toBasketValueApiField(value.basketValue.firstValue),
    basket_value_second: toBasketValueApiField(value.basketValue.secondValue),
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_EXACT,
    date: null,
    date_second: null,
    duration: 0,
    duration_second: 0,
    ...subFilterSlices,
  };
};
