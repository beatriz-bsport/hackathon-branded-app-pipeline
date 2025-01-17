/* eslint-disable-next-line */
const MenuItemTypes = ['text', 'checkbox', 'radio'] as const;

export type MenuItemType = (typeof MenuItemTypes)[number];

export type MenuItemClasses = {
  button?: string;
  input?: string;
  icon?: string;
  label?: string;
};
