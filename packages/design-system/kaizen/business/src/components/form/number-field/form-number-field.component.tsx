import type { ReactElement } from "react";

import { type FieldValues, FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import type { NumberFieldPath } from "#src/utils/form-types";
import { toMaxDigits } from "#src/utils/number";

type FormNumberFieldProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  /** Number of characters after the comma */
  maxDigits?: number;
} & Partial<TextFieldProps>;

export const FormNumberField = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  id,
  fieldName,
  className,
  maxDigits,
  ...additionalProps
}: FormNumberFieldProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, TextFieldProps>
      name={fieldName}
      mapProps={({ defaultProps }) => {
        return {
          ...defaultProps,
          // Convert from number (form state) to string (textfield state)
          value:
            defaultProps.value == null
              ? ""
              : String(toMaxDigits(defaultProps.value, maxDigits)),
          onChange: (event) => {
            // Convert from string (textfield state) to number (form state)
            const converted = toMaxDigits(
              event.target.valueAsNumber,
              maxDigits,
            );
            defaultProps.onChange(Number.isNaN(converted) ? null : converted);
          },
          ...(additionalProps ?? {}),
        };
      }}
    >
      <TextField id={id} className={className ?? ""} type="number" />
    </FormField>
  );
};
