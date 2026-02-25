import {
  AnalyticCard,
  Body,
  Card,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useFetchCampaignSentPerformanceReport } from "#src/api/use-fetch-campaign-sent-performance-report";
import { useTranslation } from "#src/utils/i18n";

type CampaignSentPerformanceProps = {
  campaignUuid: string;
  deliveryRate?: string;
  openRate?: string;
  clickRate?: string;
  unsubscribedRate?: string;
  totalRecipients?: number;
  totalOpened?: number;
  totalClicked?: number;
  totalUnsubscribed?: number;
};
export const CampaignSentPerformance = ({
  campaignUuid,
  deliveryRate,
  openRate,
  clickRate,
  unsubscribedRate,
  totalRecipients,
  totalOpened,
  totalClicked,
  totalUnsubscribed,
}: CampaignSentPerformanceProps) => {
  const { t } = useTranslation("campaign");
  const { data: performanceReport } = useFetchCampaignSentPerformanceReport({
    campaignUuid,
  });

  const hasDeliveryRate = deliveryRate && totalRecipients;
  const hasOpenRate = openRate && totalOpened;
  const hasClickRate = clickRate && totalClicked;
  const hasUnsubscribedRate = unsubscribedRate && totalUnsubscribed;
  const hasPerformance =
    hasDeliveryRate || hasOpenRate || hasClickRate || hasUnsubscribedRate;

  const topLinkMap = Object.entries(performanceReport?.top_links || {});
  const hasTopLinks = topLinkMap.length > 0;
  const sortedTopLinks = topLinkMap.sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="strong">
          {t("campaignDetails.performance.title")}
        </Title>
        <div className="flex flex-row gap-xs">
          {hasDeliveryRate && (
            <AnalyticCard
              fullWidth
              title={t("campaignDetails.performance.deliveryRate.title")}
              figure={`${String(deliveryRate)}%`}
              subtitle={t("campaignDetails.performance.deliveryRate.subtitle", {
                count: totalRecipients,
              })}
            />
          )}
          {hasOpenRate && (
            <AnalyticCard
              fullWidth
              title={t("campaignDetails.performance.openRate.title")}
              figure={`${String(openRate)}%`}
              subtitle={t("campaignDetails.performance.openRate.subtitle", {
                count: totalOpened,
              })}
            />
          )}
          {hasClickRate && (
            <AnalyticCard
              fullWidth
              title={t("campaignDetails.performance.clickRate.title")}
              figure={`${String(clickRate)}%`}
              subtitle={t("campaignDetails.performance.clickRate.subtitle", {
                count: totalClicked,
              })}
            />
          )}
          {hasUnsubscribedRate && (
            <AnalyticCard
              fullWidth
              title={t("campaignDetails.performance.unsubscribedRate.title")}
              figure={`${String(unsubscribedRate)}%`}
              subtitle={String(
                t("campaignDetails.performance.unsubscribedRate.subtitle", {
                  count: totalUnsubscribed,
                }),
              )}
            />
          )}
          {!hasPerformance && (
            <AnalyticCard
              fullWidth
              title={String(t("campaignDetails.performance.empty"))}
              figure="---"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="strong">
          {t("campaignDetails.performance.clickPerformance.title")}
        </Title>
        {hasTopLinks ? (
          <Card padding="none" className="flex flex-col">
            {sortedTopLinks.map(([url, count], index) => {
              const isLastItem = index === sortedTopLinks.length - 1;
              return (
                <div
                  key={url}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    window.open(url, "_blank");
                  }}
                >
                  <div className="flex flex-row items-center justify-between p-sm">
                    <Body htmlVariant="span" size="md" weight="weak">
                      {url}
                    </Body>
                    <Body htmlVariant="span" weight="strong" size="md">
                      {t("campaignDetails.performance.clickPerformance.click", {
                        count,
                      })}
                    </Body>
                  </div>
                  {!isLastItem && (
                    <Divider orientation="horizontal" weight="thin" />
                  )}
                </div>
              );
            })}
          </Card>
        ) : (
          <AnalyticCard
            fullWidth
            title={String(
              t("campaignDetails.performance.clickPerformance.empty"),
            )}
            figure="---"
          />
        )}
      </div>
    </div>
  );
};
