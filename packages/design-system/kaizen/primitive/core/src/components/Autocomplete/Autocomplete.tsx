import React, { useEffect, useState } from "react";

import { MenuProps } from "#src/components/Menu";
import { type TextFieldProps } from "#src/components/TextField";
import type { Placement } from "#src/hooks";

import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
} from "./autocomplete-controlled";
import type {
  AutocompleteItems,
  MultiSelectAutocompleteProps,
  SingleSelectAutocompleteProps,
} from "./types";

type BaseAutocompleteProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  /** Props passed to the underlying TextField component */
  textfieldProps: TextFieldProps;
  /** Props passed to the underlying Menu component */
  menuProps?: Partial<MenuProps>;
  /** List of items to provide as autocompletion options */
  items: AutocompleteItems;
  /** Whether the popover should take the full width of its container */
  fullWidth?: boolean;
  /** Debounce duration in milliseconds to limit how often value change callbacks are triggered */
  debounceValue?: number;
  /** Placement of the popover relative to the input field */
  popoverPlacement?: Placement;
  /** Array of item IDs that should be pre-selected on component mount */
  defaultSelectedIds?: string[];
  /** Search mode: 'local' filters items client-side, 'remote' relies on external filtering */
  searchMode?: "local" | "remote";
  /** Callback function triggered whenever the input value changes */
  onValueChange?: (value: string) => void;
  /** Loading state configuration */
  loadingProps?: {
    isLoading: boolean;
    message?: string;
  };
  /** options to disable the field making the autocomplete, textfield and popover not usable */
  disabled?: boolean;
  /** Empty the selected value array when clicking, used when you want to display a filterable list of choice not made to be kept */
  clearOnSelect?: boolean;
  /** Callback function triggered when the textfield clear action is performed */
  onClear?: () => void;
  /** Whether to not display chips in a multi select context */
  hideChips?: boolean;
  /** Whether to display selected items in the base items list, as they are grouped in a "Selected" section */
  showSelectedItemsInBase?: boolean;
  /**
   * Whether to provide a custom logic for toggling items (select or unselect).
   * Should return the final array of ids to keep. If single choice, ensure the length of the array is 1 or 0.
   * */
  onToggleItem?: ({
    prev,
    toggledItem,
  }: {
    prev: string[];
    toggledItem: string;
  }) => string[];
};

export type AutocompleteProps = BaseAutocompleteProps &
  (MultiSelectAutocompleteProps | SingleSelectAutocompleteProps);

/**
 * Autocomplete Component
 *
 * A text input field that offers autocompletion from a set of items.
 * It functions by filtering these items according to the user's input and
 * displaying them in a popover. Supports both single and multi-selection
 * modes, with optional pre-selected items.
 *
 * Legacy uncontrolled API. New code should prefer
 * `AutocompleteControlled`, which exposes a standard `value` / `onChange`
 * interface.
 */
const Autocomplete: React.FC<AutocompleteProps> = (props) => {
  const {
    defaultSelectedIds = [],
    multiSelect = false,
    onSelect,
    onToggleItem,
    hideChips = false,
    showSelectedItemsInBase = false,
    textfieldProps,
    menuProps,
    items,
    fullWidth,
    debounceValue,
    popoverPlacement,
    searchMode,
    onValueChange,
    loadingProps,
    disabled,
    clearOnSelect,
    onClear,
    className,
  } = props;

  const [value, setValue] = useState<string[]>(defaultSelectedIds);

  /**
   * Iso with legacy behavior: `defaultSelectedIds` was consumed reactively, so
   * consumers that resolve the ids asynchronously could update the selection by
   * updating the prop. Sync the internal state whenever the resolved ids change.
   */
  const defaultSelectedIdsKey = defaultSelectedIds.join(",");
  useEffect(() => {
    setValue(defaultSelectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedIdsKey]);

  const handleChange: AutocompleteControlledProps["onChange"] = (
    next,
    toggledItem,
  ) => {
    let finalNext = next;

    if (onToggleItem) {
      if (toggledItem != null) {
        finalNext = onToggleItem({ prev: value, toggledItem });
      }
    }

    setValue(finalNext);

    if (multiSelect) {
      (onSelect as MultiSelectAutocompleteProps["onSelect"])?.(finalNext);
    } else {
      (onSelect as SingleSelectAutocompleteProps["onSelect"])?.(
        finalNext[0] ?? "",
      );
    }
  };

  return (
    <AutocompleteControlled
      textfieldProps={textfieldProps}
      menuProps={menuProps}
      items={items}
      fullWidth={fullWidth}
      debounceValue={debounceValue}
      popoverPlacement={popoverPlacement}
      searchMode={searchMode}
      onValueChange={onValueChange}
      loadingProps={loadingProps}
      disabled={disabled}
      clearOnSelect={clearOnSelect}
      onClear={onClear}
      className={className}
      multiSelect={multiSelect}
      value={value}
      onChange={handleChange}
      withChips={!hideChips}
      withSelectedInBase={showSelectedItemsInBase}
    />
  );
};

Autocomplete.displayName = "KaizenAutocomplete";

export default Autocomplete;
