import type { ReactElement } from "react";

import { type FieldValues, FormField } from "@bsport/form";
import { Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

import type { BooleanFieldPath } from "#src/utils/form-types";

type FormToggleProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  label: string;
  /**
   * Optional side effect fired after the form value has been updated.
   * Receives the new boolean value so callers can react to it (e.g. resetting
   * a sibling field when this one turns on).
   */
  onChangeCallback?: (nextValue: boolean) => void;
} & Partial<ToggleProps>;

export const FormToggle = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  id,
  fieldName,
  label,
  onChangeCallback,
  ...additionalProps
}: FormToggleProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, ToggleProps>
      name={fieldName}
      mapProps={({ defaultProps, field }) => {
        const { statusText: _, ...otherDefaultProps } = defaultProps;
        return {
          ...otherDefaultProps,
          ...(additionalProps ?? {}),
          onChange: (event) => {
            field.onChange(event);
            additionalProps.onChange?.(event);
            onChangeCallback?.(event.target.checked);
          },
          // Required to avoid conflict with typing of Toggle.value
          value: "",
          checked: field.value,
        };
      }}
    >
      {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `checked` props */}
      <Toggle id={id} label={label} />
    </FormField>
  );
};

FormToggle.displayName = "KaizenFormToggle";
