import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchTeachersAction,
  fuzzySearchTeachersAction,
  selectCount,
  selectFuzzySearchTeachers,
  selectTeachers,
  useTeacherStore,
} from "@bsport/store-core-data-teacher";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

export const useFetchTeachers = ({
  searchInput,
  archived,
}: {
  searchInput: string;
  archived?: boolean;
}) => {
  // Retrieve pagination params from the URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // Retrieve pagination results from the store
  const pageTeachers = useTeacherStore(selectTeachers);
  const fuzzyTeachers = useTeacherStore(selectFuzzySearchTeachers);
  const count = useTeacherStore(selectCount);

  // Paginated fetcher
  const _fetchTeacherPage = useCallback(async () => {
    return fetchTeachersAction(fetch, {
      page_size: currentPageSize,
      page: currentPage,
      disabled: !!archived,
    });
  }, [currentPage, currentPageSize, archived]);

  const [{ isLoading: isLoadingPage }, fetchTeacherPage] = useAsync<
    typeof _fetchTeacherPage
  >({
    asyncFn: _fetchTeacherPage,
    dependencies: [_fetchTeacherPage],
    onFailure: console.error,
  });

  // Fuzzy fetcher
  const _fuzzySearchTeachers = useCallback(async () => {
    return fuzzySearchTeachersAction(fetch, {
      disabled: !!archived,
      queryString: searchInput,
      page_size: currentPageSize,
      page: DEFAULT_PAGE,
    });
  }, [currentPageSize, searchInput, archived]);

  const [{ isLoading: isLoadingFuzzy }, fuzzySearchTeachers] = useAsync<
    typeof _fuzzySearchTeachers
  >({
    asyncFn: _fuzzySearchTeachers,
    dependencies: [_fuzzySearchTeachers],
    onFailure: console.error,
  });

  const paginationParams: PaginationProps = searchInput
    ? // Fuzzy search pagination parameters
      {
        currentPage: DEFAULT_PAGE,
        rowsPerPage: currentPageSize,
        totalItems: fuzzyTeachers.length,
        showRowsPerPageSelector: true,
      }
    : // Basic pagination parameters
      {
        currentPage: currentPage,
        rowsPerPage: currentPageSize,
        totalItems: count,
        onPageSettingsChange: setPageSettings,
        showRowsPerPageSelector: true,
      };
  const teachers = searchInput ? fuzzyTeachers : pageTeachers;
  const isLoading = searchInput ? isLoadingFuzzy : isLoadingPage;
  const isEmpty = searchInput ? fuzzyTeachers.length === 0 : count === 0;
  const isEmptySearch = isEmpty && !!searchInput;

  return {
    paginationParams,
    teachers,
    fetchTeacherPage,
    fuzzySearchTeachers,
    isLoading,
    isEmpty,
    isEmptySearch,
  };
};
