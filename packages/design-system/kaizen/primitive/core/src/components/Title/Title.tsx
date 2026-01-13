import { type VariantProps, cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React, { useMemo } from "react";
import type { SetRequired } from "type-fest";

import { TYPOGRAPHY_COLORS } from "#src/constants";

const defaultClasses = [] as const;

const variants = {
  htmlVariant: {
    h1: ["text-title-xl", "leading-xl"],
    h2: ["text-title-lg", "leading-xl"],
    h3: ["text-title-md", "leading-md"],
    h4: ["text-title-sm", "leading-md"],
    h5: ["text-title-xs", "leading-sm"],
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
    [TYPOGRAPHY_COLORS.disabled]: ["text-onsurface-default", "opacity-sm"],
    [TYPOGRAPHY_COLORS.inherit]: ["text-inherit"],
  },
  weight: {
    weaker: ["font-weaker"],
    weak: ["font-weak"],
    strong: ["font-strong"],
    stronger: ["font-stronger"],
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

/**
 * The Title component is a fundamental component used to render text with various
 * styling options, including different colors, HTML variants, and font weights.
 * @param props.className Classname to add to the title component.
 * @param props.htmlVariant HTML heading element to render. Can be "h1", "h2", "h3", "h4", or "h5".
 * @param props.color Color of the title text.
 * @param props.weight Weight of the title text. Can be "weak" or "strong".
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-title--docs
 */
const Title: React.FC<TitleProps> = ({
  className,
  htmlVariant,
  color = "inherit",
  weight,
  ...props
}) => {
  const TitleComponent = useMemo(() => {
    return (props: React.HTMLAttributes<HTMLHeadingElement>) =>
      React.createElement(htmlVariant || "h5", props);
  }, [htmlVariant]);
  return (
    <TitleComponent
      data-component="Kaizen-Title"
      role="heading"
      className={title({ className, color, htmlVariant, weight })}
      {...props}
    />
  );
};

Title.displayName = "KaizenTitle";

export const htmlVariants = mapValues(
  variants.htmlVariant,
  (_, key) => key,
) as {
  [key in keyof typeof variants.htmlVariant]: key;
};
export const colors = mapValues(variants.color, (_, key) => key) as {
  [key in keyof typeof variants.color]: key;
};
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};

export default Title;
