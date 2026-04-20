import { NavLink } from "react-router";

import { Tabs, type TabsProps } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useBuildPageTabs = (): TabsProps => {
  const { t } = useTranslation("shared-list");

  return {
    orientation: "horizontal",
    TabsItems: [
      <NavLink to={`../${URLS.MEDIA}`} key="media">
        {({ isActive }) => (
          <Tabs.Item id="media" label={t("tabs.media")} isActive={isActive} />
        )}
      </NavLink>,
      <NavLink to={`../${URLS.COLLECTION}`} key="collections">
        {({ isActive }) => (
          <Tabs.Item
            id="collections"
            label={t("tabs.collections")}
            isActive={isActive}
          />
        )}
      </NavLink>,
    ],
  };
};
