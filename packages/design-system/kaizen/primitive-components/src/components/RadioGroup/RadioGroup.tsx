import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import RadioButton, { RadioOptionsProps } from "./RadioButton";

export const defaultClasses = ["flex flex-col gap-md"] as const;

const radioGroup = cva(defaultClasses);

export type RadioGroupProps = React.HTMLAttributes<HTMLFieldSetElement> &
  VariantProps<typeof radioGroup> & {
    id: string;
    options: Array<RadioOptionsProps>;
    value: string;
    onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    direction?: "start" | "end";
  };

/**
 * A group of radio buttons presented as a single component.
 * This component is used to render a set of radio buttons, allowing the user to select
 * a single option from the provided list.
 * @param props.className Additional classes to apply to the radio group.
 * @param props.id Unique ID for the fieldset element.
 * @param props.options An array of options to display as radio buttons.
 * @param props.value Currently selected value.
 * @param props.onChangeValue Callback function triggered when the selected value changes.
 * @param props.disabled Whether the radio buttons should be disabled.
 * @param props.direction The direction in which the radio buttons are laid out. Default is "start".
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-radiogroup--docs
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  id,
  options,
  value,
  onChangeValue,
  disabled,
  direction = "start",
  ...props
}) => {
  return (
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
        {options?.map((option) => (
          <RadioButton
            {...option}
            checked={value === option.value}
            onChange={onChangeValue}
            disabled={disabled!}
            direction={direction}
            key={option.id}
          />
        ))}
      </div>
    </fieldset>
  );
};

RadioGroup.displayName = "KaizenRadioGroup";

export default RadioGroup;
