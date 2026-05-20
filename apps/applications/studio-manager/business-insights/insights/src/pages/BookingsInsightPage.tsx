import { useCallback, useRef, useState } from "react";
import { Navigate } from "react-router";

import { useDetailsLayout } from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { InsightDetailLayout } from "#src/components/InsightDetailLayout";
import { AiSummaryPanel } from "#src/components/ai-summary-panel";
import { DASHBOARD_TYPES } from "#src/constants";
import { useGenerateSummary, usePresignedUrl } from "#src/hooks/api";
import { useInsightGate } from "#src/utils/access";
import { useTranslation } from "#src/utils/i18n";

interface SummaryParams {
  variables: Record<string, string>;
  pageId?: string;
  documentationUrl?: string;
}

const BookingsInsightPage = () => {
  const { t } = useTranslation("insights");
  const { isAllowed, isLoading } = useInsightGate("booking");
  const { detailsLayoutProps, toggleIsPanelOpened } = useDetailsLayout();
  const [summaryEnabled, setSummaryEnabled] = useState(false);
  // Snapshot of params captured at click time — never updated while panel is open
  const [summaryParams, setSummaryParams] = useState<SummaryParams>({
    variables: {},
  });
  // Ref tracks latest variables without triggering re-renders or query key changes
  const latestVariablesRef = useRef<Record<string, string>>({});
  const handleVariablesChange = useCallback((vars: Record<string, string>) => {
    latestVariablesRef.current = vars;
  }, []);

  const {
    iframeUrl,
    isLoading: isLoadingUrl,
    error,
  } = usePresignedUrl(DASHBOARD_TYPES.BOOKING_INSIGHT);

  const {
    data: exportData,
    isLoading: isExporting,
    error: exportError,
  } = useGenerateSummary({
    insightKey: DASHBOARD_TYPES.BOOKING_INSIGHT,
    variables: summaryParams.variables,
    pageId: summaryParams.pageId,
    enabled: summaryEnabled,
  });

  const pageTitle = t("pages.bookingInsight.title");

  const handleCreateSummary = useCallback(
    (values: { "page-id"?: string; "documentation-url"?: string }) => {
      // Snapshot current variables so the query key is stable for the lifetime of the panel open
      setSummaryParams({
        variables: { ...latestVariablesRef.current },
        pageId: values["page-id"],
        documentationUrl: values["documentation-url"],
      });
      setSummaryEnabled(true);
      toggleIsPanelOpened(true);
    },
    [toggleIsPanelOpened],
  );

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
      detailsLayoutProps={detailsLayoutProps}
      withPanel={summaryEnabled}
      panelChildren={
        <AiSummaryPanel
          isLoading={isExporting}
          error={exportError}
          data={exportData}
          documentationUrl={summaryParams.documentationUrl}
        />
      }
    >
      {iframeUrl && (
        <DashboardIframe
          src={iframeUrl}
          title={pageTitle}
          onVariablesChange={handleVariablesChange}
          onCreateSummary={handleCreateSummary}
        />
      )}
    </InsightDetailLayout>
  );
};

export default BookingsInsightPage;
