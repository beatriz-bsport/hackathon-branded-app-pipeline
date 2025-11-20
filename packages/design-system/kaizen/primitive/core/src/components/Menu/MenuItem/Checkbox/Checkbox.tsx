import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import Avatar from "#src/components/Avatar";
import { CheckboxSVG } from "#src/components/Checkbox";
import Icon from "#src/components/Icon";
import Indicator from "#src/components/Menu/MenuItem/Indicator";
import {
  defaultMenuItemClasses,
  menuItemVariants,
} from "#src/components/Menu/MenuItem/constants";
import { CheckBox as CheckBoxType } from "#src/components/Menu/MenuItem/types";

const checkbox = cva(defaultMenuItemClasses, {
  variants: menuItemVariants,
});

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof checkbox> &
  Omit<CheckBoxType, "type">;
/**
 * React component for a checkbox menu item.
 *
 * The `Checkbox` component provides a flexible and accessible checkbox element that can be used
 * within menus or lists. It supports multiple states (`checked`, `unchecked`, and `indeterminate`) and
 * includes additional customization options like avatars, icons, and labels.
 *
 * ### Features:
 * - Fully accessible with ARIA attributes, including support for `indeterminate` state.
 * - Supports avatars, icons, and labels for enhanced UI.
 * - Disabled state handling with proper styles and interactions.
 * - Click handling to toggle checkbox states, including when clicking on associated labels.
 *
 * ### Props:
 *
 * @param props.avatar (`string | undefined`): URL for an avatar image to display on the left side of the item.
 * @param props.disabled (`boolean`): If `true`, disables the checkbox and prevents interactions.
 * @param props.iconLeft (`string | undefined`): Name of an icon to display on the left side of the item.
 * @param props.id (`string`): Unique identifier for the checkbox input element.
 * @param props.label (`string`): Text to display as the label for the checkbox item.
 * @param props.onChange (`(event: React.ChangeEvent<HTMLInputElement>) => void`): Callback function invoked when the checkbox state changes.
 * @param props.value (`"checked" | "unchecked" | "indeterminate"`): Current state of the checkbox.
 * @param props.rightSlot (`React.ReactNode`): Additional content to render on the right side of the item.
 */
const Checkbox: React.FC<CheckboxProps> = ({
  avatar,
  disabled,
  iconLeft,
  id,
  label,
  onChange,
  onClick,
  value,
  rightSlot,
  ...props
}) => {
  const handleCheckboxChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if ((event.target as HTMLElement).tagName === "INPUT") return;
      onClick?.(event);
    },
    [onClick],
  );
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

  const checkboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = value === "indeterminate";
    }
  }, [value]);

  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLLabelElement>) => {
      // Prevent inner elements from stopping the click event
      if (!disabled) {
        e.preventDefault(); // Prevent triggering input focus unnecessarily
        onClick?.(e); // Invoke parent click handler
      }
    },
    [disabled],
  );

  return (
    <button
      role="check"
      aria-checked={value === "checked"}
      className={checkbox({ disabled })}
      onClick={handleCheckboxChange}
      tabIndex={0}
    >
      <Indicator disabled={disabled} />
      <div
        className={classNames(
          "flex items-center relative text-onsurface-default text-body-md leading-sm",
          { "opacity-sm pointer-events-none": disabled },
        )}
      >
        <input
          className={classNames(
            "appearance-none w-md h-md rounded-xs",
            "cursor-pointer disabled:cursor-default",
            "transition-colors duration-default ease-in-out",
            "border-stroke-thin indeterminate:border-none checked:border-none",
            "bg-surface-action-default-elevated-rest border-stroke-action-default-rest \
              indeterminate:bg-surface-action-main-strong-rest checked:bg-surface-action-main-strong-rest",
            {
              // Hovered state
              "hover:bg-surface-action-default-elevated-hovered hover:border-stroke-action-default-hovered \
              hover:active:bg-surface-action-default-elevated-pressed":
                !disabled && value === "unchecked",
              "hover:shadow-action-call-to-action-hovered hover:bg-surface-action-main-strong-hovered \
              hover:active:shadow-action-call-to-action-pressed hover:active:bg-surface-action-main-strong-pressed":
                !disabled && value !== "unchecked",
              // Disabled state
              "border-stroke-action-default-pressed bg-surface-action-default-elevated-pressed":
                disabled && value === "unchecked",
              "bg-surface-action-main-strong-pressed":
                disabled && value !== "unchecked",
            },
          )}
          type="checkbox"
          role="checkbox"
          ref={checkboxRef}
          id={id}
          checked={value !== "unchecked"}
          disabled={disabled}
          onChange={onChange}
          onClick={onClick}
          aria-checked={
            value === "indeterminate" ? "mixed" : value === "checked"
          }
          aria-disabled={disabled}
          aria-labelledby={id}
          tabIndex={-1}
          {...props}
        />
        <CheckboxSVG value={value} />
      </div>
      <div className="flex items-center justify-between w-full">
        <label
          onClick={handleOnClick}
          htmlFor={id}
          className={classNames(
            "flex items-center justify-between cursor-pointer",
            {
              "cursor-default": disabled,
            },
          )}
        >
          <div className="flex gap-xs">
            {renderedAvatar ?? renderedIcon}
            <span>{label}</span>
          </div>
        </label>
        {rightSlot ?? null}
      </div>
    </button>
  );
};

Checkbox.displayName = "KaizenMenuItemCheckbox";

export default Checkbox;
