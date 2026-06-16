import { useInfiniteQuery } from "@tanstack/react-query";

import {
  type FetchInboxMessagesParams,
  type InboxMessagesPageParam,
  inboxMessagesInfiniteQueryOptions,
} from "@bsport/api-cdp/inbox";

import { fetch } from "#src/utils/fetch";

const INBOX_MESSAGES_STALE_TIME = 60 * 1000; // 1 minute

/**
 * Loads the messages of a conversation as a bidirectional, cursor-paginated
 * feed. The initial load returns a window around the seam (the read/unread
 * boundary); `fetchPreviousPage` walks older history (`before` cursor) and
 * `fetchNextPage` walks newer messages (`after` cursor).
 *
 * Flattens the paginated results into a single `messages` array (oldest →
 * newest) and re-exposes the TanStack Query controls needed to drive the
 * scrollback / live-tail UX.
 */
export const useThreadMessages = (
  conversationId: string,
  params: FetchInboxMessagesParams = {},
) => {
  const {
    data,
    isLoading,
    isError,
    isFetchNextPageError,
    isFetchPreviousPageError,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
  } = useInfiniteQuery({
    ...inboxMessagesInfiniteQueryOptions(fetch, conversationId, params),
    initialPageParam: {} as InboxMessagesPageParam,
    getNextPageParam: (lastPage): InboxMessagesPageParam | undefined =>
      lastPage.hasMoreAfter
        ? { after: lastPage.messages.at(-1)?.id }
        : undefined,
    getPreviousPageParam: (firstPage): InboxMessagesPageParam | undefined =>
      firstPage.hasMoreBefore
        ? { before: firstPage.messages[0]?.id }
        : undefined,
    staleTime: INBOX_MESSAGES_STALE_TIME,
  });

  return {
    messages: data?.pages.flatMap((page) => page.messages) ?? [],
    // The seam comes from the page that carried it (the initial, no-cursor load).
    firstUnreadId:
      data?.pages.find((page) => page.firstUnreadId !== null)?.firstUnreadId ??
      null,
    isLoading,
    hasError: isError,
    hasFetchNextPageError: isFetchNextPageError,
    hasFetchPreviousPageError: isFetchPreviousPageError,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
  };
};
