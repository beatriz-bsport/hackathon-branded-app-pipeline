import { DateTime } from "luxon";

import {
  DATETIME_FORMATS,
  DateTimeFormat,
  DateTimeFormatOptions,
  MappedDate,
} from "./types";
import { cleanDayString, cleanMonthString } from "./utils";

/**
 * Default options for datetime formatting
 */
const DEFAULT_OPTIONS: Required<DateTimeFormatOptions> = {
  locale: "en-US",
  timeZone: "Europe/Paris",
  showTimeZone: false,
  relativeFallbackFormat: DATETIME_FORMATS.MEDIUM_DATE,
  relativeFallbackDays: 7,
};

/**
 * Single endpoint for datetime formatting with comprehensive format support.
 * This function handles all datetime formatting needs across the application.
 * Use formatDateTimeFromDate if you have a DateTime object instead.
 *
 * @param dateTimeString - ISO datetime string to format (e.g., "2024-10-15T14:30:00Z")
 * @param format - The desired output format from DATETIME_FORMATS
 * @param options - Optional formatting options (locale, timezone, etc.)
 * @returns DateTimeFormatResult with formatted string and metadata
 *
 * @example
 * ```ts
 * // Basic date formatting
 * const result = formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.FULL_DATE);
 * console.log(result.formatted); // "October 15, 2024"
 *
 * // Time formatting
 * formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.TIME_SIMPLE);
 * // { formatted: "14:30", success: true, ... }
 *
 * // With custom locale and timezone
 * formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.FULL_DATETIME, {
 *   locale: "fr-FR",
 *   timeZone: "Europe/Paris"
 * });
 * // { formatted: "15 octobre 2024 à 16:30", success: true, ... }
 *
 * // Relative formatting
 * formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.RELATIVE);
 * // { formatted: "2 hours ago", success: true, ... }
 * ```
 */
export const formatDateTime = (
  dateTimeString: string,
  format: DateTimeFormat,
  options: DateTimeFormatOptions = {},
): string => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Handle empty or invalid input
    if (!dateTimeString || typeof dateTimeString !== "string") {
      console.error("Invalid input: dateTimeString must be a non-empty string");
      return "N/A";
    }

    const dateTime = DateTime.fromISO(dateTimeString, {
      locale: opts.locale,
      zone: opts.timeZone,
    });

    if (!dateTime.isValid) {
      console.error(
        `Invalid datetime string: ${dateTimeString}. Reason: ${dateTime.invalidReason}`,
      );
      return "N/A";
    }

    return formatByType(dateTime, format, opts);
  } catch (error) {
    console.error(
      `Error formatting datetime: ${error instanceof Error ? error.message : String(error)}`,
    );
    return "N/A";
  }
};

/**
 * Single endpoint for datetime formatting with comprehensive format support.
 * This function handles all datetime formatting needs across the application.
 * Use formatDateTime if you have an ISO string instead.
 *
 * @param dateTime - DateTime object to format
 * @param format - The desired output format from DATETIME_FORMATS
 * @param options - Optional formatting options (locale, timezone, etc.)
 * @returns DateTimeFormatResult with formatted string and metadata
 *
 * @example
 * ```ts
 * // Basic date formatting
 * const dateTime = DateTime.fromISO("2024-10-15T14:30:00Z");
 * const result = formatDateTimeFromDate(dateTime, DATETIME_FORMATS.FULL_DATE);
 * console.log(result.formatted); // "October 15, 2024"
 *
 * // Time formatting
 * formatDateTimeFromDate(dateTime, DATETIME_FORMATS.TIME_SIMPLE);
 * // { formatted: "14:30", success: true, ... }
 *
 * // With custom locale and timezone
 * formatDateTimeFromDate(dateTime, DATETIME_FORMATS.FULL_DATETIME, {
 *   locale: "fr-FR",
 *   timeZone: "Europe/Paris"
 * });
 * // { formatted: "15 octobre 2024 à 16:30", success: true, ... }
 *
 * // Relative formatting
 * const dateTime = DateTime.fromISO("2024-10-15T14:30:00Z");
 * formatDateTimeFromDate(dateTime, DATETIME_FORMATS.RELATIVE);
 * // { formatted: "2 hours ago", success: true, ... }
 * ```
 */
