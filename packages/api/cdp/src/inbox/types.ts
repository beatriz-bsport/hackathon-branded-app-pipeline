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
 * Raw response of the studio-manager conversation **search** endpoint
 * (`…/conversation/search/?q=`). Unlike the cursor-based list
 * ({@link RawStudioManagerConversationsResponse}), search uses DRF
 * page-number pagination. The result rows reuse the same serializer as the
 * list, so each entry is a {@link RawInboxConversation} and the list's
 * normalizer can be reused unchanged.
 */
export type RawStudioManagerConversationsSearchResponse = {
  /** Total number of matches across all pages. */
  count: number;
  /**
   * URL of the next page, or `null` on the last page. Consumers use it only
   * for truthiness (does another page exist) — it is never parsed.
   */
  next: string | null;
  /** URL of the previous page, or `null` on the first page. */
  previous: string | null;
  results: RawInboxConversation[];
};

export type FetchInboxConversationsSearchParams = {
  /** Fuzzy query matched against member name, email, and phone. */
  q: string;
  /** Page-number pagination (1-based). The backend default is page 1. */
  page?: number;
  /**
   * Trigram distance cutoff. Without it the endpoint re-orders the studio's
   * entire conversation set by relevance instead of returning real matches, so
   * a value must always be sent (see the app-side named constant).
   */
  distance_threshold: number;
};

/**
 * Who authored a message, from the backend `timeline` contract. `member` is an
 * inbound message; `studio` is an outbound message from the business; `agent` is
 * an AI agent reply (typed for completeness — not yet mocked, folds to an
 * outbound bubble in the UI).
 */
export type InboxMessageAuthorType = "member" | "agent" | "studio";

/**
 * The non-automated `message_type` values that render as chat bubbles (alongside
 * `null`): an outbound message the studio typed by hand (`manually_sent`) and an
 * inbound member reply (`member_reply`). See the inbox app's `mapMessage`.
 */
export const BUBBLE_MESSAGE_TYPES = ["manually_sent", "member_reply"] as const;

/**
 * The automated `message_type` values that render as collapsed cards. Each value
 * reflects which id is populated in `CommunicationSent.metadata` (see bsport-django
 * `apps/communicate/communication/types.py`):
 *
 * - `campaign`                   → `automated_campaign_id` (SmartListAutomatedCampaign)
 * - `transactional_notification` → `notification_rule` / `notification_event` (NotificationRule)
 * - `auto_message`               → `marketing_notification_id` (MarketingNotification)
 * - `automation`                 → `cadence_id` (Cadence / workflow)
 * - `audience`                   → `smartlist_id` (SmartList, ExecutionContext.AUDIENCE)
 * - `franchise`                  → `communication_sent_group_config_id` (ExecutionContext.COMMUNICATION_FROM_FRANCHISE)
 */
export const AUTOMATED_MESSAGE_TYPES = [
  "campaign",
  "transactional_notification",
  "auto_message",
  "automation",
  "audience",
  "franchise",
] as const;

/**
 * Every backend `message_type` value — the bubble types plus the automated (card)
 * types. The single runtime source of truth: {@link StudioManagerMessageType} is
 * derived from it, and the app-side normalize allowlist reuses it.
 */
export const STUDIO_MANAGER_MESSAGE_TYPES = [
  ...BUBBLE_MESSAGE_TYPES,
  ...AUTOMATED_MESSAGE_TYPES,
] as const;

/**
 * Presentational classification of an automated message — the automated subset
 * of {@link StudioManagerMessageType} that renders as a collapsed card. Derived
 * from {@link AUTOMATED_MESSAGE_TYPES} so the list stays a single source of truth.
 */
export type AutomatedMessageType = (typeof AUTOMATED_MESSAGE_TYPES)[number];

/**
 * Type of a message, mirroring the backend `message_type`. The bubble-vs-card
 * discriminator (see the inbox app's `mapMessage`): the {@link BUBBLE_MESSAGE_TYPES}
 * (and `null`) render as chat bubbles; the {@link AUTOMATED_MESSAGE_TYPES} render
 * as collapsed cards. Derived from {@link STUDIO_MANAGER_MESSAGE_TYPES}.
 */
export type StudioManagerMessageType =
  (typeof STUDIO_MANAGER_MESSAGE_TYPES)[number];

