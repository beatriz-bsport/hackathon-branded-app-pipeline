import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import { REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS } from "../sub-filters/registry";
import type {
  BasketAbandonmentDirtyPatchPayload,
  BasketAbandonmentFilterFormValue,
} from "../types";
import {
  mapBasketComparator,
  toBasketValueApiField,
} from "../utils/basket-value-utils";

type BasketAbandonmentFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<BasketAbandonmentFilterFormValue>>
>;

const appendBasketValueDirtySlice = (
  dirtyFields: BasketAbandonmentFilterDirtyFields,
  value: BasketAbandonmentFilterFormValue,
): BasketAbandonmentDirtyPatchPayload => {
  if (!hasNestedDirty(dirtyFields.basketValue)) {
    return {};
  }

  return {
    comparator: mapBasketComparator(value.basketValue.operator),
    basket_value: toBasketValueApiField(value.basketValue.firstValue),
    basket_value_second: toBasketValueApiField(value.basketValue.secondValue),
  };
};

/**
 * Builds a `PATCH /basket_abandonment/{id}/` payload from React Hook Form dirty fields.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: BasketAbandonmentFilterDirtyFields,
  value: BasketAbandonmentFilterFormValue,
): BasketAbandonmentDirtyPatchPayload => {
  const payload: BasketAbandonmentDirtyPatchPayload = {
    ...appendBasketValueDirtySlice(dirtyFields, value),
  };

  for (const subFilterModule of REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
