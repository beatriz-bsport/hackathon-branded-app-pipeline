import type { Virtualizer } from "@tanstack/react-virtual";
import { useEffect, useState } from "react";

import type { FeedRow } from "./build-rows";

export type UseInitialSeamScrollParams = {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  rows: FeedRow[];
  firstUnreadId: number | null;
  /** 1 when a leading (older-history) loader row occupies index 0, else 0. */
  leadingCount: number;
  isLoading: boolean;
};

/**
 * Anchors the feed on first paint and reports when it's done. With unread
 * messages, scrolls so the "NEW" seam separator sits at the top of the viewport
 * (read context above, unread below); when fully read, scrolls to the bottom.
 *
 * Runs exactly once, after the first page's data has produced rows. The scroll
 * is instant (never `smooth`) — smooth scrolling disables virtual-core's
 * prepend-anchor and size-change adjustments mid-animation. Returns `hasAnchored`
 * so callers can defer scroll-driven pagination until the view is positioned
 * (otherwise the mount-time top-of-list render would prematurely fetch older
 * history before the seam scroll repositions the viewport).
 */
export function useInitialSeamScroll({
  virtualizer,
  rows,
  firstUnreadId,
  leadingCount,
  isLoading,
}: UseInitialSeamScrollParams): boolean {
  const [hasAnchored, setHasAnchored] = useState(false);

  useEffect(() => {
    if (hasAnchored) return;
    if (isLoading || rows.length === 0) return;

    if (firstUnreadId !== null) {
      const newRowIndex = rows.findIndex((row) => row.type === "new");
      if (newRowIndex !== -1) {
        virtualizer.scrollToIndex(leadingCount + newRowIndex, {
          align: "start",
        });
      } else {
        // Seam isn't in the loaded window (shouldn't happen on initial load) —
        // fall back to the bottom.
        virtualizer.scrollToEnd();
      }
    } else {
      virtualizer.scrollToEnd();
    }

    setHasAnchored(true);
  }, [hasAnchored, isLoading, rows, firstUnreadId, leadingCount, virtualizer]);

  return hasAnchored;
}
