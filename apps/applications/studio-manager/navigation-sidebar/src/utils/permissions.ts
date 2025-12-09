import type { DeepKeys } from "@bsport/permissions";
import {
  type WithSignature,
  checkFeaturePermission,
  checkHasPermission,
} from "@bsport/permissions";
import type {
  CompanyRolePermissions,
  ObjectLevelPermissions,
} from "@bsport/sm-backbone";
import { dataAccessLayer } from "@bsport/sm-backbone";

export {
  checkFeaturePermission,
  checkHasPermission,
  type WithSignature,
} from "@bsport/permissions";

export type Permissions = Omit<CompanyRolePermissions, "restrictedPaths">;
export type RolePermissionPath = DeepKeys<Permissions>;

export const useFeaturePermission = (identifier: number) => {
  const features = dataAccessLayer.useCompanyFeatures();
  return checkFeaturePermission({
    features,
    identifier,
    enableInEnvMode: ["local"],
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
