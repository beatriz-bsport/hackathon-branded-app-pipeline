import type { InfiniteData } from "@tanstack/react-query";

import {
  INBOX_MESSAGE_STATUSES,
  type InboxMessage,
  type InboxMessageStatus,
  type InboxMessagesResponse,
  type RawStudioManagerTimelineResponse,
  type RawTimelineItem,
  STUDIO_MANAGER_MESSAGE_TYPES,
  type StudioManagerMessageType,
  inboxChannelFromWireName,
} from "@bsport/api-cdp/inbox";

// `Array.includes` with the element type widened to `string`, so an `as const`
// tuple of string literals can be membership-tested against an arbitrary wire
// string. The widening happens at the parameter boundary, which the compiler
// still type-checks — unlike an `as` assertion.
const includesString = (values: readonly string[], raw: string): boolean =>
  values.includes(raw);

// Type guard narrowing a raw backend `message_type` to the domain union, reusing
// the api package's single source of truth for the allowlist.
const isStudioManagerMessageType = (
  raw: string,
): raw is StudioManagerMessageType =>
  includesString(STUDIO_MANAGER_MESSAGE_TYPES, raw);

// Anything outside the allowlist (and `null`) normalizes to `null`, so an unknown
// future type folds to a plain bubble rather than throwing.
const toMessageType = (raw: string | null): StudioManagerMessageType | null =>
  raw !== null && isStudioManagerMessageType(raw) ? raw : null;

// Type guard narrowing a raw backend `status` to the domain union. The wire field
// is an open `string` (backend `str | None`), so this mirrors `toMessageType`:
// any value outside the rendered statuses folds to `null` (no affordance).
const isInboxMessageStatus = (raw: string): raw is InboxMessageStatus =>
  includesString(INBOX_MESSAGE_STATUSES, raw);

const toStatus = (raw: string | null): InboxMessageStatus | null =>
  raw !== null && isInboxMessageStatus(raw) ? raw : null;

/**
 * Maps one raw timeline message item onto the UI-facing {@link InboxMessage},
 * flattening the `{ date_created, data }` envelope and translating the backend
 * snake_case vocabulary to the camelCase domain shape.
 */
export const normalizeInboxMessage = (item: RawTimelineItem): InboxMessage => ({
  id: item.data.communication_sent_id,
  channel: inboxChannelFromWireName(item.data.channel),
  authorType: item.data.author_type,
  messageType: toMessageType(item.data.message_type),
  title: item.data.title,
  content: item.data.content,
  dateCreated: item.date_created,
  status: toStatus(item.data.status),
});

/**
 * Stable `select` for the messages infinite query: flattens each raw timeline
 * page's `items` → `messages` (keeping only `item_type === "message"`) and the
 * `communication_sent_window` envelope → the flat windowing flags the thread
 * view consumes. Module-scoped so its reference is stable across renders
 * (TanStack memoizes `select` by identity).
 */
export const selectInboxMessages = (
  data: InfiniteData<RawStudioManagerTimelineResponse>,
): InfiniteData<InboxMessagesResponse> => ({
  ...data,
  pages: data.pages.map((page) => ({
    messages: page.items
      .filter((item) => item.item_type === "message")
      .map(normalizeInboxMessage),
    firstUnreadId:
      page.communication_sent_window.first_unread_communication_sent_id,
    hasMoreBefore: page.communication_sent_window.has_more_before,
    hasMoreAfter: page.communication_sent_window.has_more_after,
  })),
});
