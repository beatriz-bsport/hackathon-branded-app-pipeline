import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useTranslation } from "#src/utils/i18n";

/**
 * Trial Analysis dashboard page.
 * Displays analytics for trial offer performance in an embedded iframe.
 */
const TrialAnalysisPage = () => {
  const { t } = useTranslation("insights");
  const { iframeUrl, isLoading, error } = usePresignedUrl(
    DASHBOARD_TYPES.TRIAL_ANALYSIS,
  );

  const pageTitle = t("pages.trialAnalysis.title");

  return (
    <InsightDetailLayout title={pageTitle} isLoading={isLoading} error={error}>
      {iframeUrl && <DashboardIframe src={iframeUrl} title={pageTitle} />}
    </InsightDetailLayout>
  );
};

export default TrialAnalysisPage;
