import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { mapValues } from "lodash";

const defaultClasses = ["border-stroke-divider", "flex"] as const;

const variants = {
  orientation: {
    horizontal: ["w-full", "h-[1px]", "flex-row"],
    vertical: ["h-full", "w-[1px]", "flex-col"],
  },
  weight: {
    thin: ["border-stroke-thin"],
    regular: ["border-stroke-regular"],
  },
} as const;

const divider = cva(defaultClasses, {
  variants,
});

export const orientations = mapValues(
  variants.orientation,
  (_, key) => key,
) as {
  [key in keyof typeof variants.orientation]: key;
};
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};

/**
 * The Divider component is a visual element used to separate content into distinct sections
 * styling options, including different orientations and weights.<br>
 * @param props.className Classname to add to the body component.
 * @param props.orientation Direction of the divider can be "horizontal" or "vertical".
 * @param props.weight Weight of the divider line. Can be "thin" or "regular".
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-divider--docs
 */
export type DividerProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof divider>;

const Divider: React.FC<DividerProps> = ({
  className,
  orientation,
  weight,
  ...props
}) => {
  return (
    <span
      className={divider({ className, orientation, weight })}
      {...props}
    ></span>
  );
};

Divider.displayName = "KaizenDivider";

export default Divider;
