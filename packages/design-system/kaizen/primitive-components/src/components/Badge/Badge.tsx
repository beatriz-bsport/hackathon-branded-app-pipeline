import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import { SetRequired } from "type-fest";
import Icon, { IconName } from "../Icon";

const defaultClasses = [
  "flex items-center justify-center",
  "gap-element-2xs",
] as const;

const variants = {
  size: {
    sm: ["text-body-xs"],
    lg: ["text-body-md"],
  },
  sizeByType: {
    "text:sm": ["h-element-sm"],
    "text:lg": ["h-element-md"],
    "dot:sm": ["w-element-xs h-element-xs"],
    "dot:lg": ["w-element-sm h-element-sm"],
  },
  colorByType: {
    "text:default": [
      "bg-surface-default-weak",
      "border-stroke-strong",
      "text-onsurface-default",
    ],
    "text:main": [
      "bg-surface-main-weak",
      "border-stroke-main",
      "text-onsurface-main-strong",
    ],
    "text:critical": [
      "bg-surface-status-critical-weak",
      "border-stroke-status-critical",
      "text-onsurface-status-critical-strong",
    ],
    "dot:default": ["bg-surface-default-strong"],
    "dot:main": ["bg-surface-main-strong"],
    "dot:critical": ["bg-surface-status-critical-strong"],
  },
  buttonType: {
    text: ["w-fit", "border-stroke-thin rounded-circle", "px-xs"],
    dot: ["rounded-sm"],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const colors = ["default", "main", "critical"] as const;

type BadgeVariantProps = SetRequired<
  Omit<VariantProps<typeof badge>, "sizeByType" | "colorByType" | "buttonType">,
  "size"
>;

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  BadgeVariantProps & {
    text?: string;
    size: keyof typeof sizes;
    color: (typeof colors)[number];
    icon?: IconName;
  };

const badge = cva(defaultClasses, {
  variants,
});

/**
 * React component to render a badge with customizable text and icon.
 * This component is different from Indicator and is meant to be placed alongside other elements.
 * @param props.className Classname to add to the badge.
 * @param props.text Text to display in the badge. If the text is empty, the badge will be a dot.
 * @param props.size Size of the badge. Can be "sm" or "lg".
 * @param props.color Defines the color, background and border of the badge.
 * @param props.icon Optional icon to display on the right side of the badge.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-badge--docs
 */
const Badge: React.FC<BadgeProps> = ({
  className,
  text,
  size,
  color,
  icon,
  ...props
}) => {
  const buttonType = text?.length || icon ? "text" : "dot";
  const iconSize = size === "lg" ? "sm" : "xs";

  return (
    <div
      className={badge({
        className,
        size,
        sizeByType: `${buttonType}:${size}` as keyof typeof variants.sizeByType,
        colorByType:
          `${buttonType}:${color}` as keyof typeof variants.colorByType,
        buttonType,
      })}
      {...props}
    >
      <span className="leading-xs">{text}</span>
      {!!icon && <Icon icon={icon} size={iconSize} />}
    </div>
  );
};

Badge.displayName = "KaizenBadge";

export default Badge;
