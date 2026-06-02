import { type ReactNode } from "react";
import { Link, Navigate } from "react-router";

import {
  Alert,
  Breadcrumbs,
  DetailsLayout,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { AiSummaryPanel } from "#src/components/ai-summary-panel";
import type { InsightRegistryItem } from "#src/constants";
import { usePresignedUrl } from "#src/hooks/api/usePresignedUrl";
import { useAiSummary } from "#src/hooks/use-ai-summary";
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
  const {
    iframeUrl,
    isLoading: iframeLoading,
    error,
  } = usePresignedUrl(dashboardType, { enabled: isAllowed });
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

  const renderContent = (): ReactNode => {
    if (iframeLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-full p-md">
          <Alert status="critical" title={error} />
        </div>
      );
    }

    return iframeUrl ? (
      <DashboardIframe
        src={iframeUrl}
        title={title}
        onVariablesChange={handleVariablesChange}
        onCreateSummary={handleCreateSummary}
      />
    ) : null;
  };

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={withPanel}>
      <DetailsLayout.Header
        pageTitle={title}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <div
        style={{ gridArea: "content" }}
        className="w-full h-full p-0 overflow-hidden"
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
