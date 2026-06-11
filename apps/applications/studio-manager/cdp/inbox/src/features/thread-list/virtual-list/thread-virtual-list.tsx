import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";

import type { InboxConversationListItem } from "@bsport/api-cdp/inbox";

import { ThreadListRow } from "#src/features/thread-list/item/thread-list-row";

import { ThreadLoadMoreStatusRow } from "./thread-load-more-status-row";
import { useLoadMoreConversations } from "./use-load-more-conversations";
import { useNextPageErrorToast } from "./use-next-page-error-toast";

// Every thread row is a fixed 64px (40px content + 12px x 2 `py-sm`), so the
// virtualizer can size rows from this constant alone.
const ROW_HEIGHT = 64;

// Render this many rows beyond the viewport on each side. A generous overscan
// keeps freshly-scrolled rows already painted, so the list stays smooth.
const OVERSCAN_ROWS = 12;

export type ThreadVirtualListProps = {
  conversations: InboxConversationListItem[];
  hasNextPage: boolean;
  hasFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

export function ThreadVirtualList({
  conversations,
  hasNextPage,
  hasFetchNextPageError,
  isFetchingNextPage,
  fetchNextPage,
}: ThreadVirtualListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // One extra row when more pages exist: the trailing load-more status row.
  const rowCount = hasNextPage
    ? conversations.length + 1
    : conversations.length;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN_ROWS,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useNextPageErrorToast({ hasFetchNextPageError, isFetchingNextPage });

  useLoadMoreConversations({
    virtualItems,
    threadCount: conversations.length,
    hasNextPage,
    hasFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
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
          style={{ transform: `translateY(${virtualItems[0]?.start ?? 0}px)` }}
        >
          {virtualItems.map((virtualRow) => {
            const conversation = conversations[virtualRow.index];

            return (
              <div key={virtualRow.key} style={{ height: virtualRow.size }}>
                {conversation ? (
                  <ThreadListRow
                    conversation={conversation}
                    isSelected={conversation.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ) : (
                  <ThreadLoadMoreStatusRow
                    hasError={hasFetchNextPageError}
                    onRetry={fetchNextPage}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
