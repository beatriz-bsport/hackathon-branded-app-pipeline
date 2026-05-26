import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { UpdateActivePassesFilterPayload } from "@bsport/api-cdp/smartlist";

import {
  hasNestedDirty,
  isDirtyFieldEntry,
} from "#src/components/filters/shared/dirty-fields";

import {
  ACTIVE_PASSES_COMPARATOR_TYPE,
  activePassesComparatorTypeToApiValueMap,
} from "../constants";
import type { ActivePassesFilterFormValue } from "../types";

type ActivePassesDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<ActivePassesFilterFormValue>>
>;

/**
 * Builds a partial `PATCH /active_passes/{id}/` body using React Hook Form's
 * `dirtyFields` map.
 *
 * M2M arrays (`payment_packs`, `private_passes`) and `select_all_*` booleans
 * must be sent together whenever either selector side changes, because the
 * backend treats them as a unit. An explicit empty `[]` is sent to clear a list.
 */
export const buildActivePassesFilterDirtyPatch = (
  dirtyFields: ActivePassesDirtyFields,
  value: ActivePassesFilterFormValue,
): UpdateActivePassesFilterPayload => {
  const patch: UpdateActivePassesFilterPayload = {};
  const isBetween =
    value.comparatorType === ACTIVE_PASSES_COMPARATOR_TYPE.between;

  const isComparatorDirty =
    isDirtyFieldEntry(dirtyFields.comparatorType) ||
    isDirtyFieldEntry(dirtyFields.comparatorValue) ||
    isDirtyFieldEntry(dirtyFields.comparatorValueSecond);

  if (isComparatorDirty) {
    patch.nb_active_passes_comparator =
      activePassesComparatorTypeToApiValueMap[value.comparatorType];
    patch.nb_active_passes_value = value.comparatorValue;
    patch.nb_active_passes_value_second = isBetween
      ? (value.comparatorValueSecond ?? value.comparatorValue)
      : 0;
  }

  if (hasNestedDirty(dirtyFields.paymentPacksSelector)) {
    const paymentPacksEnabled = value.paymentPacksSelector.enabled;
    patch.select_all_payment_packs = paymentPacksEnabled
      ? value.paymentPacksSelector.selectAll
      : false;
    patch.payment_packs = paymentPacksEnabled
      ? value.paymentPacksSelector.selectedIds
      : [];
  }

  if (hasNestedDirty(dirtyFields.privatePassesSelector)) {
    const privatePassesEnabled = value.privatePassesSelector.enabled;
    patch.select_all_private_passes = privatePassesEnabled
      ? value.privatePassesSelector.selectAll
      : false;
    patch.private_passes = privatePassesEnabled
      ? value.privatePassesSelector.selectedIds
      : [];
  }

  return patch;
};
