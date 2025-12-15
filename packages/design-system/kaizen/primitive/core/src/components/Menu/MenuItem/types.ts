import { DividerProps } from "#src/components/Divider";
import { IconName } from "#src/components/Icon";

import { menuItemTypes } from "./constants";

export type LeftSlot = {
  avatar?: { src: string; initials: string };
  iconLeft?: IconName;
  leftSlot?: React.ReactNode;
};

export type Title = {
  label: string;
  type: typeof menuItemTypes.title;
};

export type Button = {
  id: string;
  subItems?: SubMenu[];
  disabled?: boolean;
  label: string;
  onClick: () => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.button;
} & LeftSlot;

export type Text = {
  id: string;
  subItems?: SubMenu[];
  label: string;
  rightSlot?: React.ReactNode;
  description?: string;
  type: typeof menuItemTypes.text;
} & LeftSlot;

export type Radio = {
  checked: boolean;
  disabled: boolean;
  id: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.radio;
  value: string;
  description?: string;
} & LeftSlot;

export type CheckBox = {
  disabled: boolean;
  id: string;
  label: string;
  onClick?: (event?: React.MouseEvent) => void;
  rightSlot?: React.ReactNode;
  type: typeof menuItemTypes.checkbox;
  value: "checked" | "unchecked" | "indeterminate";
} & LeftSlot;

export type Divider = {
  type: typeof menuItemTypes.divider;
} & DividerProps;

export type MenuItem = Button | CheckBox | Divider | Radio | Title | Text;

export type SubMenu = Button | Radio | CheckBox | Text;
