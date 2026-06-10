import { useInfiniteQuery } from "@tanstack/react-query";

import {
  type FetchInboxConversationsParams,
  inboxConversationsInfiniteQueryOptions,
} from "@bsport/api-cdp/inbox";

import { fetch } from "#src/utils/fetch";

const INBOX_CONVERSATIONS_STALE_TIME = 60 * 1000; // 1 minute

/**
 * Loads the B2B inbox thread list as an infinite, page-by-page feed. Flattens
 * the paginated results into a single `conversations` array and re-exposes the
 * TanStack Query controls needed to drive infinite scroll.
 */
export const useInboxConversations = (
  params: FetchInboxConversationsParams = {},
) => {
  const {
    data,
    isLoading,
    isError,
    isFetchNextPageError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    ...inboxConversationsInfiniteQueryOptions(fetch, params),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    staleTime: INBOX_CONVERSATIONS_STALE_TIME,
  });

  return {
    conversations: data?.pages.flatMap((page) => page.results) ?? [],
    isLoading,
    hasError: isError,
    hasFetchNextPageError: isFetchNextPageError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
};
