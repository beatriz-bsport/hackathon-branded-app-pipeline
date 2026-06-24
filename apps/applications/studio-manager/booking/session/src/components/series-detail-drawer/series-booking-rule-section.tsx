import type { FC } from "react";

import { Body, Chip, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  SERIES_BOOKING_RULE_CHIP_COLORS,
  type SeriesBookingRule,
} from "#src/utils/series-booking-rule";

type SeriesBookingRuleLabelKey =
  | "seriesTable.bookingRules.fullSeries"
  | "seriesTable.bookingRules.openSeries"
  | "seriesTable.bookingRules.singleClass";

type SeriesBookingRuleDescriptionKey =
  | "seriesTable.headerInfo.bookingRule.fullSeriesDescription"
  | "seriesTable.headerInfo.bookingRule.openSeriesDescription"
  | "seriesTable.headerInfo.bookingRule.singleClassDescription";

const BOOKING_RULE_LABEL_KEYS: Record<
  SeriesBookingRule,
  SeriesBookingRuleLabelKey
> = {
  fullSeries: "seriesTable.bookingRules.fullSeries",
  openSeries: "seriesTable.bookingRules.openSeries",
  singleClass: "seriesTable.bookingRules.singleClass",
};

const BOOKING_RULE_DESCRIPTION_KEYS: Record<
  SeriesBookingRule,
  SeriesBookingRuleDescriptionKey
> = {
  fullSeries: "seriesTable.headerInfo.bookingRule.fullSeriesDescription",
  openSeries: "seriesTable.headerInfo.bookingRule.openSeriesDescription",
  singleClass: "seriesTable.headerInfo.bookingRule.singleClassDescription",
};

type SeriesBookingRuleSectionProps = {
  bookingRule: SeriesBookingRule;
};

export const SeriesBookingRuleSection: FC<SeriesBookingRuleSectionProps> = ({
  bookingRule,
}) => {
  const { t } = useTranslation("series");

  return (
    <section className="flex flex-col gap-xs">
      <div className="flex flex-wrap items-center gap-xs">
        <Title htmlVariant="h3" weight="strong">
          {t("seriesDetailDrawer.bookingRule.title")}
        </Title>
        <Chip
          label={t(BOOKING_RULE_LABEL_KEYS[bookingRule])}
          color={SERIES_BOOKING_RULE_CHIP_COLORS[bookingRule]}
          type="weak"
          size="lg"
        />
      </div>
      <Body htmlVariant="p" size="lg">
        {t(BOOKING_RULE_DESCRIPTION_KEYS[bookingRule])}
      </Body>
    </section>
  );
};
