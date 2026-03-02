import { useEffect, useMemo, useRef, useState } from "react";

import {
  Autocomplete,
  AutocompleteItems,
  type AutocompleteProps,
  MenuOptionWithColor,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { SearchResultItem } from "./types";
import { type StoreSearchConfig, useGenericSearch } from "./use-generic-search";

/**
 * Props for the BackendSelector component with store-based search
 * @template TParams - Type for additional search parameters (for API calls)
 * @template TResult - Type for search results from store
 */
export type BackendSelectorProps<TParams, TResult> = {
  /**
   * Store configuration for data injection and search functionality
   */
  storeConfig: StoreSearchConfig<TParams, TResult>;

  /**
   * Optional custom formatter to transform search results into autocomplete items.
   * If not provided, a default formatter will be used that attempts to extract
   * common properties like title, name, subject, and description.
   *
   * @param results - Array of search results from store
   * @returns Array of autocomplete items with id, label, and optional description
   */
  optionsFormatter?: (results: TResult[]) => AutocompleteItems;

  /**
   * Props to customize the underlying text field component.
   * Common props include label, placeholder, iconLeft, etc.
   */
  textfieldProps?: TextFieldProps;

  /**
   * Loading message to display during search operations
   */
  loadingMessage?: string;

  /**
   * Array of default selected item IDs.
   */
  defaultValues?: string[];

  /**
   * If true, disables the selector input.
   */
  disabled?: boolean;

  /**
   * Optional CSS class name for custom styling
   */
  className?: string;

  /**
   * Callback fired when an item is selected, receiving the selected item's ID.
   */
  onSelect?: (selectedId: string | string[]) => void;

  /**
   * Callback fired when the clear action is performed, receiving the cleared item's ID.
   */
  onClear?: () => void;

  /**
   * Boolean to be able to transform the backend selector from a single item selecotr into a multi selector
   */
  multiSelect?: boolean;
};

const isGroupItems = (
  items: AutocompleteItems,
): items is { title: string; options: MenuOptionWithColor[] }[] =>
  Array.isArray(items) && items.length > 0 && "options" in items[0];

/**
 * A generic backend selector component that provides search functionality
 * through Zustand store data injection with optional API triggers.
 *
 * This component automatically handles:
 * - Store data selection and filtering
 * - Real-time search input with debouncing
 * - Type-safe result formatting
 * - Optional API calls to refresh store data
 *
 * @template TParams - Type for additional search parameters (for API calls)
 * @template TResult - Type for search results from store
 */
export const BackendSelector = <
  TParams = Record<string, unknown>,
  TResult = unknown,
>({
  disabled = false,
  storeConfig,
  textfieldProps,
  loadingMessage,
  optionsFormatter,
  onSelect,
  defaultValues,
  className,
  onClear,
  multiSelect = false,
}: BackendSelectorProps<TParams, TResult>) => {
  const { t } = useTranslation("marketingNotificationList");
  const [searchInput, setSearchInput] = useState("");
  const [cachedSelectedItems, setCachedSelectedItems] =
    useState<AutocompleteItems>([]);

  // Track if component has initialized and if we've seen the first onSelect call
  const isInitializedRef = useRef(false);
  const hasSeenFirstSelectRef = useRef(false);

  // Use the generic search hook
  const { results, isLoading, isAutocompleteReady } = useGenericSearch<
    TParams,
    TResult
  >({
    searchInput,
    storeConfig: {
      ...storeConfig,
      initialValue: defaultValues?.join(",") || "",
    },
  });

  const formatResults = (results: TResult[]): AutocompleteItems => {
    // Create a set of IDs from cachedSelectedItems for fast lookup
    const cachedSelectedIds = new Set(
      cachedSelectedItems.flatMap((item) =>
        "options" in item ? item.options.map((opt) => opt.id) : [item.id],
      ),
    );

    if (optionsFormatter) {
      const formattedResults = optionsFormatter(results);

      if (isGroupItems(formattedResults)) {
        // Keep group structure; inside each group, filter options to exclude ids in cachedSelectedIds
        const filtered: { title: string; options: MenuOptionWithColor[] }[] =
          formattedResults.map((item) => ({
            title: item.title,
            options: item.options.filter(
              (option) => !cachedSelectedIds.has(option.id),
            ),
          }));
        const cached: { title: string; options: MenuOptionWithColor[] }[] =
          isGroupItems(cachedSelectedItems) ? cachedSelectedItems : [];
        return [...filtered, ...cached];
      }

      // Flat items branch
      const filtered = formattedResults.filter(
        (item) => !cachedSelectedIds.has(item.id),
      );
      const cached: MenuOptionWithColor[] = isGroupItems(cachedSelectedItems)
        ? []
        : cachedSelectedItems;
      return [...filtered, ...cached];
    }

    const formattedResults: MenuOptionWithColor[] = results.map((result) => {
      const item = result as SearchResultItem;
      return {
        id: item.id?.toString() || "",
        label: item?.title || item?.name || "",
        description: item?.subject || item?.description || "",
      };
    });

    const filtered = formattedResults.filter(
      (item) => !cachedSelectedIds.has(item.id),
    );
    const cached: MenuOptionWithColor[] = isGroupItems(cachedSelectedItems)
      ? []
      : cachedSelectedItems;
    return [...filtered, ...cached];
  };
  const itemsList = formatResults(results);

  // Compute valid default selected IDs - only include IDs that are actually in the items list
  // This prevents race conditions where defaultValues are set before items are loaded
  const validDefaultSelectedIds = useMemo(() => {
    if (!defaultValues || defaultValues.length === 0) {
      return undefined;
    }

    // Create a set of available item IDs for fast lookup
    const availableIds = new Set(
      itemsList.flatMap((item) =>
        "options" in item ? item.options.map((opt) => opt.id) : [item.id],
      ),
    );

    // Filter defaultValues to only include IDs that are present in itemsList
    const validIds = defaultValues.filter((id) => availableIds.has(id));

    // Only return if we have valid IDs and hydration is complete
    // If hydration is still in progress, return undefined to prevent premature selection
    return !isAutocompleteReady && validIds.length > 0 ? validIds : undefined;
  }, [defaultValues, itemsList, isAutocompleteReady]);

  // Mark as initialized once hydration completes
  useEffect(() => {
    if (!isAutocompleteReady) {
      isInitializedRef.current = true;
    }
  }, [isAutocompleteReady]);

  // Wrapper for onSelect that prevents the initial empty array call during initialization
  const handleSelect = (value: string | string[]) => {
    if (!onSelect || isAutocompleteReady) {
      return;
    }

    // Check if this is an empty value (empty string or empty array)
    const isEmpty =
      value === "" || (Array.isArray(value) && value.length === 0);
    const isArray = Array.isArray(value);
    // If component is initialized and this is the first call with empty value, ignore it
    // This prevents the race condition where Autocomplete calls onSelect with [] during initialization
    if (isInitializedRef.current && !hasSeenFirstSelectRef.current && isEmpty) {
      hasSeenFirstSelectRef.current = true;
      return;
    }

    // Mark that we've seen a select call
    hasSeenFirstSelectRef.current = true;

    // Only call onSelect if component is initialized
    if (isInitializedRef.current) {
      onSelect(value);
      const resolveItemById = (itemId: string) => {
        for (const item of itemsList) {
          if ("id" in item && item.id === itemId) return item;
          if ("options" in item) {
            const opt = item.options.find((o) => o.id === itemId);
            if (opt) {
              return {
                id: opt.id,
                label: opt.label,
              } as AutocompleteProps["items"][number];
            }
          }
        }
        return undefined;
      };
      if (isArray) {
        const selectedItems = value
          .map(resolveItemById)
          .filter(
            (item): item is NonNullable<typeof item> => item !== undefined,
          );

        setCachedSelectedItems((prev) => {
          // Create a set of existing item IDs for fast lookup
          const existingIds = new Set(
            prev.flatMap((item) =>
              "options" in item ? item.options.map((opt) => opt.id) : [item.id],
            ),
          );

          // Filter out items that already exist
          const newItems = selectedItems.filter(
            (item) => "id" in item && !existingIds.has(item.id),
          );

          return [...prev, ...newItems] as AutocompleteProps["items"];
        });
      } else {
        const selectedItem = resolveItemById(value);
        if (selectedItem) {
          setCachedSelectedItems((prev) => {
            // Check if item already exists
            const existingIds = new Set(
              prev.flatMap((item) =>
                "options" in item
                  ? item.options.map((opt) => opt.id)
                  : [item.id],
              ),
            );

            // Only add if it doesn't already exist
            if ("id" in selectedItem && !existingIds.has(selectedItem.id)) {
              return [...prev, selectedItem] as AutocompleteProps["items"];
            }
            return prev;
          });
        }
      }
    }
  };

  const autocompleteProps: AutocompleteProps = {
    fullWidth: true,
    className,
    disabled,
    searchMode: "remote",
    popoverPlacement: "bottom-right",
    textfieldProps: {
      id: "backend-selector-textfield",
      ...textfieldProps,
    },
    debounceValue: 500,
    defaultSelectedIds: validDefaultSelectedIds,
    items: itemsList,
    loadingProps: {
      isLoading: isLoading && !isAutocompleteReady,
      message: loadingMessage || t("searching"),
    },
    onValueChange: (event: string) => {
      setSearchInput(event);
    },
    onClear: () => {
      setSearchInput("");
      onClear?.();
      setCachedSelectedItems([]);
    },
  };

  if (multiSelect) {
    return (
      <Autocomplete
        {...autocompleteProps}
        multiSelect={true}
        onSelect={handleSelect}
      />
    );
  }

  return (
    <Autocomplete
      {...autocompleteProps}
      multiSelect={false}
      onSelect={handleSelect}
    />
  );
};
