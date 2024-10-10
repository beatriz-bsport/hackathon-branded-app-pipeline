import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import { SetRequired } from "type-fest";
import Icon, { IconName } from "../Icon";

const defaultClasses = [
  "flex items-center justify-center",
  "gap-element-2xs",
  "absolute -top-xs -right-sm",
] as const;

const variants = {
  size: {
    sm: ["text-body-xs", "leading-2xs"],
    lg: ["text-body-md", "leading-xs"],
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
      "bg-surface-status-weak",
      "border-stroke-status-critical",
      "text-onsurface-status-critical-strong",
    ],
    "dot:default": ["bg-surface-default-strong"],
    "dot:main": ["bg-surface-main-strong"],
    "dot:critical": ["bg-surface-status-critical-strong"],
  },
  buttonType: {
    text: ["w-fit", "border-stroke-thin rounded-circle", "p-xs"],
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
    text: string;
    size: keyof typeof sizes;
    color: (typeof colors)[number];
    icon?: IconName;
  };

const badge = cva(defaultClasses, {
  variants,
});

const Badge: React.FC<BadgeProps> = ({
  className,
  text,
  size,
  color,
  icon,
  children,
  ...props
}) => {
  const buttonType = text.length || icon ? "text" : "dot";
  const iconSize = size === "lg" ? "sm" : "xs";

  return (
    <div style={{ position: "relative", display: "inline-block" }} {...props}>
      {children}
      <div
        className={badge({
          className,
          size,
          sizeByType:
            `${buttonType}:${size}` as keyof typeof variants.sizeByType,
          colorByType:
            `${buttonType}:${color}` as keyof typeof variants.colorByType,
          buttonType,
        })}
      >
        {text}
        {!!icon && <Icon icon={icon} size={iconSize} />}
      </div>
    </div>
  );
};

Badge.displayName = "KaizenBadge";

export default Badge;
