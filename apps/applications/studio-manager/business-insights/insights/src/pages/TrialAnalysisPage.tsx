import { Navigate } from "react-router";

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
  const hasPermission = useHasSubscriptionInvoicesPermission();
  const isTrialAnalysisEnabled = useInsightFlag(InsightFlags.TRIAL_ANALYSIS);
  const { iframeUrl, isLoading, error } = usePresignedUrl(
    DASHBOARD_TYPES.TRIAL_ANALYSIS,
  );

  const pageTitle = t("pages.trialAnalysis.title");

  // Redirect users without permission or if feature flag is off
  if (!hasPermission || !isTrialAnalysisEnabled) {
    return <Navigate to="/" replace />;
  }

  return (
    <InsightDetailLayout title={pageTitle} isLoading={isLoading} error={error}>
      {iframeUrl && <DashboardIframe src={iframeUrl} title={pageTitle} />}
    </InsightDetailLayout>
  );
};

export default TrialAnalysisPage;
