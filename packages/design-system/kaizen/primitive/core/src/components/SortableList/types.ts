import type { AvatarProps } from "#src/components/Avatar";
import type { IconName } from "#src/components/Icon";
import type { ListItemChipsProps } from "#src/components/List";
import type { WithTooltip } from "#src/components/Tooltip";
import type { ActionButton, ActionsDropdownConfig } from "#src/hooks";

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
  dropdownConfig?: ActionsDropdownConfig;
  buttons?: WithTooltip<ActionButton>[];
  onItemClick?: () => void;
};
