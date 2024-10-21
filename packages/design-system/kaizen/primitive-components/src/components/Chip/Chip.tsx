import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SetRequired } from "type-fest";
import Icon, { IconName } from "../Icon";
import { colors, defaultClasses, sizes, types, variants } from "./constants";

const chip = cva(defaultClasses, {
  variants,
});

type VariantChipsProps = SetRequired<
  Omit<VariantProps<typeof chip>, "type" | "colorByType">,
  "size"
>;

export type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantChipsProps & {
    label: string;
    type: keyof typeof types;
    size: keyof typeof sizes;
    color: (typeof colors)[number];
    iconLeft?: IconName;
    dismissible?: boolean;
    onClick?: () => void;
  };

/**
 * React component to display a Chip.
 * @param props.className Classname to add to the chip.
 * @param props.label Text to display in the chip.
 * @param props.type Type of the chip. Can be "weak" or "strong".
 * @param props.size Size of the chip. Can be "sm" or "lg".
 * @param props.color Defines the color of the chip.
 * @param props.iconLeft Optional icon to display on the left side of the chip.
 * @param props.dismissible Boolean to define if the chip is dismissible.
 * @param props.onClick Function to call when the chip is dismissed.
 * @link https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=490-3106
 */
const Chip: React.FC<ChipProps> = ({
  className,
  type,
  size,
  color,
  label,
  iconLeft,
  dismissible,
  onClick,
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

  const shouldRender = useMemo(() => !dismissed, [dismissed]);
  if (!shouldRender) return null;

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

  return (
    <div
      className={chip({
        className,
        type,
        size,
        colorByType: `${type}:${color}` as keyof typeof variants.colorByType,
      })}
      {...props}
    >
      {renderedIconLeft}
      <span>{label}</span>
      {renderedIconDismiss}
    </div>
  );
};

Chip.displayName = "KaizenChip";

export { colors, sizes, types };

export default Chip;
