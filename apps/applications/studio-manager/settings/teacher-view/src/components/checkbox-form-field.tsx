import {
  type FieldPathByValue,
  type FieldValues,
  FormField,
} from "@bsport/form";
import { Checkbox, type CheckboxProps } from "@bsport/kaizen-primitive-core";

type CheckboxFormFieldProps<T extends FieldValues> = {
  name: FieldPathByValue<T, boolean>;
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
};

export function CheckboxFormField<T extends FieldValues>({
  name,
  id,
  label,
  checked,
  disabled,
  helperText,
  errorText,
}: CheckboxFormFieldProps<T>) {
  return (
    <FormField<T, typeof name, CheckboxProps>
      name={name}
      mapProps={({ defaultProps, form }) => ({
        onChange: (next: boolean) => {
          defaultProps.onChange(next);
          form.trigger(name);
        },
      })}
    >
      <Checkbox
        id={id}
        label={label}
        value={checked ? "checked" : "unchecked"}
        disabled={disabled}
        helperText={helperText}
        errorText={errorText}
      />
    </FormField>
  );
}
