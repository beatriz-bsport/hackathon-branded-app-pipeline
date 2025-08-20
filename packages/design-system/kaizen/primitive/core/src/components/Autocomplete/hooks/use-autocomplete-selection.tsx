import { useCallback, useEffect, useState } from "react";

import type { AutocompleteItems } from "#src/components/Autocomplete";
import type { MenuOption } from "#src/components/Menu";
import type { TextFieldProps } from "#src/components/TextField";

/**
 * Custom hook for managing autocomplete selection state and cached items.
 *
 * This hook maintains two separate but related data structures:
 * - `selectedValues`: Array of currently selected item IDs (for Menu component state)
 * - `cachedItems`: Array of MenuOption objects for recently selected items (for "Selected Items" section)
 *
 * The main purpose of this separation is to allow the Autocomplete component to keep list of items that were selected
 * and that might not be given anymore as props. Why ? For example if you are using it with fectched data from an API
 * you want to keep the data of the selected items even if the original list of items changes. If you are using it as
 * a backend selector for example, your first search will return a list of items, you select some of them,
 * then you search again and the list of items changes, you want to keep the selected items, that is why we are
 * implementing these cachedItems, to keep the selected items even if the original list changes.
 *
 * The separation allows for:
 * 1. Menu component to track selected state by IDs
 * 2. Autocomplete to display a "Selected Items" section at the top of dropdown
 * 3. Deduplication logic to remove cached items from the main search results
 * 4. Pre-population of selections via defaultSelectedIds
 *
 * @param items - All available autocomplete items (grouped or flat)
 * @param defaultSelectedIds - Array of item IDs to pre-select on mount
 * @param multiSelect - Whether multiple selections are allowed
 * @param textFieldProps - Props for the underlying text field
 * @returns Object containing selection state, cached items, text field values, and utility functions
 */
export const useAutocompleteSelection = (
  items: AutocompleteItems,
  defaultSelectedIds: string[] = [],
  multiSelect: boolean = false,
  textFieldProps: TextFieldProps,
) => {
  // Helper function to find item by ID across all items structures
  const getItemById = useCallback(
    (id: string): MenuOption | undefined => {
      const allItems = items.flatMap((item) =>
        "options" in item ? item.options : [item],
      );
      return allItems.find((option) => option.id === id);
    },
    [items],
  );

  // Initialize selected values with default IDs
  const [selectedValues, setSelectedValues] = useState<string[]>(
    () => defaultSelectedIds,
  );

  // Initialize cached items with default selected items
  const [cachedItems, setCachedItems] = useState<MenuOption[]>(() => {
    return defaultSelectedIds
      .map((id) => getItemById(id))
      .filter((item): item is MenuOption => item !== undefined);
  });

  // Get initial textfield value for single-select mode
  const getInitialTextFieldValue = useCallback(() => {
    if (!multiSelect && defaultSelectedIds.length > 0) {
      const firstSelectedItem = getItemById(defaultSelectedIds[0]);
      return firstSelectedItem?.label || textFieldProps.value || "";
    }
    return textFieldProps.value || "";
  }, [multiSelect, defaultSelectedIds, getItemById, textFieldProps.value]);

  const [textfieldValue, setTextFieldValue] = useState(() =>
    getInitialTextFieldValue(),
  );
  const [searchedValue, setSearchedValue] = useState(() => "");

  // Sync cached items when default selected IDs change
  useEffect(() => {
    const newCachedItems = defaultSelectedIds
      .map((id) => getItemById(id))
      .filter((item): item is MenuOption => item !== undefined);

    setCachedItems(newCachedItems);
  }, []);

  return {
    // Selection state management
    selectedValues, // Array of selected item IDs for Menu component
    setSelectedValues, // Function to update selected IDs

    // Recently selected items cache
    cachedItems, // Array of MenuOption objects for "Selected Items" section
    setCachedItems, // Function to add/remove items from cache

    // Text field state management
    textfieldValue, // Current text field display value, we use it so that we can display the real text input that the user is typing
    setTextFieldValue, // Function to update text field value
    searchedValue, // Current search query value, we use it to filter items and we update it manually by applying toLowerCas() method for example, that is why we do not want to display it to the user
    setSearchedValue, // Function to update search query

    // Utility functions
    getItemById, // Helper to find items by ID across all item structures
  };
};
