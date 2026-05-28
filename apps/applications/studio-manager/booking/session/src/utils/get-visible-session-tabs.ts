export type SessionTabKey = "overview" | "editor" | "series";

export const getVisibleSessionTabs = (
  group: number | null,
): SessionTabKey[] => {
  const tabs: SessionTabKey[] = ["overview", "editor"];
  if (group !== null) tabs.push("series");
  return tabs;
};
