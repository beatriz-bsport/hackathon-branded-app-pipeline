import type { FC } from "react";

import { Body, Card, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import type { SeriesDetailsBookingRule } from "#src/utils/series-details-form";

type SeriesAddSummaryCardProps = {
  bookingRule: SeriesDetailsBookingRule;
  managerOnly: boolean;
  seriesName: string;
  serviceName?: string;
};

export const SeriesAddSummaryCard: FC<SeriesAddSummaryCardProps> = ({
  bookingRule,
  managerOnly,
  seriesName,
  serviceName,
}) => {
  const { t } = useTranslation("series");

  return (
    <Card
      className="flex shrink-0 flex-col gap-sm border-none bg-surface-default-weaker"
      actionable={false}
    >
      <Title htmlVariant="h5" weight="stronger">
        {seriesName}
      </Title>
      <div className="grid gap-x-2xl gap-y-xs md:grid-cols-2">
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("seriesAddModal.steps.addClasses.summary.service")}
          </Body>
          <Body size="md">
            {serviceName ?? t("seriesAddModal.steps.addClasses.summary.notSet")}
          </Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("seriesAddModal.steps.addClasses.summary.seriesType")}
          </Body>
          <Body size="md">{t(`seriesTable.bookingRules.${bookingRule}`)}</Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("seriesAddModal.steps.addClasses.summary.visibility")}
          </Body>
          <Body size="md">
            {managerOnly
              ? t(
                  "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.hidden.label",
                )
              : t(
                  "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.visible.label",
                )}
          </Body>
        </div>
      </div>
    </Card>
  );
};
