import { useMemo } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { getFeatureRelatedToUrl } from "./features";
import type { PermissionCheckItem } from "./types";
import { useFeaturesPermissions } from "./use-features-permissions";
import { useRolePermissions } from "./use-role-permissions";
import { removeTrailingSlash } from "./utils";

/**
 * Check whether the **url** of the item can be accessed based on computed feature and role permissions
 * or **urlWhitelist** settings, that are compared with **url** and **legacyUrl**.
 */
function checkRoutingPermissions({
  item,
  featurePermissions,
  rolePermissions,
  restrictedUrls,
}: {
  item: PermissionCheckItem;
  featurePermissions: Map<number, boolean>;
  rolePermissions: Map<string, boolean>;
  restrictedUrls: Array<string>;
}) {
  const cleanUrl = removeTrailingSlash(item.url);
  const cleanLegacyUrl = removeTrailingSlash(item.legacyUrl);

  // Step 1: Feature access check
  // If the URL is related to an Upsell and the user does not have the Upsell activated
  // Then the user does not have the permission to access this URL
  const featureIdentifier = getFeatureRelatedToUrl(item.url);
  if (featureIdentifier && !featurePermissions.get(featureIdentifier)) {
    return false;
  }

  // Step 2: Restricted URLs check
  // When restricted URLs are defined, the staff will only have access to the defined URLs,
  // which take precedence over the rest of the permission system.
  if (restrictedUrls.length > 0) {
    const isInRestrictedURLsList = (candidate?: string) =>
      restrictedUrls.some((restrictedUrl) =>
        (candidate ?? "").startsWith(restrictedUrl),
      );
    return (
      isInRestrictedURLsList(cleanUrl) || isInRestrictedURLsList(cleanLegacyUrl)
    );
  }

  // Step 3: Permission check
  // Authorize the access when no permissions are provided,
  // or if one of the provided permission is matched.
  if (!item.requiredPermissions?.length) {
    return true;
  }

  return !!rolePermissions.get(item.id);
}

/**
 * Create a map between an item id and whether or not the user has access to it
 * @param items List of protected (with permissions) Navigation elements
 */
export const useBatchRoutingPermissions = (items: PermissionCheckItem[]) => {
  // Retrieve batch permissions
  const featurePermissions = useFeaturesPermissions();
  const rolePermissions = useRolePermissions(items);

  // Pre-compute restricted URLs
  const userRole = dataAccessLayer.useUserRole();
  const restrictedUrls = useMemo(
    () => userRole?.permissions?.restrictedPaths ?? [],
    [userRole],
  );

  // Return memoized permission results for each item
  return useMemo(() => {
    const results = new Map<string, boolean>();

    items.forEach((item) => {
      const hasAnyPermission = checkRoutingPermissions({
        item,
        featurePermissions,
        rolePermissions,
        restrictedUrls,
      });
      results.set(item.id, hasAnyPermission);
    });

    return results;
  }, [items, featurePermissions, rolePermissions, restrictedUrls]);
};
