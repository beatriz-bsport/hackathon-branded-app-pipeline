import { useCallback, useMemo } from "react";

import type { AutocompleteItems } from "#src/components/Autocomplete";
import type { MenuOption } from "#src/components/Menu";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

type UseAutocompleteItemsParams = {
  items: AutocompleteItems;
  cachedItems: MenuOption[];
  searchInput: string;
  searchMode: "local" | "remote";
};

const areStringMatching = ({
  label,
  input,
}: {
  label: string;
  input: string;
}): boolean => {
  if (!input) return true;
  const normalizedInput = (input || "").toLowerCase();
  const normalizedLabel = (label || "").toLowerCase();
  let idx = 0;
  for (const char of normalizedInput) {
    idx = normalizedLabel.indexOf(char, idx);
    if (idx === -1) return false;
    idx++;
  }
  return true;
};

/**
 * Custom hook for managing autocomplete items with filtering and grouping logic
 */
export const useAutocompleteItems = ({
  items,
  cachedItems,
  searchInput,
  searchMode,
}: UseAutocompleteItemsParams) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  // Sanitize and normalize the search input
  const normalizedInput = (searchInput || " ").toLowerCase().trim();

  // Create a set of cached item IDs for efficient lookup
  const cachedItemIds = useMemo(
    () => new Set(cachedItems.map((item: MenuOption) => item.id)),
    [cachedItems],
  );

  // Filter function that removes cached items and applies search filter
  const filterAndRemoveCached = useCallback(
    (options: MenuOption[]) => {
      return options
        .filter((option) => !cachedItemIds.has(option.id))
        .filter(
          (option) =>
            searchMode === "remote" ||
            areStringMatching({
              label: option.label,
              input: normalizedInput,
            }),
        );
    },
    [cachedItemIds, searchMode, normalizedInput],
  );

  // Helper function to check if items are grouped
  const isGroupedItems = useCallback(
    (
      items: AutocompleteItems,
    ): items is { title: string; options: MenuOption[] }[] => {
      return Array.isArray(items) && items.length > 0 && "title" in items[0];
    },
    [],
  );

  // Helper function to check if a group should be included
  const shouldIncludeGroup = useCallback(
    (group: { title: string; options: MenuOption[] }) => {
      const hasMatchingOptions = group.options.length > 0;

      if (hasMatchingOptions) {
        return true;
      }

      const isLocalSearch = searchMode === "local";
      const titleMatchesSearch = areStringMatching({
        label: group.title,
        input: normalizedInput,
      });

      return isLocalSearch && titleMatchesSearch;
    },
    [searchMode, normalizedInput],
  );

  // Helper function to filter grouped items
  const filterGroupedItems = useCallback(
    (groupedItems: { title: string; options: MenuOption[] }[]) => {
      return groupedItems
        .map(({ title, options }) => ({
          title,
          options: filterAndRemoveCached(options),
        }))
        .filter(shouldIncludeGroup);
    },
    [filterAndRemoveCached, shouldIncludeGroup],
  );

  // Helper function to filter flat items
  const filterFlatItems = useCallback(
    (flatItems: MenuOption[]) => {
      return filterAndRemoveCached(flatItems);
    },
    [filterAndRemoveCached],
  );

  const filterBaseItems = useCallback((): AutocompleteItems => {
    const isGrouped = isGroupedItems(items);

    if (isGrouped) {
      return filterGroupedItems(items);
    }

    return filterFlatItems(items as MenuOption[]);
  }, [items, isGroupedItems, filterGroupedItems, filterFlatItems]);

  // Helper function to create cached items section
  const createCachedItemsSection = useCallback(() => {
    return {
      title: t("autocomplete.categories.selectedItems"),
      options: cachedItems.filter(
        (option: MenuOption) =>
          searchMode === "remote" ||
          areStringMatching({
            label: option.label,
            input: normalizedInput,
          }),
      ),
    };
  }, [cachedItems, searchMode, normalizedInput, t]);

  // Helper function to merge cached items with grouped base items
  const mergeWithGroupedItems = useCallback(
    (
      cachedSection: { title: string; options: MenuOption[] },
      groupedBaseItems: { title: string; options: MenuOption[] }[],
    ) => {
      return [cachedSection, ...groupedBaseItems];
    },
    [],
  );

  // Helper function to merge cached items with flat base items
  const mergeWithFlatItems = useCallback(
    (
      cachedSection: { title: string; options: MenuOption[] },
      flatBaseItems: MenuOption[],
    ) => {
      const baseSection = {
        title: t("autocomplete.categories.allItems"),
        options: flatBaseItems,
      };

      const hasBaseItems = baseSection.options.length > 0;

      if (hasBaseItems) {
        return [cachedSection, baseSection];
      }

      return [cachedSection];
    },
    [t],
  );

  const mergeBaseItemsWithCachedItems = useCallback(
    (filteredBaseItems: AutocompleteItems): AutocompleteItems => {
      const hasCachedItems = cachedItems.length > 0;

      if (!hasCachedItems) {
        return filteredBaseItems;
      }

      const cachedSection = createCachedItemsSection();
      const hasMatchingCachedItems = cachedSection.options.length > 0;

      if (!hasMatchingCachedItems) {
        return filteredBaseItems;
      }

      const areBaseItemsGrouped = isGroupedItems(filteredBaseItems);

      if (areBaseItemsGrouped) {
        return mergeWithGroupedItems(cachedSection, filteredBaseItems);
      }

      return mergeWithFlatItems(
        cachedSection,
        filteredBaseItems as MenuOption[],
      );
    },
    [
      cachedItems,
      createCachedItemsSection,
      isGroupedItems,
      mergeWithGroupedItems,
      mergeWithFlatItems,
    ],
  );

  const filteredItems = useMemo((): AutocompleteItems => {
    const filteredBaseItems: AutocompleteItems = filterBaseItems();

    // Combine cached section with filtered items
    return mergeBaseItemsWithCachedItems(filteredBaseItems);
  }, [filterBaseItems, mergeBaseItemsWithCachedItems]);

  return { items: filteredItems };
};
