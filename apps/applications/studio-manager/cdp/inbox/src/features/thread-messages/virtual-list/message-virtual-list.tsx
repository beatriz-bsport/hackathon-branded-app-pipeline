import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  InboxMessage,
  InboxParticipantSummary,
} from "@bsport/api-cdp/inbox";
import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { buildRows } from "./build-rows";
import { FeedRowView } from "./feed-row";
import { MessageLoadMoreStatusRow } from "./message-load-more-status-row";
import { useBidirectionalLoadMore } from "./use-bidirectional-load-more";
import { useInitialSeamScroll } from "./use-initial-seam-scroll";
import { usePageErrorToast } from "./use-page-error-toast";

// First-paint estimate for an unmeasured row — close to a short bubble /
// collapsed automated card, so the scrollbar settles quickly. Real heights come
// from `measureElement`.
const ESTIMATED_ROW_HEIGHT = 96;

// Render this many rows beyond each viewport edge to keep scrolling smooth.
const OVERSCAN_ROWS = 6;

export type MessageVirtualListProps = {
  /** Messages oldest → newest (ascending id). */
  messages: InboxMessage[];
  /** Seam id — the first unread message; `null` when fully read. */
  firstUnreadId: number | null;
  /** Conversation participant — drives the inbound message avatar. */
  participant: InboxParticipantSummary;
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
 * The virtualized, reverse-scrolling message feed. Messages render oldest → top,
 * newest → bottom; `anchorTo: "end"` keeps the viewport pinned to the bottom and
 * — together with the stable row keys from {@link buildRows} — keeps prepended
 * older history from jumping the scroll position. Dynamic row measurement
 * (`measureElement`) handles variable heights (expanding emails, collapsible
 * automated cards).
 */
export function MessageVirtualList({
  messages,
  firstUnreadId,
  participant,
  hasPreviousPage,
  hasNextPage,
  hasFetchPreviousPageError,
  hasFetchNextPageError,
  isFetchingPreviousPage,
  isFetchingNextPage,
  fetchPreviousPage,
  fetchNextPage,
}: MessageVirtualListProps) {
  const { t } = useTranslation("thread-messages");
  const scrollRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(
    () => buildRows(messages, firstUnreadId),
    [messages, firstUnreadId],
  );

  // Index space, top → bottom: [leading loader?] [rows…] [trailing loader?].
  const leadingCount = hasPreviousPage ? 1 : 0;
  const count = leadingCount + rows.length + (hasNextPage ? 1 : 0);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN_ROWS,
    anchorTo: "end",
    getItemKey: (index) => {
      if (leadingCount === 1 && index === 0) return "loader-previous";
      const rowIndex = index - leadingCount;
      return rows[rowIndex]?.key ?? "loader-next";
    },
  });

  const virtualItems = virtualizer.getVirtualItems();

  const hasAnchored = useInitialSeamScroll({
    virtualizer,
    rows,
    firstUnreadId,
    leadingCount,
    isLoading: messages.length === 0,
  });

  usePageErrorToast({
    hasError: hasFetchPreviousPageError,
    isFetching: isFetchingPreviousPage,
  });
  usePageErrorToast({
    hasError: hasFetchNextPageError,
    isFetching: isFetchingNextPage,
  });

  useBidirectionalLoadMore({
    enabled: hasAnchored,
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
  });

  // "Jump to latest" appears only when the open landed on the seam (mid-thread,
  // newer messages below) and there are still newer messages to reach. It hides
  // once the tail is reached (`hasNextPage` false) or after the user clicks it.
  const [openedOnSeam, setOpenedOnSeam] = useState(false);
  const [jumpDismissed, setJumpDismissed] = useState(false);

  useEffect(() => {
    if (hasAnchored && firstUnreadId !== null) setOpenedOnSeam(true);
  }, [hasAnchored, firstUnreadId]);

  const showJumpToLatest = openedOnSeam && hasNextPage && !jumpDismissed;

  const handleJumpToLatest = () => {
    virtualizer.scrollToEnd();
    setJumpDismissed(true);
  };

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="hide-scrollbar h-full overflow-y-auto [overflow-anchor:none]"
      >
        <div
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          <div
            className="absolute left-0 top-0 w-full"
            style={{
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const isLeadingLoader =
                leadingCount === 1 && virtualRow.index === 0;
              const isTrailingLoader =
                hasNextPage && virtualRow.index === count - 1;
              const row = rows[virtualRow.index - leadingCount];

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                >
                  {isLeadingLoader ? (
                    <MessageLoadMoreStatusRow
                      hasError={hasFetchPreviousPageError}
                      onRetry={fetchPreviousPage}
                    />
                  ) : isTrailingLoader ? (
                    <MessageLoadMoreStatusRow
                      hasError={hasFetchNextPageError}
                      onRetry={fetchNextPage}
                    />
                  ) : row ? (
                    <FeedRowView row={row} participant={participant} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showJumpToLatest && (
        <div className="absolute inset-x-0 bottom-sm flex justify-center">
          <Button
            kind="default"
            intent="call-to-action"
            color="main"
            size="sm"
            label={t("messageFeed.jumpToLatest")}
            iconRight="chevron-down"
            onClick={handleJumpToLatest}
          />
        </div>
      )}
    </div>
  );
}
