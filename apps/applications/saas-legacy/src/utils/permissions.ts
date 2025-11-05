import type { RolePermission } from '#src/libs/role/types';
import { parseRestrictedPath } from '#src/libs/role/utils';

/**
 * Based on the role permissions and the current pathname,
 * Determine whether the user can access the Backoffice Router.
 * @returns
 * - hasBOAccess: whether the access is granted
 * - redirectionUrl:in case hasBOAccess is false, provide a redirection url
 */
export const checkHasBackofficeAccess = (
  permissions: RolePermission,
): { hasBOAccess: boolean; redirectionUrl: string } => {
  if ((permissions?.restrictedPaths ?? []).length === 0) {
    // No restrictions
    return {
      hasBOAccess: true,
      redirectionUrl: '',
    };
  }

  return {
    hasBOAccess: permissions.restrictedPaths.some((permission) => {
      const cleanedPath = parseRestrictedPath(permission);
      return window.location.pathname.includes(cleanedPath);
    }),
    // Fallback to first restricted path
    redirectionUrl: parseRestrictedPath(permissions.restrictedPaths[0]),
  };
};
