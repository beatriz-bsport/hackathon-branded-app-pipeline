import React, { useMemo, useRef } from "react";
import { MenuItemRadioType } from "#src/components/MenuItem/types";
import {
  baseMenuItemClasses,
  menuItemVariants,
} from "#src/components/MenuItem/constants";
import { cva } from "class-variance-authority";
import Avatar from "#src/components/Avatar";
import Icon from "#src/components/Icon";
import MenuItemIndicator from "#src/components/MenuItem/MenuItemIndicator";

const menuItemRadio = cva(baseMenuItemClasses, {
  variants: menuItemVariants,
});

type RadioOptionsProps = {
  id: string;
  value: string;
};

export type MenuItemRadioProps = React.InputHTMLAttributes<HTMLInputElement> &
  RadioOptionsProps &
  Omit<MenuItemRadioType, "type">;

/**
 * React component for a radio menu item.
 *
 * The `MenuItemRadio` component is a reusable and customizable component for creating radio-style
 * menu items. It provides functionality for selecting a single option from a group and can include
 * additional elements such as an avatar, an icon, and a label.
 *
 * ### Features:
 * - Fully accessible with ARIA attributes.
 * - Supports avatars, icons, labels, and custom right slots.
 * - Keyboard and mouse interaction support.
 * - Disables interaction when `disabled` prop is set.
 *
 * ### Props:
 *
 * @param props.id (`string`): A unique identifier for the radio input element.
 * @param props.value (`string`): The value associated with the radio option.
 * @param props.checked (`boolean`): Determines whether the radio item is selected.
 * @param props.onChange (`(event: React.ChangeEvent<HTMLInputElement>) => void`): Callback function triggered
 *   when the selection changes.
 * @param props.disabled (`boolean`): If `true`, disables the radio item and makes it non-interactive.
 * @param props.label (`string`): Text to display as the label for the radio item.
 * @param props.rightSlot (`React.ReactNode`): Additional content to render on the right side of the item.
 * @param props.avatar (`string | undefined`): URL for an avatar image to display on the left side of the item.
 * @param props.iconLeft (`string | undefined`): Name of an icon to display on the left side of the item.
 */
const MenuItemRadio: React.FC<MenuItemRadioProps> = ({
  id,
  value,
  checked,
  onChange,
  disabled,
  label,
  rightSlot,
  avatar,
  iconLeft,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
    () =>
      label || value ? (
        <label htmlFor={id} className="cursor-pointer">
          <span className="pr-xs">{label ?? value}</span>
        </label>
      ) : null,
    [label, value, id],
  );

  const renderedRightSlot = useMemo(
    () => (rightSlot ? <div className="flex">{rightSlot}</div> : null),
    [label],
  );

  const handleMenuItemClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      event.stopPropagation();
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <button
      className={menuItemRadio({ disabled, checked })}
      onClick={handleMenuItemClick}
      tabIndex={0}
      role="radio"
    >
      <MenuItemIndicator disabled={disabled} />
      <input
        ref={inputRef}
        className="sr-only"
        type="radio"
        role="radio"
        name={value}
        value={value}
        id={id}
        checked={checked ?? false}
        disabled={disabled}
        aria-checked={checked}
        aria-labelledby={id}
        onChange={onChange}
        tabIndex={-1}
        {...props}
      />
      {renderedAvatar ?? renderedIcon}
      {renderedLabel}
      {renderedRightSlot}
    </button>
  );
};

MenuItemRadio.displayName = "KaizenMenuItemRadio";

export default MenuItemRadio;
