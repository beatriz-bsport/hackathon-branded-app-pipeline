/**
 * Channel a message / conversation came through. Single source of truth for the
 * channel union — the inbox app's `Channel` component re-exports this as its
 * `ChannelType`.
 */
export type InboxChannel = "email" | "sms" | "push" | "in_app";

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
 * Denormalized participant summary for the list view. The B2B inbox is a
 * one-member-per-conversation view, so we surface the first participant.
 */
export type InboxParticipantSummary = {
  fullName: string;
  avatarUrl?: string;
  /** Fallback initials shown when no avatar image is available. */
  initials?: string;
};

/**
 * A single row in the B2B inbox list view. The UI-facing (camelCase) shape,
 * produced from the raw backend payload (see {@link RawInboxConversation}) by
 * `selectInboxConversations`.
 */
export type InboxConversationListItem = {
  /** Conversation id — the backend `uuid`. */
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
  /** Whether the conversation has an unresolved escalation to a human. */
  hasUnresolvedEscalation: boolean;
  aiEnabled: boolean;
};

/**
 * Backend communication-kind code on the conversation list payload, mirroring
 * bsport-django's `InboxMessageChannel` IntEnum: 0=email, 1=sms, 2=push,
 * 3=in_app. The order matches the inbox app's `CHANNEL_TYPES`.
 */
export type InboxMessageChannelCode = 0 | 1 | 2 | 3;

/**
 * One participant as returned by the backend list serializer
 * (`StudioManagerInboxConversationOutputSerializer.get_participants`).
 */
export type RawInboxParticipant = {
  name: string;
  /** Photo URL (the backend always supplies a default). */
  photo: string;
};

/**
 * A conversation exactly as the backend returns it (snake_case). Mapped onto
 * {@link InboxConversationListItem} by `selectInboxConversations`.
 */
export type RawInboxConversation = {
  uuid: string;
  last_message_preview: string;
  last_message_channel: InboxMessageChannelCode;
  participants: RawInboxParticipant[];
  ai_enabled: boolean;
  studio_unread_count: number;
  has_unresolved_escalation: boolean;
  date_created: string;
  /** Drives list ordering and the `older`/`newer` cursor. */
  last_inbox_activity_at: string;
};

/**
 * Raw response of the studio-manager conversation list endpoint. Cursor-based:
 * `more_conversations` signals whether another page exists in the requested
 * direction (there is no total count / page index).
 */
export type RawStudioManagerConversationsResponse = {
  results: RawInboxConversation[];
  more_conversations: boolean;
};

export type FetchInboxConversationsParams = {
  /**
   * Exclusive cursor — conversations are fetched relative to this activity
   * timestamp. Required together with `direction`.
   */
  last_inbox_activity_at_cursor?: string;
  /** Page direction relative to the cursor. Required when a cursor is set. */
  direction?: "older" | "newer";
  /** Page size (backend default 20, max 50). */
  limit?: number;
  /** Filter to conversations with unread messages. */
  unread?: boolean;
  /** Filter to conversations with an unresolved escalation. */
  escalated?: boolean;
};

/**
 * Who sent a message. `member` is an inbound message (the backend's `is_answer`
 * on `CommunicationSent`); `studio` is an outbound message from the business.
 */
export type InboxMessageSender = "studio" | "member";

/**
 * Origin of a message. `"manual"` is a one-off message a studio manager typed —
 * it renders as a chat bubble. Every other value is an automated/campaign
 * message that renders as a collapsed card. The automated values mirror the
 * inbox app's `AutomatedMessageType`, each derived from which id is populated in
 * `CommunicationSent.metadata` (see bsport-django `apps/communicate`).
 */
export type InboxMessageSource =
  | "manual"
  | "campaign"
  | "transactional-notification"
  | "auto-message"
  | "automation"
  | "audience-message"
  | "franchise-campaign";

/** Delivery status of a message. Mirrors the inbox UI's `MessageStatus`. */
export type InboxMessageStatus = "sent" | "failed";

/**
 * A single message in a conversation. Denormalized from `CommunicationSent` for
 * the B2B inbox thread view. The `id` is a sequential integer that doubles as
 * the pagination cursor (see `FetchInboxMessagesParams`).
 */
export type InboxMessage = {
  /** `CommunicationSent.id` — sequential integer; the pagination cursor. */
  id: number;
  channel: InboxChannel;
  sender: InboxMessageSender;
  /** Origin of the message; drives chat-bubble vs automated-card rendering. */
  source: InboxMessageSource;
  /**
   * Human-readable name of the source (campaign/workflow name, e.g. "Summer
   * campaign"). `null` for `manual` messages, which have no source.
   */
  sourceName: string | null;
  /** Subject line. Present for `email`/`push`; `null` for `sms`/`in_app`. */
  title: string | null;
  /** Message content. HTML for `email`, plain text for the other channels. */
  body: string;
  /** ISO timestamp of when the message was created. */
  dateCreated: string;
  status: InboxMessageStatus;
};

/**
 * Response for the "list conversation messages" endpoint. The server returns a
 * pre-split window around the seam (the boundary between read and unread). See
 * the Notion "List messages" UX spec.
 */
export type InboxMessagesResponse = {
  /** Messages ordered oldest → newest (ascending `id`). */
  messages: InboxMessage[];
  /**
   * Id of the first unread message — the seam the client scrolls to on open.
   * `null` when the conversation is fully read (client scrolls to the bottom),
   * and always `null` when a filter is active (the seam is then ignored).
   */
  firstUnreadId: number | null;
  /** Whether older messages exist before the returned window. */
  hasMoreBefore: boolean;
  /** Whether newer messages exist after the returned window. */
  hasMoreAfter: boolean;
};

export type FetchInboxMessagesParams = {
  /** Load messages strictly older than this id (`id` < `before`). */
  before?: number;
  /** Load messages strictly newer than this id (`id` > `after`). */
  after?: number;
  /** Max messages per direction. Defaults to the backend/mock page size. */
  limit?: number;
  /** Channel filter. When set, the seam is ignored. */
  channel?: InboxChannel;
  /** Source/message-type filter. When set, the seam is ignored. */
  message_type?: InboxMessageSource;
};
