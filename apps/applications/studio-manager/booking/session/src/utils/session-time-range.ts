import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import {
  type DateTime,
  fromIsoString,
  modifyTime,
} from "@bsport/datetime-manipulation";

/** The end is given either explicitly (`dateEnd`) or derived from a duration. */
type SessionTimeRangeArgs = {
  dateStart: string;
  zone?: string;
  locale?: string;
} & (
  | { dateEnd: string; durationMinute?: never }
  | { dateEnd?: never; durationMinute: number }
);

/** Formats a single `DateTime` as a short clock time, e.g. "9:00 AM". */
export const formatClockTime = (datetime: DateTime): string =>
  formatDateTimeFromDate(datetime, DATETIME_FORMATS.TIME_SIMPLE);

/**
 * Resolves a session's start and end `DateTime`s in the given zone, deriving
 * the end from `durationMinute` when no explicit `dateEnd` is supplied.
 */
export const getSessionStartEnd = (
  args: SessionTimeRangeArgs,
): { start: DateTime; end: DateTime } => {
  const { dateStart, zone, locale } = args;
  const start = fromIsoString(dateStart, { zone, locale });
  const end =
    args.dateEnd !== undefined
      ? fromIsoString(args.dateEnd, { zone, locale })
      : modifyTime({
          datetime: start,
          duration: { minute: args.durationMinute },
          operator: "plus",
        });
  return { start, end };
};

/** Formats a session's time range as "start - end", e.g. "9:00 AM - 10:00 AM". */
export const formatSessionTimeRange = (args: SessionTimeRangeArgs): string => {
  const { start, end } = getSessionStartEnd(args);
  return `${formatClockTime(start)} - ${formatClockTime(end)}`;
};
