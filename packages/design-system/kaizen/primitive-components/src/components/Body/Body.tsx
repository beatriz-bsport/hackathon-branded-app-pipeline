import React, { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import { TYPOGRAPHY_COLORS } from "../../constants";

const defaultClasses = [] as const;

const variants = {
  size: {
    lg: ["text-body-lg", "leading-md", "space-y-md"],
    md: ["text-body-md", "leading-sm", "space-y-sm"],
    sm: ["text-body-sm", "leading-xs", "space-y-xs"],
  },
  color: {
    [TYPOGRAPHY_COLORS.default]: ["text-onsurface-default"],
    [TYPOGRAPHY_COLORS.info]: ["text-onsurface-status-info-weak"],
    [TYPOGRAPHY_COLORS.positive]: ["text-onsurface-status-positive-weak"],
    [TYPOGRAPHY_COLORS.critical]: ["text-onsurface-status-critical-weak"],
    [TYPOGRAPHY_COLORS.warning]: ["text-onsurface-status-warning-weak"],
    [TYPOGRAPHY_COLORS.onstrong]: ["text-onsurface-default-onstrong"],
    [TYPOGRAPHY_COLORS.weak]: ["text-onsurface-weak"],
    [TYPOGRAPHY_COLORS.weaker]: ["text-onsurface-weaker"],
    [TYPOGRAPHY_COLORS.disabled]: ["text-onsurface-disabled", "opacity-sm"],
  },
  weight: {
    weak: ["font-weak"],
    strong: ["font-strong"],
  },
} as const;

/**
 * Colors available for a body text.
 */
export const colors = mapValues(variants.color, (_, key) => key) as {
  [key in keyof typeof variants.color]: key;
};
/**
 * Colors available for a body text.
 */
export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
/**
 * Font weights available for a body text.
 */
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};
/**
 * HTML Variants available for a body text.
 */
export const htmlVariants = {
  p: "p",
  span: "span",
} as const;

const body = cva(defaultClasses, {
  variants,
});

export type BodyProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof body> & {
    htmlVariant: keyof typeof htmlVariants;
  };

const Body: React.FC<BodyProps> = ({
  className,
  htmlVariant,
  size,
  color,
  weight,
  ...props
}) => {
  const Component = useMemo(() => {
    return (props: React.HTMLAttributes<HTMLParagraphElement>) =>
      React.createElement(htmlVariant, props);
  }, [htmlVariant]);
  return (
    <Component
      className={body({ className, size, color, weight })}
      {...props}
    />
  );
};

Body.displayName = "KaizenBody";

export default Body;
