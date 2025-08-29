import { checkFeaturePermission } from "@bsport/permissions";
import { dataAccessLayer } from "@bsport/sm-backbone";

const UPSELL_IDENTIFIER_PUSH_NOTIFICATION = 15;

export const useAvailableUpsells = () => {
  const companyFeatures = dataAccessLayer.useCompanyFeatures();
  const isPushNotificationEnabled = checkFeaturePermission({
    features: companyFeatures,
    identifier: UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  });

  return {
    isPushNotificationEnabled,
  };
};
