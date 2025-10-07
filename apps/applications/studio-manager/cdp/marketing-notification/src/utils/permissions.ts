import {
  type DeepKeys,
  type WithSignature,
  checkFeaturePermission,
  checkHasPermission,
} from "@bsport/permissions";
import {
  type ObjectLevelPermissions,
  dataAccessLayer,
} from "@bsport/sm-backbone";

export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
    permissions: userRole?.object_level_permissions,
    path,
  });
};

export const useCompanyUpsell = (identifier: number) => {
  const companyUpsells = dataAccessLayer.useCompanyFeatures();
  return checkFeaturePermission({
    features: companyUpsells,
    identifier,
  });
};
