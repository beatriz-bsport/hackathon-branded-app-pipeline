import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const variants = {
  type: {
    line: "h-full w-2xs",
    block: "h-sm w-sm rounded-xs",
  },
} as const;

const colorIndicator = cva("flex", { variants });

export type ColorIndicatorProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof colorIndicator> & {
    color: string;
    type: "line" | "block";
  };

/**
 *
 * Render a visual color indication that can be either a line or a block
 * As a line, it fills the entire height of the container.
 * @param props.className Classname to add to the color indicator.
 * @param props.color The color to display in the indicator. Can be any valid CSS color value (hex, rgb, etc).
 * @param props.type The type of indicator to display. Can be either "line" or "block".
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-colorindicator--docs
 */
const ColorIndicator: React.FC<ColorIndicatorProps> = ({
  className,
  color,
  type,
  ...props
}) => {
  return (
    <div
      className={colorIndicator({ type, className })}
      style={{ backgroundColor: color }}
      {...props}
    />
  );
};

ColorIndicator.displayName = "KaizenColorIndicator";

export default ColorIndicator;
