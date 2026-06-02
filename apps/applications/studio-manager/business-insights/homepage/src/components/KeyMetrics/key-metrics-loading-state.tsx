import type { FC } from "react";

import { Body, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const METRIC_CARD_COUNT = 4;

export const KeyMetricsLoadingState: FC = () => {
  const { t } = useTranslation("default");

  return (
    <div className="flex w-full flex-col sm:flex-row gap-md overflow-x-auto pt-md">
      {Array.from({ length: METRIC_CARD_COUNT }).map((_, index) => (
        <Card
          key={index}
          className="flex min-h-[180px] flex-1 flex-col items-center justify-center gap-sm"
        >
          <Loader size="md" />
          <Body color="weak" size="md">
            {t("keyMetrics.loading")}
          </Body>
        </Card>
      ))}
    </div>
  );
};
