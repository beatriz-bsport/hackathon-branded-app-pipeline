import type { RolePermissionPath } from "#src/utils/permissions";

export type PermissionCheckItem = {
  id: string;
  url?: string;
  legacyUrl?: string;
  requiredPermissions?: Array<RolePermissionPath>;
};
