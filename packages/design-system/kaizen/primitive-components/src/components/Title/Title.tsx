import type { SetRequired } from "type-fest";
import React, { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import { TYPOGRAPHY_COLORS } from "../../constants";

const defaultClasses = [] as const;

const variants = {
  htmlVariant: {
    h1: ["text-title-xl", "leading-xl"],
    h2: ["text-title-lg", "leading-lg"],
    h3: ["text-title-md", "leading-md"],
    h4: ["text-title-sm", "leading-sm"],
    h5: ["text-title-xs", "leading-xs"],
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
    [TYPOGRAPHY_COLORS.inherit]: ["text-inherit"],
  },
  weight: {
    weak: ["font-weak"],
    strong: ["font-stronger"],
  },
} as const;

const title = cva(defaultClasses, {
  variants,
});

type TitleVariantsProps = SetRequired<
  VariantProps<typeof title>,
  "htmlVariant"
>;

export type TitleProps = React.HTMLAttributes<HTMLHeadingElement> &
  TitleVariantsProps &
  React.PropsWithChildren;

const Title: React.FC<TitleProps> = ({
  className,
  color = "inherit",
  htmlVariant,
  weight,
  ...props
}) => {
  const TitleComponent = useMemo(() => {
    return (props: React.HTMLAttributes<HTMLHeadingElement>) =>
      React.createElement(htmlVariant || "h5", props);
  }, [htmlVariant]);
  return (
    <TitleComponent
      className={title({ className, color, htmlVariant, weight })}
      {...props}
    />
  );
};

Title.displayName = "KaizenTitle";

/**
 * HTML variants available for a title
 */
export const htmlVariants = mapValues(
  variants.htmlVariant,
  (_, key) => key,
) as {
  [key in keyof typeof variants.htmlVariant]: key;
};
/**
 * Colors available for a title
 */
export const colors = mapValues(variants.color, (_, key) => key) as {
  [key in keyof typeof variants.color]: key;
};
/**
 * Colors available for a title
 */
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};

export default Title;
