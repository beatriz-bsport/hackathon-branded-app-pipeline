import { type VariantProps, cva } from "class-variance-authority";
import React, { useEffect, useState } from "react";

import FormRadioField, { FormRadioOptionsProps } from "./FormRadioField";

export const defaultClasses = ["flex flex-col gap-md"] as const;

const radioGroup = cva(defaultClasses);

export type FormRadioGroupProps =
  React.FieldsetHTMLAttributes<HTMLFieldSetElement> &
    VariantProps<typeof radioGroup> & {
      id: string;
      options: Array<FormRadioOptionsProps>;
      label?: string;
      value?: string;
      onChangeValue?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      disabled?: boolean;
      direction?: "start" | "end";
      required?: boolean;
    };

/**
 * FormRadioGroup Component
 *
 * Renders a group of radio buttons within a fieldset. It allows users to select a single option
 * from a list of provided choices. Each option is rendered using the `FormRadioField` component.
 *
 * This component supports layout customization, accessibility via `role="radiogroup"`,
 * and dynamic sizing logic to align radio labels based on their computed widths.
 *
 * @component
 * @example
 * <FormRadioGroup
 *   id="payment-method"
 *   options={[
 *     { id: "card", label: "Credit Card", value: "card" },
 *     { id: "paypal", label: "PayPal", value: "paypal" },
 *   ]}
 *   value="card"
 *   onChangeValue={(e) => console.log(e.target.value)}
 * />
 *
 * @param {string} props.id - Unique identifier for the radio group (fieldset element).
 * @param {string} props.label Optionnal - Label to identify the radio group global element.
 * @param {Array<FormRadioOptionsProps>} props.options - Array of radio button options to render.
 * @param {string} props.value - Optionnal if you are using @bsport/form package - The currently selected option's value.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChangeValue Optionnal if you are using @bsport/form package - Callback triggered when selection changes.
 * @param {boolean} [props.disabled] - If true, disables all radio buttons.
 * @param {"start" | "end"} [props.direction="start"] - Alignment direction for the radio buttons and their labels.
 * @param {string} [props.className] - Additional Tailwind or custom CSS classes to apply to the container.
 * @param {React.FieldsetHTMLAttributes<HTMLFieldSetElement>} [props...] - Additional native HTML fieldset attributes.
 * @param {boolean} props.required Optionnal - Whether the Form Radio Group is mandatory for the user too fill. Displays an asterisk (*) next to the label.
 *
 * @returns {JSX.Element} A fieldset element containing a list of stylized radio buttons.
 *
 * @see FormRadioField
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-radiogroup--docs
 */
const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  className,
  id,
  label,
  options,
  value,
  onChangeValue,
  disabled,
  direction = "start",
  required,
  ...props
}) => {
  const [labelColWidths, setLabelColWidths] = useState<number[]>([]);
  const [labelMaxWidth, setLabelMaxWidth] = useState(0);

  useEffect(() => {
    setLabelMaxWidth(
      labelColWidths.length > 0 ? Math.max(...labelColWidths) : 0,
    );
  }, [labelColWidths]);

  return (
    <div className="flex flex-col gap-xs">
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

      <fieldset
        className={radioGroup({ className })}
        role="radiogroup"
        id={id}
        {...props}
      >
        <div
          className={
            "flex flex-col w-fit gap-xs text-onsurface-default text-body-md leading-sm"
          }
        >
          {options?.map((option) => {
            return (
              <FormRadioField
                {...option}
                checked={value === option.value}
                onChange={onChangeValue}
                disabled={disabled!}
                direction={direction}
                key={option.id}
                element={option.element}
                setLabelColWidths={setLabelColWidths}
                labelMaxWidth={labelMaxWidth}
              />
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

FormRadioGroup.displayName = "KaizenFormRadioGroup";

export default FormRadioGroup;
