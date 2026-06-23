import { HttpResponse, delay, http } from "msw";

import type {
  InboxMessage,
  InboxMessagesResponse,
  RawInboxConversation,
  RawStudioManagerConversationsResponse,
} from "../types";
import {
  MOCK_INBOX_FIRST_UNREAD_ID,
  mockInboxConversations,
  mockInboxMessages,
} from "./data";

const INBOX_CONVERSATIONS_DEFAULT_LIMIT = 20;

// Match the studio-manager conversation collection endpoint regardless of the
// API base URL the host app resolves to (Storybook points at the dev API). The
// trailing slash (and no wildcard) anchors it to the collection so it does not
// also match per-conversation sub-resources like `.../conversation/<id>/
// communication_sent`. MSW ignores the query string when matching, so the
// `?...` appended by `buildUrlParams` needs no wildcard here.
export const INBOX_CONVERSATION_URL_PATTERN =
  "*/communicate/v1/communication/studio_manager/conversation/";

/**
 * Cursor-based page over the dataset (ordered newest → oldest). With no cursor
 * returns the most-recent `limit`; with a cursor returns up to `limit` strictly
 * older/newer than it. `more_conversations` flags another page in that
 * direction.
 */
const buildPage = (
  dataset: RawInboxConversation[],
  {
    cursor,
    direction,
    limit,
  }: {
    cursor?: string;
    direction?: "older" | "newer";
    limit: number;
  },
): RawStudioManagerConversationsResponse => {
  let pool = dataset;
  if (cursor !== undefined && direction === "older") {
    pool = dataset.filter((c) => c.last_inbox_activity_at < cursor);
  } else if (cursor !== undefined && direction === "newer") {
    pool = dataset.filter((c) => c.last_inbox_activity_at > cursor);
  }

  const results = pool.slice(0, limit);

  return {
    results,
    more_conversations: pool.length > results.length,
  };
};

type MakeInboxHandlersOptions = {
  /** Dataset to paginate over. Defaults to the full mock dataset. */
  dataset?: RawInboxConversation[];
  /**
   * Artificial latency per request. A number is milliseconds; `"infinite"`
   * never resolves (useful for exercising loading states). Defaults to 400ms.
   */
  delayMs?: number | "infinite";
  /**
   * Pages at or beyond this number respond with HTTP 500. `1` fails the initial
   * (cursor-less) load; `2` serves the first page and fails every cursored page
   * after it — useful for the "next page failed to load" state. Defaults to
   * never failing.
   */
  errorFromPage?: number;
};

/**
 * Builds the MSW handler(s) for the studio-manager conversation list endpoint.
 * Serves the configured dataset cursor-by-cursor so infinite scroll can be
 * exercised.
 */
export const makeInboxHandlers = ({
  dataset = mockInboxConversations,
  delayMs = 400,
  errorFromPage,
}: MakeInboxHandlersOptions = {}) => [
  http.get(INBOX_CONVERSATION_URL_PATTERN, async ({ request }) => {
    const url = new URL(request.url);
    const cursor =
      url.searchParams.get("last_inbox_activity_at_cursor") ?? undefined;
    const direction =
      (url.searchParams.get("direction") as "older" | "newer" | null) ??
      undefined;
    const limit =
      Number(url.searchParams.get("limit") ?? "") ||
      INBOX_CONVERSATIONS_DEFAULT_LIMIT;

    await delay(delayMs);

    // The initial load is cursor-less ("page 1"); any cursored request is a
    // later page ("page >= 2"), preserving the page-indexed error semantics.
    const page = cursor === undefined ? 1 : 2;
    if (errorFromPage !== undefined && page >= errorFromPage) {
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }

    return HttpResponse.json(buildPage(dataset, { cursor, direction, limit }));
  }),
];

// --- Conversation messages -------------------------------------------------

const INBOX_MESSAGES_DEFAULT_LIMIT = 20;

// Matches the per-conversation messages endpoint regardless of API base URL.
// The `*` before `communication_sent` covers the conversation id segment; the
// trailing `*` covers the query string appended by `buildUrlParams`.
export const INBOX_MESSAGES_URL_PATTERN =
  "*/communicate/v1/communication/studio_manager/conversation/*/communication_sent*";

