import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import React, { useMemo } from "react";

import Icon, { IconName } from "#src/components/Icon";

const defaultClasses = [
  "flex items-center justify-center",
  "text-center",
  "text-onsurface-default",
  "font-stronger",
  "overflow-hidden",
  "border-stroke-default",
  "cursor-pointer",
  "active:shadow-action-default-hovered",
  "hover:border-stroke-action-default-hovered",
] as const;

const variants = {
  size: {
    xs: ["h-md w-md", "border-stroke-thin", "text-[0.375rem]", "leading-2xs"],
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
    iconName?: IconName;
    initials?: string;
    actionableIconName?: IconName;
    src?: string;
    alt?: string;
  };

const getSquaredCircle = (size: keyof typeof variants.size) => {
  if (size === "sm" || size === "xs") return "rounded-xs";
  if (size === "md") return "rounded-sm";
  return "rounded-md";
};

const getIconSize = (size: keyof typeof variants.size) => {
  if (size === "xs") return "xs";
  // md and sm variant have the same icon size
  return size === "lg" ? "lg" : "sm";
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
 * @param props.iconName The name of the icon to display.
 * @param props.actionableIconName The name of the icon to display when hovering actionable Avatar.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-avatar--docs
 */
const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt,
  size = "md",
  shape,
  onClick,
  iconName,
  initials,
  actionableIconName,
  ...props
}) => {
  const shapeStyle =
    shape === "round" ? "rounded-circle" : getSquaredCircle(size);

  const renderedImgOrIcon = useMemo(() => {
    // Render the image based on src if provided
    if (src) return <img src={src} alt={alt || ""} />;

    // If src is not provided, check if an iconName exists, to render it easily
    if (iconName) return <Icon icon={iconName} size={getIconSize(size)} />;

    // If neither src nor iconName are provided, check if initials exist to render them instead.
    if (initials) {
      return initials.slice(0, 3).toUpperCase();
    }
    return null;
  }, [src, alt, iconName, size, initials]);

  // Whether an action can be performed
  const isActionable = !!onClick && src;

  const renderedEditIcon = useMemo(
    () => (
      <Icon
        icon={actionableIconName || "user-edit"}
        size={getIconSize(size)}
        className="text-onsurface-default-onstrong"
      />
    ),
    [size, actionableIconName],
  );

  // Tailwind classes to have a consistent transition over the different children
  const transitionClasses = "transition ease-in-out duration-default";

  return (
    <div
      data-component="Kaizen-Avatar"
      className={classNames(
        avatar({ className, size }),
        shapeStyle,
        transitionClasses,
        {
          "bg-surface-default-weak": !src,
          "group relative": isActionable,
        },
      )}
      onClick={onClick}
      {...props}
    >
      {/* Main picture or icon, on which a blur may be apply on hover for actionable Avatar */}
      <div
        className={classNames("relative z-0", transitionClasses, {
          "group-hover:blur-sm": isActionable,
        })}
      >
        {renderedImgOrIcon}
      </div>

      {/* Edit Icon with darkening background displayed on hover for actionable Avatar */}
      {isActionable && (
        <div
          className={classNames(
            "absolute top-[0] bottom-[0] left-[0] right-[0]",
            "flex items-center justify-center",
            "z-10 opacity-transparent",
            "group-hover:opacity-[100] group-hover:bg-surface-blanket",
            transitionClasses,
          )}
        >
          {renderedEditIcon}
        </div>
      )}
    </div>
  );
};

Avatar.displayName = "KaizenAvatar";

export default Avatar;
