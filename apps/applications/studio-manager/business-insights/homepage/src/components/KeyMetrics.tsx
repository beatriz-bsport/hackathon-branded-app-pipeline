import type { FC } from "react";

import { HomepageSection } from "#src/components/HomepageSection";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks";
import { useTranslation } from "#src/utils/i18n";

import { Dashboard } from "./Dashboard";

/**
 * Key Metrics component displays an embedded iframe with key business metrics.
 * Shows a loading state while fetching the dashboard URL.
 * This is a Sigma embedded dashboard showing high-level business metrics.
 */
export const KeyMetrics: FC = () => {
  const { t } = useTranslation("default");
  const { iframeUrl, isLoading, error } = usePresignedUrl(
    DASHBOARD_TYPES.HOME_PAGE_KEY_METRICS,
  );

  if (error) {
    console.warn(`[Homepage] KeyMetrics error: ${error}`);
    return null;
  }

  return (
    <HomepageSection title={t("keyMetrics.title")} noGap>
      <Dashboard
        errorMessage={t("keyMetrics.unavailable")}
        iframeLeftTranslate={-16}
        iframeMinHeight={285}
        iframeTitle={t("keyMetrics.title")}
        iframeUrl={iframeUrl}
        isLoading={isLoading}
      />
    </HomepageSection>
  );
};
