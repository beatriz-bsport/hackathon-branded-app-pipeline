import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type FetchVideosParams,
  fetchVideosQueryOptions,
} from "@bsport/api-buyables/video";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

export const useVideosQuery = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const params: FetchVideosParams & { mine: boolean } = {
    mine: true,
    page: currentPage,
    page_size: currentPageSize,
  };

  const { data } = useSuspenseQuery(fetchVideosQueryOptions(fetch, params));

  const videos = data.results;
  const totalItems = data.count;
  const isEmpty = totalItems === 0;

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

  return {
    videos,
    isEmpty,
    paginationProps,
  };
};
