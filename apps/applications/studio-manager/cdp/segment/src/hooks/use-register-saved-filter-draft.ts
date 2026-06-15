import { useEffect } from "react";

import { useFilterDraftGuardStore } from "#src/stores/filter-draft-guard/store";

/**
 * Registers a saved filter card dirty state in the filter draft guard store.
 * Unsaved new filters are tracked separately via `draftFilters` in the manager.
 */
export const useRegisterSavedFilterDraft = (
  filterId: number | null | undefined,
  isDirty: boolean,
) => {
  const setSavedFilterDirty = useFilterDraftGuardStore(
    (state) => state.setSavedFilterDirty,
  );

  useEffect(() => {
    if (!filterId) {
      return;
    }

    const filterKey = `saved-${filterId}`;
    setSavedFilterDirty(filterKey, isDirty);

    return () => {
      setSavedFilterDirty(filterKey, false);
    };
  }, [filterId, isDirty, setSavedFilterDirty]);
};
