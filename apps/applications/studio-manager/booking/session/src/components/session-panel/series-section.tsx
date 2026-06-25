import type { FC } from "react";
import { useHref } from "react-router";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Chip,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { useRetrieveSeriesQuery } from "#src/hooks/series/use-retrieve-series-query";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  ABSOLUTE_ROUTES,
  flags,
  useBookingManagementFlag,
  useUrls,
} from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import {
  SERIES_BOOKING_RULE_CHIP_COLORS,
  getSeriesBookingRule,
} from "#src/utils/series-booking-rule";

type SeriesSectionProps = {
  sessionId: number;
};

export const SeriesSection: FC<SeriesSectionProps> = ({ sessionId }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const { t: tSeries } = useTranslation("series");
  const isCalendarSeriesTabEnabled = useBookingManagementFlag(
    flags.CALENDAR_SERIES_TAB,
  );
  const { data: session } = useRetrieveSession(sessionId);
  const { data: series } = useRetrieveSeriesQuery(session.group);
  const { resolveSeriesClassesPath } = useUrls();

  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  const seriesClassesPath =
    session.group === null
      ? ABSOLUTE_ROUTES.INDEX
      : resolveSeriesClassesPath(session.group);
  const seriesClassesHref = useHref(seriesClassesPath);

  if (session.group === null || !series) {
    return null;
  }

  const dateFormatOptions = {
    locale: i18n.language,
    timeZone: companyTimeZone,
  };

  const formattedFirstDate = series.first_offer_date
    ? formatDateTime(
        series.first_offer_date,
        DATETIME_FORMATS.MEDIUM_DATE,
        dateFormatOptions,
      )
    : "";

  const formattedLastDate = series.last_offer_date
    ? formatDateTime(
        series.last_offer_date,
        DATETIME_FORMATS.MEDIUM_DATE,
        dateFormatOptions,
      )
    : "";

  const dateRange =
    formattedFirstDate &&
    formattedLastDate &&
    formattedFirstDate !== formattedLastDate
      ? t("sessionPanel.series.dateRange", {
          firstDate: formattedFirstDate,
          lastDate: formattedLastDate,
        })
      : formattedFirstDate ||
        formattedLastDate ||
        t("sessionPanel.series.missingDate");

  const bookingRule = getSeriesBookingRule(series);

  return (
    <>
      <Divider weight="extra-thin" />
      <section>
        <header className="flex items-center justify-between">
          <Title htmlVariant="h4" weight="strong">
            {t("sessionPanel.series.title")}
          </Title>
          {isCalendarSeriesTabEnabled ? (
            <Button
              kind="icon-button"
              icon="link-external-02"
              size="md"
              intent="flat"
              color="default"
              label={t("sessionPanel.series.linkAriaLabel")}
              onClick={() => {
                window.open(seriesClassesHref, "_blank", "noopener,noreferrer");
              }}
            />
          ) : null}
        </header>
        <div className="flex flex-col gap-xs pt-sm">
          <Body htmlVariant="p" size="lg" weight="strong">
            {series.name}
          </Body>
          <Body htmlVariant="p" size="lg" weight="weak">
            {t("sessionPanel.series.summary", {
              count: series.offers.length,
              dateRange,
            })}
          </Body>
          <div className="flex flex-wrap items-center gap-xs pt-2xs">
            <Chip
              label={tSeries(`seriesTable.bookingRules.${bookingRule}`)}
              color={SERIES_BOOKING_RULE_CHIP_COLORS[bookingRule]}
              type="weak"
              size="lg"
            />
          </div>
        </div>
      </section>
    </>
  );
};
