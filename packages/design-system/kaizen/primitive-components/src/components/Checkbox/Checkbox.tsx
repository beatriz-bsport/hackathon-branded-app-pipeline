import React, { useCallback, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";

export const defaultClasses = [
  "relative",
  "text-onsurface-default text-body-md leading-sm",
] as const;

const checkbox = cva(defaultClasses);

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof checkbox> & {
    value: "checked" | "unchecked" | "indeterminate";
    labelText: string;
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
 * @param props.labelText Text label of the checkbox.
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
  labelText,
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
            "cursor-pointer",
            "transition-colors duration-default ease-in-out",
            "border-stroke-thin indeterminate:border-none checked:border-none disabled:bg-surface-action-disabled/md disabled:border-stroke-action-default-disabled/md",
            {
              "bg-surface-status-critical-weak border-stroke-status-critical indeterminate:bg-surface-status-critical-strong checked:bg-surface-status-critical-strong":
                errorText,
              "bg-surface-action-default-elevated-rest border-stroke-action-default-rest indeterminate:bg-surface-action-main-strong-rest checked:bg-surface-action-main-strong-rest":
                !errorText,
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
        <svg
          className={classNames(
            "absolute pointer-events-none",
            { "ml-[1px]": direction === "start" },
            { "mr-[1px]": direction === "end" },
            { hidden: value === "unchecked" },
            { "fill-onsurface-action-main-disabled": disabled },
            { "fill-onsurface-default-onstrong": !disabled },
          )}
          xmlns="http://www.w3.org/2000/svg"
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="none"
        >
          {value === "checked" ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.0791 3.08753C12.307 3.31533 12.307 3.68468 12.0791 3.91248L5.66248 10.3292C5.43467 10.557 5.06533 10.557 4.83752 10.3292L1.92085 7.41248C1.69305 7.18468 1.69305 6.81533 1.92085 6.58753C2.14866 6.35972 2.51801 6.35972 2.74581 6.58753L5.25 9.09171L11.2542 3.08753C11.482 2.85972 11.8513 2.85972 12.0791 3.08753Z"
            />
          ) : value === "indeterminate" ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.33325 7C2.33325 6.67783 2.59442 6.41666 2.91659 6.41666H11.0833C11.4054 6.41666 11.6666 6.67783 11.6666 7C11.6666 7.32216 11.4054 7.58333 11.0833 7.58333H2.91659C2.59442 7.58333 2.33325 7.32216 2.33325 7Z"
            />
          ) : null}
        </svg>
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
          <span>{labelText}</span>
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

Checkbox.displayName = "KaizenCheckbox";

export default Checkbox;
