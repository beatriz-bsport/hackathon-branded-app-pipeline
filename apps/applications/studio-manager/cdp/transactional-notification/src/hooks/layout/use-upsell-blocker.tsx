import { checkFeaturePermission } from "@bsport/permissions";
import { dataAccessLayer } from "@bsport/sm-backbone";

export type NotificationRuleAvailableUpsells = {
  pushNotification: boolean;
};

const UPSELL_IDENTIFIER_PUSH_NOTIFICATION = 15;

export const useAvailableUpsells = (): NotificationRuleAvailableUpsells => {
  const companyFeatures = dataAccessLayer.useCompanyFeatures();
  const isPushNotificationEnabled = checkFeaturePermission({
    features: companyFeatures,
    identifier: UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  });

  return {
    pushNotification: isPushNotificationEnabled,
  };
};
