import type { TabKey } from "./types";

export const getVisibleTabs = ({
  groupId,
}: {
  groupId: number | null;
}): TabKey[] => {
  const tabs: TabKey[] = ["overview", "editor"];
  if (groupId !== null) tabs.push("series");
  return tabs;
};
