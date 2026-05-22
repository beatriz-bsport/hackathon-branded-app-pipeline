import { ACTIVE_PASSES_COMPARATOR_TYPE } from "./constants";
import type { ActivePassesFilterFormValue } from "./types";

/**
 * Default form state for a new active passes filter draft.
 * Both sections start disabled (no specific pass required by default).
 */
export const createDefaultActivePassesFilter = (
  smartlistId: number,
): ActivePassesFilterFormValue => ({
  smartlist: smartlistId,
  comparatorType: ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual,
  comparatorValue: 1,
  comparatorValueSecond: null,
  paymentPacksSelector: {
    enabled: false,
    selectAll: false,
    selectedIds: [],
  },
  privatePassesSelector: {
    enabled: false,
    selectAll: false,
    selectedIds: [],
  },
});
