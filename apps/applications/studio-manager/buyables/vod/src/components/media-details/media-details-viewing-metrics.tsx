import type { FC } from "react";

import { Body, Card, Title } from "@bsport/kaizen-primitive-core";

import { useVideoAnalyticsQuery } from "#src/hooks/api/use-video-analytics-query";
import { useTranslation } from "#src/utils/i18n";

type MediaDetailsViewingMetricsProps = {
  videoId: number;
  uploadedAt: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );

export const MediaDetailsViewingMetrics: FC<
  MediaDetailsViewingMetricsProps
> = ({ videoId, uploadedAt }) => {
  const { t } = useTranslation("media-details");
  const { data: analytics } = useVideoAnalyticsQuery(videoId);

  const metrics = [
    {
      key: "total-views",
      label: t("panel.totalViews"),
      value: analytics.nb_views_total.toString(),
    },
    {
      key: "views-last-week",
      label: t("panel.viewsLastWeek"),
      value: analytics.nb_views_last_week.toString(),
    },
    {
      key: "distinct-viewers",
      label: t("panel.distinctViewers"),
      value: analytics.nb_distinct_viewers.toString(),
    },
  ];

  return (
    <section className="flex flex-col gap-md">
      <div className="flex flex-col gap-2xs">
        <Body size="lg" weight="strong">
          {t("panel.viewingTitle")}
        </Body>
        <Body size="sm" color="weak" weight="weak">
          {t("panel.uploadedAt", { date: formatDate(uploadedAt) })}
        </Body>
      </div>

      <Card padding="default" className="flex flex-row gap-xs">
        {metrics.map(({ key, label, value }) => (
          <div key={key} className="flex flex-1 flex-col items-center gap-2xs">
            <Title htmlVariant="h1" weight="strong">
              {value}
            </Title>
            <Body size="sm" color="weak" weight="weak" className="text-center">
              {label}
            </Body>
          </div>
        ))}
      </Card>
    </section>
  );
};