/**
 * Builds the windowed `InboxMessagesResponse` for a request. The dataset must be
 * ordered oldest → newest (ascending `id`).
 *
 * - filtered (channel/message_type set) → most recent `limit` matches, seam ignored
 * - `before=<id>` → up to `limit` messages older than `before`
 * - `after=<id>`  → up to `limit` messages newer than `after`
 * - initial (no cursor) → up to `limit` before the seam + up to `limit` from the seam on
 */
const buildMessagesWindow = (
  dataset: InboxMessage[],
  firstUnreadId: number | null,
  params: {
    before?: number;
    after?: number;
    limit: number;
    channel?: string | null;
    messageType?: string | null;
  },
): InboxMessagesResponse => {
  const { before, after, limit, channel, messageType } = params;
  const isFiltered = Boolean(channel) || Boolean(messageType);

  if (isFiltered) {
    const filtered = dataset.filter(
      (message) =>
        (!channel || message.channel === channel) &&
        (!messageType || message.source === messageType),
    );
    const messages = filtered.slice(-limit);
    return {
      messages,
      firstUnreadId: null,
      hasMoreBefore: filtered.length > messages.length,
      hasMoreAfter: false,
    };
  }

  if (before !== undefined) {
    const older = dataset.filter((message) => message.id < before);
    const messages = older.slice(-limit);
    return {
      messages,
      firstUnreadId: null,
      hasMoreBefore: older.length > messages.length,
      hasMoreAfter: false,
    };
  }

  if (after !== undefined) {
    const newer = dataset.filter((message) => message.id > after);
    const messages = newer.slice(0, limit);
    return {
      messages,
      firstUnreadId: null,
      hasMoreBefore: false,
      hasMoreAfter: newer.length > messages.length,
    };
  }

  // Initial load: split the dataset at the seam.
  const seamIndex =
    firstUnreadId === null
      ? dataset.length
      : dataset.findIndex((message) => message.id === firstUnreadId);
  // A seam id that isn't in the dataset is treated as "fully read".
  const splitAt = seamIndex === -1 ? dataset.length : seamIndex;

  const beforeSeam = dataset.slice(0, splitAt);
  const fromSeam = dataset.slice(splitAt);
  const beforeWindow = beforeSeam.slice(-limit);
  const afterWindow = fromSeam.slice(0, limit);
  const isFullyRead = splitAt >= dataset.length;

  return {
    messages: [...beforeWindow, ...afterWindow],
    firstUnreadId: isFullyRead ? null : firstUnreadId,
    hasMoreBefore: beforeSeam.length > beforeWindow.length,
    hasMoreAfter: fromSeam.length > afterWindow.length,
  };
};

type MakeInboxMessagesHandlersOptions = {
  /** Dataset to window over (oldest → newest). Defaults to the full mock dataset. */
  dataset?: InboxMessage[];
  /** Id of the first unread message (the seam). `null` = fully read. */
  firstUnreadId?: number | null;
  /** Artificial latency per request. See {@link MakeInboxHandlersOptions.delayMs}. */
  delayMs?: number | "infinite";
  /** Default page size when the request omits `limit`. */
  defaultLimit?: number;
  /** When true, every request responds with HTTP 500. */
  errorOnLoad?: boolean;
};

/**
 * Builds the MSW handler(s) for the conversation messages endpoint. Serves a
 * seam-anchored window on the initial load and bidirectional `before`/`after`
 * cursor pages thereafter, matching the Notion "List messages" contract.
 */
export const makeInboxMessagesHandlers = ({
  dataset = mockInboxMessages,
  firstUnreadId = MOCK_INBOX_FIRST_UNREAD_ID,
  delayMs = 400,
  defaultLimit = INBOX_MESSAGES_DEFAULT_LIMIT,
  errorOnLoad,
}: MakeInboxMessagesHandlersOptions = {}) => [
  http.get(INBOX_MESSAGES_URL_PATTERN, async ({ request }) => {
    const url = new URL(request.url);
    const beforeParam = url.searchParams.get("before");
    const afterParam = url.searchParams.get("after");
    const limit = Number(url.searchParams.get("limit") ?? "") || defaultLimit;

    await delay(delayMs);

    if (errorOnLoad) {
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }

    return HttpResponse.json(
      buildMessagesWindow(dataset, firstUnreadId, {
        before: beforeParam !== null ? Number(beforeParam) : undefined,
        after: afterParam !== null ? Number(afterParam) : undefined,
        limit,
        channel: url.searchParams.get("channel"),
        messageType: url.searchParams.get("message_type"),
      }),
    );
  }),
];
