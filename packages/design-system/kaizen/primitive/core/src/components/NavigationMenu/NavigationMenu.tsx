import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Item from "#src/components/NavigationMenu/Item";
import { NavigationMenuProvider } from "#src/components/NavigationMenu/Context";
import type { NavigationMenuType } from "#src/components/NavigationMenu/types";

const navigationMenu = cva();

export type NavigationMenuProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof navigationMenu> &
  NavigationMenuType;
/**
 * NavigationMenu
 *
 * A component that renders a structured navigation menu with multiple items and optional sub-items.
 * This component utilizes `ContextProvider` to manage the state of the menu items.
 *
 * @param props.className - Additional CSS classes for custom styling of the navigation menu.
 * @param props.items - Array of items to render in the navigation menu. Each item can have optional sub-items and right-side content.
 * @param props.onItemClick - Callback function triggered when a menu item is clicked.
 */
const NavigationMenu: React.FC<NavigationMenuProps> = ({
  className,
  items,
  onItemClick,
  ...props
}) => {
  if (!items?.length) return null;
  return (
    <NavigationMenuProvider onItemClick={onItemClick} items={items}>
      <div className={navigationMenu({ className })} {...props}>
        {items.map(({ id }) => (
          <Item id={id} key={id} />
        ))}
      </div>
    </NavigationMenuProvider>
  );
};

NavigationMenu.displayName = "KaizenNavigationMenu";

export default NavigationMenu;
