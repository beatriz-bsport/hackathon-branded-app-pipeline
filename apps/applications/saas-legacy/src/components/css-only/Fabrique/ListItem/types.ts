const ListItemSizeTypes = ['sm', 'lg'] as const;
const ListItemTypeTypes = [
  'text',
  'checkbox',
  'radio',
  'clickableText',
] as const;

export type ListItemSize = (typeof ListItemSizeTypes)[number];
export type ListItemType = (typeof ListItemTypeTypes)[number];
