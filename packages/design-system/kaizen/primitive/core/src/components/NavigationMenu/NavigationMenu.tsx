import React from "react";

import Divider from "#src/components/Divider";

import {
  NavigationMenuProvider,
  type NavigationMenuProviderProps,
} from "./Context";
import Group from "./Group";
import Item from "./Item";
import type { NavigationMenuElement } from "./types";

export type NavigationMenuProps = React.HTMLAttributes<HTMLDivElement> &
  Omit<NavigationMenuProviderProps, "items"> & {
    elements: NavigationMenuElement[];
  };

/**
 * NavigationMenu
 *
 * A component that renders a structured navigation menu with multiple items and optional sub-items.
 * This component utilizes `ContextProvider` to manage the state of the menu items.
 *
 * @param props.className - Additional CSS classes for custom styling of the navigation menu.
 * @param props.elements - Array of items or dividers to render in the navigation menu. Each item can have optional sub-items and right-side content.
 * @param props.onItemClick - Callback function triggered when a menu item is clicked.
 */
const NavigationMenu: React.FC<NavigationMenuProps> = ({
  className,
  elements,
  onItemClick,
  ...props
}) => {
  if (!elements?.length) return null;
  return (
    <NavigationMenuProvider
      onItemClick={onItemClick}
      items={elements.filter(
        (item) => item?.type !== "divider" && item?.type !== "group",
      )}
    >
      <div className={className || ""} {...props}>
        {elements.map((element, index) => {
          if (element?.type === "divider") {
            return (
              <Divider
                key={`navigation-divider-${index}`}
                className="border-stroke-thin mt-2xs mb-xs last:mb-[0px]"
              />
            );
          } else if (element?.type === "group") {
            return (
              <Group key={`navigation-group-${index}`} label={element?.label} />
            );
          }

          return <Item id={element.id} key={element.id} />;
        })}
      </div>
    </NavigationMenuProvider>
  );
};

NavigationMenu.displayName = "KaizenNavigationMenu";

export default NavigationMenu;
