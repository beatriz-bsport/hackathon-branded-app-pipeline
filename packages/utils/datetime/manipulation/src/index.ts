import { Info, Zone } from "luxon";

import { type DateTime, LuxonDateTime } from "./constants";

export { type DateTime, LuxonDateTime } from "./constants";

/**
 * Represents the starting day of the week.
 * 1 = Monday, …, 6 = Saturday, 7 = Sunday.
 */
export type WeekStartDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * Converts a native JavaScript Date to a DateTime object.
 *
 * @param date - The native JavaScript Date.
 * @returns The corresponding DateTime object.
 */
export const toDateTime = (date: Date, zone?: string): DateTime => {
  return LuxonDateTime.fromJSDate(date, { zone });
};

/**
 * Converts a DateTime object to a native JavaScript Date.
 *
 * @param dateTime - The DateTime object.
 * @returns The corresponding native JavaScript Date.
 */
export const toDate = (dateTime: DateTime): Date => dateTime.toJSDate();

/**
 * Gets today's date as a native JavaScript Date having the correct calendar day.
 * For example, if the company timezone is "America/New_York" and the local timezone is "America/Los_Angeles",
 * calling this function on April 7th at 10 PM PDT will return April 8th, since it's already past midnight in New York.
 *
 * @param locale - The locale identifier (e.g., "en-US", "fr-FR").
 * @param zone - The IANA time zone name (e.g., "America/New_York").
 * @returns Today's date as a native JavaScript Date.
 */
export const getTodayJSDate = (locale?: string, zone?: string): Date => {
  const localToday = getLocalNow({
    locale: locale,
    zone: zone,
  }).toISODate();
  if (!localToday) {
    return new Date();
  }

  // Build the Date object manually to avoid timezone issues
  const [year, month, day] = localToday.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Parses an ISO 8601 string to a DateTime object.
 *
 * @param isoString - The ISO 8601 formatted string.
 * @param options - Optional settings such as time zone and locale.
 * @returns The corresponding DateTime object.
 */
export const fromIsoString = (
  isoString: string,
  options?: { zone?: string; locale?: string },
): DateTime => LuxonDateTime.fromISO(isoString, options);

/**
 * Gets the current local DateTime, with optional time zone and locale settings.
 *
 * @param options - Optional settings such as time zone and locale.
 * @returns  The current local DateTime object.
 */
export const getLocalNow = ({
  zone,
  locale,
}: {
  zone?: string | Zone;
  locale?: string;
}): DateTime =>
  LuxonDateTime.now()
    .setZone(zone ?? "local")
    .setLocale(locale ?? "en");

/**
 * Retrieves all days in the month of the provided DateTime.
 *
 * @param date - The DateTime representing any day in the month.
 * @returns An array of DateTime objects for each day in the month.
 */
export const getDaysInMonth = (date: DateTime): DateTime[] => {
  const days = date.daysInMonth ?? 0;
  return days
    ? Array.from({ length: days }, (_, i) =>
        date.startOf("month").plus({ days: i }),
      )
    : [];
};

/**
 * Checks if two DateTime objects represent the same calendar day.
 *
 * @param date1 - The first DateTime.
 * @param date2 - The second DateTime.
 * @returns True if both dates are on the same day; otherwise, false.
 */
export const isSameDay = (date1: DateTime, date2: DateTime): boolean =>
  date1.hasSame(date2, "day");

/**
 * Calculates the offset for the first day of the month in a calendar grid based on the start of the week.
 *
 * @param date - A DateTime representing any day in the month.
 * @param locale - The locale identifier, e.g., "en" or "fr". Default is "en".
 * @returns The number of blank cells before the first day of the month.
 */
export const calculateOffset = (
  date: DateTime,
  locale: string = "en",
): number =>
  (date.startOf("month").weekday - getWeekStartDayFromLocale(locale) + 7) % 7;

/**
 * Retrieves an array of localized weekday names in the desired order.
 *
 * @param format - The format of the weekday name:
 *  - "long" (e.g., "Monday", "Tuesday", etc.)
 *  - "short" (e.g., "Mon", "Tue", etc.)
 *  - "narrow" (e.g., "M", "T", etc.)
 * @param locale - The locale identifier, e.g., "en" or "fr". Default is "en".
 * @returns An array of weekday names localized and rotated based on the weekStartDay.
 */
export const getWeekdays = (
  format: "long" | "short" | "narrow" = "short",
  locale = "en-GB",
): string[] => {
  const weekdays = Info.weekdays(format, { locale });
  const weekStartDay = getWeekStartDayFromLocale(locale);
  const rotation = (7 + weekStartDay - 1) % 7;
  return [...weekdays.slice(rotation), ...weekdays.slice(0, rotation)];
};

export const getWeekStartDayFromLocale = (locale: string): WeekStartDay => {
  return Info.getStartOfWeek({ locale });
};

/**
 * Gets the start and end of the week for a given date, respecting the locale's week start day.
 *
 * @param date - A Date object representing any day in the week.
 * @param locale - The locale identifier (e.g., "en-US", "fr-FR"). Default is "en-GB".
 * @returns An object with start and end Date objects representing the week boundaries.
 */
export const getWeekBounds = (
  date: DateTime,
  locale: string = "en-GB",
): { start: DateTime; end: DateTime } => {
  const dateTime = date.setLocale(locale);
  const startOfWeek = dateTime.startOf("week", { useLocaleWeeks: true });
  const endOfWeek = dateTime.endOf("week", { useLocaleWeeks: true });
  return {
    start: startOfWeek,
    end: endOfWeek,
  };
};

/**
 * Retrieves an array of localized month names.
 *
 * @param format - The format of the month name, either "long" or "short". Default is "long".
 * @param locale - The locale identifier, e.g., "en" or "fr". Default is "en".
 * @returns An array of month names localized according to the provided format and locale.
 */
export const getMonths = (
  format: "long" | "short" = "long",
  locale: string = "en",
): string[] => Info.months(format, { locale });

/**
 * Generates a calendar grid for the given month, respecting the locale's week start day.
 *
 * @param displayMonth - A DateTime representing any day within the target month.
 * @param locale - The locale identifier, e.g., "en" or "fr". Default is "en".
 * @returns An array containing nulls for offset cells and DateTime objects for each day in the month.
 */
export const generateCalendarDays = (
  displayMonth: DateTime,
  locale: string = "en",
): (DateTime | null)[] => {
  const offset = calculateOffset(displayMonth, locale);
  const daysInMonth = getDaysInMonth(displayMonth);
  return [...Array(offset).fill(null), ...daysInMonth];
};

/**
 * Converts a Date object to an ISO 8601 date string (YYYY-MM-DD) in UTC timezone.
 * Handles timezone offsets by normalizing to UTC before conversion.
 *
 * @param date - The Date object to convert. Invalid dates return an empty string.
 * @returns A formatted ISO date string (e.g., "2025-04-07") or an empty string if invalid.
 */
export const getIsoDateString = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "";
  }
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};

