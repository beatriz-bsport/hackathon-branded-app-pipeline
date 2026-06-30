import type { InboxConversationListItem } from "@bsport/api-cdp/inbox";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { ThreadListItem } from "./thread-list-item";
import type { ThreadListItemProps } from "./thread-list-item";
import { useMarkConversationAsReadMutation } from "./use-mark-conversation-as-read-mutation";
import { useMarkConversationAsUnreadMutation } from "./use-mark-conversation-as-unread-mutation";

export type ThreadListRowProps = {
  conversation: InboxConversationListItem;
  isSelected: boolean;
  onSelect: (threadId: string) => void;
};

/**
 * Data-bound wrapper around `ThreadListItem`. Maps a server-shaped
 * `InboxConversationListItem` onto the presentational item's props.
 *
 * Convention: in this feature folder, `*-item` is presentational and `*-row`
 * is the data adapter that wraps it. See `cdp/inbox/AGENTS.md`.
 */
export function ThreadListRow({
  conversation,
  isSelected,
  onSelect,
}: ThreadListRowProps) {
  const onMarkRead = useMarkConversationAsReadMutation(conversation.id);
  const onMarkUnread = useMarkConversationAsUnreadMutation(conversation.id);
  return (
    <ThreadListItem
      {...getThreadListItemProps(conversation)}
      isSelected={isSelected}
      onClick={() => onSelect(conversation.id)}
      onMarkRead={() => onMarkRead.mutate()}
      onMarkUnread={() => onMarkUnread.mutate()}
    />
  );
}

function getThreadListItemProps(
  conversation: InboxConversationListItem,
): Pick<
  ThreadListItemProps,
  | "contactName"
  | "preview"
  | "channel"
  | "timestamp"
  | "isUnread"
  | "unreadCount"
  | "avatarSrc"
  | "avatarInitials"
> {
  return {
    contactName: conversation.participant.fullName,
    preview: conversation.lastMessagePreview,
    channel: conversation.lastMessageChannel,
    timestamp: formatTimestamp(conversation.dateUpdated),
    isUnread: conversation.studioUnreadCount > 0,
    unreadCount: conversation.studioUnreadCount,
    avatarSrc: conversation.participant.avatarUrl,
    avatarInitials: conversation.participant.initials,
  };
}

function formatTimestamp(iso: string): string {
  return formatDateTime(iso, DATETIME_FORMATS.SHORT_DATETIME);
}
