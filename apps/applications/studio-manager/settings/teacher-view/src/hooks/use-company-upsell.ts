import { checkFeaturePermission } from "@bsport/permissions";
import { dataAccessLayer } from "@bsport/sm-backbone";

export const useCompanyUpsell = (identifier: number) => {
  const companyFeatures = dataAccessLayer.useCompanyFeatures();

  return checkFeaturePermission({
    features: companyFeatures,
    identifier,
  });
};
