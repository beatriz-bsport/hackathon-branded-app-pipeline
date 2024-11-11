import React from "react";
import classNames from "classnames";

export type RadioOptionsProps = {
  id: string;
  value: string;
  helperText?: string;
  errorText?: string;
};

export type RadioButtonProps = RadioOptionsProps & {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  direction?: "start" | "end";
};

/**
 * A single radio button.
 * Using grid to arrange and align the label and input next to each other.
 * Second row with an empty space to arrange the helper & error texts below the input.
 *
 * @remarks
 * This component is highly recommended to be used within a {@link RadioGroup} component.
 *
 * @param id Unique ID of the input element.
 * @param value Value displayed next to the input.
 * @param helperText Helper text to display below the label.
 * @param errorText Error text to display below the label.
 * @param checked Whether the radio button is checked.
 * @param onChange Callback when the value changes.
 * @param disabled Whether the radio button is disabled.
 * @param direction Direction of the label relative to the input.
 */
const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  value,
  helperText,
  errorText,
  checked,
  onChange,
  disabled,
  direction = "start",
}) => {
  return (
    <div
      className={classNames(
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
            "appearance-none w-md h-md rounded-circle",
            "cursor-pointer",
            "border-stroke-thin border-stroke-action-default-rest",
            "checked:border-none disabled:bg-surface-action-disabled/md disabled:border-stroke-action-default-disabled/md",
            "bg-surface-action-default-elevated-rest checked:bg-surface-action-main-strong-rest",
            {
              "bg-surface-status-critical-weak border-stroke-status-critical checked:bg-surface-status-critical-strong":
                errorText,
              "cursor-default": disabled,
            },
          )}
          type="radio"
          role="radio"
          name={value}
          value={value}
          id={id}
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          aria-invalid={!!errorText}
          aria-labelledby={id}
          tabIndex={0}
          onChange={onChange}
        />
        {checked && (
          <svg
            className={classNames(
              "absolute pointer-events-none",
              { "ml-[4px]": direction === "start" },
              { "mr-[4px]": direction === "end" },
              { block: checked },
              { hidden: !checked },
              { "fill-onsurface-action-main-disabled": disabled },
              { "fill-onsurface-default-onstrong": !disabled },
            )}
            xmlns="http://www.w3.org/2000/svg"
            width={8}
            height={8}
            viewBox="0 0 8 8"
            fill="none"
          >
            <circle cx="4" cy="4" r="4" fill="white" />
          </svg>
        )}
      </div>
      <div className="flex" style={{ gridArea: "label" }}>
        <label
          htmlFor={id}
          className={classNames("flex cursor-pointer w-full", {
            "cursor-default": disabled,
            "pl-xs": direction === "start",
            "pr-xs": direction === "end",
          })}
        >
          <span>{value}</span>
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

export default RadioButton;
