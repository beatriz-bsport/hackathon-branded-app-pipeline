import { mutationOptions } from "@tanstack/react-query";

import { type Fetch, type URLParams, buildUrlParams } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import {
  INBOX_CHANNEL_TO_WIRE_NAME,
  INBOX_CONVERSATION_API_URL,
  INBOX_CONVERSATION_SEARCH_API_URL,
  inboxMessagesApiUrl,
} from "./constants";
import type {
  FetchInboxConversationsParams,
  FetchInboxConversationsSearchParams,
  FetchInboxMessagesParams,
  InboxMessagesCursor,
  RawStudioManagerConversationsResponse,
  RawStudioManagerConversationsSearchResponse,
  RawStudioManagerTimelineResponse,
} from "./types";

export const inboxKeys = {
  all: [QUERY_KEY_MAIN, "inbox-conversation"] as const,
  lists: () => [...inboxKeys.all, "list"] as const,
  infiniteLists: () => [...inboxKeys.lists(), "infinite"] as const,
  infinite: (params: FetchInboxConversationsParams) =>
    [...inboxKeys.infiniteLists(), params] as const,
  // Search is a separate endpoint with an incompatible (page-number)
  // pagination contract, so it gets its own key sub-tree under `all` rather
  // than reusing `lists()`. This guarantees the cursor list and the search
  // results never collide in the query cache.
  searchLists: () => [...inboxKeys.all, "search", "list"] as const,
  searchInfiniteLists: () => [...inboxKeys.searchLists(), "infinite"] as const,
  searchInfinite: (params: FetchInboxConversationsSearchParams) =>
    [...inboxKeys.searchInfiniteLists(), params] as const,
} as const;

/**
 * The `last_inbox_activity_at` cursor passed as the infinite-query `pageParam`.
 * `undefined` is the initial (most-recent) load.
 */
export type InboxConversationsPageParam = string | undefined;

