import { useMemo } from "react";

import type {
  MenuSet,
  NavigationElement,
  NavigationSidebarItem,
  NavigationSidebarSubItem,
} from "./navigation-items";
import {
  isDividerElement,
  isGroupElement,
  isItemElement,
} from "./navigation-items";

/**
 * Filters navigation elements based on user permissions and menu type.
 *
 * This hook consolidates all permission-based filtering logic in one place:
 * - Removes items and sub-items that users don't have permission to access
 * - Hides parent sections when all their sub-items are inaccessible
 * - Cleans up consecutive and trailing dividers for better visual presentation
 *
 * @param navigationElements - Array of navigation elements (items, groups, dividers)
 * @param elementsPermissions - Map of element IDs to their permission status (true = accessible)
 * @param menuSet - Type of menu being rendered ("default" or "settings")
 *
 * @returns Filtered and cleaned navigation elements ready for rendering
 *
 * @example
 * ```tsx
 * const filteredElements = useFilteredNavigationElements(
 *   navigationElements,
 *   elementsPermissions,
 *   "default"
 * );
 * ```
 */
export const useFilteredNavigationElements = (
  navigationElements: NavigationElement[],
  elementsPermissions: Map<string, boolean>,
  menuSet: MenuSet,
) => {
  return useMemo(() => {
    /**
     * Filters sub-items of a navigation item based on permissions.
     * Only keeps sub-items that either have no href (always visible) or have permission.
     *
     * @param item - Navigation item that may contain sub-items
     * @returns Item with filtered sub-items array
     */
    const filterSubItems = (
      item: NavigationSidebarItem,
    ): NavigationSidebarItem => {
      if (!item.subItems || item.subItems.length === 0) {
        return item;
      }

      // Filter out sub-items that don't have permissions
      const visibleSubItems = item.subItems.filter(
        (subItem) =>
          (!subItem.href || !!elementsPermissions.get(subItem.id)) &&
          !subItem.hidden,
      ) as NavigationSidebarSubItem[];

      return {
        ...item,
        subItems: visibleSubItems.length > 0 ? visibleSubItems : undefined,
      };
    };

    /**
     * Determines if a navigation item should be visible based on permissions.
     *
     * - Items with sub-items: visible only if at least one sub-item is accessible
     * - Items without href: always visible (like groups)
     * - Items with href: visible only if user has permission
     *
     * @param item - Navigation item to check
     * @returns True if the item should be visible, false otherwise
     */
    const isItemVisible = (item: NavigationSidebarItem): boolean => {
      if (item.hidden) return false;

      if (item.subItems && item.subItems.length > 0) {
        return item.subItems.some(
          (subItem) => !subItem.href || !!elementsPermissions.get(subItem.id),
        );
      }

      if (!item.href) {
        return true;
      }

      if (!elementsPermissions.get(item.id)) {
        return false;
      }

      return true;
    };

    const filtered = navigationElements
      .filter((element) => {
        if (isDividerElement(element) || isGroupElement(element)) {
          return true;
        }

        if (isItemElement(element)) {
          return isItemVisible(element);
        }

        return true;
      })
      .map((element) => {
        if (isItemElement(element)) {
          return filterSubItems(element);
        }
        return element;
      });

    // For settings menu, no need to clean dividers since there are no dividers in settings
    if (menuSet === "settings") {
      return filtered;
    }

    // Remove consecutive dividers and trailing dividers for default menu
    const cleanedElements = [];
    let lastWasDivider = false;

    for (const element of filtered) {
      if (isDividerElement(element)) {
        if (!lastWasDivider) {
          cleanedElements.push(element);
          lastWasDivider = true;
        }
      } else {
        cleanedElements.push(element);
        lastWasDivider = false;
      }
    }

    // Remove trailing divider
    if (
      cleanedElements.length > 0 &&
      isDividerElement(cleanedElements[cleanedElements.length - 1])
    ) {
      cleanedElements.pop();
    }

    return cleanedElements;
  }, [navigationElements, elementsPermissions, menuSet]);
};
