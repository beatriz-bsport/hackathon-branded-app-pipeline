import { useCompanyUpsell } from "#src/utils/permissions";

const UPSELL_IDENTIFIER_PUSH_NOTIFICATION = 15;

export const useUpsellChecker = () => {
  const hasPushNotificationUpsell = useCompanyUpsell(
    UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  );

  return {
    isPushNotificationUpsellActivated: hasPushNotificationUpsell,
  };
};
