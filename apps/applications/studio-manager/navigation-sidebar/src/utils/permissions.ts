import type { DeepKeys } from "@bsport/permissions";
import type { CompanyRolePermissions } from "@bsport/sm-backbone";

export {
  checkFeaturePermission,
  checkHasPermission,
  type WithSignature,
} from "@bsport/permissions";

export type Permissions = Omit<CompanyRolePermissions, "restrictedPaths">;
export type RolePermissionPath = DeepKeys<Permissions>;
