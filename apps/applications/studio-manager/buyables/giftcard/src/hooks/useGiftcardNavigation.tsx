import { useCallback } from "react";

import { LEGACY_ROUTES } from "#src/urls";

export const useGiftcardNavigation = () => {
  const navigateToGiftcardDetail = useCallback((giftcardId: number) => {
    /** @todo When switching to revamped details page, use navigate from react-router */
    window.location.href = LEGACY_ROUTES.DETAILS(giftcardId);
  }, []);

  return {
    navigateToGiftcardDetail,
  };
};
