import { useInfiniteQuery } from "@tanstack/react-query";

import {
  type FetchInboxMessagesParams,
  type InboxMessagesPageParam,
  type RawStudioManagerTimelineResponse,
  inboxMessagesInfiniteQueryOptions,
} from "@bsport/api-cdp/inbox";

import { fetch } from "#src/utils/fetch";

import { selectInboxMessages } from "./normalize-inbox-message";

const INBOX_MESSAGES_STALE_TIME = 60 * 1000; // 1 minute

// `getNextPageParam` / `getPreviousPageParam` read the RAW timeline page (the
// `select` only transforms the data exposed to the component), so they walk the
// envelope's window flags and the first/last `communication_sent_id`.
const getNextPageParam = (
  lastPage: RawStudioManagerTimelineResponse,
): InboxMessagesPageParam | undefined => {
  if (!lastPage.communication_sent_window.has_more_after) return undefined;

  const communication_sent_id =
    lastPage.items.at(-1)?.data.communication_sent_id;
  // `has_more_after` implies a non-empty page; the guard keeps the cursor pair
  // intact (both-or-neither) for the empty edge case.
  return communication_sent_id === undefined
    ? undefined
    : { communication_sent_id, direction: "newer" };
};

const getPreviousPageParam = (
  firstPage: RawStudioManagerTimelineResponse,
): InboxMessagesPageParam | undefined => {
  if (!firstPage.communication_sent_window.has_more_before) return undefined;

  const communication_sent_id = firstPage.items[0]?.data.communication_sent_id;

  return communication_sent_id === undefined
    ? undefined
    : { communication_sent_id, direction: "older" };
};

/**
 * Loads the messages of a conversation as a bidirectional, cursor-paginated
 * feed. The initial load returns a window around the seam (the read/unread
 * boundary); `fetchPreviousPage` walks older history (`direction: "older"`) and
 * `fetchNextPage` walks newer messages (`direction: "newer"`).
 *
 * Normalizes the raw timeline pages app-side (`selectInboxMessages`), flattens
 * the paginated results into a single `messages` array (oldest → newest) and
 * re-exposes the TanStack Query controls needed to drive the scrollback /
 * live-tail UX.
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
    getNextPageParam,
    getPreviousPageParam,
    select: selectInboxMessages,
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
