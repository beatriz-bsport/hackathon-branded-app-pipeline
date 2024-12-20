import { DividerProps } from "#src/components/Divider";
import { IconName } from "#src/components/Icon";
import { menuItemTypes } from "./constants";

export type LeftSlot = { avatar?: string; iconLeft?: IconName }; // If `avatar` is provided, `iconLeft` must not be provided

export type TitleType = {
  label: string;
  type: typeof menuItemTypes.title;
};

export type ButtonType = {
  id: string;
  subItems?: SubMenuType[];
  disabled?: boolean;
  label: string;
  onClick: () => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.button;
} & LeftSlot;

export type RadioType = {
  checked: boolean;
  disabled: boolean;
  id: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.radio;
  value: string;
} & LeftSlot;

export type CheckBoxType = {
  disabled: boolean;
  id: string;
  label: string;
  onClick?: (event?: React.MouseEvent) => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.checkbox;
  value: "checked" | "unchecked" | "indeterminate";
} & LeftSlot;

export type DividerType = {
  type: typeof menuItemTypes.divider;
} & DividerProps;

export type MenuItemType =
  | ButtonType
  | CheckBoxType
  | DividerType
  | RadioType
  | TitleType;

export type SubMenuType = ButtonType | RadioType | CheckBoxType;
