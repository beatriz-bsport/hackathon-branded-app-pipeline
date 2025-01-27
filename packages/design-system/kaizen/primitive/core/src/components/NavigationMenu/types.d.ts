import { IconName } from "#src/components/Icon";
import { MouseEvent } from "react";

export type BaseItem = {
  id: string;
  label: string;
  href?: React.AnchorHTMLAttributes<HTMLAnchorElement>["href"];
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
};

export type Item = BaseItem & {
  icon: IconName;
  subItems?: BaseItem[];
  rightSlot?: React.ReactNode;
};

export type NavigationMenuType = {
  items: Item[];
  onItemClick?: (item: BaseItem | Item) => (e: MouseEvent) => void;
};
