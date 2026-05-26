import { ComponentType, ReactNode } from "react";

import type { MenuOption } from "@bsport/kaizen-primitive-core";

export type ItemsSearchFilterOption = {
  id: number;
  name: string;
  description?: string;
};

/**
 * Slice of filtered options rendered under an optional menu heading (e.g. tag category).
 */
export type ItemsSearchFilterGroup = {
  /** When empty, no `title` row is inserted before `options`. */
  heading: string;
  options: ItemsSearchFilterOption[];
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
  /** When true, the search query also matches `option.description` (case-insensitive). */
  searchIncludesDescription?: boolean;
  /**
   * When set, builds the dropdown with `Menu` `title` rows from filtered options.
   * Receives the same list as the internal name/description filter (respects `searchIncludesDescription`).
   */
  groupFilteredOptions?: (
    filteredOptions: ItemsSearchFilterOption[],
  ) => ItemsSearchFilterGroup[];

  /**
   * When the number of chosen items exceeds this value, only the first
   * `collapseSelectionThreshold` rows are shown until the user expands the list.
   * Omit or pass `Infinity` to always show every selected row.
   */
  collapseSelectionThreshold?: number;
};
