import type { ActivePassesFilter } from "@bsport/api-cdp/smartlist";

import {
  ACTIVE_PASSES_COMPARATOR_TYPE,
  activePassesApiValueToComparatorTypeMap,
} from "../constants";
import type { ActivePassesFilterFormValue } from "../types";

/**
 * Maps a hydrated `ActivePassesFilter` row from `get_filters` into editor form state.
 */
export const mapActivePassesFilterToFormValue = (
  filter: ActivePassesFilter,
): ActivePassesFilterFormValue => {
  const comparatorType =
    activePassesApiValueToComparatorTypeMap[
      filter.nb_active_passes_comparator
    ] ?? ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual;

  const isBetween = comparatorType === ACTIVE_PASSES_COMPARATOR_TYPE.between;

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    comparatorType,
    comparatorValue: filter.nb_active_passes_value,
    comparatorValueSecond: isBetween
      ? filter.nb_active_passes_value_second
      : null,
    paymentPacksSelector: {
      enabled:
        filter.select_all_payment_packs || filter.payment_packs.length > 0,
      selectAll: filter.select_all_payment_packs,
      selectedIds: [...filter.payment_packs],
    },
    privatePassesSelector: {
      enabled:
        filter.select_all_private_passes || filter.private_passes.length > 0,
      selectAll: filter.select_all_private_passes,
      selectedIds: [...filter.private_passes],
    },
  };
};
