import { useCallback, useEffect, useMemo } from "react";
import type { Result } from "typescript-result";

import { useAsync } from "@bsport/use-async";

/**
 * Local filter function signature for filtering store data
 */
export type FilterFunction<TResult> = (
  data: TResult[],
  query: string,
) => TResult[];

/**
 * Configuration for store-based search with optional API trigger
 */
export type StoreSearchConfig<TParams, TResult> = {
  initialValue?: string;
  /**
   * Optional search function to trigger API calls (e.g., for fetching fresh data)
   * @param query - The search query string
   * @param params - Additional parameters for the search
   */
  searchFn: (
    query: string,
    params?: Partial<{ id__in?: string }> & TParams,
  ) => Promise<Result<unknown, unknown>>;

  /**
   * Store selector to get data from Zustand store
   */
  data: TResult[];

  /**
   * Optional filter function to search through store data
   * If not provided, all store data will be returned
   */
  filterFn?: FilterFunction<TResult>;
};

/**
 * Generic search hook configuration
 */
export type UseSearchConfig<TParams, TResult> = {
  /**
   * The current search query string
   */
  searchInput?: string;

  /**
   * Store configuration for data injection and filtering
   */
  storeConfig: StoreSearchConfig<TParams, TResult>;
};

/**
 * A generic search hook that works with Zustand store data injection.
 * Optionally supports API calls to refresh store data.
 *
 * @template TParams - Type for additional search parameters
 * @template TResult - Type for search results
 *
 * @param config - Configuration object for the search
 * @returns Object containing search state and controls
 * @returns returns.results - Array of filtered search results from store
 * @returns returns.search - Function to manually trigger search
 * @returns returns.isLoading - Boolean indicating if API call is in progress
 * @returns returns.isEmptySearch - Boolean indicating if search returned no results
 * @returns returns.hasInitialData - Boolean indicating if initial data has been loaded
 */
export const useGenericSearch = <
  TParams = Record<string, unknown>,
  TResult = unknown,
>(
  config: UseSearchConfig<TParams, TResult>,
) => {
  const { searchInput = "", storeConfig } = config;

  const { searchFn, filterFn, data, initialValue } = storeConfig;

  const [{ isLoading }, fetchItems] = useAsync<typeof searchFn>({
    asyncFn: searchFn,
  });

  const [{ isLoading: isHydrating }, hydrateItems] = useAsync<typeof searchFn>({
    asyncFn: searchFn,
  });

  // Apply client-side filtering
  const filteredData = useMemo(() => {
    // If no filter function provided, return all store data
    if (!filterFn) return data;

    // Only apply filter if we have a query and it meets minimum length
    if (!searchInput) {
      return data;
    }

    return filterFn(data, searchInput);
  }, [data, searchInput, filterFn]);

  // Manual search trigger (for API calls)
  const performSearch = useCallback(() => {
    if (fetchItems) {
      fetchItems(searchInput);
    }
  }, [fetchItems, searchInput]);

  const isEmptySearch = filteredData.length === 0;

  // Handle search input changes
  useEffect(() => {
    if (searchInput) {
      // Only perform search if we have initial data and user is searching
      performSearch();
    }
  }, [searchInput, performSearch]);

  // Handle initial data loading
  useEffect(() => {
    if (initialValue) {
      hydrateItems("", {
        id__in: initialValue,
      } as { id__in: string } & TParams);
    } else {
      fetchItems("");
    }
  }, []);

  return {
    results: filteredData,
    search: performSearch,
    isLoading,
    isHydrating,
    isEmptySearch,
  };
};
