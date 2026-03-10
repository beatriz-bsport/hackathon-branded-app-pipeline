import React, { PropsWithChildren } from "react";

import { NavigationMenu } from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";

import type {
  NavigationSidebarItem,
  NavigationSidebarSubItem,
} from "./navigation-items";

type NavigationMenuItemProps = PropsWithChildren<{
  kind: "item" | "subitem";
  item: NavigationSidebarSubItem | NavigationSidebarItem;
  navigate?: (href: string) => void;
}>;

/**
 * Wrap an NavigationMenu Item or Subitem with the proper routing element.
 * Each item comes with an href and a revamped indicator (whether or not it's the revamp link)
 *
 * If NavigationSidebar is in saas-legacy (e.g. isBridged = true) :
 * - if revamped : Navigate with a <a> element to "/studio/{href}"
 * - if not revamped : Navigate in the react router context of saas-legacy using a history push / navigate function
 *
 * If NavigationSidebar is in sm-host (e.g. isBridged = false) :
 * - if revamped : Navigate in the same react router context using NavLink
 * - if not revamped : Navigate with a <a> element to "/{href}"
 */
export const NavigationMenuElement: React.FC<NavigationMenuItemProps> = ({
  item,
  navigate,
  kind = "subitem",
  children,
}) => {
  const itemElement = ({
    isActive,
    onClick,
    disableSelection,
  }: {
    isActive?: boolean;
    onClick?: () => void;
    disableSelection?: boolean;
  } = {}) => {
    if (kind === "subitem") {
      return (
        <NavigationMenu.SubItem
          key={item.id}
          id={item.id}
          label={item.label}
          active={isActive}
          onClick={item?.onClick ?? onClick}
          endSlot={(item as NavigationSidebarSubItem).endSlot}
        >
          {children}
        </NavigationMenu.SubItem>
      );
    }
    return (
      <NavigationMenu.Item
        key={item.id}
        id={item.id}
        label={item.label}
        active={isActive}
        onClick={item?.onClick ?? onClick}
        endSlot={item.endSlot}
        icon={item.icon}
        disableSelection={disableSelection}
      >
        {children}
      </NavigationMenu.Item>
    );
  };

  // Apply same margin bottom class as NavigationItem when wrapping it
  // and ensure it's a block element (since margin does not apply on inline display)
  const itemClassName = "mb-2xs last:mb-[0px] block";

  return (
    <NavigationLink
      item={item}
      navigate={navigate}
      renderElement={itemElement}
      wrapperConfig={kind === "item" ? { className: itemClassName } : {}}
    />
  );
};
