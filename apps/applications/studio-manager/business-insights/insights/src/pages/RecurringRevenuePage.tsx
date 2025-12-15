import { Navigate } from "react-router";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useTranslation } from "#src/utils/i18n";
import { useHasSubscriptionInvoicesPermission } from "#src/utils/permissions";

/**
 * Recurring Revenue dashboard page.
 * Displays analytics for subscription events and recurring revenue in an embedded iframe.
 * Protected route - requires subscription permission.
 */
const RecurringRevenuePage = () => {
  const { t } = useTranslation("insights");
  const { hasPermission, isLoading: isLoadingPermission } =
    useHasSubscriptionInvoicesPermission();
  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.RECURRING_REVENUE);

  const pageTitle = t("pages.recurringRevenue.title");

  // Wait for permissions to load before redirecting
  if (isLoadingPermission) {
    return (
      <InsightDetailLayout title={pageTitle} isLoading={true} error={null}>
        {null}
      </InsightDetailLayout>
    );
  }

  // Redirect if no permission
  if (!hasPermission) {
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

export default RecurringRevenuePage;
