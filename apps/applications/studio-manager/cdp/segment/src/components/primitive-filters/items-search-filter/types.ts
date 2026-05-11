import { ComponentType, ReactNode } from "react";

import type { MenuOption } from "@bsport/kaizen-primitive-core";

export type ItemsSearchFilterOption = {
  id: number;
  name: string;
  description?: string;
};

export type ItemsSearchFilterMenuOptionView = Pick<
  MenuOption,
  "label" | "description" | "leftSlot" | "rightSlot"
>;

export type ItemsSearchFilterValue = number[];

export type ItemsSearchFilterSelectedListItemProps = {
  id: string;
  optionId: number;
  option: ItemsSearchFilterOption;
  isSelectable?: boolean;
  selected?: boolean;
  isCompact?: boolean;
  onSelect?: () => void;
  onRemove: (id: number) => void;
  selectedOptionFormatter?: (option: ItemsSearchFilterOption) => ReactNode;
  removeLabel: string;
};

export type ItemsSearchFilterProps = {
  id: string;
  label?: string;
  options: ItemsSearchFilterOption[];
  value?: ItemsSearchFilterValue;
  onChange?: (value: ItemsSearchFilterValue) => void;
  selectAllLabelBuilder?: (filteredCount: number) => string;
  menuOptionFormatter?: (
    option: ItemsSearchFilterOption,
  ) => ItemsSearchFilterMenuOptionView;
  selectedOptionFormatter?: (option: ItemsSearchFilterOption) => ReactNode;
  selectedListItem?: ComponentType<ItemsSearchFilterSelectedListItemProps>;
  disabled?: boolean;
  className?: string;
  searchPlaceholder?: string;
  emptySearchLabel?: string;
  emptySelectionLabel?: string;
  selectedSectionLabel?: string;
  errorText?: string;
};
