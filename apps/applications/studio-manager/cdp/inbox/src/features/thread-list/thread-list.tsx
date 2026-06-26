import { cx } from "@bsport/kaizen-primitive-core";

import { ThreadListHeader } from "#src/features/thread-list/header/thread-list-header";
import { useThreadFilter } from "#src/features/thread-list/header/use-thread-filter";

import { ThreadListContent } from "./thread-list-content";
import { useInboxConversations } from "./use-inbox-conversations";

export type ThreadListProps = {
  className?: string;
};

/**
 * The Inbox left panel: a virtualized, infinite-scrolling list of conversation
 * threads. This component only coordinates — it loads the data and hands off to
 * the subcomponent that fits the current state (status message vs. the list).
 */
export function ThreadList({ className }: ThreadListProps) {
  const { filter, setFilter, conversationParams } = useThreadFilter();

  const {
    conversations,
    isLoading,
    hasError,
    hasNextPage,
    hasFetchNextPageError,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInboxConversations(conversationParams);

  return (
    <div
      className={cx(
        "flex h-full w-full flex-col bg-surface-default",
        className,
      )}
    >
      <ThreadListHeader filter={filter} onFilterChange={setFilter} />

      <div className="flex-1 overflow-hidden">
        <ThreadListContent
          conversations={conversations}
          isLoading={isLoading}
          hasError={hasError}
          hasNextPage={hasNextPage}
          hasFetchNextPageError={hasFetchNextPageError}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
