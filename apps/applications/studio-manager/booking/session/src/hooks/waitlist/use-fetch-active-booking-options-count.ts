import { useQuery } from "@tanstack/react-query";

import { fetchPaginatedBookingOptionsQueryOption } from "@bsport/api-book";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useFetchActiveBookingOptionsCount = (sessionId: number) => {
  const { currentPage, currentPageSize } = usePaginationQueryParams({
    namespace: "waiting-list",
  });

  const { data } = useQuery({
    ...fetchPaginatedBookingOptionsQueryOption(fetch, {
      offer: sessionId,
      cancelled: false,
      page: currentPage,
      page_size: currentPageSize,
    }),
    throwOnError: true,
    staleTime: STALE_TIME,
    select: (data) => data.count,
  });

  return data ?? 0;
};
