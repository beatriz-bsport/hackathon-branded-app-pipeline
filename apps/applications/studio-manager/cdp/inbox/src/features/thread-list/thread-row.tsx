import type { InboxConversationListItem } from "@bsport/api-cdp/inbox";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { ThreadListItem } from "./thread-list-item/thread-list-item";
import type { ThreadListItemProps } from "./thread-list-item/thread-list-item";

export type ThreadRowProps = {
  conversation: InboxConversationListItem;
  isSelected: boolean;
  onSelect: (threadId: string) => void;
};

export function ThreadRow({
  conversation,
  isSelected,
  onSelect,
}: ThreadRowProps) {
  return (
    <ThreadListItem
      {...getThreadItemProps(conversation)}
      isSelected={isSelected}
      onClick={() => onSelect(conversation.id)}
    />
  );
}

function getThreadItemProps(
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
