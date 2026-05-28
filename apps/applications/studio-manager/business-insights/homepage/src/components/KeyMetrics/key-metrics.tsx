import type { FC } from "react";

import { Dashboard } from "#src/components/Dashboard";
import { HomepageSection } from "#src/components/HomepageSection";
import { DASHBOARD_TYPES } from "#src/constants";
import { useSigmaLoadingState } from "#src/hooks/use-sigma-loading-state";
import { useTranslation } from "#src/utils/i18n";

import { KeyMetricsErrorState } from "./key-metrics-error-state";
import { KeyMetricsLoadingState } from "./key-metrics-loading-state";

/**
 * Key Metrics component displays an embedded iframe with key business metrics.
 * This is a Sigma embedded dashboard showing high-level business metrics.
 */
export const KeyMetrics: FC = () => {
  const { t } = useTranslation("default");
  const { iframeUrl, status, error, onSigmaMessage } = useSigmaLoadingState(
    DASHBOARD_TYPES.HOME_PAGE_KEY_METRICS,
  );

  if (error) {
    console.warn(`[Homepage] KeyMetrics error: ${error}`);
  }

  return (
    <HomepageSection title={t("keyMetrics.title")} noGap>
      <Dashboard
        errorContent={<KeyMetricsErrorState />}
        errorMessage={t("keyMetrics.unavailable")}
        iframeLeftTranslate={-16}
        iframeLoadingHeight={150}
        iframeTitle={t("keyMetrics.title")}
        iframeUrl={iframeUrl}
        isError={status === "error"}
        isLoading={status === "loading"}
        loadingContent={<KeyMetricsLoadingState />}
        onSigmaMessage={onSigmaMessage}
      />
    </HomepageSection>
  );
};
