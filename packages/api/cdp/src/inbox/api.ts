import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { INBOX_CONVERSATION_API_URL } from "./constants";
import type {
  FetchInboxConversationsParams,
  InboxConversationListItem,
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
