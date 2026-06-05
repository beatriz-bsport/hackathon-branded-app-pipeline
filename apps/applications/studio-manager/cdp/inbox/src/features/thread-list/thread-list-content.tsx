import type { InboxConversationListItem } from "@bsport/api-cdp/inbox";
import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { ThreadListStatus } from "./thread-list-status";
import { ThreadVirtualList } from "./thread-virtual-list";

export type ThreadListContentProps = {
  conversations: InboxConversationListItem[];
  isLoading: boolean;
  hasError: boolean;
  hasNextPage: boolean;
  hasFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

export function ThreadListContent({
  conversations,
  isLoading,
  hasError,
  hasNextPage,
  hasFetchNextPageError,
  isFetchingNextPage,
  fetchNextPage,
}: ThreadListContentProps) {
  const { t } = useTranslation("thread-list");

  const hasConversations = conversations.length > 0;

  if (hasError && !hasConversations) {
    return (
      <ThreadListStatus>
        <Body color="weak">{t("threadList.loadingError")}</Body>
      </ThreadListStatus>
    );
  }

  if (isLoading) {
    return (
      <ThreadListStatus>
        <Loader size="lg" />
      </ThreadListStatus>
    );
  }

  if (!hasConversations) {
    return (
      <ThreadListStatus>
        <Body color="weak">{t("threadList.empty")}</Body>
      </ThreadListStatus>
    );
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
