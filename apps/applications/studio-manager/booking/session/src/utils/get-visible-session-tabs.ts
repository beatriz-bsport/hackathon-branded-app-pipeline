export type SessionTabKey = "overview" | "editor" | "occurrences";

/**
 * Grouped classes expose their series context in the details panel and link to
 * the canonical series page instead of adding a session-level tab.
 */
export const getVisibleSessionTabs = (
  group: number | null,
  recurrenceCount: number,
): SessionTabKey[] => {
  const tabs: SessionTabKey[] = ["overview", "editor"];

  if (group === null && recurrenceCount > 1) {
    tabs.push("occurrences");
  }

  return tabs;
};
