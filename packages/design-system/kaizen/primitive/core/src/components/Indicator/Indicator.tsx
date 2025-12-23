import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import React from "react";
import { SetRequired } from "type-fest";

import Body from "#src/components/Body";

const defaultClasses = [
  "flex items-center justify-center",
  "gap-element-2xs",
  "leading-xs",
] as const;

const variants = {
  position: {
    top: ["top-[0]", "-translate-y-1/2"],
    bottom: ["bottom-[0]", "translate-y-1/2"],
  },
  size: {
    sm: ["p-2xs"],
    lg: ["p-xs"],
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
    text: ["w-fit", "border-stroke-thin rounded-circle"],
    dot: ["rounded-sm"],
  },
} as const;

export const positions = mapValues(variants.position, (_, key) => key) as {
  [key in keyof typeof variants.position]: key;
};
export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const colors = ["default", "main", "critical"] as const;

type NonNullableVariants<T> = {
  [P in keyof T]: Exclude<T[P], null | undefined>;
};

type IndicatorVariantProps = SetRequired<
  Omit<
    NonNullableVariants<VariantProps<typeof indicator>>,
    "sizeByType" | "colorByType" | "buttonType"
  >,
  "position" | "size"
>;

export type IndicatorProps = React.HTMLAttributes<HTMLDivElement> &
  IndicatorVariantProps & {
    value?: number;
    color: (typeof colors)[number];
  };

const indicator = cva(defaultClasses, {
  variants,
});

/**
 * React component to display an Indicator for numeric notifications or status updates, appearing beside the content it accompanies.
 * @param props.className Classname to add to the component.
 * @param props.value Value to display in the component. If > 99, will display "99+".
 * @param props.position Position of the indicator when children are provided. Can be "top" or "bottom", always on the right side.
 * @param props.size Size of the component. Can be "sm" or "lg".
 * @param props.color Color of the component.
 * @param props.children Component(s) to display along with the indicator.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-indicator--docs
 */
const Indicator: React.FC<IndicatorProps> = ({
  className,
  value,
  position,
  size,
  color,
  children,
  ...props
}) => {
  /* Max value not customizable */
  const numberToRender = value && value > 99 ? "99+" : value || undefined;
  const positionIndicator = "absolute right-[0] translate-x-1/2";
  const buttonType = value ? "text" : "dot";

  return (
    <div
      data-component="Kaizen-Indicator"
      className="relative inline-block align-top text-onsurface-default"
      {...props}
    >
      {children}
      <div
        className={classNames(
          indicator({
            className,
            position: children ? position : undefined,
            size,
            sizeByType:
              `${buttonType}:${size}` as keyof typeof variants.sizeByType,
            colorByType:
              `${buttonType}:${color}` as keyof typeof variants.colorByType,
            buttonType,
          }),
          children ? positionIndicator : "",
        )}
      >
        <Body
          htmlVariant="span"
          color="inherit"
          size={size === "lg" ? "md" : "sm"}
        >
          {numberToRender}
        </Body>
      </div>
    </div>
  );
};

Indicator.displayName = "KaizenIndicator";

export default Indicator;