/** Fetches a raw page of conversations — no transformation (normalize app-side). */
export const fetchInboxConversationsAPI = async (
  fetch: Fetch<RawStudioManagerConversationsResponse>,
  params: FetchInboxConversationsParams,
): Promise<RawStudioManagerConversationsResponse> => {
  const { data } = await fetch(
    `${INBOX_CONVERSATION_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

export const inboxConversationsInfiniteQueryOptions = (
  fetch: Fetch<RawStudioManagerConversationsResponse>,
  params: FetchInboxConversationsParams = {},
) => ({
  queryKey: inboxKeys.infinite(params),
  queryFn: ({ pageParam }: { pageParam: InboxConversationsPageParam }) =>
    fetchInboxConversationsAPI(fetch, {
      ...params,
      // Omit the cursor keys on the initial load — `buildUrlParams` stringifies
      // every value, so passing `undefined` would send `?...cursor=undefined`.
      ...(pageParam !== undefined
        ? { last_inbox_activity_at_cursor: pageParam, direction: "older" }
        : {}),
    }),
});

export const markConversationAsReadAPI = async (
  fetch: Fetch<void>,
  conversationId: string,
): Promise<void> => {
  await fetch(`${INBOX_CONVERSATION_API_URL}/${conversationId}/mark_as_read/`, {
    method: "POST",
  });
};

export const markConversationAsReadMutationOptions = (
  fetch: Fetch<void>,
  conversationId: string,
) =>
  mutationOptions({
    mutationFn: () => markConversationAsReadAPI(fetch, conversationId),
  });

export const markConversationAsUnreadAPI = async (
  fetch: Fetch<void>,
  conversationId: string,
): Promise<void> => {
  await fetch(
    `${INBOX_CONVERSATION_API_URL}/${conversationId}/mark_as_unread/`,
    {
      method: "POST",
    },
  );
};

export const markConversationAsUnreadMutationOptions = (
  fetch: Fetch<void>,
  conversationId: string,
) =>
  mutationOptions({
    mutationFn: () => markConversationAsUnreadAPI(fetch, conversationId),
  });

/** Fetches a raw page of search matches — no transformation (normalize app-side). */
export const fetchInboxConversationsSearchAPI = async (
  fetch: Fetch<RawStudioManagerConversationsSearchResponse>,
  params: FetchInboxConversationsSearchParams,
): Promise<RawStudioManagerConversationsSearchResponse> => {
  const { data } = await fetch(
    `${INBOX_CONVERSATION_SEARCH_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

/** The 1-based page number passed as the search infinite-query `pageParam`. */
export type InboxConversationsSearchPageParam = number;

/**
 * Params accepted by the infinite builder: the full search params minus `page`,
 * which the infinite query owns through `pageParam`. Excluding it keeps the
 * query key stable — a caller-supplied `page` would otherwise fragment the same
 * search across multiple cache entries for no behavioral difference.
 */
export type InboxConversationsSearchInfiniteParams = Omit<
  FetchInboxConversationsSearchParams,
  "page"
>;

export const inboxConversationsSearchInfiniteQueryOptions = (
  fetch: Fetch<RawStudioManagerConversationsSearchResponse>,
  params: InboxConversationsSearchInfiniteParams,
) => ({
  queryKey: inboxKeys.searchInfinite(params),
  queryFn: ({ pageParam }: { pageParam: InboxConversationsSearchPageParam }) =>
    fetchInboxConversationsSearchAPI(fetch, { ...params, page: pageParam }),
});

export const inboxMessageKeys = {
  all: [QUERY_KEY_MAIN, "inbox-message"] as const,
  lists: () => [...inboxMessageKeys.all, "list"] as const,
  infiniteLists: () => [...inboxMessageKeys.lists(), "infinite"] as const,
  infinite: (conversationId: string, params: FetchInboxMessagesParams) =>
    [...inboxMessageKeys.infiniteLists(), conversationId, params] as const,
} as const;

/** Fetches a raw page of the timeline — no transformation (normalize app-side). */
export const fetchInboxMessagesAPI = async (
  fetch: Fetch<RawStudioManagerTimelineResponse>,
  conversationId: string,
  params: FetchInboxMessagesParams,
): Promise<RawStudioManagerTimelineResponse> => {
  const { channels, communication_sent_id, direction, limit, message_types } =
    params;

  const limitParam: URLParams = limit !== undefined ? { limit } : {};

  const messageTypesParam: URLParams =
    message_types !== undefined ? { message_types } : {};

  const channelsParam: URLParams = channels?.length
    ? {
        channels: channels.map(
          (channel) => INBOX_CHANNEL_TO_WIRE_NAME[channel],
        ),
      }
    : {};

  const cursorParam: URLParams =
    communication_sent_id !== undefined && direction !== undefined
      ? { communication_sent_id, direction }
      : {};

  const query: URLParams = {
    ...limitParam,
    ...messageTypesParam,
    ...channelsParam,
    ...cursorParam,
  };
  const { data } = await fetch(
    `${inboxMessagesApiUrl(conversationId)}/${buildUrlParams(query)}`,
  );
  return data;
};

/**
 * Cursor for the bidirectional message feed — the same both-or-neither
 * {@link InboxMessagesCursor}. `communication_sent_id` + `direction` page
 * relative to a message; an empty object is the initial (seam) load.
 */
export type InboxMessagesPageParam = InboxMessagesCursor;

export const inboxMessagesInfiniteQueryOptions = (
  fetch: Fetch<RawStudioManagerTimelineResponse>,
  conversationId: string,
  params: FetchInboxMessagesParams = {},
) => ({
  queryKey: inboxMessageKeys.infinite(conversationId, params),
  queryFn: ({ pageParam }: { pageParam: InboxMessagesPageParam }) =>
    fetchInboxMessagesAPI(fetch, conversationId, { ...params, ...pageParam }),
});
