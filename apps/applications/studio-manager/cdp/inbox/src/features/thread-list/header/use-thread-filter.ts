import { useState } from "react";

import type { FetchInboxConversationsParams } from "@bsport/api-cdp/inbox";

/**
 * The selectable thread-list filters, in menu order. `"all"` sends no filter param;
 * `"unread"` narrows the feed to conversations with unread messages. Favorites/muted/
 * needs-human are deferred to a later iteration.
 */
export const THREAD_FILTERS = ["all", "unread"] as const;

/** The single-select thread-list filter — one of {@link THREAD_FILTERS}. */
export type ThreadFilter = (typeof THREAD_FILTERS)[number];

/**
 * Owns the thread-list filter state and derives the conversation query params from
 * it. State is local React state — it does not persist across navigation (the app
 * has no URL-param convention yet). Co-located with the filter UI because the two
 * change together.
 *
 * `conversationParams` encapsulates the `buildUrlParams` gotcha in one place: `"all"`
 * yields `{}` (no `unread` key) rather than `{ unread: undefined }`, which
 * `buildUrlParams` would stringify to `unread=undefined` — the same reason `api.ts`
 * omits the cursor keys on the initial load.
 */
export function useThreadFilter() {
  const [filter, setFilter] = useState<ThreadFilter>("all");

  const conversationParams: FetchInboxConversationsParams =
    filter === "unread" ? { unread: true } : {};

  return { filter, setFilter, conversationParams };
}
