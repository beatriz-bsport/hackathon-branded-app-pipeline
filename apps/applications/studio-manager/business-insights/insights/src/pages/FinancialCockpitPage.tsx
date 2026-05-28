import { Navigate } from "react-router";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useInsightGate } from "#src/utils/access";
import { useTranslation } from "#src/utils/i18n";

/**
 * Financial Cockpit dashboard page.
 * Displays a comprehensive financial performance overview in an embedded iframe.
 * Protected route - requires invoices report permission and feature flag.
 */
const FinancialCockpitPage = () => {
  const { t } = useTranslation("insights");
  const { isAllowed, isLoading } = useInsightGate("financial_cockpit");

  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.FINANCIAL_COCKPIT);

  const pageTitle = t("pages.financialCockpit.title");

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

export default FinancialCockpitPage;
