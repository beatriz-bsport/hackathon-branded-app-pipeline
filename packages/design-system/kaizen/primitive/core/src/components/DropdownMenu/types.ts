import type { MutableRefObject, ReactNode } from "react";

import { type IconName } from "#src/components/Icon";
import { type Placement } from "#src/hooks/placement-classes.hook";

export type DropdownMenuContextValue = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  multiSelect?: boolean;
  onSelectItem?: (id: string, nextValues?: string[]) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  closePopover: () => void;
  closePopoverRef: MutableRefObject<(() => void) | null>;
};

export type DropdownMenuTriggerProps = {
  children: (props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  }) => ReactNode;
};

export type DropdownMenuContentProps = {
  children: ReactNode;
  className?: string;
  popoverContentClassName?: string;
  placement?: Placement;
  maxHeightPx?: number;
  maxWidthPx?: number;
};

export type DropdownMenuItemProps = {
  id: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: IconName;
  avatar?: { src: string; initials: string };
  rightSlot?: ReactNode;
  description?: string;
  onClick?: () => void;
};

export type DropdownMenuTitleProps = {
  children: ReactNode;
};

export type DropdownMenuSearchProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export type DropdownMenuTextProps = {
  id: string;
  children: ReactNode;
  icon?: IconName;
  avatar?: { src: string; initials: string };
  rightSlot?: ReactNode;
  description?: string;
};
