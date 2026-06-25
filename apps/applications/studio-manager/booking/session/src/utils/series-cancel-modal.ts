import type { Session } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import type { Series } from "#src/types";
import {
  type SeriesClassDateBounds,
  getSeriesNonCancelledClassBounds,
} from "#src/utils/series-detail-drawer";

type SeriesCancelClass = Pick<Session, "available" | "date_start">;

type SeriesCancelSeries = Pick<Series, "name" | "offers">;

type GetSeriesCancelClassCountParams = {
  classes: SeriesCancelClass[];
  series: Pick<Series, "offers">;
};

type FormatSeriesCancelDateRangeParams = SeriesClassDateBounds & {
  locale: string;
  timeZone: string;
};

type GetSeriesCancelSubtitleParams = {
  classes: SeriesCancelClass[];
  locale: string;
  series: SeriesCancelSeries;
  timeZone: string;
};

export const getSeriesCancelClassCount = ({
  classes,
  series,
}: GetSeriesCancelClassCountParams): number =>
  classes.length > 0
    ? classes.filter((sessionClass) => sessionClass.available).length
    : series.offers.length;

export const formatSeriesCancelDateRange = ({
  firstClassDate,
  lastClassDate,
  locale,
  timeZone,
}: FormatSeriesCancelDateRangeParams): string => {
  if (!firstClassDate) {
    return "";
  }

  const dateFormatOptions = { locale, timeZone };
  const formattedFirstDate = formatDateTime(
    firstClassDate,
    DATETIME_FORMATS.MEDIUM_DATE,
    dateFormatOptions,
  );

  if (!lastClassDate) {
    return formattedFirstDate;
  }

  const formattedLastDate = formatDateTime(
    lastClassDate,
    DATETIME_FORMATS.MEDIUM_DATE,
    dateFormatOptions,
  );

  if (formattedFirstDate === formattedLastDate) {
    return formattedFirstDate;
  }

  return `${formattedFirstDate} - ${formattedLastDate}`;
};

export const getSeriesCancelSubtitle = ({
  classes,
  locale,
  series,
  timeZone,
}: GetSeriesCancelSubtitleParams): string => {
  const dateRange = formatSeriesCancelDateRange({
    ...getSeriesNonCancelledClassBounds(classes),
    locale,
    timeZone,
  });

  if (!dateRange) {
    return series.name;
  }

  return `${series.name} · ${dateRange}`;
};
