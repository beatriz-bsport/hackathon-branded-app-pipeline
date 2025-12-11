import { IconName } from "#src/components/Icon";

export type TitleItem = {
  label: string;
  type: "title";
};

export type DividerItem = {
  type: "divider";
};

export type TextItem = {
  id: string;
  type: "text";
  avatar?: { src: string; initials: string };
  iconLeft?: IconName;
  label: string;
  description?: string;
  rightSlot?: React.ReactNode;
  disabled?: boolean;
  leftSlot?: React.ReactNode;
};

export type MenuButton = {
  id: string;
  type: "button";
  label: string;
  iconLeft?: IconName;
  disabled?: boolean;
  onClick: () => void;
  leftSlot?: React.ReactNode;
};

export type MenuOption = {
  avatar?: { src: string; initials: string };
  iconLeft?: IconName;
  id: string;
  label: string;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  description?: string;
  type?: null;
  disabled?: boolean;
};

export type Item = TitleItem | DividerItem | TextItem | MenuOption | MenuButton;

export type MenuType = {
  disabled?: boolean;
  items: Item[];
  multiSelect?: boolean;
  onSelectOption?: (value: string) => void;
  selectedValues?: string[];
};
