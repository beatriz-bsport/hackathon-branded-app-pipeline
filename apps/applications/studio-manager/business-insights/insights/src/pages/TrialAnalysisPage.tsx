import { Navigate } from "react-router";

import { useFlagsStatus } from "@bsport/sm-backbone";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { InsightFlags, useInsightFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";
import { useHasSubscriptionInvoicesPermission } from "#src/utils/permissions";

/**
 * Trial Analysis dashboard page.
 * Displays analytics for trial offer performance in an embedded iframe.
 * Protected route - requires subscription invoices permission.
 */

const TrialAnalysisPage = () => {
  const { t } = useTranslation("insights");
  const { hasPermission, isLoading: isLoadingPermission } =
    useHasSubscriptionInvoicesPermission();
  const isTrialAnalysisEnabled = useInsightFlag(InsightFlags.TRIAL_ANALYSIS);
  const { flagsReady } = useFlagsStatus();
  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.TRIAL_ANALYSIS);

  const pageTitle = t("pages.trialAnalysis.title");

  // Wait for permissions and flags to load before redirecting
  if (isLoadingPermission || !flagsReady) {
    return (
      <InsightDetailLayout title={pageTitle} isLoading={true} error={null}>
        {null}
      </InsightDetailLayout>
    );
  }

  // Only redirect if permissions are loaded and explicitly false or feature flag is off
  if (
    !isLoadingPermission &&
    flagsReady &&
    (!hasPermission || !isTrialAnalysisEnabled)
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <InsightDetailLayout
      title={pageTitle}
      isLoading={isLoadingUrl}
      error={error}
    >
      {iframeUrl && <DashboardIframe src={iframeUrl} title={pageTitle} />}
    </InsightDetailLayout>
  );
};

export default TrialAnalysisPage;
