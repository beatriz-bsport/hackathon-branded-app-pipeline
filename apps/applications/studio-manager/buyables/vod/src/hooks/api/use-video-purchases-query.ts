import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchVideoPurchasesQueryOptions } from "@bsport/api-buyables/video-purchase";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";

import { PURCHASES_PAGE_SIZE } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

export const useVideoPurchasesQuery = (videoId: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [videoId]);

  const { data, isFetching, isPending, isError, error } = useQuery({
    ...fetchVideoPurchasesQueryOptions(fetch, {
      video: videoId,
      page: currentPage,
      page_size: PURCHASES_PAGE_SIZE,
    }),
    placeholderData: keepPreviousData,
  });

  const totalCount = data?.count ?? 0;

  const paginationProps: PaginationProps = {
    currentPage,
    rowsPerPage: PURCHASES_PAGE_SIZE,
    totalItems: totalCount,
    disabled: isFetching,
    maxVisiblePages: 3,
    showRowsPerPageSelector: false,
    onPageSettingsChange: (page) => setCurrentPage(page),
  };

  return {
    purchases: data?.results ?? [],
    totalItems: data?.count,
    paginationProps,
    isLoading: isPending,
    isError,
    error,
  };
};
