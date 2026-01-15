import type { ReactElement } from "react";

import { getCurrencyCode } from "@bsport/currency";
import { type FieldPath, type FieldValues, FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

// Enforce the selected name to be within the FieldValues and to resolve to a number field
type NumberFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: T[K] extends number | null ? K : never;
}[FieldPath<T>];

type FormPriceFieldProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
} & Partial<TextFieldProps>;

export const FormPriceField = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  id,
  fieldName,
  className,
  ...additionalProps
}: FormPriceFieldProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, TextFieldProps>
      name={fieldName}
      mapProps={({ defaultProps }) => {
        return {
          ...defaultProps,
          // Convert from number (form state) to string (textfield state)
          value: defaultProps.value == null ? "" : String(defaultProps.value),
          onChange: (event) => {
            // Convert from string (textfield state) to number (form state)
            defaultProps.onChange(event.target.valueAsNumber);
          },
          ...(additionalProps ?? {}),
        };
      }}
    >
      <TextField
        id={id}
        className={["w-full", className ?? ""].join(" ")}
        suffix={{
          type: "text",
          value: getCurrencyCode().toLocaleUpperCase(),
        }}
        type="number"
      />
    </FormField>
  );
};
