import type { FC } from "react";

import {
  Avatar,
  AvatarProps,
  Body,
  type BodyProps,
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
};

export const AvatarWithName: FC<AvatarWithNameProps> = ({
  name = "",
  avatarSrc,
  avatarConfig = {},
  bodyConfig = {},
}) => {
  const initials = name
    .split(" ")
    .map((part) => (part.length > 0 ? part[0] : ""))
    .join("")
    .toUpperCase();

  const displayAvatar = !isDefaultAvatar(avatarSrc);

  return (
    <div className="flex flex-row gap-sm items-center">
      <Avatar
        size="md"
        shape="round"
        {...avatarConfig}
        src={displayAvatar ? avatarSrc : undefined}
        alt={name}
        initials={initials}
      />
      <Body {...bodyConfig}>{name}</Body>
    </div>
  );
};
