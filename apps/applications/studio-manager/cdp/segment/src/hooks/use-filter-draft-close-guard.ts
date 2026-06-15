import { useState } from "react";

import { selectIsDraftingFilters } from "#src/stores/filter-draft-guard/selectors";
import { useFilterDraftGuardStore } from "#src/stores/filter-draft-guard/store";

/**
 * Guards closing the parameters drawer while filter forms still have unsaved changes.
 */
export const useFilterDraftCloseGuard = () => {
  const isDraftingFilters = useFilterDraftGuardStore(selectIsDraftingFilters);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const requestProtectedAction = (action: () => void) => {
    if (!isDraftingFilters) {
      action();
      return;
    }

    setPendingAction(() => action);
    setIsDiscardModalOpen(true);
  };

  const confirmDiscard = () => {
    const action = pendingAction;
    setIsDiscardModalOpen(false);
    setPendingAction(null);
    action?.();
  };

  const cancelDiscard = () => {
    setIsDiscardModalOpen(false);
    setPendingAction(null);
  };

  return {
    isDraftingFilters,
    isDiscardModalOpen,
    requestProtectedAction,
    confirmDiscard,
    cancelDiscard,
  };
};
