import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useTranslation } from "#src/utils/i18n";

/**
 * Recurring Revenue dashboard page.
 * Displays analytics for subscription events and recurring revenue in an embedded iframe.
 */
const RecurringRevenuePage = () => {
  const { t } = useTranslation("insights");
  const { iframeUrl, isLoading, error } = usePresignedUrl(
    DASHBOARD_TYPES.RECURRING_REVENUE,
  );

  const pageTitle = t("pages.recurringRevenue.title");

  return (
    <InsightDetailLayout title={pageTitle} isLoading={isLoading} error={error}>
      {iframeUrl && <DashboardIframe src={iframeUrl} title={pageTitle} />}
    </InsightDetailLayout>
  );
};

export default RecurringRevenuePage;
