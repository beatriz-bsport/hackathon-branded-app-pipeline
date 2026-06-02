import type { FC } from "react";

import { Body, Card, Icon, Illustration } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const METRIC_TITLE_KEYS = [
  "totalRevenue",
  "totalBooking",
  "totalAttendance",
  "totalOccupancy",
] as const;

export const KeyMetricsErrorState: FC = () => {
  const { t } = useTranslation("default");

  return (
    <div className="flex w-full flex-col sm:flex-row gap-md overflow-x-auto pt-md">
      {METRIC_TITLE_KEYS.map((metricKey) => (
        <Card
          key={metricKey}
          className="flex min-h-[180px] flex-1 flex-col gap-lg"
        >
          <div className="flex items-center justify-start gap-sm">
            <Body size="md" weight="strong" color="weak">
              {t(`keyMetrics.metrics.${metricKey}`)}
            </Body>
            <Icon
              icon="info-circle"
              size="sm"
              className="text-onsurface-weak"
            />
          </div>
          <div className="flex grow flex-col items-center justify-center gap-sm text-onsurface-weak">
            <Illustration name="error" size="lg" />
            <Body color="weak" size="md">
              {t("keyMetrics.dataUnavailable")}
            </Body>
          </div>
        </Card>
      ))}
    </div>
  );
};
