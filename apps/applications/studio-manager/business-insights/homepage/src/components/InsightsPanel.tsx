import type { FC } from "react";

import { HomepageSection } from "#src/components/HomepageSection";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks";
import { useTranslation } from "#src/utils/i18n";

import { Dashboard } from "./Dashboard";

/**
 * Insights Panel component displays an embedded iframe with detailed business insights.
 * Shows a loading state while fetching the dashboard URL.
 * This is a Sigma embedded dashboard showing detailed analytics and charts.
 */
export const InsightsPanel: FC = () => {
  const { t } = useTranslation("default");
  const { iframeUrl, isLoading, error } = usePresignedUrl(
    DASHBOARD_TYPES.HOME_PAGE_INSIGHTS_PANEL,
  );

  if (error) {
    console.warn(`[Homepage] InsightsPanel error: ${error}`);
    return null;
  }

  return (
    <HomepageSection title={t("insightsPanel.title")}>
      <Dashboard
        errorMessage={t("insightsPanel.unavailable")}
        iframeLoadingHeight={690}
        iframeLoadingMobileHeight={2081}
        iframeTitle={t("insightsPanel.title")}
        iframeUrl={iframeUrl}
        isLoading={isLoading}
      />
    </HomepageSection>
  );
};
