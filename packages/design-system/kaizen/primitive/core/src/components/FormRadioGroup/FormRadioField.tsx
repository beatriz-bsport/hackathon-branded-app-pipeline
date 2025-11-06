import classNames from "classnames";
import React, { useEffect, useId, useRef } from "react";

import Alert, { type AlertProps } from "#src/components/Alert";

export type FormRadioOptionsProps = {
  label: string;
  value: string;
  helperText?: string;
  errorText?: string;
  element?: React.ReactNode;
  alertConfig?: {
    alert: AlertProps;
    position?: "top" | "bottom";
  };
};

export type FormRadioFieldProps = FormRadioOptionsProps & {
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  direction?: "start" | "end";
  setLabelColWidths: React.Dispatch<React.SetStateAction<number[]>>;
  labelMaxWidth: number;
};

/**
 * FormRadioField Component
 *
 * Represents a single radio button field rendered within a grid layout.
 * This component includes a label, optional helper and error text, and supports alignment
 * configuration (start or end). It also supports an optional `element`, like an icon or input,
 * and uses `ResizeObserver` to dynamically measure and align radio group labels consistently.
 *
 * Intended for use within a `FormRadioGroup`, which manages state and layout across multiple `FormRadioField` components.
 *
 * @component
 * @example
 * <FormRadioField
 *   id="paypal"
 *   value="PayPal"
 *   checked={selectedValue === "PayPal"}
 *   onChange={(e) => setSelectedValue(e.target.value)}
 *   disabled={false}
 *   direction="start"
 *   helperText="No account required"
 *   errorText=""
 *   setLabelColWidths={setWidths}
 *   labelMaxWidth={120}
 * />
 *
 * @param {string} props.label - Label displayed as the Radio option choice.
 * @param {string} props.value - Value of the radio button used to manage state.
 * @param {boolean} props.checked - Whether the radio button is currently selected.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Callback triggered when the value changes.
 * @param {boolean} props.disabled - Disables the radio button if true.
 * @param {string} [props.helperText] - Optional helper text shown below the label.
 * @param {string} [props.errorText] - Optional error message shown below the label (triggers error styles).
 * @param {React.ReactNode} [props.element] - Optional custom element displayed next to the radio (e.g. icon, input).
 * @param {React.ReactNode} [props.alertConfig] - Optional custom Alert element displayed under the radio field.
 * @param {"start" | "end"} [props.direction="start"] - Layout direction: "start" places label after input, "end" before.
 * @param {React.Dispatch<React.SetStateAction<number[]>>} props.setLabelColWidths - Used to report label or element width to the parent for consistent sizing.
 * @param {number} props.labelMaxWidth - The max width calculated across all labels for alignment purposes.
 *
 * @returns {JSX.Element} A grid-based layout containing a radio input, label, optional custom element, and helper/error text.
 *
 * @see FormRadioGroup
 */
