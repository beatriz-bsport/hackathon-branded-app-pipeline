import React, { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Avatar from "../../Avatar";
import Icon from "../../Icon";
import { defaultMenuItemClasses, menuItemVariants } from "../constants";
import type { MenuItemButtonType } from "../types";
import MenuItemIndicator from "../MenuItemIndicator";

const menuItemButton = cva(defaultMenuItemClasses, {
  variants: menuItemVariants,
});

export type MenuItemButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof menuItemButton>,
  "children"
> &
  MenuItemButtonType;

/**
 * React component for a button menu item.
 *
 * The `MenuItemButton` component provides a versatile button element designed for use in menus or lists.
 * It supports additional UI features such as avatars, icons, and right-aligned slots, allowing for rich
 * and interactive menu designs.
 *
 * ### Features:
 * - Customizable with avatars, icons, labels, and right-aligned elements.
 * - Supports a disabled state with proper styles and interactions.
 * - Designed with accessibility in mind for seamless keyboard and screen-reader navigation.
 * - Integrates utility-based styling for easy customization.
 *
 * ### Props:
 *
 * @param props.avatar (`string | undefined`): URL for an avatar image to display on the left side of the item.
 * @param props.className (`string | undefined`): Additional CSS classes to apply to the button for custom styling.
 * @param props.iconLeft (`string | undefined`): Name of an icon to display on the left side of the button.
 * @param props.label (`string | undefined`): Text to display as the label of the button.
 * @param props.rightSlot (`React.ReactNode | undefined`): Custom content to display on the right side of the button.
 * @param props.disabled (`boolean`): If `true`, disables the button and prevents interactions.
 */
const MenuItemButton: React.FC<MenuItemButtonProps> = ({
  avatar,
  className,
  iconLeft,
  label,
  rightSlot,
  disabled,
  ...props
}) => {
  const renderedAvatar = useMemo(
    () =>
      avatar ? (
        <Avatar src={avatar} alt="Avatar" shape="round" size="sm" />
      ) : null,
    [avatar],
  );

  const renderedIcon = useMemo(
    () => (iconLeft ? <Icon icon={iconLeft} size="sm" /> : null),
    [iconLeft],
  );

  const renderedLabel = useMemo(
    () => (label ? <span className="pr-xs">{label}</span> : null),
    [label],
  );

  const renderedRightSlot = useMemo(
    () => (rightSlot ? <div className="flex">{rightSlot}</div> : null),
    [rightSlot],
  );

  return (
    <button className={menuItemButton({ className, disabled })} {...props}>
      <MenuItemIndicator disabled={disabled} />
      {renderedAvatar ?? renderedIcon}
      {renderedLabel}
      {renderedRightSlot}
    </button>
  );
};

MenuItemButton.displayName = "KaizenMenuItemButton";

export default MenuItemButton;
