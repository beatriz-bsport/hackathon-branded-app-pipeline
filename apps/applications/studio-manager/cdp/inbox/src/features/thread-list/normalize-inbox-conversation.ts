import type { InfiniteData } from "@tanstack/react-query";

import type {
  InboxConversationListItem,
  RawInboxConversation,
  RawStudioManagerConversationsResponse,
} from "@bsport/api-cdp/inbox";

import { channelFromCode } from "#src/components/channel/constants";

const initialsOf = (name: string): string =>
  name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

/**
 * Maps one raw backend conversation onto the UI-facing list item. The B2B inbox
 * is one-member-per-conversation, so the first participant is surfaced.
 */
export const normalizeInboxConversation = (
  raw: RawInboxConversation,
): InboxConversationListItem => {
  const participant = raw.participants[0];

  return {
    id: raw.uuid,
    participant: {
      fullName: participant?.name ?? "",
      avatarUrl: participant?.photo,
      initials: participant ? initialsOf(participant.name) : undefined,
    },
    lastMessagePreview: raw.last_message_preview,
    lastMessageChannel: channelFromCode(raw.last_message_channel),
    dateUpdated: raw.last_inbox_activity_at,
    studioUnreadCount: raw.studio_unread_count,
    hasUnresolvedEscalation: raw.has_unresolved_escalation,
    aiEnabled: raw.ai_enabled,
  };
};

/**
 * Stable `select` for the conversations infinite query: normalizes each raw
 * page's results while leaving the page envelope (and the `more_conversations`
 * flag `getNextPageParam` reads) untouched. Module-scoped so its reference is
 * stable across renders (TanStack memoizes `select` by identity).
 */
export const selectInboxConversations = (
  data: InfiniteData<RawStudioManagerConversationsResponse>,
): InfiniteData<{
  results: InboxConversationListItem[];
  more_conversations: boolean;
}> => ({
  ...data,
  pages: data.pages.map((page) => ({
    ...page,
    results: page.results.map(normalizeInboxConversation),
  })),
});
