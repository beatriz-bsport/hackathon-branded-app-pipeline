import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { passesInfiniteQueryOptions } from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

import { COMPATIBLE_PASSES_PAGE_SIZE } from "./constants";

export const useCompatiblePasses = (metaActivityId: number) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery(
    passesInfiniteQueryOptions(fetch, {
      meta_activity: metaActivityId,
      disabled: false,
      page_size: COMPATIBLE_PASSES_PAGE_SIZE,
    }),
  );

  // TODO: Replace with scroll-based pagination to preserve infinite query benefits.
  // Currently fetches all pages eagerly, which defeats the purpose of pagination.
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError)
      fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  return {
    passes: data?.pages.flatMap((p) => p.results) ?? [],
    count: data?.pages[0]?.count ?? 0,
  };
};
