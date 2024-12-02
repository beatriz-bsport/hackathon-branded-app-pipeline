import { DividerProps } from "../Divider";
import { IconName } from "../Icon";
import { menuItemTypes } from "./constants";

export type MenuItemLeftSlot = { avatar?: string; iconLeft?: IconName }; // If `avatar` is provided, `iconLeft` must not be provided

export type MenuItemTitleType = {
  label: string;
  type: typeof menuItemTypes.title;
};

export type MenuItemButtonType = {
  subItems?: SubMenuType[];
  disabled?: boolean;
  label: string;
  onClick: () => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.button;
} & MenuItemLeftSlot;

export type MenuItemRadioType = {
  checked: boolean;
  disabled: boolean;
  id: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.radio;
  value: string;
} & MenuItemLeftSlot;

export type MenuItemCheckBoxType = {
  disabled: boolean;
  id: string;
  label: string;
  onClick?: (event?: React.MouseEvent) => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.checkBox;
  value: "checked" | "unchecked" | "indeterminate";
} & MenuItemLeftSlot;

export type MenuItemDividerType = {
  type: typeof menuItemTypes.divider;
} & DividerProps;

export type MenuItemType =
  | MenuItemButtonType
  | MenuItemCheckBoxType
  | MenuItemDividerType
  | MenuItemRadioType
  | MenuItemTitleType;

export type SubMenuType =
  | MenuItemButtonType
  | MenuItemRadioType
  | MenuItemCheckBoxType;
