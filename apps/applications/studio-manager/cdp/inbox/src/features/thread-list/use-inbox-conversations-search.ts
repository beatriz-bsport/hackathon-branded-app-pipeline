import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import {
  type RawStudioManagerConversationsSearchResponse,
  inboxConversationsSearchInfiniteQueryOptions,
} from "@bsport/api-cdp/inbox";

import { fetch } from "#src/utils/fetch";

import { selectInboxConversationsSearch } from "./normalize-inbox-conversation";

// Trigram-distance cutoff for the search endpoint. The backend drops matches
// whose distance exceeds this, so a value MUST be sent — without one the
// endpoint returns the studio's entire conversation set merely re-ordered by
// relevance (a no-results state is then unreachable).
//
// Higher = more permissive. Tuned empirically against the dev backend: short
// partial-name queries ("fi", "fir") only begin returning matches at ~0.9,
// while 1.0 (or no threshold) returns the entire set; 0.3 filtered everything
// out (search always came back empty). 0.9 surfaces relevant matches across
// query lengths without collapsing to "return all".
// TODO(CE-2266): confirm the exact value with the backend team before GA.
export const INBOX_SEARCH_DISTANCE_THRESHOLD = 0.9;

// Shorter than the list's cache: search queries are typed ad hoc and rarely
// revisited, so there's little to gain from holding them long.
const INBOX_SEARCH_STALE_TIME = 30 * 1000;

const getNextPageParam = (
  lastPage: RawStudioManagerConversationsSearchResponse,
  allPages: RawStudioManagerConversationsSearchResponse[],
) => (lastPage.next ? allPages.length + 1 : undefined);

/**
 * Loads member-search results as a page-number infinite feed. Mirrors
 * {@link useInboxConversations} (same return surface) so the container can swap
 * between them on `isSearching` without the rendering layer caring which one
 * supplied the data. Disabled until `query` is non-empty (the caller passes the
 * already-trimmed, debounced value); `keepPreviousData` holds the prior results
 * on screen while the next debounced query loads, avoiding a per-keystroke
 * loader flash.
 */
export const useInboxConversationsSearch = (query: string) => {
  const isEnabled = query.length > 0;

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
    ...inboxConversationsSearchInfiniteQueryOptions(fetch, {
      q: query,
      distance_threshold: INBOX_SEARCH_DISTANCE_THRESHOLD,
    }),
    initialPageParam: 1,
    getNextPageParam,
    select: selectInboxConversationsSearch,
    enabled: isEnabled,
    staleTime: INBOX_SEARCH_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    conversations: data?.pages.flatMap((page) => page.results) ?? [],
    // While disabled the query is `pending` but not actually loading; only
    // report loading once it is enabled, so an empty search field never shows a
    // spinner.
    isLoading: isEnabled && isLoading,
    hasError: isError,
    hasFetchNextPageError: isFetchNextPageError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
};
