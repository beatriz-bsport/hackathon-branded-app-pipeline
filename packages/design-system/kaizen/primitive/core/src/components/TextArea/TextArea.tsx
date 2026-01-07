import { cva } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import React, { ChangeEvent, useMemo } from "react";

const defaultClasses = [
  "min-h-xl w-full",
  "rounded-md",
  "p-xs",
  "text-body-lg",
  "leading-md",
  "text-onsurface-weak placeholder:text-onsurface-weaker",
  "focus:outline focus:outline-2",
  "bg-[transparent]",
] as const;

const variants = {
  status: {
    default: [
      "shadow-border-thin-default",
      "focus:outline-stroke-action-main-selected",
    ],
    positive: [
      "shadow-border-thin-positive",
      "focus:outline-stroke-status-positive",
    ],
    error: [
      "shadow-border-thin-critical",
      "focus:outline-stroke-status-critical",
      "invalid:shadow-border-thin-critical invalid:outline-stroke-status-critical",
    ],
  },
};

export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

const textArea = cva(defaultClasses, { variants });

export type TextAreaProps = React.HTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  status?: keyof typeof statuses;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  statusText?: string;
  maxLength?: number;
  minLength?: number;
};

/**
 * A component that allows users to input multiple lines of text.
 * @param props.className Classname to add to the textarea container.
 * @param props.id Unique ID for the textarea element.
 * @param props.status The status of the textarea, which affects its styling.
 * @param props.value The current value of the textarea.
 * @param props.defaultValue The default value of the textarea.
 * @param props.onChange Callback function to call when the value changes.
 * @param props.label The text for the label associated with the textarea.
 * @param props.placeholder Placeholder text to display when the textarea is empty.
 * @param props.required Whether the textarea is required. Displays an asterisk (*) next to the label.
 * @param props.disabled Whether the textarea is disabled.
 * @param props.helperText Additional helper text to display below the textarea.
 * @param props.statusText Status text to display below the textarea.
 * @param props.minLength Minimal length of the value that can be inserted in the field
 * @param props.maxLength Maximal length of the value that can be inserted in the field
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-textarea--docs
 */
const TextArea: React.FC<TextAreaProps> = ({
  className,
  id,
  status = "default",
  defaultValue,
  value,
  onChange,
  label,
  placeholder,
  required,
  disabled,
  helperText,
  statusText,
  minLength,
  maxLength,
  ...props
}) => {
  const textClasses = useMemo(
    () =>
      classNames("text-body-sm leading-xs text-ellipsis", {
        "text-onsurface-weak": status === "default",
        "text-onsurface-status-positive-strong": status === "positive",
        "text-onsurface-status-critical-strong": status === "error",
      }),
    [status],
  );

  return (
    <div
      data-component="Kaizen-TextArea"
      className={classNames("flex flex-col gap-2xs", {
        "opacity-sm pointer-events-none": disabled,
      })}
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
      <textarea
        className={classNames(textArea({ className, status }))}
        id={id}
        name={id}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        {...props}
      />
      {helperText && <p className={textClasses}>{helperText}</p>}
      {statusText && <p className={textClasses}>{statusText}</p>}
    </div>
  );
};

TextArea.displayName = "KaizenTextArea";

export default TextArea;
