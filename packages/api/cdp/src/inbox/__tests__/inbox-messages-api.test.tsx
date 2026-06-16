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
  type InboxMessagesPageParam,
  inboxMessagesInfiniteQueryOptions,
} from "#src/inbox/api";
import {
  MOCK_INBOX_FIRST_UNREAD_ID,
  makeInboxMessages,
  makeInboxMessagesHandlers,
  mockInboxMessages,
} from "#src/inbox/mocks";
import type { FetchInboxMessagesParams } from "#src/inbox/types";

const CONVERSATION_ID = "conv-0001";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const useInboxMessagesQuery = (params: FetchInboxMessagesParams = {}) =>
  useInfiniteQuery({
    ...inboxMessagesInfiniteQueryOptions(
      createTestFetch(),
      CONVERSATION_ID,
      params,
    ),
    initialPageParam: {} as InboxMessagesPageParam,
    getNextPageParam: (lastPage): InboxMessagesPageParam | undefined =>
      lastPage.hasMoreAfter
        ? { after: lastPage.messages.at(-1)?.id }
        : undefined,
    getPreviousPageParam: (firstPage): InboxMessagesPageParam | undefined =>
      firstPage.hasMoreBefore
        ? { before: firstPage.messages[0]?.id }
        : undefined,
  });

const renderInboxMessagesQuery = (params: FetchInboxMessagesParams = {}) => {
  const queryClient = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  return {
    queryClient,
    ...renderHook(() => useInboxMessagesQuery(params), { wrapper }),
  };
};

describe("inboxMessagesInfiniteQueryOptions", () => {
  it("returns a seam-anchored window on the initial load", async () => {
    const { result } = renderInboxMessagesQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstPage = result.current.data?.pages[0];

    expect(firstPage?.firstUnreadId).toBe(MOCK_INBOX_FIRST_UNREAD_ID);
    // 20 read-context messages before the seam + the 11 from the seam (50..60).
    expect(firstPage?.messages).toHaveLength(31);
    expect(firstPage?.messages[0]?.id).toBe(MOCK_INBOX_FIRST_UNREAD_ID - 20);
    expect(firstPage?.messages.at(-1)?.id).toBe(mockInboxMessages.length);
    expect(firstPage?.hasMoreBefore).toBe(true);
    expect(firstPage?.hasMoreAfter).toBe(false);
    // Seam present → there are newer messages below, but all are in this window.
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.hasNextPage).toBe(false);
  });

  it("pages into older history via the `before` cursor", async () => {
    const { result } = renderInboxMessagesQuery();

    await waitFor(() => expect(result.current.hasPreviousPage).toBe(true));

    const oldestBefore = result.current.data?.pages[0]?.messages[0]?.id;
    const previous = await act(() => result.current.fetchPreviousPage());

    // TanStack prepends previous pages to the front of the list.
    const olderPage = previous.data?.pages[0];

    expect(olderPage?.firstUnreadId).toBeNull();
    expect(olderPage?.messages.at(-1)?.id).toBe((oldestBefore ?? 0) - 1);
    expect(olderPage?.hasMoreBefore).toBe(true);
  });

  it("pages into newer messages via the `after` cursor", async () => {
    // Seam near the start so the initial window leaves newer messages below.
    server.use(
      ...makeInboxMessagesHandlers({
        dataset: makeInboxMessages(60),
        firstUnreadId: 10,
        delayMs: 0,
      }),
    );

    const { result } = renderInboxMessagesQuery();

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    const newestAfter = result.current.data?.pages.at(-1)?.messages.at(-1)?.id;
    const next = await act(() => result.current.fetchNextPage());

    const newerPage = next.data?.pages.at(-1);

    expect(newerPage?.firstUnreadId).toBeNull();
    expect(newerPage?.messages[0]?.id).toBe((newestAfter ?? 0) + 1);
    expect(newerPage?.hasMoreAfter).toBe(true);
  });

  it("ignores the seam when a channel filter is active", async () => {
    const { result } = renderInboxMessagesQuery({ channel: "chat" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstPage = result.current.data?.pages[0];

    expect(firstPage?.firstUnreadId).toBeNull();
    expect(firstPage?.hasMoreAfter).toBe(false);
    expect(
      firstPage?.messages.every((message) => message.channel === "chat"),
    ).toBe(true);
  });

  it("scrolls to the bottom (no seam) when the conversation is fully read", async () => {
    server.use(
      ...makeInboxMessagesHandlers({ firstUnreadId: null, delayMs: 0 }),
    );

    const { result } = renderInboxMessagesQuery();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstPage = result.current.data?.pages[0];

    expect(firstPage?.firstUnreadId).toBeNull();
    expect(firstPage?.hasMoreAfter).toBe(false);
    expect(firstPage?.messages.at(-1)?.id).toBe(mockInboxMessages.length);
  });

  it("enters an error state when the messages endpoint fails", async () => {
    server.use(...makeInboxMessagesHandlers({ delayMs: 0, errorOnLoad: true }));

    const { result } = renderInboxMessagesQuery();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
