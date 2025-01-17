/* eslint-disable-next-line */
const BadgeColorTypes = ['grey', 'main', 'onstrong', 'warning'] as const;

export type BadgeColor = (typeof BadgeColorTypes)[number];
