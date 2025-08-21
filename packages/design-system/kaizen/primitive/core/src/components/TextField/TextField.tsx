import { cva } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import React, {
  type ChangeEvent,
  HTMLInputAutoCompleteAttribute,
  useState,
} from "react";

import Badge from "#src/components/Badge";
import Button from "#src/components/Button";
import Icon, { IconName } from "#src/components/Icon";

import ColorInput from "./ColorInput";

const defaultClasses = [
  "w-full",
  "leading-md",
  "outline-none",
  "border-none",
  "text-onsurface-weak placeholder:text-onsurface-weak",
  "text-ellipsis",
  "bg-[transparent]",
] as const;

const variants = {
  status: {
    default: [""],
    positive: [""],
    error: [""],
  },
  type: {
    default: "text-body-lg",
    search: "text-body-sm",
  },
} as const;

export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

export const inputTypes = [
  "color",
  "date",
  "datetime-local",
  "email",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "time",
] as const;

export type TextFieldPrefixSuffix =
  | {
      type: "text" | "color" | "country";
      value: string;
    }
  | {
      type: "icon";
      value: IconName;
    };

const textField = cva(defaultClasses, {
  variants,
  defaultVariants: {
    type: "default",
  },
});

export type TextFieldProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "prefix" | "suffix" | "type" | "onChange"
> & {
  id: string;
  status?: keyof typeof statuses;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  statusText?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  prefix?: TextFieldPrefixSuffix;
  suffix?: TextFieldPrefixSuffix;
  fullWidth?: boolean;
  type?: (typeof inputTypes)[number];
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  autocomplete?: HTMLInputAutoCompleteAttribute;
};

/**
 * A component that allows users to input a single line of text.
 * @param props.className Classname to add to the textfield container.
 * @param props.id Unique ID for the textfield element.
 * @param props.status The status of the textfield, which affects its styling.
 * @param props.value The current value of the textfield.
 * @param props.onChange Callback function to call when the value changes.
 * @param props.onClear Callback function to call when the clear button is clicked.
 * @param props.label The text for the label associated with the textfield.
 * @param props.placeholder Placeholder text to display when the textfield is empty.
 * @param props.required Whether the textfield is required. Displays an asterisk (*) next to the label.
 * @param props.disabled Whether the textfield is disabled.
 * @param props.helperText Additional helper text to display below the textfield.
 * @param props.statusText Status text to display below the textfield.
 * @param props.iconLeft Name of the icon to use on the left inside the textfield.
 * @param props.iconRight Name of the icon to use on the right inside the textfield.
 * @param props.prefix Text, color, or icon to display on the left of the textfield.
 * @param props.suffix Text, color, or icon to display on the right of the textfield.
 * @param props.type The type of the textfield.
 * @param props.onBlur Callback function to call when the textfield loses focus.
 * @param props.onFocus Callback function to call when the textfield gains focus.
 * @param props.fullWidth Optionnal - boolean, make the component take the full available width of the parent.
 * @param props.inputRef Optionnal - React ref to the input element, useful for focusing the input programmatically.
 */
