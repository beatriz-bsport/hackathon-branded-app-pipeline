import type { ReactElement } from "react";

import { type FieldPath, type FieldValues, FormField } from "@bsport/form";
import { Checkbox, type CheckboxProps } from "@bsport/kaizen-primitive-core";

type NestedValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

type BooleanFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: NestedValue<T, K> extends boolean ? K : never;
}[FieldPath<T>];

type FormCheckboxProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  label: string;
  helperText?: string;
} & Partial<CheckboxProps>;

export const FormCheckbox = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  id,
  fieldName,
  label,
  helperText,
  ...additionalProps
}: FormCheckboxProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, CheckboxProps>
      name={fieldName}
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        ...additionalProps,
        value: defaultProps.value ? "checked" : "unchecked",
        onChange: (checked: boolean) => defaultProps.onChange(checked),
      })}
    >
      {/** @ts-expect-error Pass props implicitly - FormField forwards value, onChange, id, label, helperText */}
      <Checkbox id={id} label={label} helperText={helperText} />
    </FormField>
  );
};
