import type { AvatarProps } from "#src/components/Avatar";
import type { ButtonProps } from "#src/components/Button";
import type { IconName } from "#src/components/Icon";
import type { ListItemChipsProps } from "#src/components/List";

export type Sortable = {
  id: string;
  title: string;
  rightTitle?: string;
  description?: string;
  icon?: IconName;
  avatar?: AvatarProps;
  chips?:
    | [ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps, ListItemChipsProps];
  chipsDirection?: "start" | "end";
  buttons?:
    | [ButtonProps]
    | [ButtonProps, ButtonProps]
    | [ButtonProps, ButtonProps, ButtonProps];
};

export type ListHeader = {
  id: string;
  title: string;
  description?: string;
  buttons?:
    | [ButtonProps]
    | [ButtonProps, ButtonProps]
    | [ButtonProps, ButtonProps, ButtonProps];
};
