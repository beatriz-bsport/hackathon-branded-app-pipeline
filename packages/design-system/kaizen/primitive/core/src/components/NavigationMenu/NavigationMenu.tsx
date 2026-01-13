import React from "react";

import {
  NavigationMenuProvider,
  type NavigationMenuProviderProps,
} from "./Context";
import NavigationMenuDivider from "./Divider";
import Group from "./Group";
import Item from "./Item";
import SubItem from "./SubItem";

export type NavigationMenuProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> &
  Omit<NavigationMenuProviderProps, "items"> & {
    children: React.ReactNode;
  };

/**
 * NavigationMenu
 *
 * A component that renders a structured navigation menu with multiple items and optional sub-items.
 * This component utilizes `ContextProvider` to manage the state of the menu items.
 *
 * @param props.className - Additional CSS classes for custom styling of the navigation menu.
 * @param props.children - React children for direct composition using Item, Group, and Divider components.
 * @param props.onItemClick - Callback function triggered when a menu item is clicked.
 */
const NavigationMenu: React.FC<NavigationMenuProps> = ({
  className,
  children,
  onItemClick,
  ...props
}) => {
  if (!children) {
    return null;
  }

  return (
    <div
      data-component="Kaizen-NavigationMenu"
      className={className || ""}
      {...props}
    >
      <NavigationMenuProvider onItemClick={onItemClick}>
        {children}
      </NavigationMenuProvider>
    </div>
  );
};

const NavigationMenuWithSubcomponents =
  NavigationMenu as typeof NavigationMenu & {
    Item: typeof Item;
    Group: typeof Group;
    Divider: typeof NavigationMenuDivider;
    SubItem: typeof SubItem;
  };

NavigationMenuWithSubcomponents.displayName = "KaizenNavigationMenu";
NavigationMenuWithSubcomponents.Item = Item;
NavigationMenuWithSubcomponents.Group = Group;
NavigationMenuWithSubcomponents.Divider = NavigationMenuDivider;
NavigationMenuWithSubcomponents.SubItem = SubItem;

export default NavigationMenuWithSubcomponents;
