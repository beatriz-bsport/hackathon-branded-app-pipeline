import type {
  InboxMessage,
  InboxParticipantSummary,
} from "@bsport/api-cdp/inbox";
import {
  ErrorFallback,
  Loader,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MessageVirtualList } from "./virtual-list/message-virtual-list";

export type ThreadMessagesContentProps = {
  messages: InboxMessage[];
  firstUnreadId: number | null;
  participant: InboxParticipantSummary;
  isLoading: boolean;
  hasError: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  hasFetchPreviousPageError: boolean;
  hasFetchNextPageError: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => unknown;
  fetchNextPage: () => unknown;
  refetch: () => unknown;
};

/**
 * Routes the message panel to the subview that fits the current state. Only a
 * failed *initial* load (no messages to fall back on) shows the full-screen
 * error — page-load failures while scrolling keep the feed on screen and are
 * surfaced on the loader row + a toast instead.
 */
export function ThreadMessagesContent({
  messages,
  firstUnreadId,
  participant,
  isLoading,
  hasError,
  hasPreviousPage,
  hasNextPage,
  hasFetchPreviousPageError,
  hasFetchNextPageError,
  isFetchingPreviousPage,
  isFetchingNextPage,
  fetchPreviousPage,
  fetchNextPage,
  refetch,
}: ThreadMessagesContentProps) {
  const { t } = useTranslation("thread-messages");
  const hasMessages = messages.length > 0;

  const { EmptyState } = useEmptyState({
    isEmpty: !hasMessages,
    emptyConfig: { title: t("messageFeed.empty") },
  });

  if (hasError && !hasMessages) {
    return (
      <div className="flex h-full items-center justify-center p-md">
        <ErrorFallback
          title={t("messageFeed.loadingError")}
          subtitle=""
          description=""
          actionProps={{ label: t("messageFeed.retry"), onClick: refetch }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-md">
        <Loader size="lg" />
      </div>
    );
  }

  if (!hasMessages) {
    return <EmptyState />;
  }

  return (
    <MessageVirtualList
      messages={messages}
      firstUnreadId={firstUnreadId}
      participant={participant}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      hasFetchPreviousPageError={hasFetchPreviousPageError}
      hasFetchNextPageError={hasFetchNextPageError}
      isFetchingPreviousPage={isFetchingPreviousPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchPreviousPage={fetchPreviousPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
