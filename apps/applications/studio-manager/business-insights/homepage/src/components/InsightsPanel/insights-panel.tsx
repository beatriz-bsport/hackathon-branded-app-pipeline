import type { FC } from "react";

import { Dashboard } from "#src/components/Dashboard";
import { HomepageSection } from "#src/components/HomepageSection";
import { DASHBOARD_TYPES } from "#src/constants";
import { useSigmaLoadingState } from "#src/hooks/use-sigma-loading-state";
import { useTranslation } from "#src/utils/i18n";

import { InsightsPanelErrorState } from "./insights-panel-error-state";
import { InsightsPanelLoadingState } from "./insights-panel-loading-state";

/**
 * Insights Panel component displays an embedded iframe with detailed business insights.
 * This is a Sigma embedded dashboard showing detailed analytics and charts.
 */
export const InsightsPanel: FC = () => {
  const { t } = useTranslation("default");
  const { iframeUrl, status, error, onSigmaMessage } = useSigmaLoadingState(
    DASHBOARD_TYPES.HOME_PAGE_INSIGHTS_PANEL,
  );

  if (error) {
    console.warn(`[Homepage] InsightsPanel error: ${error}`);
  }

  return (
    <HomepageSection title={t("insightsPanel.title")}>
      <Dashboard
        clipContentToLoadingHeight
        errorContent={<InsightsPanelErrorState />}
        errorMessage={t("insightsPanel.unavailable")}
        iframeLoadingHeight={690}
        iframeLoadingMobileHeight={2081}
        iframeLeftTranslate={-16}
        iframeTitle={t("insightsPanel.title")}
        iframeUrl={iframeUrl}
        isError={status === "error"}
        isLoading={status === "loading"}
        loadingContent={<InsightsPanelLoadingState />}
        onSigmaMessage={onSigmaMessage}
      />
    </HomepageSection>
  );
};
