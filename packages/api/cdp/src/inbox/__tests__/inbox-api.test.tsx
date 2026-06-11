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
import type { FetchInboxConversationsParams } from "#src/inbox/types";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const useInboxConversationsQuery = (
  params: FetchInboxConversationsParams = {},
) =>
  useInfiniteQuery({
    ...inboxConversationsInfiniteQueryOptions(createTestFetch(), params),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
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
  it("loads the first page with default pagination metadata", async () => {
    const { result } = renderInboxConversationsQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstPage = result.current.data?.pages[0];

    expect(firstPage).toEqual({
      count: mockInboxConversations.length,
      page: 1,
      next_page: 2,
      links: {
        next: 2,
        previous: null,
      },
      results: mockInboxConversations.slice(0, 20),
    });
    expect(firstPage?.results).toHaveLength(20);
    expect(firstPage?.results[0]).toEqual(mockInboxConversations[0]);
    expect(result.current.hasNextPage).toBe(true);
  });

  it("uses the pageParam path to fetch and append the next page", async () => {
    const { result } = renderInboxConversationsQuery();

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    const nextPageResult = await act(() => result.current.fetchNextPage());

    expect(nextPageResult.data?.pages).toHaveLength(2);

    const secondPage = nextPageResult.data?.pages[1];

    expect(secondPage?.page).toBe(2);
    expect(secondPage?.links.previous).toBe(1);
    expect(secondPage?.results).toEqual(mockInboxConversations.slice(20, 40));
  });

  it("keeps explicit params in the query key and uses them for page slicing", async () => {
    const params = { page_size: 3, filter: "unread" } as const;
    const { queryClient, result } = renderInboxConversationsQuery(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(inboxKeys.infinite(params))).toBe(
      result.current.data,
    );
    expect(result.current.data?.pages[0]?.results).toEqual(
      mockInboxConversations.slice(0, 3),
    );
  });

  it("returns final-page metadata for a short dataset", async () => {
    const dataset = makeInboxConversations(4);
    server.use(...makeInboxHandlers({ dataset, delayMs: 0 }));

    const { result } = renderInboxConversationsQuery({ page_size: 10 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]).toEqual({
      count: dataset.length,
      page: 1,
      next_page: null,
      links: {
        next: null,
        previous: null,
      },
      results: dataset,
    });
    expect(result.current.hasNextPage).toBe(false);
  });

  it("enters an error state when the inbox endpoint fails", async () => {
    server.use(...makeInboxHandlers({ delayMs: 0, errorFromPage: 1 }));

    const { result } = renderInboxConversationsQuery();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
