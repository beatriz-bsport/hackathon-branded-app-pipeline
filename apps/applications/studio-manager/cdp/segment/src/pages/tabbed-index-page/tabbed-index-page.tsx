import { NavLink } from "react-router";

import {
  ListLayout,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { SegmentListPageContent } from "#src/components/segment-list-page-content";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type SegmentIndexTab = "prebuilt" | "custom";

type Props = {
  activeTab: SegmentIndexTab;
};

const PrebuiltPlaceholder = () => {
  const { t } = useTranslation("list");
  return (
    <ListLayout.Content>
      <div className="flex items-center justify-center h-full p-8 text-onsurface-weak">
        {t("prebuilt.placeholder")}
      </div>
    </ListLayout.Content>
  );
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
    return <SegmentListPageContent pageTabs={tabsConfig} />;
  }

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("title")} pageTabs={tabsConfig} />
      <PrebuiltPlaceholder />
    </ListLayout>
  );
};

export default TabbedIndexPage;
