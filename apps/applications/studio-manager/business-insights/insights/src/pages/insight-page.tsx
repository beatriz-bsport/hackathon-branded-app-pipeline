import { Activity, type ReactNode } from "react";
import { Link, Navigate } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { AiSummaryPanel } from "#src/components/ai-summary-panel";
import { InsightDetailErrorState } from "#src/components/insight-detail-error-state";
import { InsightDetailLoadingState } from "#src/components/insight-detail-loading-state";
import type { InsightRegistryItem } from "#src/constants";
import { useAiSummary } from "#src/hooks/use-ai-summary";
import { useSigmaLoadingState } from "#src/hooks/use-sigma-loading-state";
import { URLS } from "#src/urls";
import { type InsightId, useInsightGate } from "#src/utils/access";
import { useTranslation } from "#src/utils/i18n";

type InsightPageProps = Pick<
  InsightRegistryItem,
  "id" | "dashboardType" | "titleKey"
>;

export const InsightPage = ({
  id,
  dashboardType,
  titleKey,
}: InsightPageProps) => {
  const { t } = useTranslation("insights");
  const title = t(titleKey) as string;
  const { isAllowed, isLoading: isGateLoading } = useInsightGate(
    id as InsightId,
  );
  const { iframeUrl, status, onSigmaMessage } = useSigmaLoadingState(
    dashboardType,
    { enabled: isAllowed },
  );
  const { handleVariablesChange, handleCreateSummary, summaryLayoutProps } =
    useAiSummary(dashboardType);
  const { detailsLayoutProps, withPanel, summaryKey, summaryPanelProps } =
    summaryLayoutProps;

  const breadcrumbsItems = [
    <Link key="insights-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id="breadcrumb-insights" text={t("pageTitle")} />
    </Link>,
  ];

  if (isGateLoading) {
    return (
      <DetailsLayout {...detailsLayoutProps}>
        <DetailsLayout.Header
          pageTitle={title}
          BreadcrumbsItems={breadcrumbsItems}
        />
        <div
          style={{ gridArea: "content" }}
          className="w-full h-full p-0 overflow-hidden"
        >
          <div className="flex justify-center items-center h-full">
            <Loader size="lg" />
          </div>
        </div>
      </DetailsLayout>
    );
  }

  if (!isAllowed) {
    return <Navigate to=".." replace />;
  }

  const isLoading = status === "loading";
  const isError = status === "error";

  const loadingContent = (
    <InsightDetailLoadingState
      loadingMessage={t("detail.loading.message", { title }) as string}
    />
  );
  const errorContent = <InsightDetailErrorState />;

  const renderContent = (): ReactNode => {
    // No URL yet: never mount the iframe — show loading or error placeholder only.
    if (!iframeUrl) {
      return isLoading ? loadingContent : errorContent;
    }

    // Sigma reported an error.
    if (isError) {
      return errorContent;
    }

    // URL available: keep iframe mounted in a stable branch so React never
    // unmounts/remounts it. Switching branches causes a second request with
    // the same JWT, which Sigma rejects. The loader is overlaid via CSS and
    // Activity; only visibility changes, the iframe element stays alive.
    return (
      <div className={isLoading ? "relative w-full h-full" : "w-full"}>
        <Activity mode={isLoading ? "visible" : "hidden"}>
          {loadingContent}
        </Activity>
        <div
          aria-hidden={isLoading}
          className={
            isLoading
              ? "absolute inset-0 pointer-events-none opacity-0 overflow-hidden"
              : "w-full"
          }
        >
          <DashboardIframe
            src={iframeUrl}
            title={title}
            onSigmaMessage={onSigmaMessage}
            onVariablesChange={handleVariablesChange}
            onCreateSummary={handleCreateSummary}
          />
        </div>
      </div>
    );
  };

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={withPanel}>
      <DetailsLayout.Header
        pageTitle={title}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <div
        style={{ gridArea: "content" }}
        className="w-full h-full p-0 overflow-y-auto"
      >
        {renderContent()}
      </div>
      {withPanel && (
        <DetailsLayout.Panel>
          <AiSummaryPanel key={summaryKey} {...summaryPanelProps} />
        </DetailsLayout.Panel>
      )}
    </DetailsLayout>
  );
};
