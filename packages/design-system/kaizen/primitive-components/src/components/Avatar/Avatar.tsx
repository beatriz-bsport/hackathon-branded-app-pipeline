import React, { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";

const defaultClasses = [
  "flex items-center justify-center",
  "text-center",
  "overflow-hidden",
  "border-stroke-default",
  "border-opacity-md",
  "cursor-pointer",
  "active:shadow-action-default-hovered",
] as const;

const variants = {
  size: {
    sm: ["h-lg w-lg", "border-stroke-thin", "text-body-xs", "leading-2xs"],
    md: [
      "h-xl w-xl",
      "border-stroke-regular",
      "text-body-sm font-semibold",
      "leading-xs",
    ],
    lg: [
      "h-2xl w-2xl",
      "border-stroke-regular",
      "text-title-md font-semibold",
      "leading-md",
    ],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};

const avatar = cva(defaultClasses, {
  variants,
});

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof avatar> & {
    size?: keyof typeof variants.size;
    shape: "squared" | "round";
    onClick?: () => void;
  } & (
    | {
        src: string;
        alt: string;
      }
    | {
        children: React.ReactNode;
        src?: never;
        alt?: never;
      }
  );

const getSquaredCircle = (size: keyof typeof variants.size) => {
  if (size === "sm") return "rounded-xs";
  if (size === "md") return "rounded-sm";
  return "rounded-md";
};

const getIconInitialsPadding = (size: keyof typeof variants.size) => {
  if (size === "sm") return "p-xs";
  if (size === "md") return "p-sm";
  return "p-md";
};

/**
 * A component that displays an avatar, which can be an image or an icon.
 * It allows to customize the size and shape of the avatar.
 * @param props.className Classname to add to the avatar container.
 * @param props.src The URL of the image to display.
 * @param props.alt The alt text for the image.
 * @param props.size The size of the avatar. Can be "sm", "md", or "lg".
 * @param props.shape The shape of the avatar. Can be "squared" or "round".
 * @param props.onClick A callback function to call when the avatar is clicked.
 * @param props.children The icon to display when no image is provided through src and alt.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-avatar--docs
 */
const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt,
  size = "md",
  shape,
  onClick,
  children,
  ...props
}) => {
  const shapeStyle =
    shape === "round" ? "rounded-circle" : getSquaredCircle(size);
  const iconInitialStyle = !src
    ? `bg-surface-default-weak ${getIconInitialsPadding(size)}`
    : "";

  const renderedImgOrIcon = useMemo(() => {
    return src ? <img src={src} alt={alt || ""} /> : children;
  }, [src, alt, children]);

  return (
    <div
      className={`${avatar({ className, size })} ${shapeStyle} ${iconInitialStyle}`}
      onClick={onClick}
      {...props}
    >
      {renderedImgOrIcon}
    </div>
  );
};

Avatar.displayName = "KaizenAvatar";

export default Avatar;
