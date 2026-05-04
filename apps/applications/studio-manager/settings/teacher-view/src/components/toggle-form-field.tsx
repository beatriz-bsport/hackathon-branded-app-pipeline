import {
  type FieldPathByValue,
  type FieldValues,
  FormField,
} from "@bsport/form";
import { Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

type ToggleFormFieldProps<T extends FieldValues> = {
  name: FieldPathByValue<T, boolean>;
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
};

export function ToggleFormField<T extends FieldValues>({
  name,
  id,
  label,
  checked,
  disabled,
  helperText,
  errorText,
}: ToggleFormFieldProps<T>) {
  return (
    <FormField<T, typeof name, ToggleProps>
      name={name}
      mapProps={({ defaultProps, form }) => ({
        onToggleChange: (next) => {
          defaultProps.onChange(next);
          form.trigger(name);
        },
      })}
    >
      <Toggle
        id={id}
        label={label}
        checked={checked}
        disabled={disabled}
        helperText={helperText}
        errorText={errorText}
      />
    </FormField>
  );
}
