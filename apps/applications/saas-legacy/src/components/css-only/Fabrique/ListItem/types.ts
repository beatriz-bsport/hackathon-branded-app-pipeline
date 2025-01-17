/* eslint-disable-next-line */
const ListItemSizeTypes = ['sm', 'lg'] as const;
/* eslint-disable-next-line */
const ListItemTypeTypes = [
  'text',
  'checkbox',
  'radio',
  'clickableText',
] as const;

export type ListItemSize = (typeof ListItemSizeTypes)[number];
export type ListItemType = (typeof ListItemTypeTypes)[number];
