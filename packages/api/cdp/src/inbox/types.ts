/**
 * Channel the latest message in a conversation came through. Mirrors the
 * `ChannelType` used by the inbox app's `Channel` component.
 */
export type InboxChannel = "email" | "sms" | "push" | "chat";

/**
 * Quick filters shown above the B2B inbox list (favorites, muted, needs human,
 * unread). Reserved for a later iteration — the prototype only serves the plain
 * unfiltered feed, but the param is threaded through so it can be honored later.
 */
export type InboxConversationFilter =
  | "all"
  | "unread"
  | "favorites"
  | "muted"
  | "needs_human";

/**
 * Denormalized participant summary for the list view. Derived from
 * `InboxParticipant` → `Member` in the data model.
 */
export type InboxParticipantSummary = {
  memberId: number;
  fullName: string;
  avatarUrl?: string;
  /** Fallback initials shown when no avatar image is available. */
  initials?: string;
};

/**
 * A single row in the B2B inbox list view. Denormalized from `InboxConversation`
 * (+ its `InboxParticipant`) for cheap list rendering.
 */
export type InboxConversationListItem = {
  /** Conversation id (UUID in the data model). */
  id: string;
  participant: InboxParticipantSummary;
  /** Denormalized preview of the latest message. */
  lastMessagePreview: string;
  /** Channel the latest message came through (drives the preview icon). */
  lastMessageChannel: InboxChannel;
  /** ISO timestamp of the last activity, used for ordering the list. */
  dateUpdated: string;
  /** Number of unread messages from the studio's point of view. */
  studioUnreadCount: number;
  favorite: boolean;
  muted: boolean;
  aiEnabled: boolean;
};

export type FetchInboxConversationsParams = {
  /** Page number of the results (for pagination). */
  page?: number;
  /** Number of items per page (for pagination). */
  page_size?: number;
  /** Reserved quick filter — not yet honored by the backend/mock. */
  filter?: InboxConversationFilter;
};