/**
 * Delivery statuses the UI renders. `processing` is an in-flight send (shown as a
 * "Sending…" affordance); `success` shows the timestamp; `failed` shows the red
 * "Failed" label. The single runtime source of truth for {@link InboxMessageStatus};
 * the app-side normalize folds any other backend status (the wire field is an open
 * `string`) to `null`.
 */
export const INBOX_MESSAGE_STATUSES = [
  "success",
  "failed",
  "processing",
] as const;

export type InboxMessageStatus = (typeof INBOX_MESSAGE_STATUSES)[number];

/**
 * The `data` payload of a timeline message item, exactly as the backend returns
 * it (snake_case). Mapped onto the domain {@link InboxMessage} by the app-side
 * `normalizeInboxMessage`.
 */
export type RawTimelineMessageData = {
  /** `CommunicationSent.id` — sequential integer; the pagination cursor. */
  communication_sent_id: number;
  channel: string | null;
  /** Open wire string (backend `str | None`); normalized to {@link InboxMessageStatus} | null. */
  status: string | null;
  message_type: string | null;
  title: string;
  content: string;
  author_type: InboxMessageAuthorType;
};

/**
 * One item in the conversation timeline. Today the only `item_type` is
 * `"message"`; the union is left open so future item kinds (e.g. system events)
 * can be filtered out app-side.
 */
export type RawTimelineItem = {
  item_type: "message";
  date_created: string;
  data: RawTimelineMessageData;
};

/**
 * Raw response of the studio-manager conversation `timeline` endpoint. The
 * server returns a pre-split window around the seam (the boundary between read
 * and unread) plus the windowing flags. Mapped onto {@link InboxMessagesResponse}
 * by the app-side `selectInboxMessages`.
 */
export type RawStudioManagerTimelineResponse = {
  items: RawTimelineItem[];
  communication_sent_window: {
    /**
     * Id of the first unread message — the seam the client scrolls to on open.
     * `null` when the conversation is fully read, and always `null` when a
     * filter is active (the seam is then ignored).
     */
    first_unread_communication_sent_id: number | null;
    has_more_before: boolean;
    has_more_after: boolean;
  };
};

/**
 * A single message in a conversation — the backend-faithful camelCase domain
 * shape, produced from a {@link RawTimelineItem} by `normalizeInboxMessage`. The
 * `id` is a sequential integer that doubles as the pagination cursor.
 */
export type InboxMessage = {
  /** `CommunicationSent.id` — sequential integer; the pagination cursor. */
  id: number;
  /** `null` when the backend sends no channel (e.g. agent messages). */
  channel: InboxChannel | null;
  authorType: InboxMessageAuthorType;
  /** `null` for plain member/manual messages with no message type. */
  messageType: StudioManagerMessageType | null;
  /** Subject line. Empty string when the channel carries no title (sms/in_app). */
  title: string;
  /** Message content. HTML for `email`, plain text for the other channels. */
  content: string;
  /** ISO timestamp of when the message was created. */
  dateCreated: string;
  /** `null` when the backend status is outside success/failed/processing. */
  status: InboxMessageStatus | null;
};

/**
 * App-facing normalized response for the conversation `timeline` endpoint. The
 * flat shape the thread view consumes, produced from
 * {@link RawStudioManagerTimelineResponse} by the app-side `selectInboxMessages`.
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

/**
 * Cursor for the conversation `timeline` feed: page relative to a
 * `CommunicationSent.id` in a direction. The two fields travel together — a
 * caller passes both or neither (the initial seam load passes neither),
 * mirroring the backend contract that rejects a cursor without a direction.
 */
export type InboxMessagesCursor =
  | { communication_sent_id: number; direction: "older" | "newer" }
  | { communication_sent_id?: never; direction?: never };

/** Cursor (both-or-neither) plus the optional page filters for a timeline request. */
export type FetchInboxMessagesParams = InboxMessagesCursor & {
  /** Max messages per direction. Defaults to the backend/mock page size. */
  limit?: number;
  /** Channel filter (CSV on the wire). When set, the seam is ignored. */
  channels?: InboxChannel[];
  /** Message-type filter (CSV on the wire). When set, the seam is ignored. */
  message_types?: StudioManagerMessageType[];
};
