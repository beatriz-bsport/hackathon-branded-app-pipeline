import { Avatar, type AvatarProps } from "@bsport/kaizen-primitive-core";

import { getMemberInitialsFromFullName } from "#src/utils/memberUtils";

type MemberAvatarProps = {
  name: string;
  photo?: string | null;
  size?: AvatarProps["size"];
  shape?: AvatarProps["shape"];
};

export const MemberAvatar = ({
  name,
  photo,
  size = "md",
  shape = "round",
}: MemberAvatarProps) => (
  <Avatar
    shape={shape}
    size={size}
    src={photo ?? undefined}
    initials={getMemberInitialsFromFullName(name)}
    alt={name}
  />
);