export const getIsoDate = (date: DateTime): string => {
  return date.toISODate() ?? "";
};

/**
 * Validates whether a value is a Date object or ISO date string (YYYY-MM-DD).
 * For strings, checks format only (not calendar validity).
 *
 * @param date - A Date object or string to validate.
 * @returns `true` if the input is a valid Date object or matches the expected string format.
 */
export const isValidDate = (date: Date | string): boolean => {
  if (typeof date === "string") {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }
  return !!date && !isNaN(date.getTime());
};

/**
 * Determines if the locale uses a meridiem (AM/PM) format for time representation.
 *
 * @param locale - The locale identifier (e.g., "en-US", "fr-FR")
 * @returns True if the locale uses 12-hour format with meridiem, false for 24-hour format
 */
export const getIsMeridiemLocale = (locale: string): boolean => {
  const parts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(new Date(2020, 0, 1, 13, 0, 0));

  return parts.some((part) => part.type === "dayPeriod");
};

/**
 * Get the start of day (00:00:00.000) for a given date, optionally in a specific timezone.
 * If no timezone is provided, the system's local timezone is used.
 *
 * @param date - The input date.
 * @param zone - Optional IANA time zone name (e.g., "America/New_York").
 * @returns A Date object representing the start of the day.
 */
export function startOfDay(date: Date, zone?: string): Date {
  return toDate(toDateTime(date, zone).startOf("day"));
}

/**
 * Check if a date is within a range (inclusive)
 */
export function isWithinRange(
  date: DateTime,
  start: DateTime,
  end: DateTime,
  timezone?: string,
): boolean {
  const normalize = (dateTime: DateTime) =>
    dateTime
      .setZone(timezone ?? dateTime.zone)
      .startOf("day")
      .toMillis();

  return (
    normalize(date) >= normalize(start) && normalize(date) <= normalize(end)
  );
}

/**
 * Get ISO weekday from DateTime (1 = Monday, 7 = Sunday)
 */
export function getISOWeekday(
  date: DateTime,
  zone?: string | Zone,
): WeekStartDay {
  return date.setZone(zone ?? date.zone).weekday as WeekStartDay;
}

export function getStartOf({
  dateTime,
  unit,
}: {
  dateTime: DateTime;
  unit: "day" | "month" | "year" | "week";
}): DateTime {
  return dateTime.startOf(unit);
}

export * from "./converters";
export * from "./operators";
