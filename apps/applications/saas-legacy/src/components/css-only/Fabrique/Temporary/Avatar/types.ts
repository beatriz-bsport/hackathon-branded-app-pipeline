/* eslint-disable-next-line */
const AvatarSizes = ['sm', 'lg', 'md', 'xl'] as const;

export type AvatarSize = (typeof AvatarSizes)[number];

/* eslint-disable-next-line */
const AvatarTypes = ['user', 'place'] as const;

export type AvatarType = (typeof AvatarTypes)[number];
