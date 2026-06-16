import type { VirtualItem } from "@tanstack/react-virtual";
import { useEffect } from "react";

// Start fetching while this many rows are still beyond the viewport edge, so
// data is cached by the time the user reaches the end (same as thread-list).
const PREFETCH_ROW_THRESHOLD = 5;

export type UseBidirectionalLoadMoreParams = {
  /** Gate: only paginate once the initial seam scroll has positioned the view. */
  enabled: boolean;
  virtualItems: VirtualItem[];
  /** Total virtual row count, including leading/trailing loader rows. */
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  hasFetchPreviousPageError: boolean;
  hasFetchNextPageError: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => unknown;
  fetchNextPage: () => unknown;
};

/**
 * Drives bidirectional pagination from the virtualizer's rendered window:
 * scrolling near the top loads older history (`fetchPreviousPage`), near the
 * bottom loads newer messages (`fetchNextPage`). Each direction is guarded by
 * its `isFetching*` flag (no double-fetch) and `hasFetch*Error` (no auto-retry
 * storm — retry is the loader row's button).
 */
export function useBidirectionalLoadMore({
  enabled,
  virtualItems,
  count,
  hasPreviousPage,
  hasNextPage,
  hasFetchPreviousPageError,
  hasFetchNextPageError,
  isFetchingPreviousPage,
  isFetchingNextPage,
  fetchPreviousPage,
  fetchNextPage,
}: UseBidirectionalLoadMoreParams) {
  // Near the top → older history.
  useEffect(() => {
    if (!enabled) return;
    const firstItem = virtualItems[0];

    if (!firstItem) return;

    if (
      firstItem.index <= PREFETCH_ROW_THRESHOLD &&
      hasPreviousPage &&
      !hasFetchPreviousPageError &&
      !isFetchingPreviousPage
    ) {
      void fetchPreviousPage();
    }
  }, [
    enabled,
    virtualItems,
    hasPreviousPage,
    hasFetchPreviousPageError,
    isFetchingPreviousPage,
    fetchPreviousPage,
  ]);

  // Near the bottom → newer messages.
  useEffect(() => {
    if (!enabled) return;
    const lastItem = virtualItems.at(-1);

    if (!lastItem) return;

    if (
      lastItem.index >= count - 1 - PREFETCH_ROW_THRESHOLD &&
      hasNextPage &&
      !hasFetchNextPageError &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    enabled,
    virtualItems,
    count,
    hasNextPage,
    hasFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
  ]);
}
