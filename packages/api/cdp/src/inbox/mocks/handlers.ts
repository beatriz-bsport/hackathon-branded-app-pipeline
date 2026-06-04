import { HttpResponse, delay, http } from "msw";

import type { PaginatedResponse } from "@bsport/store-base";

import type { InboxConversationListItem } from "../types";
import { mockInboxConversations } from "./data";

const INBOX_CONVERSATIONS_DEFAULT_PAGE_SIZE = 20;

// Match the inbox conversation endpoint regardless of the API base URL the host
// app resolves to (Storybook points at the dev API). The trailing `*` covers
// the query string appended by `buildUrlParams`.
export const INBOX_CONVERSATION_URL_PATTERN =
  "*/customer-data-platform/v1/inbox_conversation*";

const buildPage = (
  dataset: InboxConversationListItem[],
  page: number,
  pageSize: number,
): PaginatedResponse<InboxConversationListItem> => {
  const start = (page - 1) * pageSize;
  const results = dataset.slice(start, start + pageSize);
  const hasNext = start + pageSize < dataset.length;
  const hasPrevious = page > 1;

  return {
    count: dataset.length,
    page,
    next_page: hasNext ? page + 1 : null,
    links: {
      next: hasNext ? page + 1 : null,
      previous: hasPrevious ? page - 1 : null,
    },
    results,
  };
};

type MakeInboxHandlersOptions = {
  /** Dataset to paginate over. Defaults to the full mock dataset. */
  dataset?: InboxConversationListItem[];
  /**
   * Artificial latency per request. A number is milliseconds; `"infinite"`
   * never resolves (useful for exercising loading states). Defaults to 400ms.
   */
  delayMs?: number | "infinite";
  /**
   * Pages at or beyond this number respond with HTTP 500. E.g. `1` fails the
   * initial load, `2` serves the first page and fails every one after —
   * useful for exercising the "next page failed to load" state. Defaults to
   * never failing.
   */
  errorFromPage?: number;
};

/**
 * Builds the MSW handler(s) for the inbox conversation list endpoint. Returns
 * the configured dataset page-by-page so infinite scroll can be exercised.
 */
export const makeInboxHandlers = ({
  dataset = mockInboxConversations,
  delayMs = 400,
  errorFromPage,
}: MakeInboxHandlersOptions = {}) => [
  http.get(INBOX_CONVERSATION_URL_PATTERN, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1") || 1;
    const pageSize =
      Number(url.searchParams.get("page_size") ?? "") ||
      INBOX_CONVERSATIONS_DEFAULT_PAGE_SIZE;

    await delay(delayMs);

    if (errorFromPage !== undefined && page >= errorFromPage) {
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }

    return HttpResponse.json(buildPage(dataset, page, pageSize));
  }),
];
