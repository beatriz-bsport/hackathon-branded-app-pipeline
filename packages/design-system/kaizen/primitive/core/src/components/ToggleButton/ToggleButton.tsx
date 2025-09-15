import React, { useEffect, useState } from "react";

import Button, { type ButtonProps } from "#src/components/Button";
import { IconName } from "#src/components/Icon";
import { type TooltipProps, withTooltip } from "#src/components/Tooltip";

export type ToggleButtonContentConfigProps = {
  label: string;
  icon?: IconName;
  tooltipConfig?: TooltipProps;
};

export type ToggleButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick"
> & {
  id: string;
  className?: string;
  size: ButtonProps["size"];
  checkedConfig: ToggleButtonContentConfigProps;
  uncheckedConfig: ToggleButtonContentConfigProps;
  checked?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onChange?: ({
    event,
    checked,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    checked: boolean;
  }) => void;
};

const ButtonWithTooltip = withTooltip(Button);

/**
 * ToggleButton component for Kaizen Design System.
 *
 * Renders a toggleable button with configurable checked/unchecked states, labels, and optional icons.
 * Uses separate configuration objects for checked and unchecked states to allow different labels,
 * icons, and tooltips for each state.
 *
 * @param props.id Unique identifier for the button element.
 * @param props.size Size of the button (matches Button component sizes).
 * @param props.checkedConfig Configuration for the checked state (label, optional icon, optional tooltip).
 * @param props.uncheckedConfig Configuration for the unchecked state (label, optional icon, optional tooltip).
 * @param props.checked Controlled checked state. If provided, component is controlled.
 * @param props.disabled Whether the button is disabled.
 * @param props.onChange Callback fired when the checked state changes. Receives event and new checked value.
 * @param props.fullWidth If true, the button takes the full width of its container.
 * @param props.className Additional class names to apply to the button.
 * @param props ...props Other button HTML attributes (excluding onChange and onClick).
 *
 * @example
 * ```tsx
 * <ToggleButton
 *   id="feature-toggle"
 *   checkedConfig={{
 *     label: "Feature Enabled",
 *     icon: "check",
 *     tooltipConfig: { label: "Click to disable", placement: "top" }
 *   }}
 *   uncheckedConfig={{
 *     label: "Feature Disabled",
 *     tooltipConfig: { label: "Click to enable", placement: "top" }
 *   }}
 *   checked={isEnabled}
 *   onChange={({ checked }) => setIsEnabled(checked)}
 * />
 * ```
 *
 * @see https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-togglebutton--docs
 */
const ToggleButton: React.FC<ToggleButtonProps> = ({
  className,
  checked,
  checkedConfig,
  uncheckedConfig,
  id,
  disabled,
  size = "md",
  fullWidth = false,
  onChange,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  // Sync internal state with controlled prop
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.({ event, checked: newChecked });
  };

  const labelToDisplay = isChecked
    ? checkedConfig.label
    : uncheckedConfig.label;

  const iconName = isChecked
    ? checkedConfig.icon || "check"
    : uncheckedConfig.icon;

  const tooltipConfig = isChecked
    ? checkedConfig.tooltipConfig
    : uncheckedConfig.tooltipConfig;

  // Fix: Use proper Button color type and fallback to valid colors
  const buttonColor: ButtonProps["color"] = isChecked ? "selected" : "main";

  return (
    <ButtonWithTooltip
      {...props}
      id={id}
      className={className}
      intent="default"
      size={size}
      iconRight={iconName}
      label={labelToDisplay}
      onClick={handleClick}
      disabled={disabled}
      fullWidth={fullWidth}
      color={buttonColor}
      tooltipProps={
        tooltipConfig
          ? {
              label: tooltipConfig.label,
              placement: tooltipConfig.placement,
              chip: tooltipConfig.chip,
            }
          : undefined
      }
    />
  );
};

ToggleButton.displayName = "KaizenToggleButton";

export default ToggleButton;
