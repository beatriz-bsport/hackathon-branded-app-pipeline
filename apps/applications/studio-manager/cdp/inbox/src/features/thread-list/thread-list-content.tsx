import type { InboxConversationListItem } from "@bsport/api-cdp/inbox";
import { Loader } from "@bsport/kaizen-primitive-core";

import { ThreadListEmpty } from "#src/features/thread-list/empty/thread-list-empty";
import { ThreadListError } from "#src/features/thread-list/error/thread-list-error";
import { ThreadVirtualList } from "#src/features/thread-list/virtual-list/thread-virtual-list";

export type ThreadListContentProps = {
  conversations: InboxConversationListItem[];
  isLoading: boolean;
  hasError: boolean;
  hasNextPage: boolean;
  hasFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  refetch: () => unknown;
};

export function ThreadListContent({
  conversations,
  isLoading,
  hasError,
  hasNextPage,
  hasFetchNextPageError,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
}: ThreadListContentProps) {
  const hasConversations = conversations.length > 0;

  if (hasError && !hasConversations) {
    return <ThreadListError onRetry={refetch} />;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-md">
        <Loader size="lg" />
      </div>
    );
  }

  if (!hasConversations) {
    return <ThreadListEmpty />;
  }

  return (
    <ThreadVirtualList
      conversations={conversations}
      hasNextPage={hasNextPage}
      hasFetchNextPageError={hasFetchNextPageError}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