export const formatDateTimeFromDate = (
  dateTime: DateTime,
  format: DateTimeFormat,
  options: DateTimeFormatOptions = {},
): string => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    if (!dateTime.isValid) {
      console.error(
        `Invalid datetime string: ${dateTime.invalidExplanation}. Reason: ${dateTime.invalidReason}`,
      );
      return "N/A";
    }
    return formatByType(dateTime, format, opts);
  } catch (error) {
    console.error(
      `Error formatting datetime: ${error instanceof Error ? error.message : String(error)}`,
    );
    return "N/A";
  }
};

/**
 * Internal function to handle different format types
 */
function formatByType(
  dateTime: DateTime,
  format: DateTimeFormat,
  options: Required<DateTimeFormatOptions>,
): string {
  switch (format) {
    // Date formats
    case DATETIME_FORMATS.ISO_DATE:
      return dateTime.toISODate() || "N/A";

    case DATETIME_FORMATS.FULL_DATE:
      return dateTime.toLocaleString(DateTime.DATE_FULL);

    case DATETIME_FORMATS.MEDIUM_DATE:
      return dateTime.toLocaleString(DateTime.DATE_MED);

    case DATETIME_FORMATS.SHORT_DATE:
      return dateTime.toLocaleString(DateTime.DATE_SHORT);

    case DATETIME_FORMATS.YEAR_MONTH_DAY:
      return formatYearMonthDay(dateTime);

    case DATETIME_FORMATS.DAY_MONTH_YEAR:
      return dateTime.toFormat("dd MMMM yyyy");

    case DATETIME_FORMATS.MONTH_DAY:
      return dateTime.toFormat("MMM dd");

    case DATETIME_FORMATS.DAY_MONTH:
      return dateTime.toFormat("dd MMM");

    // Time formats
    case DATETIME_FORMATS.TIME_SIMPLE:
      return dateTime.toLocaleString(DateTime.TIME_SIMPLE);

    case DATETIME_FORMATS.TIME_WITH_SECONDS:
      return dateTime.toLocaleString(DateTime.TIME_WITH_SECONDS);

    case DATETIME_FORMATS.TIME_12_HOUR:
      return dateTime.toFormat("h:mm a");

    case DATETIME_FORMATS.TIME_12_HOUR_WITH_SECONDS:
      return dateTime.toFormat("h:mm:ss a");

    // Combined datetime formats
    case DATETIME_FORMATS.FULL_DATETIME: {
      const fullDate = dateTime.toLocaleString(DateTime.DATE_FULL);
      const time12 = dateTime.toFormat("h:mm a");
      return `${fullDate} at ${time12}`;
    }

    case DATETIME_FORMATS.MEDIUM_DATETIME:
      return dateTime.toLocaleString(DateTime.DATETIME_MED);

    case DATETIME_FORMATS.SHORT_DATETIME:
      return dateTime.toLocaleString(DateTime.DATETIME_SHORT);

    case DATETIME_FORMATS.ISO_DATETIME:
      return dateTime.toISO({ includeOffset: false }) || "N/A";

    case DATETIME_FORMATS.ISO_DATETIME_WITH_ZONE:
      return dateTime.toISO() || "N/A";

    // Relative formats
    case DATETIME_FORMATS.RELATIVE:
      return dateTime.toRelative() || "N/A";

    case DATETIME_FORMATS.RELATIVE_WITH_FALLBACK:
      return formatRelativeWithFallback(dateTime, options);

    // Business-specific formats
    case DATETIME_FORMATS.BUSINESS_TIME:
      return dateTime.toFormat("h:mm a");

    case DATETIME_FORMATS.EVENT_DATE:
      return dateTime.toFormat("cccc, MMMM dd");

    case DATETIME_FORMATS.SCHEDULE:
      return dateTime.toFormat("ccc dd MMM, h:mm a");

    default:
      console.warn(`Unsupported format: ${format}`);
      return "N/A";
  }
}

/**
 * Format relative time with fallback to absolute date for older entries
 */
