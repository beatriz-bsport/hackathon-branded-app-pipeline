import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef } from "react";

import CheckboxSVG from "./CheckboxSVG";

export const defaultClasses = [
  "relative",
  "text-onsurface-default text-body-md leading-sm",
] as const;

const checkbox = cva(defaultClasses);

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  VariantProps<typeof checkbox> & {
    value: "checked" | "unchecked" | "indeterminate";
    label?: string;
    id: string;
    required?: boolean;
    disabled?: boolean;
    direction?: "start" | "end";
    helperText?: string;
    errorText?: string;
    onChange?: (value: boolean) => void;
  };

/**
 * React component implementing all the types of checkboxes used in Kaizen.
 * A checkbox is represented by 3 possible states: checked, indeterminate, and unchecked.
 * Indeterminate is a checkbox that is neither checked nor unchecked, and used to indicate that an option is partially selected.
 * The change of state is managed outside the component.
 * @param props.className Classname to add to the checkbox.
 * @param props.value Defines the state of the checkbox. Can be "checked", "unchecked" or "indeterminate".
 * @param props.label Text label of the checkbox.
 * @param props.id Id of the input.
 * @param props.required Defines if the checkbox is required or not.
 * @param props.disabled Defines if the checkbox is disabled or not.
 * @param props.direction Direction of the checkbox (start or end).
 * @param props.helperText Text below the label to describe the checkbox.
 * @param props.errorText Text to display when the checkbox is in error.
 * @param props.onChange Function to call when the checkbox is changed.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-checkbox--docs
 */
const Checkbox: React.FC<CheckboxProps> = ({
  className,
  value,
  label,
  id,
  required,
  disabled,
  helperText,
  errorText,
  onChange,
  direction = "start",
  ...props
}) => {
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked),
    [onChange],
  );

  const checkboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = value === "indeterminate";
    }
  }, [value]);

  return (
    <div
      data-component="Kaizen-Checkbox"
      className={classNames(
        checkbox({ className }),
        "grid grid-cols-[auto,1fr] grid-rows-[auto,auto,auto,1fr]",
        { "opacity-sm pointer-events-none": disabled },
      )}
      style={{
        gridTemplateAreas:
          direction === "start"
            ? `"input label" "empty helper"`
            : `"label input" "helper empty"`,
      }}
    >
      <div
        className={classNames("flex items-center", {
          "justify-end": direction === "end",
        })}
        style={{ gridArea: "input" }}
      >
        <input
          className={classNames(
            "appearance-none w-md h-md rounded-xs",
            "cursor-pointer disabled:cursor-default",
            "transition-colors duration-default ease-in-out",
            "shadow-action-default-rest active:shadow-action-default-pressed",
            {
              "bg-surface-status-critical-weak border-stroke-status-critical \
              indeterminate:bg-surface-status-critical-strong checked:bg-surface-status-critical-strong":
                errorText,
              "bg-surface-action-default-elevated-rest shadow-action-default-rest \
              indeterminate:bg-surface-action-main-strong-rest checked:bg-surface-action-main-strong-rest":
                !errorText,
              // Hovered state
              "hover:bg-surface-action-default-elevated-hovered hover:border-stroke-action-default-hovered \
              hover:active:bg-surface-action-default-elevated-pressed hover:active:border-stroke-action-default-pressed":
                !disabled && value === "unchecked" && !errorText,
              "hover:shadow-action-call-to-action-hovered hover:bg-surface-action-main-strong-hovered \
              hover:active:shadow-action-call-to-action-pressed hover:active:bg-surface-action-main-strong-pressed":
                !disabled && value !== "unchecked" && !errorText,
              // Disabled state
              "opacity-sm": disabled,
            },
          )}
          type="checkbox"
          role="checkbox"
          ref={checkboxRef}
          id={id}
          checked={value !== "unchecked"}
          disabled={disabled}
          required={required}
          onChange={handleCheckboxChange}
          aria-checked={
            value === "indeterminate" ? "mixed" : value === "checked"
          }
          aria-disabled={disabled}
          aria-invalid={!!errorText}
          aria-labelledby={id}
          tabIndex={0}
          {...props}
        />
        <CheckboxSVG value={value} direction={direction} />
      </div>
      {label && (
        <>
          <div className="flex" style={{ gridArea: "label" }}>
            <label
              htmlFor={id}
              className={classNames("flex gap-2xs cursor-pointer w-full", {
                "cursor-default": disabled,
                "pl-xs": direction === "start",
                "pr-xs": direction === "end",
              })}
            >
              <span>{label}</span>
              {required && (
                <span className="text-onsurface-status-critical-strong text-body-sm leading-xs">
                  *
                </span>
              )}
            </label>
          </div>

          <div style={{ gridArea: "empty" }} />
          <div
            className={classNames("flex flex-col", {
              "pl-xs": direction === "start",
              "pr-xs": direction === "end",
            })}
            style={{ gridArea: "helper" }}
          >
            {helperText && (
              <span className="text-onsurface-weak text-body-sm leading-xs">
                {helperText}
              </span>
            )}
            {errorText && (
              <span className="text-onsurface-status-critical-strong text-body-sm leading-xs">
                {errorText}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

Checkbox.displayName = "KaizenCheckbox";

export default Checkbox;
