import { cva } from "class-variance-authority";
import React from "react";

export const indicatorClasses = [
  "w-2xs h-full",
  "rounded-xl",
  "bg-onsurface-main-weak",
  "opacity-transparent",
  "group-disabled:opacity-transparent",
  "group-hover:opacity-[100]",
  "group-focus-visible:opacity-[100]",
  "group-active:opacity-[100] group-active:bg-onsurface-main-strong ",
  "transition-opacity ease-out duration-default",
] as const;

export const indicatorVariants = {
  disabled: {
    true: [
      // For button
      "group-disabled:opacity-transparent",
      // For other menu items components
      "opacity-transparent",
    ],
    false: [],
  },
  checked: {
    true: [
      "opacity-transparent",
      "group-disabled:opacity-transparent",
      "group-hover:opacity-transparent",
      "group-focus-visible:opacity-transparent",
      "group-active:opacity-transparent",
    ],
    false: [],
  },
};

const indicator = cva(indicatorClasses, {
  variants: indicatorVariants,
});

export type IndicatorProps = {
  disabled?: boolean;
};

const Indicator: React.FC<IndicatorProps> = ({ disabled }) => {
  return <div className={indicator({ disabled })} />;
};

export default Indicator;
