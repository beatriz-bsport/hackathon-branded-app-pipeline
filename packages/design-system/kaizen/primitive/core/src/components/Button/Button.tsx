import { cva, cx } from "class-variance-authority";
import React, { useMemo } from "react";

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

/**
 * Button renders a `<button>`, or an `<a>` styled identically when `href` is
 * provided. A single flat set of props is accepted in both modes:
 * - with `href`, the button-specific props (`disabled`, `loading`) are ignored;
 * - without `href`, the anchor-specific props (`target`, ...) are
 *   ignored.
 *
 * Event handlers are typed against `HTMLButtonElement` for consumer
 * convenience, regardless of the rendered element.
 */
type BaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target"> & {
    label: string;
    size: keyof typeof sizes;
    loading?: boolean;
    fullWidth?: boolean;
  };

type IntentProps =
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
    };

// Regular button with optional icons on left/right
type RegularButtonProps = BaseProps &
  IntentProps & {
    kind?: "default";
    iconLeft?: IconName;
    iconRight?: IconName;
    icon?: undefined;
  };

// Icon-only button where label is used as aria-label
type IconOnlyButtonProps = BaseProps &
  IntentProps & {
    kind: "icon-button";
    icon: IconName;
    iconLeft?: undefined;
    iconRight?: undefined;
  };

export type Props = RegularButtonProps | IconOnlyButtonProps;

/**
 * Function used in useMemo to render icons
 */
const IconToRender = (props: {
  className?: string;
  icon?: IconName;
  size: keyof typeof sizes;
  loading?: boolean;
  label: string | undefined | null;
}) => {
  if (!props.size) {
    return null;
  }

  const iconSize = props.size === "lg" ? "md" : "sm";

  if (props.loading) {
    return <Loader size={iconSize} />;
  }

  if (props.icon) {
    return (
      <Icon
        className={props.className ?? ""}
        icon={props.icon}
        size={iconSize}
      />
    );
  }

  return null;
};

/**
 * React component implementing all the types of buttons used in Kaizen.
 * @param props.className Classname to add to the button.
 * @param props.label Text label of the button (or aria-label for icon-button kind).
 * @param props.kind Button kind: "default" (with visible label) or "icon-button" (label used as aria-label only).
 * @param props.intent Intent on the use of the button.
 * @param props.color Defines the color of the button.
 * @param props.size Size of the button.
 * @param props.loading Loading state — shows a spinner and sets aria-busy. Ignored on link buttons (`href`).
 * @param props.disabled Disabled state. Ignored on link buttons (`href`).
 * @param props.icon Name of the icon to use (for icon-button kind).
 * @param props.iconLeft Name of the icon to use on the left side of the button (for default kind).
 * @param props.iconRight Name of the icon to use on the right side of the button (for default kind).
 * @param props.fullWidth Boolean indicating if the button should take the full width of its container.
 * @param props.href When provided, renders an `<a>` element styled as a button. Use this when the action
 *   navigates rather than triggers in-page behaviour (avoids invalid `<a><button>` nesting).
 *   `disabled` and `loading` are ignored on link buttons.
 * @param props.target HTML `target` attribute forwarded to the `<a>` element (link button only).
 *   When set to `"_blank"`, `rel="noopener noreferrer"` is injected automatically.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-button--docs
 */
const Button: React.FC<Props> = ({
  className,
  label,
  kind = "default",
  intent,
  color,
  size,
  loading = false,
  fullWidth = false,
  icon,
  iconLeft,
  iconRight,
  "aria-label": ariaLabelProp,
  // Anchor-specific props, only forwarded when rendering an <a>
  href,
  target,
  rel,
  // Button-specific props, only forwarded when rendering a <button>
  disabled,
  ...otherProps
}) => {
  const isLink = href !== undefined;
  // `loading` is a button-only behaviour, ignored on link buttons
  const showLoading = isLink ? false : loading;

  // For icon-button kind, use the single icon prop
  // For default kind, use iconLeft/iconRight
  const leftIcon = kind === "icon-button" ? icon : iconLeft;
  const rightIcon = kind === "icon-button" ? undefined : iconRight;

  const renderedIconLeft = useMemo(
    () => (
      <IconToRender
        icon={leftIcon}
        size={size}
        label={label}
        loading={showLoading}
      />
    ),
    [showLoading, leftIcon, size, label],
  );

  const renderedIconRight = useMemo(
    () => (
      <IconToRender
        className={cx({ "ml-[auto]": fullWidth })}
        icon={iconRight}
        size={size}
        label={label}
        loading={false}
      />
    ),
    [rightIcon, size, label],
  );

  const labelToRender = useMemo(() => {
    // For icon-button kind, don't render the label (it's used for aria-label only)
    if (kind === "icon-button") {
      return null;
    }

    return label ? (
      <span className="px-xs truncate min-w-0">{label}</span>
    ) : null;
  }, [label, kind]);

  // For icon-button kind, always use the label as aria-label
  // For default kind, use custom aria-label if provided, otherwise use label
  const ariaLabel = kind === "icon-button" ? label : (ariaLabelProp ?? label);

  const buttonClasses = button({
    className,
    intent,
    size,
    colorByIntent: `${intent}-${color}` as keyof typeof variants.colorByIntent,
    iconVariant:
      kind === "icon-button"
        ? (`icon-only-${size}` as `icon-only-${keyof typeof variants.size}`)
        : (`default-${size}` as `default-${keyof typeof variants.size}`),
    widthMode: fullWidth ? "full-width" : "default",
  });

  const sharedProps = {
    "data-component": "Kaizen-Button",
    "aria-label": ariaLabel,
    className: buttonClasses,
    ...otherProps,
  };

  if (href != undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        // Shared DOM props are typed against HTMLButtonElement for consumer
        // convenience, but at runtime this <a> is the element receiving them
        {...(sharedProps as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {renderedIconLeft}
        {labelToRender}
        {renderedIconRight}
      </a>
    );
  }

  return (
    <button
      role="button"
      aria-busy={loading ? "true" : "false"}
      aria-disabled={disabled ? "true" : "false"}
      disabled={disabled}
      type="button"
      {...sharedProps}
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
