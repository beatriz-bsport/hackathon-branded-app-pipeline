import { Navigate } from "react-router";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useInsightGate } from "#src/utils/access";
import { useTranslation } from "#src/utils/i18n";

/**
 * Bookings & Pass Usage dashboard page.
 * Displays bookings performance and pass usage analytics in an embedded iframe.
 * Protected route - requires bookings (group sessions) permission + feature flag.
 */
const BookingsInsightPage = () => {
  const { t } = useTranslation("insights");
  const { isAllowed, isLoading } = useInsightGate("booking");

  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.BOOKING_INSIGHT);

  const pageTitle = t("pages.bookingInsight.title");

  if (isLoading) {
    return (
      <InsightDetailLayout title={pageTitle} isLoading={true} error={null}>
        {null}
      </InsightDetailLayout>
    );
  }

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

export default BookingsInsightPage;
