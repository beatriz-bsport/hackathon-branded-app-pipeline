import { IconName } from "#src/components/Icon";

export type BaseItem = {
  id: string;
  label: string;
  href?: React.AnchorHTMLAttributes<HTMLAnchorElement>["href"];
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
};

export type NavigationMenuItem = BaseItem & {
  icon: IconName;
  subItems?: BaseItem[];
  endSlot?: React.ReactNode;
  type?: "item";
};

type NavigationMenuDivider = {
  type: "divider";
};

export type NavigationMenuElement = NavigationMenuDivider | NavigationMenuItem;
