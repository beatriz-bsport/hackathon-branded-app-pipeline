import { Navigate } from "react-router";

import { useFlagsStatus } from "@bsport/sm-backbone";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { InsightFlags, useInsightFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";
import { useHasBookingsPermission } from "#src/utils/permissions";

/**
 * Schedule Analysis dashboard page.
 * Displays analytics for studio management and schedule performance in an embedded iframe.
 * Protected route - requires bookings (group sessions) permission.
 */

const ScheduleAnalysisPage = () => {
  const { t } = useTranslation("insights");
  const { hasPermission, isLoading: isLoadingPermission } =
    useHasBookingsPermission();
  const isScheduleAnalysisEnabled = useInsightFlag(
    InsightFlags.SCHEDULE_ANALYSIS,
  );
  const { flagsReady } = useFlagsStatus();
  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.SCHEDULE_ANALYSIS);

  const pageTitle = t("pages.scheduleAnalysis.title");

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
    (!hasPermission || !isScheduleAnalysisEnabled)
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

export default ScheduleAnalysisPage;
