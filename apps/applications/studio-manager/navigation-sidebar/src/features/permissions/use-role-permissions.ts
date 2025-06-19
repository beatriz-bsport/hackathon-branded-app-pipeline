import { useMemo } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  type Permissions,
  type WithSignature,
  checkHasPermission,
} from "#src/utils/permissions";

import type { PermissionCheckItem } from "./types";

export const useRolePermissions = (items: PermissionCheckItem[]) => {
  const userRole = dataAccessLayer.useUserRole();
  const rolePermissions = userRole?.permissions;

  return useMemo(() => {
    const results = new Map<string, boolean>();

    items.forEach((item) => {
      const permissionsPaths = item.requiredPermissions ?? [];
      const hasSomePermissions = permissionsPaths.some((path) =>
        checkHasPermission<WithSignature<Permissions>>({
          permissions: rolePermissions,
          path,
        }),
      );
      results.set(item.id, hasSomePermissions);
    });

    return results;
  }, [rolePermissions, items]);
};
