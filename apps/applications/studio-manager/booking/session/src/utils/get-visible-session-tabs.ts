export type SessionTabKey = "overview" | "editor" | "series" | "occurrences";

/**
 * Series and All occurrences are mutually exclusive. A `group` only exists for
 * workshop sessions, where the Group is the canonical relationship — so Series
 * wins. Regular classes created with the "recurring" toggle never get a Group;
 * they share a session-level `recurrence_id`, and All occurrences is the right
 * view for them.
 */
export const getVisibleSessionTabs = (
  group: number | null,
  recurrenceCount: number,
): SessionTabKey[] => {
  const tabs: SessionTabKey[] = ["overview", "editor"];
  if (group !== null) {
    tabs.push("series");
  } else if (recurrenceCount > 1) {
    tabs.push("occurrences");
  }
  return tabs;
};
