import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import MenuItemButton from "./MenuItemButton";
import MenuItemCheckbox from "./MenuItemCheckbox";
import MenuItemRadio from "./MenuItemRadio";
import MenuItemTitle from "./MenuItemTitle";
import Divider from "../Divider";

import type { MenuItemType } from "./types";

import { menuItemTypes } from "./constants";

const menuItem = cva(["list-none"]);

export type MenuItemProps = {
  liHTMLAttributesProps?: React.LiHTMLAttributes<HTMLLIElement>;
} & VariantProps<typeof menuItem> &
  MenuItemType;

const MenuItem: React.FC<MenuItemProps> = ({
  liHTMLAttributesProps,
  ...props
}) => {
  const { className } = liHTMLAttributesProps ?? {};
  const { type } = props;

  const menuItemComponent = (() => {
    if (type === menuItemTypes.button) {
      return <MenuItemButton {...props} />;
    }
    if (type === menuItemTypes.radio) {
      return <MenuItemRadio {...props} />;
    }
    if (type === menuItemTypes.checkBox) {
      return <MenuItemCheckbox {...props} />;
    }
    if (type === menuItemTypes.divider) {
      return <Divider orientation="horizontal" weight="thin" {...props} />;
    }
    if (type === menuItemTypes.title) {
      return <MenuItemTitle {...props} />;
    }
  })();

  return (
    <li className={menuItem({ className })} {...liHTMLAttributesProps}>
      {menuItemComponent}
    </li>
  );
};

export default React.memo(MenuItem);
