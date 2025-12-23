import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback } from "react";

export const defaultClasses = [
  "relative",
  "text-onsurface-default text-body-md leading-sm",
] as const;

const toggle = cva(defaultClasses);

export type ToggleProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof toggle> & {
    checked: boolean;
    label: string;
    id: string;
    required?: boolean;
    disabled?: boolean;
    direction?: "start" | "end";
    helperText?: string;
    errorText?: string;
    onToggleChange?: (value: boolean) => void;
  };

/**
 * React component implementing all the types of toggles used in Kaizen.
 * @param props.className Classname to add to the toggle.
 * @param props.checked Defines the checked status of the toggle.
 * @param props.label Text label of the toggle.
 * @param props.id Id of the input.
 * @param props.required Defines if the toggle is required or not.
 * @param props.disabled Defines if the toggle is disabled or not.
 * @param props.direction Direction of the toggle (start or end).
 * @param props.helperText Text below the label to describe the toggle.
 * @param props.errorText Text to display when the toggle is in error.
 * @param props.onToggleChange Function to call when the toggle is changed.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-toggle--docs
 */
const Toggle: React.FC<ToggleProps> = ({
  className,
  checked,
  label,
  id,
  required,
  disabled,
  direction = "start",
  helperText,
  errorText,
  onToggleChange,
  ...props
}) => {
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onToggleChange?.(e.target.checked),
    [onToggleChange],
  );

  return (
    <div
      data-component="Kaizen-Toggle"
      className={classNames(
        toggle({ className }),
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
            "appearance-none w-xl h-md rounded-circle",
            "bg-surface-action-main-selected-rest",
            "cursor-pointer",
            "transition-colors duration-default ease-in-out",
            "hover:bg-surface-action-main-selected-hovered active:bg-surface-action-main-selected-pressed",
            "checked:bg-surface-action-main-strong-rest checked:hover:bg-surface-action-main-strong-hovered checked:active:bg-surface-action-main-strong-pressed",
            {
              "shadow-critical bg-surface-status-critical-weak hover:bg-surface-status-critical-weak active:bg-surface-status-critical-weak checked:bg-surface-status-critical-strong checked:hover:bg-surface-status-critical-strong checked:active:bg-surface-status-critical-strong":
                errorText,
              "cursor-default": disabled,
            },
          )}
          type="checkbox"
          role="checkbox"
          name={label}
          value={label}
          id={id}
          checked={checked}
          disabled={disabled}
          required={required}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-invalid={!!errorText}
          aria-labelledby={id}
          aria-required={required}
          tabIndex={0}
          onChange={handleCheckboxChange}
          {...props}
        />
        <div
          className={classNames(
            "absolute pointer-events-none",
            "w-[12px] h-[12px] rounded-circle",
            "bg-surface-action-default-elevated-rest",
            "border-stroke-action-default-rest border-stroke-thin",
            "transition-left duration-default ease-in-out",
            {
              "left-[2px]": !checked && direction === "start",
              "left-[18px]": checked && direction === "start",
              "right-[18px]": !checked && direction === "end",
              "right-[2px]": checked && direction === "end",
            },
          )}
        />
      </div>
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
    </div>
  );
};

Toggle.displayName = "KaizenToggle";

export default Toggle;