function formatRelativeWithFallback(
  dateTime: DateTime,
  options: Required<DateTimeFormatOptions>,
): string {
  const now = DateTime.now();
  const daysDiff = Math.abs(now.diff(dateTime, "days").days);

  if (daysDiff <= options.relativeFallbackDays) {
    return dateTime.toRelative() || "N/A";
  }

  // Fall back to absolute format for older dates
  return formatByType(dateTime, options.relativeFallbackFormat, options);
}

/**
 * Helper function to format datetime in YEAR_MONTH_DAY format ("15 Oct-2024")
 */
function formatYearMonthDay(dateTime: DateTime): string {
  const result = dateTime.toLocaleString(DateTime.DATE_MED);
  const mappedDate: MappedDate = {
    year: undefined,
    month: undefined,
    day: undefined,
  };

  const splittedDate = result.split(" ");

  splittedDate.forEach((part) => {
    if (part.match(/\d{4}/)) {
      mappedDate.year = part;
      return;
    }
    if (part.match(/\d{1,2}/)) {
      mappedDate.day = part;
      return;
    }
    mappedDate.month = part.charAt(0).toUpperCase() + part.slice(1);
  });

  if (!mappedDate.day || !mappedDate.month || !mappedDate.year) {
    return "N/A";
  }

  return `${cleanDayString(mappedDate.day)} ${cleanMonthString(mappedDate.month)}-${mappedDate.year}`;
}

/**
 * React hook that provides datetime formatting capabilities.
 * This hook creates formatting functions with preset options for consistent use across components.
 *
 * @param defaultOptions - Default options for all datetime formatting operations
 * @returns Object containing formatting functions and the main formatDateTime function
 *
 * @example
 * ```tsx
 * // Basic usage with default options
 * const { formatDate, formatTime, formatDateTime } = useFormatDatetime();
 *
 * // With custom default options
 * const { formatDate, formatTime, formatDateTime } = useFormatDatetime({
 *   locale: "fr-FR",
 *   timeZone: "Europe/Paris"
 * });
 *
 * // In component
 * const MyComponent = ({ createdAt }: { createdAt: string }) => {
 *   const { formatDate, formatTime } = useFormatDatetime();
 *
 *   return (
 *     <div>
 *       <p>Date: {formatDate(createdAt).formatted}</p>
 *       <p>Time: {formatTime(createdAt).formatted}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useFormatDatetime = (
  defaultOptions: DateTimeFormatOptions = {},
) => {
  // Pre-configured formatting functions for common use cases
  const formatDate = (
    dateTimeString: string,
    options?: DateTimeFormatOptions,
  ) =>
    formatDateTime(dateTimeString, DATETIME_FORMATS.MEDIUM_DATE, {
      ...defaultOptions,
      ...options,
    });

  const formatTime = (
    dateTimeString: string,
    options?: DateTimeFormatOptions,
  ) =>
    formatDateTime(dateTimeString, DATETIME_FORMATS.TIME_SIMPLE, {
      ...defaultOptions,
      ...options,
    });

  const formatFullDate = (
    dateTimeString: string,
    options?: DateTimeFormatOptions,
  ) =>
    formatDateTime(dateTimeString, DATETIME_FORMATS.FULL_DATE, {
      ...defaultOptions,
      ...options,
    });

  const formatRelative = (
    dateTimeString: string,
    options?: DateTimeFormatOptions,
  ) =>
    formatDateTime(dateTimeString, DATETIME_FORMATS.RELATIVE, {
      ...defaultOptions,
      ...options,
    });

  const formatBusinessTime = (
    dateTimeString: string,
    options?: DateTimeFormatOptions,
  ) =>
    formatDateTime(dateTimeString, DATETIME_FORMATS.BUSINESS_TIME, {
      ...defaultOptions,
      ...options,
    });

  // Main formatting function with applied default options
  const formatWithDefaults = (
    dateTimeString: string,
    format: DateTimeFormat,
    options?: DateTimeFormatOptions,
  ) =>
    formatDateTime(dateTimeString, format, { ...defaultOptions, ...options });

  return {
    // Pre-configured formatters
    formatDate,
    formatTime,
    formatFullDate,
    formatRelative,
    formatBusinessTime,

    // Main formatter with default options applied
    formatDateTime: formatWithDefaults,

    // Access to all available formats
    FORMATS: DATETIME_FORMATS,
  };
};
