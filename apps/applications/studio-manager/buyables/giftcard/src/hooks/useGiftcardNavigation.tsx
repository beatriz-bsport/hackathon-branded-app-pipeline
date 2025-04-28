import { useCallback } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "#src/pages/routes";

export const useGiftcardNavigation = () => {
  const navigate = useNavigate();

  const navigateToGiftcardDetail = useCallback((giftcardId: number) => {
    /** @todo Finalize routing when the routes have been fixed */
    navigate(`${ROUTES.ACTIVE}/${giftcardId}`);
  }, []);

  return {
    navigateToGiftcardDetail,
  };
};
