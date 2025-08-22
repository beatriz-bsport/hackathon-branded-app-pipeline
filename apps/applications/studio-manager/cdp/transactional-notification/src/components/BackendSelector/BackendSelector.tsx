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
   *
   * @example
   * ```tsx
   * optionsFormatter={(results) =>
   *   results.map((item) => ({
   *     id: item.id.toString(),
   *     label: item.title,
   *     description: item.subject,
   *   }))
   * }
   * ```
   */
  optionsFormatter?: (results: TResult[]) => AutocompleteProps["items"];

  /**
   * Props to customize the underlying text field component.
   * Common props include label, placeholder, iconLeft, etc.
   *
   * @example
   * ```tsx
   * textfieldProps={{
   *   id: "my-selector",
   *   label: "Select an item",
   *   placeholder: "Start typing to search...",
   *   iconLeft: "search",
   * }}
   * ```
   */
  textfieldProps?: TextFieldProps;

  /**
   * Loading message to display during search operations
   * Note: Store-based search is instant, so this is mainly for consistency
   *
   * @example
   * ```tsx
   * loadingMessage="Searching templates..."
   * ```
   */
  loadingMessage?: string;
  defaultValues?: string[];
  className?: string;
  onSelect?: (selectedId: string) => void;
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
  storeConfig,
  textfieldProps,
  loadingMessage,
  optionsFormatter,
  onSelect,
  defaultValues,
  className,
}: BackendSelectorProps<TParams, TResult>) => {
  const { t } = useTranslation("transactionalNotification");
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

  return (
    <Autocomplete
      fullWidth
      className={className}
      searchMode="remote"
      popoverPlacement="bottom-right"
      textfieldProps={{
        id: "backend-selector-textfield",
        ...textfieldProps,
      }}
      defaultSelectedIds={defaultValues ? defaultValues : []}
      items={itemsList}
      loadingProps={{
        isLoading: isLoading && !isHydrating,
        message:
          loadingMessage ||
          t(
            "notificationRuleEventDetails.details.emailTemplateSelector.searchingMessage",
          ),
      }}
      onSelect={(value: string) => {
        onSelect?.(value);
      }}
      onValueChange={(event: string) => {
        setSearchInput(event);
      }}
    />
  );
};
