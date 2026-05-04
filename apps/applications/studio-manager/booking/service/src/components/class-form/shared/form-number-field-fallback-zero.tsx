import type { ReactElement } from "react";

import { type FieldPath, type FieldValues, FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

type FormNumberFieldFallbackZeroProps<
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
} & Partial<TextFieldProps>;

export const FormNumberFieldFallbackZero = <
  TFormValues extends FieldValues,
  TFieldName extends FieldPath<TFormValues>,
>({
  fieldName,
  id,
  ...additionalProps
}: FormNumberFieldFallbackZeroProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, TextFieldProps>
      name={fieldName}
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        value: defaultProps.value == null ? "0" : String(defaultProps.value),
        onChange: (event) => {
          const nextValue = event.target.valueAsNumber;
          defaultProps.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
        },
        ...additionalProps,
      })}
    >
      {/* Keep 0 as the empty-state fallback to preserve existing payload semantics. */}
      <TextField id={id} type="number" />
    </FormField>
  );
};
