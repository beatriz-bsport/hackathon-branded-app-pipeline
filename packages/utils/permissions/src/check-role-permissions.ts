type GenericPermissions = {
  [key: string]: GenericPermissions | boolean | undefined;
};

export type WithSignature<T> = {
  [K in keyof T]: T[K] extends boolean ? boolean : WithSignature<T[K]>;
};

// Extracts deep keys from a nested object
export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${K}` | `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
  : never;

function checkHasChildrenPermission(
  subPermissions: GenericPermissions,
): boolean {
  return Object.values(subPermissions).some((value) => {
    if (!value) return false;
    return typeof value === "boolean"
      ? value
      : checkHasChildrenPermission(value);
  });
}

function checkDeeperPermission(
  subPermissions: GenericPermissions,
  permissionPath: string,
) {
  if (!subPermissions || !permissionPath) {
    return false;
  }

  const [currentKey, ...nextPaths] = permissionPath.split(".");
  if (!currentKey) {
    return false;
  }

  const currentValue = subPermissions[currentKey];
  if (typeof currentValue === "object") {
    const nextPermissionPath = nextPaths.join(".");
    if (nextPermissionPath) {
      return checkDeeperPermission(currentValue, nextPermissionPath);
    }
    // The original path was targeting an object with several children
    // If one of these children is true, then it should have access to the category
    return checkHasChildrenPermission(currentValue);
  } else {
    return !!currentValue;
  }
}

/**
 * @param permissions The permissions or object_level_permissions of a Role
 * @param permissionPath The path to the permission to check
 *
 * @description Create a hook to inject the role data
 * ```tsx
 * import {
 *   type DeepKeys,
 *   type WithSignature,
 *   checkHasPermission,
 * } from "@bsport/permissions";
 * import {
 *   type CompanyRolePermissions,
 *   type ObjectLevelPermissions,
 *   dataAccessLayer,
 * } from "@bsport/sm-backbone";
 *
 * type Permissions = Omit<CompanyRolePermissions, "restrictedPaths">;
 *
 * export const useRolePermission = (path: DeepKeys<Permissions>) => {
 *   const userRole = dataAccessLayer.useUserRole();
 *   return checkHasPermission<WithSignature<Permissions>>({
 *      permissions: userRole?.permissions,
 *      path,
 *   });
 * };
 *
 * export const useObjectLevelPermission = (
 *   path: DeepKeys<ObjectLevelPermissions>,
 * ) => {
 *   const userRole = dataAccessLayer.useUserRole();
 *   return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
 *      permissions: userRole?.object_level_permissions,
 *      path
 *   });
 * };
 * ```
 */
export function checkHasPermission<T extends GenericPermissions>({
  permissions,
  path,
}: {
  permissions?: T;
  path?: DeepKeys<T>;
}) {
  try {
    if (!permissions || !path) return false;
    return checkDeeperPermission(permissions, path);
  } catch (_error) {
    return false;
  }
}
