import { useMemo } from "react";

import type { RolePermissionPath } from "#src/utils/permissions";

import { isItemElement } from "./navigation-items";
import type {
  NavigationElement,
  NavigationSidebarSubItem,
} from "./navigation-items";

export const useProtectedItems = (
  navigationElements: Array<NavigationElement>,
) => {
  // Collect all items that need permission checking
  const protectedItems = useMemo(() => {
    const items: Array<{
      id: string;
      url?: string;
      legacyUrl?: string;
      requiredPermissions?: Array<RolePermissionPath>;
    }> = [];

    navigationElements.forEach((element) => {
      if (isItemElement(element)) {
        if (element.href) {
          items.push({
            id: element.id,
            url: element.href,
            legacyUrl: element.legacyUrl,
            requiredPermissions: element.requiredPermissions,
          });
        }

        // Collect subitems
        element.subItems?.forEach((subItem: NavigationSidebarSubItem) => {
          if (subItem.href) {
            items.push({
              id: subItem.id,
              url: subItem.href,
              legacyUrl: subItem.legacyUrl,
              requiredPermissions: subItem.requiredPermissions,
            });
          }
        });
      }
    });

    return items;
  }, [navigationElements]);

  return protectedItems;
};
