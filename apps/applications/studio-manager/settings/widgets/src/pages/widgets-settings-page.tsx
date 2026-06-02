import type { FC } from "react";

import {
  DetailsLayout,
  Loader,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { WidgetsSettingsShell } from "#src/components/widgets-settings/widgets-settings-shell";
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

const WidgetsSettingsPage: FC = () => {
  const { t } = useTranslation("common");

  const pageTabs: TabsProps = {
    value: GENERAL_TAB,
    onValueChange: redirectToLegacyTab,
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
      <DetailsLayout.Content className="max-w-none">
        <QueryBoundary
          loadingFallback={<Loader className="h-full w-full" size="xl" />}
        >
          <WidgetsSettingsShell />
        </QueryBoundary>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default WidgetsSettingsPage;
