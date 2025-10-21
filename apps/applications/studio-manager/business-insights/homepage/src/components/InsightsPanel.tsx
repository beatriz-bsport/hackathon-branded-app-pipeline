import type { FC } from "react";

import { Body, Loader, Title } from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks";
import { useTranslation } from "#src/utils/i18n";

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
    console.warn(`InsightsPanel error: ${error}`);
    return null;
  }

  return (
    <div className="flex flex-col">
      <Title htmlVariant="h2" weight="strong" className="mb-md">
        {t("insightsPanel.title")}
      </Title>

      {/* Larger height for detailed insights panel - removed border for cleaner look */}
      <div className="w-full rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center min-h-[690px]">
            <Loader size="xl" />
          </div>
        ) : iframeUrl ? (
          <DashboardIframe
            src={iframeUrl}
            title={t("insightsPanel.title")}
            minHeight={690}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[690px]">
            <Body color="weak" size="md">
              {t("insightsPanel.unavailable")}
            </Body>
          </div>
        )}
      </div>
    </div>
  );
};
