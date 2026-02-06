import { type VariantProps, cva } from "class-variance-authority";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Icon, { IconName } from "#src/components/Icon";

import { getAccessibleChipColors } from "./color-contrast";
import { colors, defaultClasses, sizes, variants } from "./constants";
import { isHexColor, normalizeHex } from "./hex-utils";

const chip = cva(defaultClasses, {
  variants,
});

type VariantChipsProps = Omit<
  VariantProps<typeof chip>,
  "type" | "colorByType" | "rounded"
>;

type ChipType = "weak" | "strong";
type ChipColor = (typeof colors)[number];
type ChipColorByType = `${ChipType}:${ChipColor}`;

export type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantChipsProps & {
    label?: string;
    type: ChipType;
    color: ChipColor;
    size: keyof typeof sizes;
    iconLeft?: IconName;
    dismissible?: boolean;
    customColor?: string;
    rounded?: "lg";
    onClick?: () => void;
  };

/**
 * React component for a chip element. It is a compact component that can be used to
 * represent a small piece of information, such as a tag, a label, a status, or an action.
 * @param props.className Classname to add to the chip.
 * @param props.label Text to display in the chip.
 * @param props.type Type of the chip. Can be "weak" or "strong".
 * @param props.color Defines the color of the chip.
 * @param props.size Size of the chip. Can be "sm" or "lg".
 * @param props.iconLeft Optional icon to display on the left side of the chip.
 * @param props.dismissible Boolean to define if the chip is dismissible.
 * @param props.dismissible Boolean to define if the chip is dismissible.
 * @param props.customColor Optional hex color to override chip colors.
 * @param props.rounded Optional border radius override (lg).
 * @param props.onClick Function to call when the chip is dismissed.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-chip--docs
 */
const Chip: React.FC<ChipProps> = ({
  className,
  label,
  type,
  color,
  size,
  iconLeft,
  dismissible,
  customColor,
  rounded,
  onClick,
  style,
  ...props
}) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismissClick = useCallback(() => {
    setDismissed(true);
    onClick?.();
  }, [onClick]);

  useEffect(() => {
    if (!dismissible && onClick) {
      console.warn(
        `You set isDismissible to false but you set a function onClick on the chip with label "${label}". The function will be ignored.`,
      );
    }
  }, [dismissible, onClick]);

  const renderedIconLeft = useMemo(
    () =>
      iconLeft ? (
        <Icon icon={iconLeft} size={size === "lg" ? "sm" : "xs"} />
      ) : null,
    [iconLeft, size],
  );
  const renderedIconDismiss = useMemo(
    () =>
      dismissible ? (
        <Icon
          icon="x"
          size={size === "lg" ? "sm" : "xs"}
          className="cursor-pointer"
          onClick={handleDismissClick}
        />
      ) : null,
    [dismissible, size],
  );

  const customColors = useMemo(() => {
    if (!customColor) {
      return null;
    }

    if (!isHexColor(customColor)) {
      return null;
    }

    const normalizedHex = normalizeHex(customColor);
    return getAccessibleChipColors(normalizedHex);
  }, [customColor]);

  const chipStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!customColors) {
      return style;
    }

    return {
      ...style,
      backgroundColor: customColors.background,
      color: customColors.text,
      boxShadow: `inset 0 0 0 1px ${customColors.border}`,
    };
  }, [customColors, style]);

  const shouldRender = useMemo(() => !dismissed, [dismissed]);
  if (!shouldRender) return null;

  const colorByType: ChipColorByType = `${type}:${color}`;
  const roundedVariant = rounded ?? "default";
  const chipClassName = chip({
    className,
    size,
    rounded: roundedVariant,
    colorByType,
  });

  return (
    <div
      data-component="Kaizen-Chip"
      className={chipClassName}
      style={chipStyle}
      {...props}
    >
      {renderedIconLeft}
      {label && <span>{label}</span>}
      {renderedIconDismiss}
    </div>
  );
};

Chip.displayName = "KaizenChip";

export { colors, sizes };

export default Chip;
