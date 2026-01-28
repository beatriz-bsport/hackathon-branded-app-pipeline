import { DeepKeys } from "@bsport/i18n";
import {
  WithSignature,
  checkFeaturePermission,
  checkHasPermission,
} from "@bsport/permissions";
import { ObjectLevelPermissions, dataAccessLayer } from "@bsport/sm-backbone";

export const ADD_ON_IDENTIFIER_SUBTEACHER_TOOL = 26;

export const ADD_ON_IDENTIFIER_ZOOM_APP = 5;

export const ADD_ON_IDENTIFIER_SPIVI = 30;

export const useCheckCompanyAddOn = (identifier: number) => {
  const companyAddOns = dataAccessLayer.useCompanyFeatures();
  return checkFeaturePermission({
    features: companyAddOns,
    identifier,
  });
};

export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
    permissions: userRole?.object_level_permissions,
    path,
  });
};

export const useAnyObjectLevelPermissions = (
  paths: DeepKeys<ObjectLevelPermissions>[],
) => {
  const userRole = dataAccessLayer.useUserRole();
  return paths.some((path) =>
    checkHasPermission<WithSignature<ObjectLevelPermissions>>({
      permissions: userRole?.object_level_permissions,
      path,
    }),
  );
};
