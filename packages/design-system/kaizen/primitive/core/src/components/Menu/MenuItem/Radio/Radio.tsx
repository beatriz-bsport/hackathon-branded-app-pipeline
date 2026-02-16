import { cva } from "class-variance-authority";
import React, { useMemo, useRef } from "react";

import Avatar from "#src/components/Avatar";
import Body from "#src/components/Body";
import Icon from "#src/components/Icon";
import Indicator from "#src/components/Menu/MenuItem/Indicator";
import {
  baseMenuItemClasses,
  menuItemVariants,
} from "#src/components/Menu/MenuItem/constants";
import { Radio as RadioType } from "#src/components/Menu/MenuItem/types";

const radio = cva(baseMenuItemClasses, {
  variants: menuItemVariants,
});

type RadioOptionsProps = {
  id: string;
  value: string;
};

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement> &
  RadioOptionsProps &
  Omit<RadioType, "type">;

/**
 * React component for a radio menu item.
 *
 * The `Radio` component is a reusable and customizable component for creating radio-style
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
const Radio: React.FC<RadioProps> = ({
  id,
  value,
  checked,
  onChange,
  disabled,
  label,
  rightSlot,
  avatar,
  iconLeft,
  description,
  leftSlot,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
    () =>
      label || value ? (
        <div id={`${id}-menu-radio-item-label`} className="flex cursor-pointer">
          <Body htmlVariant="span">{label ?? value}</Body>
        </div>
      ) : null,
    [label, value, id],
  );

  const renderedDescription = useMemo(
    () =>
      description ? (
        <Body
          id={`${id}-menu-radio-item-description`}
          htmlVariant="span"
          size="md"
          color="weak"
        >
          {description}
        </Body>
      ) : null,
    [description, id],
  );

  return (
    <label
      htmlFor={id}
      data-component="Kaizen-Menu-Item-Radio"
      className={radio({ disabled, checked: checked ?? false })}
      tabIndex={0}
    >
      <Indicator disabled={disabled} />
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
      <div className="flex items-center justify-between w-full gap-xs">
        <div className="flex items-center gap-xs">
          {leftSlot ?? renderedAvatar ?? renderedIcon}
          <div className="flex flex-col">
            {renderedLabel}
            {renderedDescription}
          </div>
        </div>
        {rightSlot ?? null}
      </div>
    </label>
  );
};

export default Radio;
