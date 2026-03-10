import React from "react";

import Checkbox, { type CheckboxProps } from "#src/components/Checkbox";
import { useCheckboxContext } from "#src/contexts/CheckboxContext";

type CheckboxGroupItemProps = Omit<
  CheckboxProps,
  "checked" | "value" | "direction"
>;

export type CheckboxGroupItemsProps = {
  options: Array<CheckboxGroupItemProps>;
  disabled?: boolean;
} & Pick<CheckboxProps, "direction">;

export const CheckboxGroupItems: React.FC<CheckboxGroupItemsProps> = ({
  options,
  direction,
  disabled,
}) => {
  const { getCheckboxState, toggleCheckbox } = useCheckboxContext();

  return (
    <>
      {options.map((checkboxConfig) => (
        <Checkbox
          key={checkboxConfig.id}
          {...checkboxConfig}
          disabled={disabled || checkboxConfig.disabled}
          direction={direction}
          value={getCheckboxState(checkboxConfig.id)}
          onChange={() => toggleCheckbox(checkboxConfig.id)}
        />
      ))}
    </>
  );
};
