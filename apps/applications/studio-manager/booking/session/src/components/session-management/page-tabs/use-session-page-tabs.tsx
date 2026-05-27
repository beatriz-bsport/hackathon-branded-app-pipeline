import { Link, useLocation } from "react-router";

import { Tabs, type TabsProps } from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { getVisibleTabs } from "./get-visible-tabs";
import { SESSION_TAB_PARAM, type TabKey } from "./types";

export const useSessionPageTabs = (
  sessionId: number,
  groupId: number | null,
): TabsProps => {
  const { t } = useTranslation("sessionManagement");
  const { getBookingsManagementPath } = useUrls();
  const { pathname, search } = useLocation();

  const overviewPath = getBookingsManagementPath(sessionId);
  const editPath = `${overviewPath}/edit`;
  const seriesPath = `${overviewPath}?${SESSION_TAB_PARAM}=series`;
  const visibleTabs = getVisibleTabs({ groupId });
  // Only treat ?tab=series as active when Series is actually visible, so a
  // deep-linked non-group session falls back to the Overview tab.
  const isSeries =
    visibleTabs.includes("series") &&
    new URLSearchParams(search).get(SESSION_TAB_PARAM) === "series";

  const activeTab: TabKey = pathname.endsWith("/edit")
    ? "editor"
    : isSeries
      ? "series"
      : "overview";

  const hrefByKey: Record<TabKey, string> = {
    overview: overviewPath,
    editor: editPath,
    series: seriesPath,
  };

  return {
    orientation: "horizontal",
    TabsItems: visibleTabs.map((key) => (
      <Link key={key} to={hrefByKey[key]}>
        <Tabs.Item
          id={`session-tab-${key}`}
          label={t(`pageTabs.${key}`)}
          isActive={activeTab === key}
        />
      </Link>
    )),
  };
};
