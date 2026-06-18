import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { INBOX_CONVERSATION_API_URL, inboxMessagesApiUrl } from "./constants";
import type {
  FetchInboxConversationsParams,
  FetchInboxMessagesParams,
  InboxConversationListItem,
  InboxMessagesResponse,
} from "./types";

export const inboxKeys = {
  all: [QUERY_KEY_MAIN, "inbox-conversation"] as const,
  lists: () => [...inboxKeys.all, "list"] as const,
  infiniteLists: () => [...inboxKeys.lists(), "infinite"] as const,
  infinite: (params: FetchInboxConversationsParams) =>
    [...inboxKeys.infiniteLists(), params] as const,
} as const;

export const fetchInboxConversationsAPI = async (
  fetch: Fetch<PaginatedResponse<InboxConversationListItem>>,
  params: FetchInboxConversationsParams,
): Promise<PaginatedResponse<InboxConversationListItem>> => {
  const { data } = await fetch(
    `${INBOX_CONVERSATION_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

export const inboxConversationsInfiniteQueryOptions = (
  fetch: Fetch<PaginatedResponse<InboxConversationListItem>>,
  params: FetchInboxConversationsParams = {},
) => ({
  queryKey: inboxKeys.infinite(params),
  queryFn: ({ pageParam }: { pageParam: number }) =>
    fetchInboxConversationsAPI(fetch, { ...params, page: pageParam }),
});

export const inboxMessageKeys = {
  all: [QUERY_KEY_MAIN, "inbox-message"] as const,
  lists: () => [...inboxMessageKeys.all, "list"] as const,
  infiniteLists: () => [...inboxMessageKeys.lists(), "infinite"] as const,
  infinite: (conversationId: string, params: FetchInboxMessagesParams) =>
    [...inboxMessageKeys.infiniteLists(), conversationId, params] as const,
} as const;

export const fetchInboxMessagesAPI = async (
  fetch: Fetch<InboxMessagesResponse>,
  conversationId: string,
  params: FetchInboxMessagesParams,
): Promise<InboxMessagesResponse> => {
  const { data } = await fetch(
    `${inboxMessagesApiUrl(conversationId)}/${buildUrlParams(params)}`,
  );
  return data;
};

/**
 * Cursor for the bidirectional message feed. `before`/`after` are
 * `CommunicationSent.id`s; an empty object is the initial (seam) load.
 */
export type InboxMessagesPageParam = {
  before?: number;
  after?: number;
};

export const inboxMessagesInfiniteQueryOptions = (
  fetch: Fetch<InboxMessagesResponse>,
  conversationId: string,
  params: FetchInboxMessagesParams = {},
) => ({
  queryKey: inboxMessageKeys.infinite(conversationId, params),
  queryFn: ({ pageParam }: { pageParam: InboxMessagesPageParam }) =>
    fetchInboxMessagesAPI(fetch, conversationId, { ...params, ...pageParam }),
});
