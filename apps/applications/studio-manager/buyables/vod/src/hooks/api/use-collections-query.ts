import { useQuery } from "@tanstack/react-query";

import {
  type FetchCollectionsParams,
  fetchCollectionsQueryOptions,
} from "@bsport/api-buyables/collection";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

export const useCollectionsQuery = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const params: FetchCollectionsParams = {
    mine: true,
    page: currentPage,
    page_size: currentPageSize,
  };

  const { data, isLoading, isError } = useQuery(
    fetchCollectionsQueryOptions(fetch, params),
  );

  const collections = data?.results ?? [];
  const totalItems = data?.count ?? 0;
  const isEmpty = !isLoading && !isError && totalItems === 0;

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: (page, pageSize) => {
      if (pageSize !== currentPageSize) {
        setPageSettings(DEFAULT_PAGE, pageSize);
      } else {
        setPageSettings(page, pageSize);
      }
    },
    showRowsPerPageSelector: true,
  };

  return { collections, isLoading, isEmpty, paginationProps };
};
