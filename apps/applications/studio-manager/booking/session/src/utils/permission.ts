import { checkFeaturePermission } from "@bsport/permissions";
import { dataAccessLayer } from "@bsport/sm-backbone";

export const ADD_ON_IDENTIFIER_SUBTEACHER_TOOL = 26;

export const useCheckCompanyAddOn = (identifier: number) => {
  const companyAddOns = dataAccessLayer.useCompanyFeatures();
  return checkFeaturePermission({
    features: companyAddOns,
    identifier,
  });
};
