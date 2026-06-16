import type { InboxMessage } from "@bsport/api-cdp/inbox";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

/** The seam separator's key — there is at most one per feed. */
export const NEW_SEPARATOR_KEY = "separator-new" as const;

/**
 * A single row in the virtualized message feed. The feed is more than the raw
 * messages: it interleaves day separators and a single "NEW" seam separator.
 * The `type` discriminator tells the renderer which component to mount.
 *
 * Every row carries a `key` that is **stable across pagination** — message rows
 * key off the message id, date rows off the calendar day, the seam off a fixed
 * string. This is what lets `@tanstack/react-virtual`'s `anchorTo: "end"` keep
 * the viewport pinned when older history is prepended: it re-finds the anchored
 * row by key. Keying any row by its array index would break that.
 */
export type FeedRow =
  | { type: "message"; key: string; message: InboxMessage }
  | { type: "date"; key: string; iso: string }
  | { type: "new"; key: typeof NEW_SEPARATOR_KEY };

/**
 * Calendar-day key (`YYYY-MM-DD`) used both to detect day boundaries and to key
 * the date rows. Computed in the same timezone `formatDateTime` renders in, so
 * the day a message is grouped under always matches its displayed time.
 */
const dayKeyOf = (iso: string): string =>
  formatDateTime(iso, DATETIME_FORMATS.ISO_DATE);

/**
 * Flattens an ascending (oldest → newest) list of messages into the feed rows
 * the virtual list renders. Emits:
 * - a `date` row before each new calendar-day group (including the first), and
 * - a single `new` row immediately before the first unread message, but only
 *   when `firstUnreadId` is set and that message is in the loaded window.
 */
export const buildRows = (
  messages: InboxMessage[],
  firstUnreadId: number | null,
): FeedRow[] => {
  const rows: FeedRow[] = [];
  let prevDayKey: string | null = null;

  for (const message of messages) {
    const dayKey = dayKeyOf(message.dateCreated);
    if (dayKey !== prevDayKey) {
      rows.push({
        type: "date",
        key: `date-${dayKey}`,
        iso: message.dateCreated,
      });
      prevDayKey = dayKey;
    }

    if (firstUnreadId !== null && message.id === firstUnreadId) {
      rows.push({ type: "new", key: NEW_SEPARATOR_KEY });
    }

    rows.push({ type: "message", key: `msg-${message.id}`, message });
  }

  return rows;
};
