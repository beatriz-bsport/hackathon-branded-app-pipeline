import type { MenuOption } from "#src/components/Menu/types";

export type AutocompleteItems =
  | Array<{
      title: string;
      options: MenuOption[];
    }>
  | MenuOption[];

export type MapIdToOption = Map<string, MenuOption>;

export type MultiSelectAutocompleteProps = {
  /** Enable multi-selection mode using checkboxes instead of radio buttons */
  multiSelect: true;
  /** Callback function triggered when items are selected (multi-select mode) */
  onSelect?: (selectedValues: string[]) => void;
};

export type SingleSelectAutocompleteProps = {
  /** Single-selection mode using radio buttons (default behavior) */
  multiSelect?: false;
  /** Callback function triggered when an item is selected (single-select mode) */
  onSelect?: (selectedValue: string) => void;
};
