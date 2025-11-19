import { Info } from "luxon";

import { type DateTime, LuxonDateTime } from "./constants";

export type { DateTime } from "./constants";

/**
 * Represents the starting day of the week.
 * 0 = Sunday, 1 = Monday, …, 6 = Saturday.
 */
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Converts a native JavaScript Date to a DateTime object.
 *
 * @param date - The native JavaScript Date.
 * @returns The corresponding DateTime object.
 */
export const toDateTime = (date: Date): DateTime =>
  LuxonDateTime.fromJSDate(date);

/**
 * Converts a DateTime object to a native JavaScript Date.
 *
 * @param dateTime - The DateTime object.
 * @returns The corresponding native JavaScript Date.
 */
export const toDate = (dateTime: DateTime): Date => dateTime.toJSDate();

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
  zone?: string;
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
 * @param weekStartDay - The index representing the starting day of the week (0 for Sunday, etc.).
 * @returns The number of blank cells before the first day of the month.
 */
export const calculateOffset = (
  date: DateTime,
  weekStartDay: WeekStartDay,
): number => ((date.startOf("month").weekday % 7) - weekStartDay + 7) % 7;

/**
 * Retrieves an array of localized weekday names in the desired order.
 *
 * @param format - The format of the weekday name:
 *  - "long" (e.g., "Monday", "Tuesday", etc.)
 *  - "short" (e.g., "Mon", "Tue", etc.)
 *  - "narrow" (e.g., "M", "T", etc.)
 * @param weekStartDay - The starting day of the week (0 = Sunday, 1 = Monday, etc.). Default is 1 (Monday).
 * @param locale - The locale identifier, e.g., "en" or "fr". Default is "en".
 * @returns An array of weekday names localized and rotated based on the weekStartDay.
 */
export const getWeekdays = (
  format: "long" | "short" | "narrow" = "short",
  weekStartDay: WeekStartDay = 0,
  locale = "en-GB",
): string[] => {
  const localeWeekStart = Info.getStartOfWeek(locale as Info.LocaleInput);
  const weekdays = Info.weekdays(format, { locale });
  const rotation = (7 + weekStartDay - (localeWeekStart % 7)) % 7;
  return [...weekdays.slice(rotation), ...weekdays.slice(0, rotation)];
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
 * @param weekStartDay - The starting day of the week (0 = Sunday, 1 = Monday, etc.).
 * @returns An array containing nulls for offset cells and DateTime objects for each day in the month.
 */
export const generateCalendarDays = (
  displayMonth: DateTime,
  weekStartDay: WeekStartDay,
): (DateTime | null)[] => {
  const offset = calculateOffset(displayMonth, weekStartDay);
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

export * from "./converters";
export * from "./operators";
