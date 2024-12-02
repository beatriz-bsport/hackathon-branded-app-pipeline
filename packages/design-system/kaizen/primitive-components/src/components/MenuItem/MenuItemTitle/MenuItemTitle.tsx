import React from "react";
import type { MenuItemTitleType } from "../types";
import Title from "../../Title";

export type MenuItemTitleProps = React.HTMLAttributes<HTMLDivElement> &
  MenuItemTitleType;

/**
 * React component for a title menu item.
 *
 * The `MenuItemTitle` component is a simple and elegant way to display a non-interactive title or
 * heading within a menu or list. It allows for customization of appearance while maintaining
 * consistent typography and spacing.
 *
 * ### Features:
 * - Displays a styled title with customizable text and styling.
 * - Utilizes a consistent typography system for clarity and visual hierarchy.
 * - Supports additional CSS classes and HTML attributes for flexible integration.
 *
 * ### Props:
 *
 * @param props.label (`string`): The text to display as the title.
 * @param props.className (`string | undefined`): Additional CSS classes to apply for custom styling.
 */
const MenuItemTitle: React.FC<MenuItemTitleProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <Title color="weaker" htmlVariant="h5" weight="weak">
        {label}
      </Title>
    </div>
  );
};

MenuItemTitle.displayName = "KaizenMenuItemTitle";

export default MenuItemTitle;
