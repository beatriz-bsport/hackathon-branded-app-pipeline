import type { FilterDraftGuardState } from "./types";

/**
 * True when the user has unsaved new filter cards or dirty saved filter forms.
 */
export const selectIsDraftingFilters = (
  state: FilterDraftGuardState,
): boolean => {
  if (state.unsavedNewFilterCount > 0) {
    return true;
  }

  return Object.values(state.dirtySavedFilterKeys).some(Boolean);
};
