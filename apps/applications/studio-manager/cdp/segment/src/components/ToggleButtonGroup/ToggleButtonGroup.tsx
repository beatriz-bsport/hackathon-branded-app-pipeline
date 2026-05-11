import {
  type IconName,
  Title,
  ToggleButton,
} from "@bsport/kaizen-primitive-core";

type ToggleButtonGroupOption<TValue extends string> = {
  value: TValue;
  label: string;
  icon?: IconName;
  disabled?: boolean;
};

export type ToggleButtonGroupProps<TValue extends string> = {
  id: string;
  label?: string;
  options: Array<ToggleButtonGroupOption<TValue>>;
  value?: TValue;
  onChangeValue?: (value: TValue) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

export const ToggleButtonGroup = <TValue extends string>({
  id,
  label,
  options,
  value,
  onChangeValue,
  size = "md",
  disabled = false,
}: ToggleButtonGroupProps<TValue>) => {
  const selectedValue = value ?? options[0]?.value;

  return (
    <div className="flex flex-col gap-xs">
      {label ? (
        <Title htmlVariant="h4" weight="weak">
          {label}
        </Title>
      ) : null}
      <div className="flex items-center gap-xs">
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            id={`${id}-${option.value}`}
            size={size}
            checked={selectedValue === option.value}
            disabled={disabled || option.disabled}
            checkedConfig={{ label: option.label, iconLeft: option.icon }}
            uncheckedConfig={{ label: option.label, iconLeft: option.icon }}
            onChange={({ checked }) => {
              if (!checked) return;
              onChangeValue?.(option.value);
            }}
          />
        ))}
      </div>
    </div>
  );
};