const TextField: React.FC<TextFieldProps> = ({
  className,
  id,
  status = "default",
  value,
  onChange,
  onClear,
  label,
  placeholder,
  required,
  disabled,
  helperText,
  statusText,
  iconLeft,
  iconRight,
  prefix,
  suffix,
  type = "text",
  onBlur,
  onFocus,
  fullWidth,
  containerProps,
  inputRef,
  autocomplete = "off",
  ...props
}) => {
  /* TODO: Check with design if the color picker needs all these props, and split it in a separate component (explained here: https://gitlab.com/bsport/ichizen/-/merge_requests/425#note_2402509306) */

  const [isInputFocused, setIsInputFocused] = useState(false);

  const isValidHex = (val?: string) =>
    /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/i.test(val ?? "");
  const getDefaultColor = (val?: string) =>
    isValidHex(val) ? (val ?? "#ffffff") : "#ffffff";

  const [colorInputValue, setColorInputValue] = useState(
    getDefaultColor(value),
  );

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = e.target.value;

    if (/^#[\da-f]{0,6}$/i.test(val)) {
      if (val.length === 4 || val.length === 7) {
        setColorInputValue(val);
      }
      onChange?.(e);
    }
  };

  const handleColorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setColorInputValue(e.target.value);
    onChange?.(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange?.(e);
  };

  const handleIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  };

  const colorInputProps =
    type === "color"
      ? { type: "text", onChange: handleTextChange }
      : { type, onChange: handleChange };

  const { className: containerClassName, ...otherContainerProps } =
    containerProps ?? {};

  return (
    <div
      className={classNames(
        "flex flex-col gap-2xs",
        {
          "opacity-sm pointer-events-none": disabled,
          "max-w-component-select": !fullWidth,
        },
        containerClassName ?? "",
      )}
      {...otherContainerProps}
    >
      {label && (
        <label
          htmlFor={id}
          className="flex gap-2xs text-onsurface-default text-body-md leading-sm"
        >
          <span>{label}</span>
          {required && (
            <span className="text-onsurface-status-critical-strong text-body-sm leading-xs">
              *
            </span>
          )}
        </label>
      )}
      <div className="flex gap-xs">
        <div
          className={classNames(
            className,
            "relative flex justify-between rounded-md bg-surface-default overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:rounded-md before:pointer-events-none",
            {
              "before:shadow-border-thin-default": status === "default",
              "before:shadow-border-thin-positive": status === "positive",
              "before:shadow-border-thin-critical": status === "error",
              "shadow-focused": isInputFocused && status === "default",
              "w-full": fullWidth,
              "bg-surface-default-weak": type === "search",
            },
          )}
        >
          {/* Input type search need this special custom style to hide clear button rendered by default in the different browsers */}
          {type === "search" && (
            <style>
              {`
                input[type="search"]::-ms-clear { display: none; width: 0; height: 0; }
                input[type="search"]::-webkit-search-decoration,
                input[type="search"]::-webkit-search-cancel-button,
                input[type="search"]::-webkit-search-results-button,
                input[type="search"]::-webkit-search-results-decoration { display: none !important; }
                input[type="search"]::-moz-search-cancel-button { display: none !important; }
              `}
            </style>
          )}
          {/* TODO: type country */}
          {prefix && Object.keys(prefix).length > 0 && (
            <div className="flex px-md items-center gap-xs border-r-stroke-thin border-r-stroke-default bg-surface-default-weak text-onsurface-weak">
              {prefix.type === "text" ? (
                <span>{prefix.value}</span>
              ) : prefix.type === "icon" ? (
                <Icon icon={prefix.value} size="sm" />
              ) : prefix.type === "color" ? (
                <Badge
                  size="sm"
                  color="default"
                  style={{ backgroundColor: prefix.value }}
                />
              ) : null}
            </div>
          )}
          <div
            className="flex gap-xs items-center justify-between w-full px-xs py-2xs"
            onClick={handleIconClick}
          >
            {type === "search" ? (
              <Icon
                icon="search-refraction"
                size="sm"
                className="text-onsurface-weaker"
              />
            ) : iconLeft ? (
              <Icon icon={iconLeft} size="sm" className="text-onsurface-weak" />
            ) : null}
            <input
              ref={inputRef}
              className={textField({
                status,
                type: type === "search" ? "search" : "default",
              })}
              id={id}
              name={id}
              value={value}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              onBlur={(e) => {
                setIsInputFocused(false);
                onBlur?.(e);
              }}
              onFocus={(e) => {
                setIsInputFocused(true);
                onFocus?.(e);
              }}
              aria-required={required}
              aria-invalid={status === "error"}
              aria-describedby={helperText ? `${id}-helper-text` : undefined}
              autoComplete={autocomplete}
              {...props}
              {...colorInputProps}
            />
            {!["number", "color", "time"].includes(type) && value ? (
              <div className="flex items-center justify-center w-sm">
                <Button
                  iconLeft="x-close"
                  size="sm"
                  intent="flat"
                  color="default"
                  onClick={onClear}
                  className="text-onsurface-weak"
                />
              </div>
            ) : null}
            {iconRight && (
              <div className="text-onsurface-weak" onClick={handleIconClick}>
                <Icon icon={iconRight} size="sm" />
              </div>
            )}
          </div>
          {/* TODO: type country */}
          {suffix && Object.keys(suffix).length > 0 && (
            <div className="flex px-md justify-center items-center gap-xs border-l-stroke-thin border-l-stroke-default bg-surface-default-weak text-onsurface-weak">
              {suffix?.type === "text" ? (
                <span>{suffix.value}</span>
              ) : suffix?.type === "icon" ? (
                <Icon icon={suffix.value} size="sm" />
              ) : suffix?.type === "color" ? (
                <Badge
                  size="sm"
                  color="default"
                  className={`bg-[${suffix.value}]`}
                />
              ) : null}
            </div>
          )}
        </div>
        {type === "color" && (
          <ColorInput
            value={colorInputValue}
            onChange={handleColorInputChange}
            disabled={disabled}
          />
        )}
      </div>
      {helperText && (
        <p className="text-body-sm leading-xs text-ellipsis text-onsurface-weak">
          {helperText}
        </p>
      )}
      {statusText && (
        <p
          className={classNames("text-body-sm leading-xs text-ellipsis", {
            "text-onsurface-weak": status === "default",
            "text-onsurface-status-positive-strong": status === "positive",
            "text-onsurface-status-critical-strong": status === "error",
          })}
        >
          {statusText}
        </p>
      )}
    </div>
  );
};

TextField.displayName = "KaizenTextField";

export default TextField;
