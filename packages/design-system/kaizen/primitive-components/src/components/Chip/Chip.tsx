import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SetRequired } from "type-fest";
import Icon, { IconName } from "../Icon";
import { colors, defaultClasses, sizes, variants } from "./constants";

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
    type: "weak" | "strong";
    color: (typeof colors)[number];
    size: keyof typeof sizes;
    iconLeft?: IconName;
    dismissible?: boolean;
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

export { colors, sizes };

export default Chip;
