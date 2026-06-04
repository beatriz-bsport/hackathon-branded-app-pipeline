import type { VirtualItem } from "@tanstack/react-virtual";
import { useEffect } from "react";

// Start fetching the next page while this many rows are still below the
// viewport, so data is already cached by the time the user reaches the end.
const PREFETCH_ROW_THRESHOLD = 5;

export type UseLoadMoreConversationsParams = {
  virtualItems: VirtualItem[];
  threadCount: number;
  hasNextPage: boolean;
  hasFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

export function useLoadMoreConversations({
  virtualItems,
  threadCount,
  hasNextPage,
  hasFetchNextPageError,
  isFetchingNextPage,
  fetchNextPage,
}: UseLoadMoreConversationsParams) {
  useEffect(() => {
    const lastItem = virtualItems.at(-1);
    if (!lastItem) return;

    if (
      lastItem.index >= threadCount - 1 - PREFETCH_ROW_THRESHOLD &&
      hasNextPage &&
      !hasFetchNextPageError &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    hasFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    threadCount,
    isFetchingNextPage,
    virtualItems,
  ]);
}
