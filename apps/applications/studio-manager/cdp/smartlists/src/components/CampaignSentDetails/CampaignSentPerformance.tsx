import {
  AnalyticCard,
  Body,
  Card,
  Collapse,
  Divider,
  Icon,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useFetchCampaignSentPerformanceReport } from "#src/api/use-fetch-campaign-sent-performance-report";
import { useTranslation } from "#src/utils/i18n";

const MAX_VISIBLE_LINKS = 3;

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
  const visibleLinks = sortedTopLinks.slice(0, MAX_VISIBLE_LINKS);
  const remainingLinks = sortedTopLinks.slice(MAX_VISIBLE_LINKS);
  const hasRemainingLinks = remainingLinks.length > 0;

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
              figure={`${openRate}%`}
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
              figure={`${clickRate}%`}
              subtitle={t("campaignDetails.performance.clickRate.subtitle", {
                count: totalClicked,
              })}
            />
          )}
        </div>
        {!hasPerformance && (
          <AnalyticCard
            fullWidth
            title={t("campaignDetails.performance.empty")}
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
            {visibleLinks.map(([url, count], index) => {
              const isLastVisible = index === visibleLinks.length - 1;
              const showDividerAfter = isLastVisible ? hasRemainingLinks : true;
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
                  {showDividerAfter && (
                    <Divider orientation="horizontal" weight="thin" />
                  )}
                </div>
              );
            })}
            {hasRemainingLinks && (
              <>
                <Collapse initiallyOpen={false}>
                  <Collapse.Content>
                    {remainingLinks.map(([url, count], index) => {
                      const isLastItem = index === remainingLinks.length;
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
                              {t(
                                "campaignDetails.performance.clickPerformance.click",
                                { count },
                              )}
                            </Body>
                          </div>
                          {!isLastItem && (
                            <Divider orientation="horizontal" weight="thin" />
                          )}
                        </div>
                      );
                    })}
                  </Collapse.Content>
                  <Collapse.Controller>
                    {({ setIsCollapseOpen, isCollapseOpen, collapseProps }) => {
                      const toggleOpen = () =>
                        setIsCollapseOpen((prev) => !prev);
                      return (
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex flex-row items-center justify-center p-sm hover:cursor-pointer bg-surface-default-weak hover:bg-surface-default-weaker duration-default"
                          onClick={toggleOpen}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleOpen();
                            }
                          }}
                          {...collapseProps}
                        >
                          <Body htmlVariant="span" size="md" weight="weak">
                            {isCollapseOpen
                              ? t(
                                  "campaignDetails.performance.clickPerformance.showLess",
                                )
                              : t(
                                  "campaignDetails.performance.clickPerformance.showMore",
                                  { count: remainingLinks.length },
                                )}
                          </Body>
                          <Icon
                            icon={
                              isCollapseOpen ? "chevron-up" : "chevron-down"
                            }
                            size="sm"
                          />
                        </div>
                      );
                    }}
                  </Collapse.Controller>
                </Collapse>
              </>
            )}
          </Card>
        ) : (
          <AnalyticCard
            fullWidth
            title={t("campaignDetails.performance.clickPerformance.empty")}
            figure="---"
          />
        )}
      </div>
    </div>
  );
};
