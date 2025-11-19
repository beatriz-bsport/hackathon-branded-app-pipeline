import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchPacksAction,
  fuzzySearchPacksAction,
  selectCount,
  selectFuzzyPacks,
  selectPacks,
  usePackStore,
} from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

const DEFAULT_SEARCH_SIZE = 20;

export const useFetchPacks = ({ searchInput }: { searchInput: string }) => {
  // Retrieve pagination params from the URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // Retrieve pagination and search results from the store
  const pagePacks = usePackStore(selectPacks);
  const fuzzyPacks = usePackStore(selectFuzzyPacks);
  const count = usePackStore(selectCount);

  // Paginated fetch
  const handleFetchPacks = useCallback(async () => {
    return fetchPacksAction(fetch, {
      page: currentPage,
      page_size: currentPageSize,
    });
  }, [currentPage, currentPageSize]);

  const [{ isLoading: isLoadingPage }, fetchPacks] = useAsync<
    typeof handleFetchPacks
  >({
    asyncFn: handleFetchPacks,
    dependencies: [handleFetchPacks],
    onFailure: console.error,
  });

  // Fuzzy fetch
  const handleFuzzySearchPacks = useCallback(async () => {
    return fuzzySearchPacksAction(fetch, {
      page_size: DEFAULT_SEARCH_SIZE,
      queryString: searchInput,
    });
  }, [searchInput]);

  const [{ isLoading: isLoadingFuzzy }, fuzzySearchPacks] = useAsync<
    typeof handleFuzzySearchPacks
  >({
    asyncFn: handleFuzzySearchPacks,
    dependencies: [handleFuzzySearchPacks],
    onFailure: console.error,
  });

  const onPageSettingsChange = (page: number, pageSize: number) => {
    if (pageSize !== currentPageSize) {
      setPageSettings(DEFAULT_PAGE, pageSize);
    } else {
      setPageSettings(page, pageSize);
    }
  };

  // Define paramaters to provide to Table
  const paginationParams: PaginationProps = searchInput
    ? // Fuzzy search pagination parameters
      {
        currentPage: DEFAULT_PAGE,
        rowsPerPage: DEFAULT_SEARCH_SIZE,
        totalItems: fuzzyPacks.length,
        showRowsPerPageSelector: true,
      }
    : // Basic pagination parameters
      {
        currentPage: currentPage,
        rowsPerPage: currentPageSize,
        totalItems: count,
        onPageSettingsChange: onPageSettingsChange,
        showRowsPerPageSelector: true,
      };

  const packs = searchInput ? fuzzyPacks : pagePacks;
  const isLoading = searchInput ? isLoadingFuzzy : isLoadingPage;
  const isEmpty = searchInput ? fuzzyPacks.length === 0 : count === 0;
  const isEmptySearch = isEmpty && searchInput.trim().length > 0;

  return {
    paginationParams,
    packs,
    fetchPacks,
    fuzzySearchPacks,
    isLoading,
    isEmpty,
    isEmptySearch,
  };
};
