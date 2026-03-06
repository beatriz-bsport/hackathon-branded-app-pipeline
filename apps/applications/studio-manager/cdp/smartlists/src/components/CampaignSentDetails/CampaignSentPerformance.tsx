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
  openRate?: string;
  clickRate?: string;
  totalOpened?: number;
  totalClicked?: number;
};
export const CampaignSentPerformance = ({
  campaignUuid,
  openRate,
  clickRate,
  totalOpened,
  totalClicked,
}: CampaignSentPerformanceProps) => {
  const { t } = useTranslation("campaign");
  const { data: performanceReport } = useFetchCampaignSentPerformanceReport({
    campaignUuid,
  });

  const hasOpenRate = openRate != null && totalOpened != null;
  const hasClickRate = clickRate != null && totalClicked != null;
  const hasPerformance = hasOpenRate || hasClickRate;

  const topLinkMap = Object.entries(performanceReport?.top_links || {});
  const hasTopLinks = topLinkMap.length > 0;
  const sortedTopLinks = topLinkMap.sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="strong">
          {t("campaignDetails.performance.title")}
        </Title>
        <div className="grid md:grid-cols-2 grid-cols-4 gap-xs md:[grid-template-areas:'open_click'] [grid-template-areas:'open_open_click_click']">
          {hasOpenRate && (
            <AnalyticCard
              fullWidth
              className="[grid-area:open]"
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
              className="[grid-area:click]"
              title={t("campaignDetails.performance.clickRate.title")}
              figure={`${String(clickRate)}%`}
              subtitle={t("campaignDetails.performance.clickRate.subtitle", {
                count: totalClicked,
              })}
            />
          )}
        </div>
        {!hasPerformance && (
          <AnalyticCard
            fullWidth
            title={String(t("campaignDetails.performance.empty"))}
            figure="---"
          />
        )}
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
