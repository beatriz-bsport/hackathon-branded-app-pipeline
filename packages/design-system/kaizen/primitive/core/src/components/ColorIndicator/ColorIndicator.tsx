import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const variants = {
  type: {
    line: "h-full",
    block: "rounded-xs",
  },
  sizeByType: {
    "line-2xs": "w-2xs",
    "line-xs": "w-2xs",
    "line-sm": "w-2xs",
    "line-md": "w-xs",
    "line-lg": "w-sm",
    "block-2xs": "h-xs w-xs",
    "block-xs": "h-sm w-sm",
    "block-sm": "h-md w-md",
    "block-md": "h-lg w-lg",
    "block-lg": "h-xl w-xl",
  },
} as const;

const colorIndicator = cva("flex", { variants });

export type ColorIndicatorProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof colorIndicator> & {
    color: string;
    type: "line" | "block";
    size: "2xs" | "xs" | "sm" | "md" | "lg";
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
  size,
  ...props
}) => {
  return (
    <div
      data-component="Kaizen-ColorIndicator"
      className={colorIndicator({
        type,
        className,
        sizeByType: `${type}-${size}`,
      })}
      style={{ backgroundColor: color }}
      {...props}
    />
  );
};

ColorIndicator.displayName = "KaizenColorIndicator";

export default ColorIndicator;
