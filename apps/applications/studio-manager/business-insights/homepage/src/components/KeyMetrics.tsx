import type { FC } from "react";

import { Body, Loader, Title } from "@bsport/kaizen-primitive-core";

import { DashboardIframe } from "#src/components/DashboardIframe";
import { DASHBOARD_TYPES } from "#src/constants";
import { usePresignedUrl } from "#src/hooks";
import { useTranslation } from "#src/utils/i18n";

/**
 * Key Metrics component displays an embedded iframe with key business metrics.
 * Shows a loading state while fetching the dashboard URL.
 * This is a Sigma embedded dashboard showing high-level business metrics.
 */
export const KeyMetrics: FC = () => {
  const { t } = useTranslation("default");
  const { iframeUrl, isLoading, error } = usePresignedUrl(
    DASHBOARD_TYPES.HOME_PAGE_KEY_METRICS,
  );

  if (error) {
    console.warn(`KeyMetrics error: ${error}`);
    return null;
  }

  return (
    <div className="flex flex-col">
      <Title htmlVariant="h2" weight="strong" className="mb">
        {t("keyMetrics.title")}
      </Title>
      <div className="w-full rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center min-h-[285px]">
            <Loader size="xl" />
          </div>
        ) : iframeUrl ? (
          <DashboardIframe
            src={iframeUrl}
            title={t("keyMetrics.title")}
            minHeight={285}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[285px]">
            <Body color="weak" size="md">
              {t("keyMetrics.unavailable")}
            </Body>
          </div>
        )}
      </div>
    </div>
  );
};
