import { cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React from "react";

const defaultClasses = ["border-stroke-divider", "flex"] as const;

const variants = {
  orientation: {
    horizontal: ["w-full", "h-[1px]"],
    vertical: ["min-h-full", "w-[1px]"],
  },
  weight: {
    "extra-thin": [],
    thin: ["border-stroke-thin"],
    regular: ["border-stroke-regular"],
  },
} as const;

const divider = cva(defaultClasses, {
  variants,
  defaultVariants: {
    orientation: "horizontal",
    weight: "thin",
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      weight: "extra-thin",
      className: "border-t-stroke-thin",
    },
    {
      orientation: "vertical",
      weight: "extra-thin",
      className: "border-l-stroke-thin",
    },
  ],
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
 * @param props.weight Weight of the divider line. Can be "extra-thin", "thin" or "regular".
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-divider--docs
 */
export type DividerProps = React.HTMLAttributes<HTMLSpanElement> & {
  orientation?: keyof typeof orientations;
  weight?: keyof typeof weights;
};

const Divider: React.FC<DividerProps> = ({
  className,
  orientation,
  weight,
  ...props
}) => {
  return (
    <span
      data-component="Kaizen-Divider"
      className={divider({ className, orientation, weight })}
      {...props}
    />
  );
};

Divider.displayName = "KaizenDivider";

export default Divider;
