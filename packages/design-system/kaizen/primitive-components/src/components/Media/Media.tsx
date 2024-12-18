import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const variants = {
  size: {
    sm: "h-element-xl rounded-sm",
    md: "h-element-2xl rounded-md",
    lg: "h-element-3xl rounded-lg",
    xl: "h-element-4xl rounded-lg",
  },
  ratio: {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "3:2": "aspect-[3/2]",
  },
};

export const sizes = variants.size;

export const ratios = variants.ratio;

const media = cva("object-cover", {
  variants,
  compoundVariants: [
    {
      size: undefined,
      class: "rounded-xl",
    },
    {
      ratio: undefined,
      class: "aspect-auto",
    },
  ],
});

export type MediaProps = React.HTMLAttributes<HTMLImageElement> &
  VariantProps<typeof media> & {
    src: string;
    alt: string;
    size?: keyof typeof variants.size;
    ratio?: keyof typeof variants.ratio;
  };

/**
 * A Media component that renders an image with customizable size, aspect ratio,
 * and additional styling options.
 * 
 * @param props.src - The image source URL.
 * @param props.alt - The alternative text for the image.
 * @param props.size - The size variant.
 * @param props.ratio - The aspect ratio variant.
 * @param props.className - Additional class names.

 */
const Media: React.FC<MediaProps> = ({
  className,
  alt,
  ratio,
  size,
  src,
  ...props
}) => {
  return (
    <img
      className={media({ className, size, ratio })}
      alt={alt}
      src={src}
      {...props}
    />
  );
};

Media.displayName = "KaizenMedia";

export default Media;
