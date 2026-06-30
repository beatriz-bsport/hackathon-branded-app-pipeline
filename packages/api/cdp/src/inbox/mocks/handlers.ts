import { HttpResponse, delay, http } from "msw";

import type {
  RawInboxConversation,
  RawStudioManagerConversationsResponse,
  RawStudioManagerTimelineResponse,
  RawTimelineItem,
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
    unread,
    escalated,
  }: {
    cursor?: string;
    direction?: "older" | "newer";
    limit: number;
    unread?: boolean;
    escalated?: boolean;
  },
): RawStudioManagerConversationsResponse => {
  let pool = dataset;
  // Apply the filter params before the cursor slice so pagination walks the
  // filtered set (mirrors the backend, which filters then paginates).
  if (unread) {
    pool = pool.filter((c) => c.studio_unread_count > 0);
  }
  if (escalated) {
    pool = pool.filter((c) => c.has_unresolved_escalation);
  }
  if (cursor !== undefined && direction === "older") {
    pool = pool.filter((c) => c.last_inbox_activity_at < cursor);
  } else if (cursor !== undefined && direction === "newer") {
    pool = pool.filter((c) => c.last_inbox_activity_at > cursor);
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
    const unread = url.searchParams.get("unread") === "true";
    const escalated = url.searchParams.get("escalated") === "true";

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

    return HttpResponse.json(
      buildPage(dataset, { cursor, direction, limit, unread, escalated }),
    );
  }),
];

// --- Conversation messages -------------------------------------------------

const INBOX_MESSAGES_DEFAULT_LIMIT = 20;

// Matches the per-conversation timeline endpoint regardless of API base URL.
// The `*` before `timeline` covers the conversation id segment; the trailing
// `*` covers the query string appended by `buildUrlParams`.
export const INBOX_MESSAGES_URL_PATTERN =
  "*/communicate/v1/communication/studio_manager/conversation/*/timeline*";

const idOf = (item: RawTimelineItem): number => item.data.communication_sent_id;

/**
 * Builds the windowed `RawStudioManagerTimelineResponse` for a request. The
 * dataset must be ordered oldest → newest (ascending `communication_sent_id`).
 *
 * - filtered (channels/message_types set) → most recent `limit` matches, seam ignored
 * - cursor + `direction: "older"` → up to `limit` messages older than the cursor
 * - cursor + `direction: "newer"` → up to `limit` messages newer than the cursor
 * - initial (no cursor) → up to `limit` before the seam + up to `limit` from the seam on
 */
const buildMessagesWindow = (
  dataset: RawTimelineItem[],
  firstUnreadId: number | null,
  params: {
    communicationSentId?: number;
    direction?: "older" | "newer";
    limit: number;
    channels: string[];
    messageTypes: string[];
  },
): RawStudioManagerTimelineResponse => {
  const { communicationSentId, direction, limit, channels, messageTypes } =
    params;
  const isFiltered = channels.length > 0 || messageTypes.length > 0;

  if (isFiltered) {
    const filtered = dataset.filter(
      (item) =>
        (channels.length === 0 ||
          (item.data.channel !== null &&
            channels.includes(item.data.channel))) &&
        (messageTypes.length === 0 ||
          (item.data.message_type !== null &&
            messageTypes.includes(item.data.message_type))),
    );
    const items = filtered.slice(-limit);
    return {
      items,
      communication_sent_window: {
        first_unread_communication_sent_id: null,
        has_more_before: filtered.length > items.length,
        has_more_after: false,
      },
    };
  }

  if (communicationSentId !== undefined && direction === "older") {
    const older = dataset.filter((item) => idOf(item) < communicationSentId);
    const items = older.slice(-limit);
    return {
      items,
      communication_sent_window: {
        first_unread_communication_sent_id: null,
        has_more_before: older.length > items.length,
        has_more_after: false,
      },
    };
  }

  if (communicationSentId !== undefined && direction === "newer") {
    const newer = dataset.filter((item) => idOf(item) > communicationSentId);
    const items = newer.slice(0, limit);
    return {
      items,
      communication_sent_window: {
        first_unread_communication_sent_id: null,
        has_more_before: false,
        has_more_after: newer.length > items.length,
      },
    };
  }

  // Initial load: split the dataset at the seam.
  const seamIndex =
    firstUnreadId === null
      ? dataset.length
      : dataset.findIndex((item) => idOf(item) === firstUnreadId);
  // A seam id that isn't in the dataset is treated as "fully read".
  const splitAt = seamIndex === -1 ? dataset.length : seamIndex;

  const beforeSeam = dataset.slice(0, splitAt);
  const fromSeam = dataset.slice(splitAt);
  const beforeWindow = beforeSeam.slice(-limit);
  const afterWindow = fromSeam.slice(0, limit);
  const isFullyRead = splitAt >= dataset.length;

  return {
    items: [...beforeWindow, ...afterWindow],
    communication_sent_window: {
      first_unread_communication_sent_id: isFullyRead ? null : firstUnreadId,
      has_more_before: beforeSeam.length > beforeWindow.length,
      has_more_after: fromSeam.length > afterWindow.length,
    },
  };
};

type MakeInboxMessagesHandlersOptions = {
  /** Dataset to window over (oldest → newest). Defaults to the full mock dataset. */
  dataset?: RawTimelineItem[];
  /** Id of the first unread message (the seam). `null` = fully read. */
  firstUnreadId?: number | null;
  /** Artificial latency per request. See {@link MakeInboxHandlersOptions.delayMs}. */
  delayMs?: number | "infinite";
  /** Default page size when the request omits `limit`. */
  defaultLimit?: number;
  /** When true, every request responds with HTTP 500. */
  errorOnLoad?: boolean;
};

// Parses a CSV query param (`?channels=email,sms`) into a string[]; `null` and
// the empty string both yield `[]` (no filter).
const parseCsvParam = (value: string | null): string[] =>
  value ? value.split(",").filter(Boolean) : [];

/**
 * Builds the MSW handler(s) for the conversation timeline endpoint. Serves a
 * seam-anchored window on the initial load and bidirectional
 * `communication_sent_id` + `direction` cursor pages thereafter, matching the
 * backend `timeline` contract.
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
    const cursorParam = url.searchParams.get("communication_sent_id");
    const direction =
      (url.searchParams.get("direction") as "older" | "newer" | null) ??
      undefined;
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
        communicationSentId:
          cursorParam !== null ? Number(cursorParam) : undefined,
        direction,
        limit,
        channels: parseCsvParam(url.searchParams.get("channels")),
        messageTypes: parseCsvParam(url.searchParams.get("message_types")),
      }),
    );
  }),
];
