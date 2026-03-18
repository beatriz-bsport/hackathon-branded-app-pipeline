import type { FC } from "react";

import {
  Avatar,
  AvatarProps,
  Body,
  type BodyProps,
  cx,
} from "@bsport/kaizen-primitive-core";

const DEFAULT_AVATAR_PATTERN = "default_profile_picture";

function isDefaultAvatar(src?: string) {
  return !src || src.includes(DEFAULT_AVATAR_PATTERN);
}

type AvatarWithNameProps = {
  name?: string;
  avatarSrc?: string;
  avatarConfig?: Omit<AvatarProps, "src">;
  bodyConfig?: BodyProps;
  href?: string;
};

export const AvatarWithName: FC<AvatarWithNameProps> = ({
  name = "",
  avatarSrc,
  avatarConfig = {},
  bodyConfig = {},
  href,
}) => {
  const initials = name
    .split(" ")
    .map((part) => (part.length > 0 ? part[0] : ""))
    .join("")
    .toUpperCase();

  const displayAvatar = !isDefaultAvatar(avatarSrc);

  const content = (
    <>
      <Avatar
        size="md"
        shape="round"
        {...avatarConfig}
        src={displayAvatar ? avatarSrc : undefined}
        alt={name}
        initials={initials}
      />
      <Body {...bodyConfig}>{name}</Body>
    </>
  );

  if (href) {
    // Note: use <a> and not NavLink since it's routing from studio to legacy
    return (
      <a
        className={cx(
          "flex flex-row gap-sm items-center",
          "hover:cursor-pointer",
          "hover:bg-surface-action-main-weak-hovered",
          "rounded-md",
        )}
        href={href}
      >
        {content}
      </a>
    );
  }

  return <div className="flex flex-row gap-sm items-center">{content}</div>;
};
