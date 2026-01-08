import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

import Divider from "#src/components/Divider";

import Button from "./Button";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Text from "./Text";
import Title from "./Title";
import { menuItemTypes } from "./constants";
import type { MenuItem as MenuItemType } from "./types";

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
      return <Button {...props} />;
    }
    if (type === menuItemTypes.radio) {
      return <Radio {...props} />;
    }
    if (type === menuItemTypes.checkbox) {
      return <Checkbox {...props} />;
    }
    if (type === menuItemTypes.divider) {
      return <Divider orientation="horizontal" weight="thin" {...props} />;
    }
    if (type === menuItemTypes.title) {
      return <Title {...props} />;
    }
    if (type === menuItemTypes.text) {
      return <Text {...props} />;
    }
  })();

  return (
    <li
      data-component="Kaizen-Menu-Item"
      role="menuitem"
      className={menuItem({ className })}
      {...liHTMLAttributesProps}
    >
      {menuItemComponent}
    </li>
  );
};

export default MenuItem;
