import { IconName } from "#src/components/Icon";

export type TitleItem = {
  label: string;
  type: "title";
};

export type DividerItem = {
  type: "divider";
};

export type MenuOption = {
  avatar?: string;
  iconLeft?: IconName;
  id: string;
  label: string;
  rightSlot?: React.ReactNode;
  type?: null;
};

export type Item = TitleItem | DividerItem | MenuOption;

export type MenuType = {
  disabled: boolean;
  items: Item[];
  multiSelect?: boolean;
  onSelectOption?: (value: string) => void;
  selectedValues?: string[];
};
