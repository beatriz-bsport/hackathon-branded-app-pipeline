import { clsx } from "clsx";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { getLocalNow } from "@bsport/datetime-manipulation";
import { Body, Icon, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { TimelineIndicator } from "#src/constants";
import type { DetailsHeaderSession } from "#src/types";
import { formatMinutes } from "#src/utils/format-minutes";
import { useTranslation } from "#src/utils/i18n";
import { getSessionStartEnd } from "#src/utils/session-time-range";

type TimeLineIndicatorColors = Record<
  TimelineIndicator,
  {
    text: "main" | "info" | "weaker";
    icon: string;
  }
>;

const TIMELINE_INDICATOR_COLORS: TimeLineIndicatorColors = {
  [TimelineIndicator.ONGOING]: {
    text: "main",
    icon: "text-onsurface-main-weak",
  },
  [TimelineIndicator.UPCOMING]: {
    text: "info",
    icon: "text-onsurface-status-info-weak",
  },
  [TimelineIndicator.PAST]: { text: "weaker", icon: "text-onsurface-weaker" },
};

export const Subtitle: React.FC<DetailsHeaderSession> = (session) => {
  const { t, i18n } = useTranslation("sessionDetails");

  const isMobile = !useMatchMedia("lg");

  const formatOptions = {
    locale: i18n?.language,
    timeZone: session.timezone_name,
  };

  const date = formatDateTime(
    session.date_start,
    DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
    formatOptions,
  );

  const startTime = formatDateTime(
    session.date_start,
    DATETIME_FORMATS.TIME_SIMPLE,
    formatOptions,
  );

  const { start: startDateTime, end: endDateTime } = getSessionStartEnd({
    dateStart: session.date_start,
    durationMinute: session.duration_minute,
    zone: session.timezone_name,
  });

  const endTimeIso = endDateTime.toISO();
  const endTime = endTimeIso
    ? formatDateTime(endTimeIso, DATETIME_FORMATS.TIME_SIMPLE, formatOptions)
    : "";

  const spanMultipleDays =
    startDateTime.toISODate() !== endDateTime.toISODate();

  const subtitle = spanMultipleDays
    ? t("header.subtitleMultiDay", {
        date,
        startTime,
        duration: formatMinutes(session.duration_minute, t),
      })
    : t("header.subtitle", {
        date,
        startTime,
        endTime,
        duration: session.duration_minute,
      });

  const now = getLocalNow({ zone: session.timezone_name });

  const timelineIndicator =
    now < startDateTime
      ? TimelineIndicator.UPCOMING
      : now > endDateTime
        ? TimelineIndicator.PAST
        : TimelineIndicator.ONGOING;

  const colors = TIMELINE_INDICATOR_COLORS[timelineIndicator];

  return (
    <div
      className={clsx("flex", { "gap-xs": !isMobile, "flex-col": isMobile })}
    >
      <Body>{subtitle}</Body>
      <div className="flex items-center gap-2xs">
        <Icon icon="circle-solid" size="xs" className={colors.icon} />
        <Body color={colors.text}>
          {t(`header.timelineIndicator.${timelineIndicator}`)}
        </Body>
      </div>
    </div>
  );
};
