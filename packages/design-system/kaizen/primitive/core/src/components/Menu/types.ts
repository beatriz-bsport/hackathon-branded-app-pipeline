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
};

export type MenuOption = {
  avatar?: { src: string; initials: string };
  iconLeft?: IconName;
  id: string;
  label: string;
  rightSlot?: React.ReactNode;
  description?: string;
  type?: null;
};

export type Item = TitleItem | DividerItem | TextItem | MenuOption;

export type MenuType = {
  disabled?: boolean;
  items: Item[];
  multiSelect?: boolean;
  onSelectOption?: (value: string) => void;
  selectedValues?: string[];
};
