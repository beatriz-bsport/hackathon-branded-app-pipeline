import { IconName } from "#src/components/Icon";

export type BaseItem = {
  id: string;
  label: string;
  href?: React.AnchorHTMLAttributes<HTMLAnchorElement>["href"];
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  active?: boolean;
};

export type NavigationMenuItem = BaseItem & {
  icon?: IconName;
  endSlot?: React.ReactNode;
};

export type NavigationMenuDivider = {
  type: "divider";
};

export type NavigationMenuGroup = {
  type: "group";
  label: string;
};

export type NavigationMenuElement =
  | NavigationMenuItem
  | NavigationMenuDivider
  | NavigationMenuGroup;
