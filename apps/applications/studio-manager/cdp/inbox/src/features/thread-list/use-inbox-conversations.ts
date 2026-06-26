import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import {
  type FetchInboxConversationsParams,
  type RawStudioManagerConversationsResponse,
  inboxConversationsInfiniteQueryOptions,
} from "@bsport/api-cdp/inbox";

import { fetch } from "#src/utils/fetch";

import { selectInboxConversations } from "./normalize-inbox-conversation";

// 1 minute: the api package stays opinion-free; this screen tolerates a short
// cache so navigating back into the inbox (or remounting during scroll) doesn't
// refetch the whole list every time.
const INBOX_CONVERSATIONS_STALE_TIME = 60 * 1000;

const getNextPageParam = (lastPage: RawStudioManagerConversationsResponse) =>
  lastPage.more_conversations
    ? lastPage.results.at(-1)?.last_inbox_activity_at
    : undefined;

/**
 * Loads the B2B inbox thread list as an infinite, cursor-based feed. The api
 * package exposes only `queryKey`/`queryFn`; this hook owns the app-level
 * options — cursor pagination (`initialPageParam`/`getNextPageParam`), the
 * raw→UI `select`, and `staleTime` — then flattens the normalized results and
 * re-exposes the controls that drive infinite scroll.
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
    initialPageParam: undefined,
    getNextPageParam,
    select: selectInboxConversations,
    staleTime: INBOX_CONVERSATIONS_STALE_TIME,
    // Keep the current list on screen while switching filters so toggling the
    // funnel swaps the rows in place instead of flashing the full-pane loader.
    placeholderData: keepPreviousData,
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
