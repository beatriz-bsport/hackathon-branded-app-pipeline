import { type VariantProps, cva } from "class-variance-authority";
import React, { useMemo } from "react";

import Avatar, { sizes } from "#src/components/Avatar/Avatar";
import { IconName } from "#src/components/Icon";
import Menu from "#src/components/Menu";
import type { Item } from "#src/components/Menu/types";
import Popover from "#src/components/Popover";

const NUMBER_AVATAR_TO_DISPLAY = 3;

const MAX_EXTRA_AVATARS = 99;

const getInitials = (name: string) =>
  (name || "")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const variants = {
  size: {
    xs: "ml-[-5px]",
    sm: "ml-[-10px]",
    md: "ml-[-14px]",
    lg: "ml-[-30px]",
  },
};

const avatarGroup = cva("flex");

const avatarClasses = cva(
  "bg-surface-default border-stroke-strong pointer-events-none",
  {
    variants,
  },
);

const popoverClasses = cva("", {
  variants,
});

export type AvatarItem = {
  id: string;
  alt: string;
  iconName?: IconName;
  name: string;
  src: string;
};

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof avatarGroup> & {
    size: keyof typeof sizes;
    shape: "squared" | "round";
    data: AvatarItem[];
  };

/**
 * AvatarGroup
 *
 * Renders a group of avatars with a placeholder avatar indicating the number
 * of additional avatars not displayed. Supports custom shapes, sizes, and styles.
 * @param props.className - Additional class names for styling the avatar group container.
 * @param props.avatars - Array of avatar objects to display. Each avatar object should include:
 *   - initials - Initials to display on the avatar.
 *   - alt - Alt text for the avatar image.
 *   - iconName - Name of the icon to display if no image is provided.
 *   - src - URL of the avatar image.
 * @param props.shape - The shape of the avatars. Supported values: "circle", "square", etc.
 * @param props.size - The size of the avatars. Supported values: "sm", "md", "lg", etc.
 * @param props.props - Additional props to spread on the container element.
 */
const AvatarGroup: React.FC<AvatarGroupProps> = ({
  className,
  data,
  shape,
  size,
  ...props
}) => {
  const numberOfAvatarLeft = data.length - NUMBER_AVATAR_TO_DISPLAY;

  const renderedAvatars = useMemo(() => {
    if (!data?.length) return null;

    return data.slice(0, NUMBER_AVATAR_TO_DISPLAY).map((avatar, index) => {
      return (
        <Avatar
          key={avatar.id}
          shape={shape}
          size={size}
          initials={getInitials(avatar.name)}
          alt={avatar.alt}
          iconName={avatar.iconName}
          src={avatar.src}
          style={{ zIndex: index }}
          className={index === 0 ? avatarClasses() : avatarClasses({ size })}
        />
      );
    });
  }, [data, size, shape]);

  const avatarsLeft: Item[] = data
    .slice(NUMBER_AVATAR_TO_DISPLAY, data.length - 1)
    .map((avatar) => ({
      id: avatar.id,
      type: "text",
      avatar: { src: avatar.src, initials: getInitials(avatar.name) },
      label: avatar.name,
    }));

  const placeholderAvatar = useMemo(
    () =>
      numberOfAvatarLeft >= 1 ? (
        <Popover className={popoverClasses({ size })}>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Avatar
                shape={shape}
                size={size}
                style={{ zIndex: NUMBER_AVATAR_TO_DISPLAY }}
                className={"text-onsurface-weaker !bg-surface-default relative"}
                onClick={() => setIsPopoverOpened((prev) => !prev)}
                initials={`+${Math.min(MAX_EXTRA_AVATARS, numberOfAvatarLeft)}`}
              />
            )}
          </Popover.Anchor>
          <Popover.Content
            placement="bottom-left"
            className="max-h-component-popover-max overflow-auto"
          >
            {() => <Menu items={avatarsLeft} />}
          </Popover.Content>
        </Popover>
      ) : null,
    [numberOfAvatarLeft, avatarsLeft, shape, size],
  );

  if (!data?.length) return null;

  return (
    <div
      data-component="Kaizen-AvatarGroup"
      className={avatarGroup({ className })}
      {...props}
    >
      {renderedAvatars}
      {placeholderAvatar}
    </div>
  );
};

export default AvatarGroup;
