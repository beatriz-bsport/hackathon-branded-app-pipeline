import React, { PropsWithChildren } from "react";
import { NavLink } from "react-router";

import { NavigationMenu } from "@bsport/kaizen-primitive-core";

import type { NavigationSidebarSubItem } from "./navigation-items";

type NavigationMenuItemProps = PropsWithChildren<{
  kind: "item" | "subitem";
  item: NavigationSidebarSubItem;
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
  const isBridged = !!navigate;
  const itemElement = ({
    isActive,
    onClick,
  }: { isActive?: boolean; onClick?: () => void } = {}) => {
    if (kind === "subitem") {
      return (
        <NavigationMenu.SubItem
          key={item.id}
          id={item.id}
          label={item.label}
          active={isActive}
          onClick={item?.onClick ?? onClick}
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
      >
        {children}
      </NavigationMenu.Item>
    );
  };

  if (!item.href) return itemElement();

  if (isBridged && item.revamped) {
    return (
      <a key={item.id} href={`/studio/${item.href}`}>
        {itemElement()}
      </a>
    );
  }

  if (isBridged && !item.revamped) {
    return itemElement({ onClick: () => navigate?.(item.href!) });
  }

  if (!isBridged && !item.revamped) {
    return (
      <a key={item.id} href={item.href}>
        {itemElement()}
      </a>
    );
  }

  return (
    <NavLink key={item.id} to={item.href}>
      {({ isActive }) => itemElement({ isActive })}
    </NavLink>
  );
};
