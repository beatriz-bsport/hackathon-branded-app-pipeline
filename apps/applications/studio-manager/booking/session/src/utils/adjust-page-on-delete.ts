import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { PaginatedResponse } from "@bsport/store-base";

/**
 * Adjusts the current page to the previous one when the last item on a page
 * is deleted, preventing a 404 from a paginated API.
 *
 * Call this in a mutation's `onSuccess` before `invalidateQueries`.
 */
export const adjustPageOnDelete = ({
  queryClient,
  queryKey,
  currentPage,
  setPage,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  currentPage: number;
  setPage: (page: number) => void;
}) => {
  if (currentPage <= 1) return;

  const cachedData = queryClient.getQueryData<PaginatedResponse>(queryKey);

  if (cachedData?.results.length === 1) {
    setPage(currentPage - 1);
  }
};
