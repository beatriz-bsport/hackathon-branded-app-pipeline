import type { ReactNode } from "react";

import type { InboxConversationListItem } from "@bsport/api-cdp/inbox";
import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { ThreadVirtualList } from "#src/features/thread-list/virtual-list/thread-virtual-list";
import { useTranslation } from "#src/utils/i18n";

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
      <Status>
        <Body color="weak">{t("threadList.loadingError")}</Body>
      </Status>
    );
  }

  if (isLoading) {
    return (
      <Status>
        <Loader size="lg" />
      </Status>
    );
  }

  if (!hasConversations) {
    return (
      <Status>
        <Body color="weak">{t("threadList.empty")}</Body>
      </Status>
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

/**
 * Centered layout for the empty / loading / error placeholders above.
 * Private to this file — promote to a shared component only if a second
 * caller appears outside `ThreadListContent`.
 */
function Status({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-md">
      {children}
    </div>
  );
}
