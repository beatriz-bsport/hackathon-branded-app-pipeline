import { useState } from "react";

import {
  Autocomplete,
  type AutocompleteProps,
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
  optionsFormatter?: (results: TResult[]) => AutocompleteProps["items"];

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

  // Use the generic search hook
  const { results, isLoading, isHydrating } = useGenericSearch<
    TParams,
    TResult
  >({
    searchInput,
    storeConfig: {
      ...storeConfig,
      initialValue: defaultValues?.join(",") || "",
    },
  });

  // Memoized function to compute autocomplete items
  const formatResults = (results: TResult[]): AutocompleteProps["items"] => {
    if (optionsFormatter) {
      return optionsFormatter(results);
    }
    return results.map((result) => {
      const item = result as SearchResultItem;
      return {
        id: item.id?.toString() || "",
        label: item?.title || item?.name || "",
        description: item?.subject || item?.description || "",
      };
    });
  };

  const itemsList = formatResults(results);

  if (isHydrating) {
    return <div className={className}>Loading...</div>; // Placeholder while hydrating
  }

  const autocompleteProps: AutocompleteProps = {
    fullWidth: true,
    clearOnSelect: true,
    className: className,
    disabled: disabled,
    searchMode: "remote",
    popoverPlacement: "bottom-right",
    textfieldProps: {
      id: "backend-selector-textfield",
      ...textfieldProps,
    },
    debounceValue: 500,
    defaultSelectedIds: defaultValues,
    items: itemsList,
    loadingProps: {
      isLoading: isLoading && !isHydrating,
      message: loadingMessage || t("searching"),
    },
    onValueChange: (event: string) => {
      setSearchInput(event);
    },
    onClear: () => {
      setSearchInput("");
      onClear?.();
    },
  };

  if (multiSelect) {
    return (
      <Autocomplete
        {...autocompleteProps}
        multiSelect={true}
        onSelect={(value) => {
          onSelect?.(value);
        }}
      />
    );
  }

  return (
    <Autocomplete
      {...autocompleteProps}
      multiSelect={false}
      onSelect={(value) => {
        onSelect?.(value);
      }}
    />
  );
};
