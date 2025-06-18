import { type VariantProps, cva } from "class-variance-authority";
import React, { useMemo } from "react";
import type { SetRequired } from "type-fest";

import Icon, { type IconName } from "#src/components/Icon";
import Loader from "#src/components/Loader";

import {
  colorsByIntent,
  defaultClasses,
  intents,
  sizes,
  variants,
} from "./constants";

const button = cva(defaultClasses, {
  variants,
  compoundVariants: [
    {
      intent: "call-to-action",
      colorByIntent: colorsByIntent["call-to-action"].map(
        (c) =>
          `call-to-action-${c}` as `call-to-action-${(typeof colorsByIntent)["call-to-action"][number]}`,
      ),
    },
    {
      intent: "default",
      colorByIntent: colorsByIntent["default"].map(
        (c) =>
          `default-${c}` as `default-${(typeof colorsByIntent)["default"][number]}`,
      ),
    },
    {
      intent: "flat",
      colorByIntent: colorsByIntent["flat"].map(
        (c) => `flat-${c}` as `flat-${(typeof colorsByIntent)["flat"][number]}`,
      ),
    },
  ],
});

type InternalVariants = "iconVariant" | "widthMode" | "colorByIntent";

type VariantButtonProps = SetRequired<
  Omit<VariantProps<typeof button>, InternalVariants>,
  // Required variants
  "size" | "intent"
>;

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantButtonProps & {
    label?: string;
    size: keyof typeof sizes;
    loading?: boolean;
    iconLeft?: IconName;
    iconRight?: IconName;
    fullWidth?: boolean;
  } & (
    | {
        intent: (typeof intents)["call-to-action"];
        color: (typeof colorsByIntent)["call-to-action"][number];
      }
    | {
        intent: (typeof intents)["default"];
        color: (typeof colorsByIntent)["default"][number];
      }
    | {
        intent: (typeof intents)["flat"];
        color: (typeof colorsByIntent)["flat"][number];
      }
  );

/**
 * Function used in useMemo to render icons
 */
const IconToRender = (props: {
  icon?: IconName;
  size: keyof typeof sizes;
  loading?: boolean;
  label: string | undefined | null;
}) => {
  if (!props.size) {
    return null;
  }
  const iconSize = props.size === "lg" ? ("md" as const) : ("sm" as const);
  if (props.loading) {
    return <Loader size={iconSize} />;
  }
  if (props.icon) {
    return <Icon icon={props.icon} size={iconSize} />;
  }
  return null;
};

/**
 * React component implementing all the types of buttons used in Kaizen.
 * @param props.className Classname to add to the button.
 * @param props.label Text label of the button.
 * @param props.intent Intent on the use of the button.
 * @param props.color Defines the color of the button.
 * @param props.size Size of the button.
 * @param props.loading State of the button when the action triggered by the button is loading.
 * @param props.iconLeft Name of the icon to use on the left side of the button.
 * @param props.iconRight Name of the icon to use on the right side of the button.
 * @param props.fullWidth Boolean indicating if the button should take the full width of its container.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-button--docs
 */
const Button: React.FC<Props> = ({
  className,
  label,
  intent,
  color,
  size,
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  ...props
}) => {
  const renderedIconLeft = useMemo(
    () => (
      <IconToRender
        icon={iconLeft}
        size={size}
        label={label}
        loading={loading}
      />
    ),
    [loading, iconLeft, size, label],
  );

  const renderedIconRight = useMemo(
    () => (
      <IconToRender
        icon={iconRight}
        size={size}
        label={label}
        loading={false}
      />
    ),
    [loading, iconRight, size, label],
  );

  const labelToRender = useMemo(() => {
    return label ? <span className={"px-xs"}>{label}</span> : null;
  }, [label]);

  const customAriaLabel = props["aria-label"] ?? label;
  const fallbackAriaLabel = iconLeft ? "Icon button" : "Button";

  return (
    <button
      role="button"
      aria-label={customAriaLabel ?? fallbackAriaLabel}
      aria-busy={loading ? "true" : "false"}
      aria-disabled={props.disabled ? "true" : "false"}
      className={button({
        className,
        intent,
        size,
        colorByIntent:
          `${intent}-${color}` as keyof typeof variants.colorByIntent,
        iconVariant:
          !label && size
            ? (`icon-only-${size}` as `icon-only-${keyof typeof variants.size}`)
            : (`default-${size}` as `default-${keyof typeof variants.size}`),
        widthMode: fullWidth ? "full-width" : "default",
      })}
      type="button"
      {...props}
    >
      {renderedIconLeft}
      {labelToRender}
      {renderedIconRight}
    </button>
  );
};

Button.displayName = "KaizenButton";

export { sizes, colorsByIntent, intents };

export default Button;
