import React, { ChangeEvent, useState } from "react";
import { cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import classNames from "classnames";
import Button from "#src/components/Button";
import Icon, { IconName } from "#src/components/Icon";
import Badge from "#src/components/Badge";

const defaultClasses = [
  "w-full",
  "font-body-lg",
  "leading-md",
  "outline-none",
  "border-none",
  "text-onsurface-weak placeholder:text-onsurface-weaker",
  "text-ellipsis",
  "bg-[transparent]",
] as const;

const variants = {
  status: {
    default: [""],
    positive: [""],
    error: [""],
  },
} as const;

export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

export const inputTypes = [
  "date",
  "datetime-local",
  "email",
  "number",
  "password",
  "tel",
  "text",
  "search",
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
  type?: (typeof inputTypes)[number];
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
  ...props
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <div
      className={classNames(
        className,
        "flex flex-col gap-2xs max-w-component-select",
        {
          "opacity-sm pointer-events-none": disabled,
        },
      )}
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
      <div
        className={classNames(
          "relative flex justify-between rounded-md bg-surface-default overflow-hidden before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:rounded-md before:pointer-events-none",
          {
            "before:shadow-border-thin-default": status === "default",
            "before:shadow-border-thin-positive": status === "positive",
            "before:shadow-border-thin-critical": status === "error",
            "shadow-focused": isInputFocused && status === "default",
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
          <div className="flex px-md items-center gap-xs border-r-stroke-thin border-r-stroke-default bg-surface-default-weak text-onsurface-weaker">
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
        <div className="flex gap-xs items-center justify-between w-full px-xs py-2xs">
          {iconLeft && (
            <div className="text-onsurface-weak">
              <Icon icon={iconLeft} size="sm" />
            </div>
          )}
          <input
            className={textField({ status })}
            id={id}
            name={id}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
            onBlur={(e) => {
              setIsInputFocused(false);
              onBlur?.(e);
            }}
            onFocus={(e) => {
              setIsInputFocused(true);
              onFocus?.(e);
            }}
            type={type}
            disabled={disabled}
            aria-required={required}
            aria-invalid={status === "error"}
            aria-describedby={helperText ? `${id}-helper-text` : undefined}
            {...props}
          />
          {type !== "number" && value && (
            <Button
              iconLeft="x-close"
              size="sm"
              intent="flat"
              color="default"
              onClick={onClear}
              className="text-onsurface-weak"
            />
          )}
          {iconRight && (
            <div className="text-onsurface-weak">
              <Icon icon={iconRight} size="sm" />
            </div>
          )}
        </div>
        {/* TODO: type country */}
        {suffix && Object.keys(suffix).length > 0 && (
          <div className="flex px-md justify-center items-center gap-xs border-l-stroke-thin border-l-stroke-default bg-surface-default-weak text-onsurface-weaker">
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
