import { type VariantProps, cva } from "class-variance-authority";
import React, { useMemo } from "react";

import Avatar from "#src/components/Avatar";
import Body from "#src/components/Body";
import Icon from "#src/components/Icon";
import MenuItemIndicator from "#src/components/Menu/MenuItem/Indicator";
import {
  defaultMenuItemClasses,
  menuItemVariants,
} from "#src/components/Menu/MenuItem/constants";
import type { Button as ButtonType } from "#src/components/Menu/MenuItem/types";

import { MenuItemLayout } from "../MenuItemLayout";

const button = cva(defaultMenuItemClasses, {
  variants: menuItemVariants,
});

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>,
  "children"
> &
  ButtonType;

/**
 * React component for a button menu item.
 *
 * The `Button` component provides a versatile button element designed for use in menus or lists.
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
const Button: React.FC<ButtonProps> = ({
  avatar,
  className,
  iconLeft,
  label,
  rightSlot,
  disabled,
  leftSlot,
  ...props
}) => {
  const renderedAvatar = useMemo(
    () =>
      avatar ? (
        <Avatar
          src={avatar.src}
          initials={avatar.initials}
          alt="Avatar"
          shape="round"
          size="sm"
        />
      ) : null,
    [avatar],
  );

  const renderedIcon = useMemo(
    () => (iconLeft ? <Icon icon={iconLeft} size="sm" /> : null),
    [iconLeft],
  );

  const renderedLabel = useMemo(
    () => (label ? <Body htmlVariant="span">{label}</Body> : null),
    [label],
  );

  return (
    <button
      data-component="Kaizen-Menu-Item-Button"
      className={button({ className, disabled })}
      {...props}
    >
      <MenuItemIndicator disabled={disabled} />
      <MenuItemLayout
        label={renderedLabel}
        startSlot={leftSlot}
        avatar={renderedAvatar}
        icon={renderedIcon}
        endSlot={rightSlot}
      />
    </button>
  );
};

Button.displayName = "KaizenMenuItemButton";

export default Button;
