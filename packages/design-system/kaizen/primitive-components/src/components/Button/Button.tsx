import type { SetRequired } from "type-fest";
import React, { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Icon, { type IconName } from "../Icon";
import {
  variants,
  sizes,
  intents,
  colorsByIntent,
  defaultClasses,
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
    iconLeft?: IconName;
    iconRight?: IconName;
    label?: string;
    loading?: boolean;
    size: keyof typeof sizes;
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
  const defaultProps = {
    size: props.size === "lg" ? ("md" as const) : ("sm" as const),
    className: `${props.loading ? "animate-spin" : ""}`,
  };
  if (props.loading) {
    return <Icon icon="loading" {...defaultProps} />;
  }
  if (props.icon) {
    return <Icon icon={props.icon} {...defaultProps} />;
  }
  return null;
};

/**
 * React component implementing all the types of buttons used in Kaizen.
 * @param props.className Classname to add to the button.
 * @param props.color Defines the color of the button.
 * @param props.icon Name of the icon to use inside of the button.
 * @param props.intent Intent on the use of the button.
 * @param props.label Text label of the button.
 * @param props.loading State of the button when the action triggered by the button is loading.
 * @param props.size Size of the button.
 * @link https://bsport.supernova-docs.io/latest/components/button/component-overview-1SAZmv8Z
 * @link https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Proto-designSystem?node-id=218-12159&m=dev
 */
const Button: React.FC<Props> = ({
  className,
  color,
  fullWidth = false,
  iconLeft,
  iconRight,
  intent,
  label,
  loading,
  size,
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
  return (
    <button
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
