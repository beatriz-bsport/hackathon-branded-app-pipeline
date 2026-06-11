import { buyableIdsToApi } from "@bsport/api-cdp/smartlist";
import type { FieldNamesMarkedBoolean } from "@bsport/form";

import {
  hasNestedDirty,
  isDirtyFieldEntry,
} from "#src/components/filters/shared/dirty-fields";

import {
  mapPurchaseHistoryComparatorToApi,
  toPurchaseHistoryNumericApiValue,
} from "../constants";
import { REGISTERED_PURCHASE_HISTORY_SUB_FILTERS } from "../sub-filters/registry";
import type {
  DirtyPatchPayload,
  PurchaseHistoryFilterFormValue,
} from "../types";
import { toPurchaseHistoryValueSecond } from "../utils/total-spent-utils";

type PurchaseHistoryFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<PurchaseHistoryFilterFormValue>>
>;

/**
 * Builds a `PATCH /expenses_complete/{id}/` payload from React Hook Form dirty fields.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: PurchaseHistoryFilterDirtyFields,
  value: PurchaseHistoryFilterFormValue,
): DirtyPatchPayload => {
  const payload: DirtyPatchPayload = {};

  if (hasNestedDirty(dirtyFields.totalSpent)) {
    payload.comparator = mapPurchaseHistoryComparatorToApi(
      value.totalSpent.operator,
    );
    payload.value = toPurchaseHistoryNumericApiValue(
      value.totalSpent.firstValue,
    );
    payload.value_second = toPurchaseHistoryValueSecond(value.totalSpent);
  }

  if (isDirtyFieldEntry(dirtyFields.spentOn)) {
    payload.buyable_identifiers = buyableIdsToApi(value.spentOn);
  }

  for (const subFilterModule of REGISTERED_PURCHASE_HISTORY_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
