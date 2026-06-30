import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { type ReactNode, createElement } from "react";
import { describe, expect, it } from "vitest";

import { createTestFetch } from "@bsport/fetch/test";

import { server } from "#src/__tests__/setup";
import {
  inboxConversationsSearchInfiniteQueryOptions,
  inboxKeys,
} from "#src/inbox/api";
import {
  INBOX_CONVERSATION_SEARCH_URL_PATTERN,
  makeInboxSearchHandlers,
} from "#src/inbox/mocks";
import type {
  FetchInboxConversationsSearchParams,
  RawInboxConversation,
  RawStudioManagerConversationsSearchResponse,
} from "#src/inbox/types";

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

// The builder exports only queryKey/queryFn; the consumer supplies the
// page-number pagination options (mirroring the app hook).
const useInboxSearchQuery = (params: FetchInboxConversationsSearchParams) =>
  useInfiniteQuery({
    ...inboxConversationsSearchInfiniteQueryOptions(createTestFetch(), params),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: RawStudioManagerConversationsSearchResponse,
      allPages: RawStudioManagerConversationsSearchResponse[],
    ) => (lastPage.next ? allPages.length + 1 : undefined),
  });

const renderInboxSearchQuery = (
  params: FetchInboxConversationsSearchParams,
) => {
  const queryClient = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  return {
    queryClient,
    ...renderHook(() => useInboxSearchQuery(params), { wrapper }),
  };
};

const makeNamedConversations = (names: string[]): RawInboxConversation[] =>
  names.map((name, index) => ({
    uuid: `conv-${index.toString().padStart(4, "0")}`,
    participants: [{ name, photo: "" }],
    last_message_preview: "",
    last_message_channel: 0,
    date_created: "2026-05-05T09:00:00.000Z",
    last_inbox_activity_at: "2026-05-05T09:00:00.000Z",
    studio_unread_count: 0,
    has_unresolved_escalation: false,
    ai_enabled: false,
  }));

describe("inboxConversationsSearchInfiniteQueryOptions", () => {
  it("requests the /search/ endpoint with q, distance_threshold and page params", async () => {
    const requestUrls: string[] = [];
    server.use(
      http.get(INBOX_CONVERSATION_SEARCH_URL_PATTERN, ({ request }) => {
        requestUrls.push(request.url);
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        } satisfies RawStudioManagerConversationsSearchResponse);
      }),
    );

    const params = { q: "ada", distance_threshold: 0.3 } as const;
    const { result } = renderInboxSearchQuery(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(requestUrls).toHaveLength(1);
    const url = new URL(requestUrls[0]);
    expect(url.pathname).toContain(
      "/communicate/v1/communication/studio_manager/conversation/search/",
    );
    expect(url.searchParams.get("q")).toBe("ada");
    expect(url.searchParams.get("distance_threshold")).toBe("0.3");
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("stores results under the distinct search key, separate from the list key", async () => {
    server.use(
      ...makeInboxSearchHandlers({
        dataset: makeNamedConversations(["Ada Lovelace"]),
        delayMs: 0,
      }),
    );

    const params = { q: "ada", distance_threshold: 0.3 } as const;
    const { queryClient, result } = renderInboxSearchQuery(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(inboxKeys.searchInfinite(params))).toBe(
      result.current.data,
    );
    // The search key branch must not collide with the list key branch.
    expect(inboxKeys.searchInfinite(params)).not.toEqual(
      inboxKeys.infinite({}),
    );
  });

  it("derives the next page from `next` and stops when it is null", async () => {
    const dataset = makeNamedConversations([
      "Ada Lovelace",
      "Ada Byron",
      "Ada Stewart",
      "Bob Stop",
    ]);
    server.use(
      ...makeInboxSearchHandlers({ dataset, delayMs: 0, pageSize: 2 }),
    );

    const params = { q: "ada", distance_threshold: 0.3 } as const;
    const { result } = renderInboxSearchQuery(params);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const firstPage = result.current.data?.pages[0];
    expect(firstPage?.count).toBe(3);
    expect(firstPage?.results).toHaveLength(2);
    expect(firstPage?.next).toBeTruthy();
    expect(result.current.hasNextPage).toBe(true);

    const nextPageResult = await act(() => result.current.fetchNextPage());
    const secondPage = nextPageResult.data?.pages[1];

    expect(secondPage?.results).toHaveLength(1);
    expect(secondPage?.next).toBeNull();
    expect(nextPageResult.hasNextPage).toBe(false);
  });

  it("returns an empty page when nothing matches", async () => {
    server.use(
      ...makeInboxSearchHandlers({
        dataset: makeNamedConversations(["Ada Lovelace"]),
        delayMs: 0,
      }),
    );

    const { result } = renderInboxSearchQuery({
      q: "zzz-no-match",
      distance_threshold: 0.3,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0]?.count).toBe(0);
    expect(result.current.data?.pages[0]?.results).toEqual([]);
    expect(result.current.hasNextPage).toBe(false);
  });
});
