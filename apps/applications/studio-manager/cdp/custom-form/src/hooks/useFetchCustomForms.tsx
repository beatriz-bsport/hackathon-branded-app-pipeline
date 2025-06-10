import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  selectCustomFormCount,
  selectCustomFormStatistics,
  selectCustomForms,
  useCustomFormStore,
} from "@bsport/store-cdp-custom-form";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useFetcherCustomForms } from "#src/hooks/api/use-fetcher-custom-form";
import { useFetcherCustomFormStatistics } from "#src/hooks/api/use-fetcher-custom-form-statistics";
import { useSearchCustomForms } from "#src/hooks/api/use-fuzzy-search-custom-forms";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

type UseFetchCustomFormsParams = {
  searchInput: string;
  archived?: boolean;
};

const MAXIMUM_SEARCH_RESULTS = 20;

export const useFetchCustomForms = ({
  searchInput,
  archived,
}: UseFetchCustomFormsParams) => {
  const { currentPage, currentPageSize, setPageSettings, setPage } =
    usePaginationQueryParams({
      shouldReplace: true,
      defaultValues: { page: DEFAULT_PAGE, page_size: DEFAULT_PAGE_SIZE },
    });

  // Selectors

  const customForms = useCustomFormStore(selectCustomForms);
  const customFormStatistics = useCustomFormStore(selectCustomFormStatistics);
  const count = useCustomFormStore(selectCustomFormCount);

  // Fetch Custom Forms Statistics

  const { isLoading: formStatisticsLoading, fetchFormStatistics } =
    useFetcherCustomFormStatistics();

  const { isLoading: formSearchingLoading, searchForms } =
    useSearchCustomForms();

  const { isLoading: formsLoading, fetchForms } = useFetcherCustomForms({
    onSuccess: (response) => {
      const { results = [] } = response;
      const idsList = results.map((customForm) => customForm.id);
      fetchCustomFormStatistics({ customFormIds: idsList });
    },
  });

  const fetchCustomFormStatistics = useCallback(
    async ({ customFormIds }: { customFormIds: number[] }) => {
      // TODO : When backend is ready, we can add the id__in filters required
      return fetchFormStatistics({
        page_size: customFormIds.length,
        page: currentPage,
      });
    },
    [fetchFormStatistics, currentPage],
  );

  // Fetch Custom Forms Statistics

  const fetchCustomForms = useCallback(
    async (pagination?: { page_size?: number; page?: number }) => {
      return fetchForms({
        page_size: pagination?.page_size ?? currentPageSize,
        page: pagination?.page ?? currentPage,
        disabled: !!archived, // when true, fetch archived (disabled) forms
      });
    },
    [fetchForms, currentPage, currentPageSize, archived],
  );
  // Fuzzy Search Custom Forms

  const fuzzySearchCustomForms = useCallback(async () => {
    return searchForms({
      disabled: !!archived,
      queryString: searchInput,
      page_size: MAXIMUM_SEARCH_RESULTS,
      page: 1,
    });
  }, [searchForms, searchInput, archived]);

  // Utility methods to interface custom forms fetching

  /**
   * Fetches the first page of the custom forms unrelated to any pagination settings.
   */
  const resetCustomForms = useCallback(async () => {
    setPage(1);
    return fetchCustomForms({ page: 1 });
  }, [fetchCustomForms, setPage]);

  /**
   * Fetches custom forms based on the current pagination settings.
   */
  const refreshCustomForms = useCallback(async () => {
    return fetchCustomForms();
  }, [fetchCustomForms]);

  // Returned values

  const paginationParams: PaginationProps = {
    currentPage: searchInput ? 1 : currentPage, // We always reset to page 1 when searching
    rowsPerPage: searchInput ? MAXIMUM_SEARCH_RESULTS : currentPageSize, // design decision: always show 20 results when searching
    totalItems: count,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: !searchInput,
  };
  const isCustomFormsLoading = searchInput
    ? formSearchingLoading
    : formsLoading;
  const isLoading = isCustomFormsLoading || formStatisticsLoading;
  const isEmpty = count === 0;
  const isEmptySearch = isEmpty && !!searchInput;

  return {
    paginationParams,
    customForms,
    customFormStatistics,
    fetchCustomForms,
    resetCustomForms,
    refreshCustomForms,
    fuzzySearchCustomForms,
    isLoading,
    isEmpty,
    isEmptySearch,
  };
};
