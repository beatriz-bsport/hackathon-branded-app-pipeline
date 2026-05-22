import { CreateActivePassesFilterPayload } from "@bsport/api-cdp/smartlist";

import {
  ACTIVE_PASSES_COMPARATOR_TYPE,
  activePassesComparatorTypeToApiValueMap,
} from "../constants";
import type { ActivePassesFilterFormValue } from "../types";

/**
 * Builds the `POST /active_passes/` body from the current form state.
 *
 * `select_all_*` is driven exclusively by the `selectAll` flag on each selector.
 * An enabled selector with `selectAll = false` must have at least one id (the
 * schema enforces this, so by the time this mapper runs the value is always valid).
 * A disabled selector contributes neither ids nor a `select_all_*` flag.
 */
export const createActivePassesPayload = (
  value: ActivePassesFilterFormValue,
): CreateActivePassesFilterPayload => {
  const isBetween =
    value.comparatorType === ACTIVE_PASSES_COMPARATOR_TYPE.between;

  const paymentPacksEnabled = value.paymentPacksSelector.enabled;
  const privatePassesEnabled = value.privatePassesSelector.enabled;

  return {
    smartlist: value.smartlist,
    nb_active_passes_comparator:
      activePassesComparatorTypeToApiValueMap[value.comparatorType],
    nb_active_passes_value: value.comparatorValue,
    nb_active_passes_value_second: isBetween
      ? (value.comparatorValueSecond ?? value.comparatorValue)
      : 0,
    select_all_payment_packs: paymentPacksEnabled
      ? value.paymentPacksSelector.selectAll
      : false,
    payment_packs: paymentPacksEnabled
      ? value.paymentPacksSelector.selectedIds
      : [],
    select_all_private_passes: privatePassesEnabled
      ? value.privatePassesSelector.selectAll
      : false,
    private_passes: privatePassesEnabled
      ? value.privatePassesSelector.selectedIds
      : [],
  };
};
