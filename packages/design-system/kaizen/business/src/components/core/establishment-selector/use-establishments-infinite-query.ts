import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchEstablishmentsInfiniteQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const PAGE_SIZE = 100;

export const useEstablishmentsInfiniteQuery = (companyId: number) => {
  const baseParams = {
    company: companyId,
    disabled: false,
    page_size: PAGE_SIZE,
  };

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    ...fetchEstablishmentsInfiniteQueryOptions(fetch, baseParams),
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });

  useEffect(() => {
    // Fetch next page until there is nothing more to fetch
    // If it fails multiple times (default retry: 3), the isError prevents infinite loop
    if (hasNextPage && !isFetchingNextPage && !isError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isError]);

  return {
    data: data?.pages.flatMap((page) => page.results) ?? [],
    isLoading: isLoading || hasNextPage || isFetchingNextPage,
    isError,
  };
};
