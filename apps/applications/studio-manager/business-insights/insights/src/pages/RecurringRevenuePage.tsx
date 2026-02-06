import { Navigate } from "react-router";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useInsightGate } from "#src/utils/access";
import { useTranslation } from "#src/utils/i18n";

/**
 * Recurring Revenue dashboard page.
 * Displays analytics for subscription events and recurring revenue in an embedded iframe.
 * Protected route - requires subscription permission.
 */
const RecurringRevenuePage = () => {
  const { t } = useTranslation("insights");
  const { isAllowed, isLoading } = useInsightGate("recurring");
  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.RECURRING_REVENUE);

  const pageTitle = t("pages.recurringRevenue.title");

  // Wait for permissions and feature flags to be loaded before redirecting
  if (isLoading) {
    return (
      <InsightDetailLayout title={pageTitle} isLoading={true} error={null}>
        {null}
      </InsightDetailLayout>
    );
  }

  // Redirect if no permission
  if (!isAllowed) {
    return <Navigate to=".." replace />;
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

export default RecurringRevenuePage;
