import type {
  FetchInboxMessagesParams,
  InboxParticipantSummary,
} from "@bsport/api-cdp/inbox";
import { cx } from "@bsport/kaizen-primitive-core";

import { ThreadMessagesHeader } from "./header/thread-messages-header";
import { ThreadMessagesContent } from "./thread-messages-content";
import { useThreadMessages } from "./use-thread-messages";

export type ThreadMessagesProps = {
  /** Conversation whose messages are shown. */
  conversationId: string;
  /** Participant of the conversation — titles the header, avatars inbound rows. */
  participant: InboxParticipantSummary;
  /** Optional channel / message-type filter; when set, the seam is ignored. */
  params?: FetchInboxMessagesParams;
  className?: string;
};

/**
 * The Inbox middle panel: a member's conversation thread. Coordinates only — it
 * loads the messages and hands off to the content router, which mounts the
 * subview that fits the current state (loading / error / empty / the feed).
 */
export function ThreadMessages({
  conversationId,
  participant,
  params,
  className,
}: ThreadMessagesProps) {
  const {
    messages,
    firstUnreadId,
    isLoading,
    hasError,
    hasNextPage,
    hasPreviousPage,
    hasFetchNextPageError,
    hasFetchPreviousPageError,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch,
  } = useThreadMessages(conversationId, params);

  return (
    <div
      className={cx(
        "flex h-full w-full flex-col bg-surface-default",
        className,
      )}
    >
      <ThreadMessagesHeader title={participant.fullName} />

      <div className="flex-1 overflow-hidden">
        <ThreadMessagesContent
          messages={messages}
          firstUnreadId={firstUnreadId}
          participant={participant}
          isLoading={isLoading}
          hasError={hasError}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          hasFetchPreviousPageError={hasFetchPreviousPageError}
          hasFetchNextPageError={hasFetchNextPageError}
          isFetchingPreviousPage={isFetchingPreviousPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchPreviousPage={fetchPreviousPage}
          fetchNextPage={fetchNextPage}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
