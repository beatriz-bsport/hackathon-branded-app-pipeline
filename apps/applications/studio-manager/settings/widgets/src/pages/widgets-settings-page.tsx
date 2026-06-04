import { type FC, useState } from "react";

import {
  DetailsLayout,
  Loader,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { WidgetsSettingsGeneralShell } from "#src/components/widgets-settings/widgets-settings-general-shell";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const GENERAL_TAB = "general";
const CUSTOMIZE_TAB = "customize";
const CUSTOM_CSS_TAB = "custom-css";

const redirectToLegacyTab = (tabIdentifier: string) => {
  if (tabIdentifier === CUSTOMIZE_TAB) {
    window.location.assign(LEGACY_URLS.CUSTOMIZE);
  }

  if (tabIdentifier === CUSTOM_CSS_TAB) {
    window.location.assign(LEGACY_URLS.CUSTOM_CSS);
  }
};

const renderTabContent = (tabIdentifier: string) => {
  if (tabIdentifier === GENERAL_TAB) {
    return <WidgetsSettingsGeneralShell />;
  }

  return null;
};

const WidgetsSettingsPage: FC = () => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState(GENERAL_TAB);

  const handleTabChange = (tabIdentifier: string) => {
    setActiveTab(tabIdentifier);
    redirectToLegacyTab(tabIdentifier);
  };

  const pageTabs: TabsProps = {
    value: activeTab,
    onValueChange: handleTabChange,
    orientation: "horizontal",
    tabs: [
      {
        id: GENERAL_TAB,
        label: t("widgetsSettings.tabs.general"),
      },
      {
        id: CUSTOMIZE_TAB,
        label: t("widgetsSettings.tabs.customize"),
      },
      {
        id: CUSTOM_CSS_TAB,
        label: t("widgetsSettings.tabs.customCss"),
      },
    ],
  };

  return (
    <DetailsLayout>
      <DetailsLayout.Header
        pageTitle={t("widgetsSettings.title")}
        pageTabs={pageTabs}
      />
      <DetailsLayout.Content className="max-w-none !p-0">
        <QueryBoundary
          loadingFallback={<Loader className="h-full w-full" size="xl" />}
        >
          {renderTabContent(activeTab)}
        </QueryBoundary>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default WidgetsSettingsPage;
