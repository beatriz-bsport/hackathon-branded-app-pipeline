import { type VariantProps, cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React, { useMemo } from "react";

import { TYPOGRAPHY_COLORS } from "#src/constants";

const defaultClasses = [] as const;

const variants = {
  size: {
    display: ["text-body-display", "leading-xl", "space-y-md"],
    xl: ["text-body-xl", "leading-lg", "space-y-md"],
    lg: ["text-body-lg", "leading-md", "space-y-md"],
    md: ["text-body-md", "leading-sm", "space-y-sm"],
    sm: ["text-body-sm", "leading-xs", "space-y-xs"],
  },
  color: {
    [TYPOGRAPHY_COLORS.main]: ["text-onsurface-main-weak"],
    [TYPOGRAPHY_COLORS.default]: ["text-onsurface-default"],
    [TYPOGRAPHY_COLORS.info]: ["text-onsurface-status-info-weak"],
    [TYPOGRAPHY_COLORS.positive]: ["text-onsurface-status-positive-weak"],
    [TYPOGRAPHY_COLORS.critical]: ["text-onsurface-status-critical-weak"],
    [TYPOGRAPHY_COLORS.warning]: ["text-onsurface-status-warning-weak"],
    [TYPOGRAPHY_COLORS.onstrong]: ["text-onsurface-default-onstrong"],
    [TYPOGRAPHY_COLORS.weak]: ["text-onsurface-weak"],
    [TYPOGRAPHY_COLORS.weaker]: ["text-onsurface-weaker"],
    [TYPOGRAPHY_COLORS.disabled]: ["text-onsurface-disabled", "opacity-sm"],
    [TYPOGRAPHY_COLORS.inherit]: ["text-inherit"],
  },
  weight: {
    weaker: ["font-weaker"],
    weak: ["font-weak"],
    strong: ["font-strong"],
    stronger: ["font-stronger"],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const colors = mapValues(variants.color, (_, key) => key) as {
  [key in keyof typeof variants.color]: key;
};
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};
export const htmlVariants = {
  p: "p",
  span: "span",
} as const;

const body = cva(defaultClasses, {
  variants,
});

export type BodyColor = keyof typeof TYPOGRAPHY_COLORS;

export type BodyProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof body> & {
    htmlVariant?: keyof typeof htmlVariants;
    color?: BodyColor;
  };

/**
 * @param props.className Classname to add to the body component.
 * @param props.htmlVariant HTML element to render. Can be "p" or "span".
 * @param props.size Size of the body text. Can be "sm", "md", or "lg".
 * @param props.color Color of the body text.
 * @param props.weight Weight of the body text. Can be "weak" or "strong".
 */
const Body: React.FC<BodyProps> = ({
  className,
  htmlVariant = "p",
  size,
  color = "default",
  weight,
  ...props
}) => {
  const Component = useMemo(() => {
    return (props: React.HTMLAttributes<HTMLParagraphElement>) =>
      React.createElement(htmlVariant, props);
  }, [htmlVariant]);
  return (
    <Component
      data-component="Kaizen-Body"
      className={body({ className, size, color, weight })}
      {...props}
    />
  );
};

Body.displayName = "KaizenBody";

export default Body;