const FormRadioField: React.FC<FormRadioFieldProps> = ({
  label,
  value,
  helperText,
  errorText,
  checked,
  onChange,
  disabled,
  direction = "start",
  element,
  alertConfig,
  setLabelColWidths,
  labelMaxWidth,
}) => {
  const id = useId();
  const labelRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const helperRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (helperRef.current && direction === "start") {
      const helperContainer = helperRef.current;
      const helperResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(() => {
          const width = Math.abs(helperContainer.getBoundingClientRect().width);
          setLabelColWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths.push(width);
            return newWidths;
          });
        });
      });

      // Observe the container
      helperResizeObserver.observe(helperContainer);

      // Also observe each child for content changes
      Array.from(helperContainer.children).forEach((child) => {
        helperResizeObserver.observe(child);
      });

      return () => {
        setLabelColWidths([]);
        helperResizeObserver.disconnect();
      };
    }
  }, [helperText, direction, setLabelColWidths]);

  useEffect(() => {
    if (errorRef.current && direction === "start") {
      const errorContainer = errorRef.current;
      const errorResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(() => {
          const width = Math.abs(errorContainer.getBoundingClientRect().width);
          setLabelColWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths.push(width);
            return newWidths;
          });
        });
      });

      // Observe the container
      errorResizeObserver.observe(errorContainer);

      // Also observe each child for content changes
      Array.from(errorContainer.children).forEach((child) => {
        errorResizeObserver.observe(child);
      });

      return () => {
        setLabelColWidths([]);
        errorResizeObserver.disconnect();
      };
    }
  }, [errorText, direction, setLabelColWidths]);

  useEffect(() => {
    if (labelRef.current && direction === "start") {
      const labelContainer = labelRef.current;
      const labelResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(() => {
          const width = Math.abs(labelContainer.getBoundingClientRect().width);

          setLabelColWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths.push(width);
            return newWidths;
          });
        });
      });

      // Observe the container
      labelResizeObserver.observe(labelContainer);

      // Also observe each child for content changes
      Array.from(labelContainer.children).forEach((child) => {
        labelResizeObserver.observe(child);
      });

      return () => {
        setLabelColWidths([]);
        labelResizeObserver.disconnect();
      };
    }
  }, [value, direction, setLabelColWidths]);

  useEffect(() => {
    if (elementRef.current && direction === "end") {
      const elementContainer = elementRef.current;
      const elementResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(() => {
          const width = Math.abs(
            elementContainer.getBoundingClientRect().width,
          );

          setLabelColWidths((prevWidths) => {
            const newWidths = [...prevWidths];
            newWidths.push(width);
            return newWidths;
          });
        });
      });

      // Observe the container
      elementResizeObserver.observe(elementContainer);

      // Also observe each child for content changes
      Array.from(elementContainer.children).forEach((child) => {
        elementResizeObserver.observe(child);
      });

      return () => {
        setLabelColWidths([]);
        elementResizeObserver.disconnect();
      };
    }
  }, [element, direction, setLabelColWidths]);

  const getGridTemplateAreas = () => {
    let gridTemplateAreas = "";
    gridTemplateAreas =
      direction === "start"
        ? `"input label element" "empty helper ."`
        : `"element label input" ". helper empty"`;
    if (alertConfig?.position === "bottom") {
      gridTemplateAreas += '"alert alert alert"';
    } else if (alertConfig?.position === "top") {
      gridTemplateAreas = '"alert alert alert" ' + gridTemplateAreas;
    }
    return gridTemplateAreas;
  };

  return (
    <div
      className={classNames(
        "grid grid-cols-[auto,auto,1fr] grid-rows-[auto, auto, auto, 1fr] items-center gap-y-xs",
        {
          "opacity-sm pointer-events-none": disabled,
        },
      )}
      style={{
        gridTemplateAreas: getGridTemplateAreas(),
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
            "cursor-pointer disabled:cursor-default",
            "transition-colors duration-default ease-in-out",
            "border-stroke-thin border-stroke-action-default-rest",
            "checked:border-none",
            "bg-surface-action-default-elevated-rest checked:bg-surface-action-main-strong-rest",
            {
              "bg-surface-status-critical-weak border-stroke-status-critical checked:bg-surface-status-critical-strong":
                errorText,
              // Hovered state
              "hover:bg-surface-action-default-elevated-hovered hover:border-stroke-action-default-hovered \
              hover:active:bg-surface-action-default-elevated-pressed hover:active:border-stroke-action-default-pressed":
                !disabled && !checked && !errorText,
              "hover:bg-surface-action-main-strong-hovered hover:shadow-action-call-to-action-hovered \
              hover:active:bg-surface-action-main-strong-pressed hover:active:shadow-action-call-to-action-pressed":
                !disabled && checked && !errorText,
              // Disabled state
              "bg-surface-action-default-elevated-pressed border-stroke-action-default-pressed":
                disabled && !checked && !errorText,
              "bg-surface-action-main-strong-pressed":
                disabled && checked && !errorText,
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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.stopPropagation();
            onChange?.(event);
          }}
        />
        {checked && (
          <svg
            className={classNames(
              "absolute pointer-events-none",
              "fill-onsurface-default-onstrong",
              { "ml-[4px]": direction === "start" },
              { "mr-[4px]": direction === "end" },
              { block: checked },
              { hidden: !checked },
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
      <div ref={labelRef} className="flex" style={{ gridArea: "label" }}>
        <label
          style={
            direction === "start" ? { minWidth: `${labelMaxWidth}px` } : {}
          }
          htmlFor={id}
          className={classNames("flex cursor-pointer w-full", {
            "cursor-default": disabled,
            "pl-xs": direction === "start",
            "pr-xs": direction === "end",
          })}
        >
          <span>{label}</span>
        </label>
      </div>
      {element && (
        <div
          ref={elementRef}
          style={
            direction === "end"
              ? {
                  gridArea: "element",
                  minWidth: `${labelMaxWidth}px`,
                }
              : { gridArea: "element" }
          }
          className={classNames("flex flex-row items-center", {
            "ml-[16px]": direction === "start",
            "mr-[16px]": direction === "end",
          })}
        >
          {element}
        </div>
      )}

      <div style={{ gridArea: "empty" }} />
      <div
        className={classNames("flex flex-col", {
          "pl-xs": direction === "start",
          "pr-xs": direction === "end",
        })}
        style={{ gridArea: "helper" }}
      >
        {helperText && (
          <span
            ref={helperRef}
            className="text-onsurface-weak text-body-sm leading-xs"
          >
            {helperText}
          </span>
        )}
        {errorText && (
          <span
            ref={errorRef}
            className="text-onsurface-status-critical-strong text-body-sm leading-xs"
          >
            {errorText}
          </span>
        )}
      </div>
      {alertConfig && (
        <div style={{ gridArea: "alert" }}>
          <Alert {...alertConfig.alert} />
        </div>
      )}
    </div>
  );
};

export default FormRadioField;
