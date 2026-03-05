import { checkFeaturePermission } from "@bsport/permissions";
import { dataAccessLayer } from "@bsport/sm-backbone";

export const useCompanyUpsell = (identifier: number) => {
  const companyUpsells = dataAccessLayer.useCompanyFeatures();
  return checkFeaturePermission({
    features: companyUpsells,
    identifier,
  });
};
