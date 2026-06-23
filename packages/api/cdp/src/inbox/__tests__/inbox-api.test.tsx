import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { type ReactNode, createElement } from "react";
import { describe, expect, it } from "vitest";

import { createTestFetch } from "@bsport/fetch/test";

import { server } from "#src/__tests__/setup";
import {
  inboxConversationsInfiniteQueryOptions,
  inboxKeys,
} from "#src/inbox/api";
import {
  makeInboxConversations,
  makeInboxHandlers,
  mockInboxConversations,
} from "#src/inbox/mocks";
import type {
  FetchInboxConversationsParams,
  RawStudioManagerConversationsResponse,
} from "#src/inbox/types";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// The builder exports only queryKey/queryFn; the consumer supplies the
// cursor-pagination options (mirroring the app hook).
const useInboxConversationsQuery = (
  params: FetchInboxConversationsParams = {},
) =>
  useInfiniteQuery({
    ...inboxConversationsInfiniteQueryOptions(createTestFetch(), params),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: RawStudioManagerConversationsResponse) =>
      lastPage.more_conversations
        ? lastPage.results.at(-1)?.last_inbox_activity_at
        : undefined,
  });

const renderInboxConversationsQuery = (
  params: FetchInboxConversationsParams = {},
) => {
  const queryClient = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  return {
    queryClient,
    ...renderHook(() => useInboxConversationsQuery(params), { wrapper }),
  };
};

describe("inboxConversationsInfiniteQueryOptions", () => {
  it("loads the most-recent page of raw conversations", async () => {
    const { result } = renderInboxConversationsQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstPage = result.current.data?.pages[0];

    expect(firstPage?.more_conversations).toBe(true);
    expect(firstPage?.results).toHaveLength(20);
    expect(firstPage?.results).toEqual(mockInboxConversations.slice(0, 20));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("fetches the next page with an older-than cursor", async () => {
    const { result } = renderInboxConversationsQuery();

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    const nextPageResult = await act(() => result.current.fetchNextPage());

    expect(nextPageResult.data?.pages).toHaveLength(2);

    const secondPage = nextPageResult.data?.pages[1];

    expect(secondPage?.results).toEqual(mockInboxConversations.slice(20, 40));
  });

  it("keeps explicit params in the query key and honors the limit", async () => {
    const params = { limit: 3 } as const;
    const { queryClient, result } = renderInboxConversationsQuery(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(inboxKeys.infinite(params))).toBe(
      result.current.data,
    );
    expect(result.current.data?.pages[0]?.results).toEqual(
      mockInboxConversations.slice(0, 3),
    );
  });

  it("flags the final page for a short dataset", async () => {
    const dataset = makeInboxConversations(4);
    server.use(...makeInboxHandlers({ dataset, delayMs: 0 }));

    const { result } = renderInboxConversationsQuery({ limit: 10 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]?.more_conversations).toBe(false);
    expect(result.current.data?.pages[0]?.results).toEqual(dataset);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("enters an error state when the inbox endpoint fails", async () => {
    server.use(...makeInboxHandlers({ delayMs: 0, errorFromPage: 1 }));

    const { result } = renderInboxConversationsQuery();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
