import { type VariantProps, cva } from "class-variance-authority";
import React, { useState } from "react";

import Icon from "../Icon";

const variants = {
  size: {
    sm: "max-h-element-xl rounded-sm",
    md: "max-h-element-2xl rounded-md",
    lg: "max-h-element-3xl rounded-lg",
    xl: "max-h-element-4xl rounded-lg",
  },
  ratio: {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "3:2": "aspect-[3/2]",
  },
  isLoaded: {
    true: "opacity-[100]",
    false: "opacity-transparent",
  },
};

export const sizes = variants.size;

export const ratios = variants.ratio;

const media = cva("object-cover transition-opacity duration-default", {
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

const placeholder = cva(
  "bg-surface-default-weak flex justify-center items-center",
  {
    variants,
    compoundVariants: [
      {
        size: undefined,
        class: "rounded-xl",
      },
      {
        ratio: undefined,
        class: "aspect-square",
      },
    ],
  },
);

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
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (!src || hasError)
    return (
      <div
        data-component="Kaizen-Media"
        className={placeholder({ className, size, ratio })}
      >
        <Icon
          icon={hasError ? "image-x" : "image-03"}
          className="inset-0 h-1/3 w-1/3 max-h-icon-xl text-onsurface-weaker"
        />
      </div>
    );

  return (
    <img
      className={media({ className, size, ratio, isLoaded })}
      alt={alt}
      src={src}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

Media.displayName = "KaizenMedia";

export default Media;
