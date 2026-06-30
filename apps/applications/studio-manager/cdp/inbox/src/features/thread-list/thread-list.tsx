import { cx } from "@bsport/kaizen-primitive-core";

import { ThreadListHeader } from "#src/features/thread-list/header/thread-list-header";
import { useThreadFilter } from "#src/features/thread-list/header/use-thread-filter";

import { ThreadListContent } from "./thread-list-content";
import { useInboxConversations } from "./use-inbox-conversations";
import { useInboxConversationsSearch } from "./use-inbox-conversations-search";

export type ThreadListProps = {
  className?: string;
};

/**
 * The Inbox left panel: a virtualized, infinite-scrolling list of conversation
 * threads. This component only coordinates — it loads the data and hands off to
 * the subcomponent that fits the current state (status message vs. the list).
 *
 * Both the filtered list and member-search queries run at once: the list stays
 * warm so clearing search is instant from cache, while the search query is
 * disabled until a query is active. `isSearching` selects which one feeds the
 * content area.
 */
export function ThreadList({ className }: ThreadListProps) {
  const {
    filter,
    setFilter,
    conversationParams,
    search,
    debouncedSearch,
    onSearchChange,
    onSearchClear,
    isSearching,
  } = useThreadFilter();

  const list = useInboxConversations(conversationParams);
  const searchResults = useInboxConversationsSearch(debouncedSearch);

  const active = isSearching ? searchResults : list;

  return (
    <div
      className={cx(
        "flex h-full w-full flex-col bg-surface-default",
        className,
      )}
    >
      <ThreadListHeader
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
      />

      <div className="flex-1 overflow-hidden">
        <ThreadListContent
          conversations={active.conversations}
          isLoading={active.isLoading}
          hasError={active.hasError}
          hasNextPage={active.hasNextPage}
          hasFetchNextPageError={active.hasFetchNextPageError}
          isFetchingNextPage={active.isFetchingNextPage}
          fetchNextPage={active.fetchNextPage}
          refetch={active.refetch}
          isSearching={isSearching}
        />
      </div>
    </div>
  );
}
