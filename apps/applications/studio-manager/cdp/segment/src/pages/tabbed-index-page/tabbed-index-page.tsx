import { NavLink } from "react-router";

import { Tabs, type TabsProps } from "@bsport/kaizen-primitive-core";

import { CustomSegmentList } from "#src/components/custom-segment-list";
import { PrebuiltSegmentList } from "#src/components/prebuilt-segment-list";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type SegmentIndexTab = "prebuilt" | "custom";

type Props = {
  activeTab: SegmentIndexTab;
};

export const TabbedIndexPage: React.FC<Props> = ({ activeTab }: Props) => {
  const { t } = useTranslation("list");

  const tabsConfig: TabsProps = {
    TabsItems: [
      <NavLink
        to={SMARTLIST_APP_LINKS.prebuiltIndex()}
        replace
        id="prebuilt"
        key="prebuilt"
      >
        {({ isActive }) => (
          <Tabs.Item
            label={t("tabs.prebuilt")}
            isActive={isActive || activeTab === "prebuilt"}
            id="prebuilt"
          />
        )}
      </NavLink>,
      <NavLink
        to={SMARTLIST_APP_LINKS.index()}
        replace
        id="custom"
        key="custom"
      >
        {({ isActive }) => (
          <Tabs.Item
            label={t("tabs.custom")}
            isActive={isActive || activeTab === "custom"}
            id="custom"
          />
        )}
      </NavLink>,
    ],
    orientation: "horizontal",
  };

  if (activeTab === "custom") {
    return <CustomSegmentList pageTabs={tabsConfig} />;
  }

  return <PrebuiltSegmentList pageTabs={tabsConfig} />;
};

export default TabbedIndexPage;
