import React from "react";

import {
  NavigationMenuProvider,
  type NavigationMenuProviderProps,
} from "./Context";
import NavigationMenuDivider from "./Divider";
import Group from "./Group";
import Item from "./Item";
import SubItem from "./SubItem";
import type { NavigationMenuElement } from "./types";

type BaseNavigationMenuProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> &
  Omit<NavigationMenuProviderProps, "items">;

type ElementsNavigationMenuProps = BaseNavigationMenuProps & {
  elements: NavigationMenuElement[];
  children?: never;
};

type ChildrenNavigationMenuProps = BaseNavigationMenuProps & {
  elements?: never;
  children: React.ReactNode;
};

export type NavigationMenuProps =
  | ElementsNavigationMenuProps
  | ChildrenNavigationMenuProps;

/**
 * NavigationMenu
 *
 * A component that renders a structured navigation menu with multiple items and optional sub-items.
 * This component utilizes `ContextProvider` to manage the state of the menu items.
 *
 * @param props.className - Additional CSS classes for custom styling of the navigation menu.
 * @param props.elements - Array of items or dividers to render in the navigation menu. Each item can have optional sub-items and right-side content.
 * @param props.children - React children for direct composition using Item, Group, and Divider components.
 * @param props.onItemClick - Callback function triggered when a menu item is clicked.
 */
const NavigationMenu: React.FC<NavigationMenuProps> = ({
  className,
  elements,
  children,
  onItemClick,
  ...props
}) => {
  if (!elements && !children) {
    return null;
  }

  return (
    <div className={className || ""} {...props}>
      {elements ? (
        <NavigationMenuProvider
          onItemClick={onItemClick}
          items={elements.filter(
            (item) => item?.type !== "divider" && item?.type !== "group",
          )}
        >
          {elements.map((element, index) => {
            if (element?.type === "divider") {
              return (
                <NavigationMenuDivider key={`navigation-divider-${index}`} />
              );
            }

            if (element?.type === "group") {
              return (
                <Group
                  key={`navigation-group-${index}`}
                  label={element.label}
                />
              );
            }

            const { id, ...elementProps } = element;
            return <Item key={id} id={id} {...elementProps} />;
          })}
        </NavigationMenuProvider>
      ) : (
        <NavigationMenuProvider onItemClick={onItemClick} items={[]}>
          {children}
        </NavigationMenuProvider>
      )}
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
