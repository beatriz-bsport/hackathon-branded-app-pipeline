import { MouseEvent, ReactElement } from 'react';

export type SubmenuItem = {
  className?: string;
  title?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  isDivider?: boolean;
  isSelected?: boolean;
  to?: string;
  /** If provided, a chevron icon will be shown at the right and another submenu will display on hover */
  items?: SubmenuItem[];
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
};
