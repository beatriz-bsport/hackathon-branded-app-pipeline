import { useNavigate } from "react-router";

import { URLS } from "#src/urls";

export const useGiftcardNavigation = () => {
  const navigate = useNavigate();

  const navigateToGiftcardDetails = (giftcardId: number) => {
    navigate(URLS.EDITOR(giftcardId));
  };

  return {
    navigateToGiftcardDetails,
  };
};
