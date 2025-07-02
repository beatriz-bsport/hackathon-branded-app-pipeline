import { useCallback } from "react";

import { LEGACY_URLS } from "#src/urls";

/**
 * Hook to abstract the logic when clicking on an "Add member" button
 */
export const useAddMember = () => {
  const handleAddMember = useCallback(() => {
    window.location.assign(LEGACY_URLS.CREATE);
  }, []);

  return { handleAddMember };
};
