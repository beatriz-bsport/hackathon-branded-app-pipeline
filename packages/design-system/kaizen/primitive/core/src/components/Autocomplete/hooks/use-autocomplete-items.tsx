import { useMemo } from "react";

import type { Item, MenuOption } from "#src/components/Menu/types";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { AutocompleteItems } from "../types";

// #region Utils

type GroupItems = { title: string; options: MenuOption[] };

/**
 * Determine whether an input can be found in a specified label following these rules:
 * - Characters don't have to be one after another
 * - When one character is not matching, return false
 *
 * @example
 * areStringsMatching({label: "Paris", input: "P"}) => true
 * areStringsMatching({label: "Paris", input: "Po"}) => false
 * areStringsMatching({label: "Paris", input: "Prs"}) => true
 */
function areStringsMatching({
  label,
  input,
}: {
  label: string;
  input: string;
}): boolean {
  if (!input) return true;

  const normalizedInput = input.toLowerCase();
  const normalizedLabel = label.toLowerCase();

  // Early exit
  if (normalizedInput.length > normalizedLabel.length) return false;

  let inputIdx = 0;
  for (
    let labelIdx = 0;
    labelIdx < normalizedLabel.length && inputIdx < normalizedInput.length;
    labelIdx++
  ) {
    if (
      normalizedInput.charCodeAt(inputIdx) ===
      normalizedLabel.charCodeAt(labelIdx)
    ) {
      inputIdx++;
    }
  }

  return inputIdx === normalizedInput.length;
}

/**
 * Determine whether items are an array of GroupItems
 */
function isGroupItemsList(items: AutocompleteItems): items is GroupItems[] {
  return Array.isArray(items) && items.length > 0 && "title" in items[0];
}

/**
 * Filter a list of MenuOption by:
 * - hiding selected items on demand
 * - keeping remaining items on remote search
 * - keeping remaining items whose label is matching the input
 */
function filterFlatItems({
  hideSelectedItemsInBase = false,
  input,
  isLocalSearch,
  items,
  selectedItemsIds = null,
}: {
  items: MenuOption[];
  input: string;
  isLocalSearch: boolean;
  hideSelectedItemsInBase?: boolean;
  selectedItemsIds?: Set<string> | null;
}): MenuOption[] {
  return items.filter((option) => {
    // 1. Hide selected items
    if (hideSelectedItemsInBase && selectedItemsIds?.has(option.id)) {
      return false;
    }

    // 2. Display all items on remote search
    if (!isLocalSearch) {
      return true;
    }

    // 3. Return only matching strings
    return areStringsMatching({
      label: option.label,
      input,
    });
  });
}

/**
 * Filter a list of GroupItems by keeping:
 * - group with options matching the filterFlatItems filtering
 * - group with label matching the input
 */
function filterGroupItems({
  hideSelectedItemsInBase,
  input,
  isLocalSearch,
  items,
  selectedItemsIds,
}: {
  hideSelectedItemsInBase: boolean;
  input: string;
  isLocalSearch: boolean;
  items: GroupItems[];
  selectedItemsIds: Set<string>;
}): GroupItems[] {
  return items
    .map((groupOption) => {
      const titleMatchesSearch =
        isLocalSearch &&
        areStringsMatching({ label: groupOption.title, input });

      return {
        title: groupOption.title,
        options: filterFlatItems({
          hideSelectedItemsInBase,
          input: titleMatchesSearch ? "" : input,
          isLocalSearch,
          selectedItemsIds,
          items: groupOption.options,
        }),
      };
    })
    .filter((group) => group.options.length > 0);
}

/**
 * From a list of Grouped Items or Flat Items, build a flat list to inject in a Menu.
 */
function buildFlatMenuItems(items: AutocompleteItems): Item[] {
  return items
    .flatMap((item, index) => {
      const isGroupedItems = "title" in item && "options" in item;
      if (isGroupedItems) {
        const title = {
          type: "title" as const,
          label: item.title,
          id: `${item.title}-title`,
        };

        const isLastItem = items.length - 1 === index;

        const divider = isLastItem
          ? null
          : {
              type: "divider" as const,
              id: `${item.title}-divider`,
            };

        return [title, ...item.options, divider].filter((x) => x != null);
      }

      return [item];
    })
    .filter((x) => x != null);
}

// #endregion

// #region Hook

type UseAutocompleteItemsProps = {
  hideSelectedItemsInBase: boolean;
  items: AutocompleteItems;
  searchedValue: string;
  searchMode: "local" | "remote";
  selectedItems: MenuOption[];
  selectedItemsIds: Set<string>;
};

/**
 * Hook to manage:
 * - the filtering of the items to display
 * - the creation of the "Selection" section
 */
export const useAutocompleteItems = ({
  hideSelectedItemsInBase,
  items,
  searchedValue,
  searchMode,
  selectedItems,
  selectedItemsIds,
}: UseAutocompleteItemsProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t, i18n } = useTranslation("default", { i18n: i18nInstance });

  const normalizedInput = searchedValue.trim().toLowerCase();
  const isLocalSearch = searchMode === "local";

  const filteredSelectedItems = useMemo(() => {
    return filterFlatItems({
      items: selectedItems,
      input: normalizedInput,
      isLocalSearch,
    });
  }, [selectedItems, normalizedInput, isLocalSearch]);

  const filteredBaseItems = useMemo(() => {
    const hasGroupItems = isGroupItemsList(items);

    if (hasGroupItems) {
      return filterGroupItems({
        items,
        hideSelectedItemsInBase,
        input: normalizedInput,
        isLocalSearch,
        selectedItemsIds,
      });
    }

    return filterFlatItems({
      items,
      hideSelectedItemsInBase,
      input: normalizedInput,
      isLocalSearch,
      selectedItemsIds,
    });
  }, [
    items,
    hideSelectedItemsInBase,
    normalizedInput,
    isLocalSearch,
    selectedItemsIds,
  ]);

  const finalItems: GroupItems[] | MenuOption[] = useMemo(() => {
    // If no selected items matching the search, return the same base structure
    if (selectedItemsIds.size === 0 || filteredSelectedItems.length === 0) {
      return filteredBaseItems;
    }

    // Create a section for Selected items
    const groupedSelectedItems = {
      title: t("autocomplete.categories.selectedItems"),
      options: filteredSelectedItems,
    };

    if (filteredBaseItems.length === 0) {
      return [groupedSelectedItems];
    }

    // When base items already have a group structure, join them
    if (isGroupItemsList(filteredBaseItems)) {
      return [groupedSelectedItems, ...filteredBaseItems];
    }

    // Else, create a "All items" section to gather base items
    const groupedFilteredItems = {
      title: t("autocomplete.categories.allItems"),
      options: filteredBaseItems,
    };
    return [groupedSelectedItems, groupedFilteredItems];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filteredBaseItems,
    filteredSelectedItems,
    selectedItemsIds.size,
    i18n.language,
  ]);

  // Convert filtered items to flat menu items
  const flatMenuItems = useMemo(
    () => buildFlatMenuItems(finalItems),
    [finalItems],
  );

  return {
    isListEmpty: finalItems.length === 0,
    flatMenuItems,
  };
};

// #endregion
