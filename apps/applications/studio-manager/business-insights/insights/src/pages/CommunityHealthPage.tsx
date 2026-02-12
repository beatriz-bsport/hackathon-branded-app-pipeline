import { Navigate } from "react-router";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api";
import { useInsightGate } from "#src/utils/access";
import { useTranslation } from "#src/utils/i18n";

/**
 * Community Health dashboard page.
 * Displays community engagement/retention analytics in an embedded iframe.
 * Protected route - requires subscription permission and feature flag.
 */
const CommunityHealthPage = () => {
  const { t } = useTranslation("insights");
  const { isAllowed, isLoading } = useInsightGate("community_health");

  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.COMMUNITY_HEALTH);

  const pageTitle = t("pages.communityHealth.title");

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

export default CommunityHealthPage;
