import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchVideoViewsQueryOptions } from "@bsport/api-buyables/video-view";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";

import { VIEWS_PAGE_SIZE } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

export const useVideoViewsQuery = (videoId: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [videoId]);

  const { data, isFetching, isPending, isError, error } = useQuery({
    ...fetchVideoViewsQueryOptions(fetch, {
      video_analytics__video: videoId,
      page: currentPage,
      page_size: VIEWS_PAGE_SIZE,
    }),
    placeholderData: keepPreviousData,
  });

  const totalCount = data?.count ?? 0;

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: VIEWS_PAGE_SIZE,
    totalItems: totalCount,
    disabled: isFetching,
    maxVisiblePages: 3,
    showRowsPerPageSelector: false,
    onPageSettingsChange: (page) => setCurrentPage(page),
  };

  return {
    views: data?.results ?? [],
    totalItems: isError ? undefined : totalCount,
    paginationProps,
    isLoading: isPending,
    isError,
    error,
  };
};
