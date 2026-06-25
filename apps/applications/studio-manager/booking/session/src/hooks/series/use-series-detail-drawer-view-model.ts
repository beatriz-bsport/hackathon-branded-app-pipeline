import { useMemo } from "react";

import type { Session } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import type { IconName } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { useLevelName } from "#src/hooks/level/useLevelName";
import type { Series } from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import { getSeriesBookingRule } from "#src/utils/series-booking-rule";
import {
  getSeriesClassStatusCounts,
  getSeriesMoreDetailsSessionId,
  getSeriesNonCancelledClassBounds,
  isSeriesCancelled,
} from "#src/utils/series-detail-drawer";

type SeriesDetailMetadataItem = {
  icon: IconName;
  id: string;
  label?: string;
  value: string;
};

type UseSeriesDetailDrawerViewModelParams = {
  activityName?: string;
  allClasses: Session[];
  levelName?: string | null;
  previewClassesCount?: number;
  series: Series | undefined;
};

export const useSeriesDetailDrawerViewModel = ({
  activityName,
  allClasses,
  levelName,
  previewClassesCount,
  series,
}: UseSeriesDetailDrawerViewModelParams) => {
  const { t, i18n } = useTranslation("series");
  const locale = i18n.language;
  const getLevelName = useLevelName();
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  const classBounds = useMemo(
    () => getSeriesNonCancelledClassBounds(allClasses),
    [allClasses],
  );

  const statusCounts = useMemo(
    () => getSeriesClassStatusCounts(allClasses),
    [allClasses],
  );

  const statusSummaryParts = useMemo(
    () =>
      [
        statusCounts.ongoing > 0
          ? t("seriesDetailDrawer.classes.statusSummary.ongoing", {
              count: statusCounts.ongoing,
            })
          : null,
        statusCounts.upcoming > 0
          ? t("seriesDetailDrawer.classes.statusSummary.upcoming", {
              count: statusCounts.upcoming,
            })
          : null,
        statusCounts.past > 0
          ? t("seriesDetailDrawer.classes.statusSummary.past", {
              count: statusCounts.past,
            })
          : null,
        statusCounts.cancelled > 0
          ? t("seriesDetailDrawer.classes.statusSummary.cancelled", {
              count: statusCounts.cancelled,
            })
          : null,
      ].filter((part): part is string => part !== null),
    [statusCounts, t],
  );

  const isCancelled =
    series !== undefined
      ? isSeriesCancelled({ classes: allClasses, series })
      : false;

  const bookingRule = series ? getSeriesBookingRule(series) : "fullSeries";

  const moreDetailsSessionId = series
    ? getSeriesMoreDetailsSessionId({
        classes: allClasses,
        offerIds: series.offers,
      })
    : null;

  const displayedLevelName = getLevelName({
    levelId: series?.level,
    levelName,
  });

  const firstClassDate = classBounds.firstClassDate
    ? formatDateTime(
        classBounds.firstClassDate,
        DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
        {
          locale,
          timeZone: classBounds.firstClassTimeZone ?? companyTimeZone,
        },
      )
    : t("seriesDetailDrawer.fallbacks.notSet");

  const lastClassDate = classBounds.lastClassDate
    ? formatDateTime(
        classBounds.lastClassDate,
        DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
        {
          locale,
          timeZone: classBounds.lastClassTimeZone ?? companyTimeZone,
        },
      )
    : t("seriesDetailDrawer.fallbacks.notSet");

  const metadataRows = useMemo<SeriesDetailMetadataItem[]>(
    () => [
      {
        icon: "log-in-03",
        id: "first-class",
        label: t("seriesDetailDrawer.metadata.firstClass"),
        value: firstClassDate,
      },
      {
        icon: "log-out-01",
        id: "last-class",
        label: t("seriesDetailDrawer.metadata.lastClass"),
        value: lastClassDate,
      },
      {
        icon: "target-04",
        id: "activity",
        value: activityName ?? t("seriesDetailDrawer.fallbacks.notSet"),
      },
      {
        icon: "bar-chart-10",
        id: "level",
        value: displayedLevelName || t("seriesDetailDrawer.fallbacks.notSet"),
      },
    ],
    [activityName, displayedLevelName, firstClassDate, lastClassDate, t],
  );

  const totalClasses = previewClassesCount ?? series?.offers.length ?? 0;

  return {
    bookingRule,
    isCancelled,
    metadataRows,
    moreDetailsSessionId,
    statusSummaryParts,
    totalClasses,
  };
};
