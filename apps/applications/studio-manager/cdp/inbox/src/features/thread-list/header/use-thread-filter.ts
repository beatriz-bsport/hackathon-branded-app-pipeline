import { useCallback, useState } from "react";

import type { FetchInboxConversationsParams } from "@bsport/api-cdp/inbox";

import { useDebouncedValue } from "#src/hooks/use-debounced-value";

/**
 * The selectable thread-list filters, in menu order. `"all"` sends no filter param;
 * `"unread"` narrows the feed to conversations with unread messages. Favorites/muted/
 * needs-human are deferred to a later iteration.
 */
export const THREAD_FILTERS = ["all", "unread"] as const;

/** The single-select thread-list filter — one of {@link THREAD_FILTERS}. */
export type ThreadFilter = (typeof THREAD_FILTERS)[number];

// ~300ms: long enough that typing doesn't fire a request per keystroke, short
// enough that results feel immediate once the manager stops. Matches the
// member-search precedent.
const SEARCH_DEBOUNCE_MS = 300;

/**
 * The combined thread-list controls hook: it owns both the filter selection and
 * the member-search state, because the two are coupled — search and the filter
 * are mutually exclusive views of the same list. Folding them into one hook
 * (rather than two standalone ones) matches the established Studio Manager list
 * pattern and keeps the coupling rules in one place.
 *
 * Filter state is local React state — it does not persist across navigation
 * (the app has no URL-param convention yet).
 *
 * `conversationParams` encapsulates the `buildUrlParams` gotcha in one place: `"all"`
 * yields `{}` (no `unread` key) rather than `{ unread: undefined }`, which
 * `buildUrlParams` would stringify to `unread=undefined` — the same reason `api.ts`
 * omits the cursor keys on the initial load.
 *
 * Search uses the value-debounce pattern: `search` is the immediate field value;
 * `debouncedSearch` is the trimmed value the data layer keys on. Search is only
 * "active" once the debounced value is non-empty after trim, so a stray keystroke
 * or whitespace keeps the normal feed on screen. The filter selection is never
 * reset while searching, so clearing the field returns to the prior filtered view.
 */
export function useThreadFilter() {
  const [filter, setFilter] = useState<ThreadFilter>("all");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const isSearching = debouncedSearch.length > 0;

  const onSearchClear = useCallback(() => setSearch(""), []);

  const conversationParams: FetchInboxConversationsParams =
    filter === "unread" ? { unread: true } : {};

  return {
    filter,
    setFilter,
    conversationParams,
    search,
    debouncedSearch,
    onSearchChange: setSearch,
    onSearchClear,
    isSearching,
  };
}
