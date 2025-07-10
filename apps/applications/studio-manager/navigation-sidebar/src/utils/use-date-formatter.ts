import { useTranslation } from "#src/utils/i18n";

export type DateFormat = "short" | "long" | "datetime";

type DateOrString = string | Date;

export interface UseDateFormatterReturn {
  formatDate: (date: DateOrString, format?: DateFormat) => string;
  formatShort: (date: DateOrString) => string;
  formatLong: (date: DateOrString) => string;
  formatDateTime: (date: DateOrString) => string;
}

const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  long: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  datetime: {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
};

/**
 * Custom hook for formatting dates with internationalization support.
 *
 * Uses the current i18n language from useTranslation to format dates
 * according to the user's locale preferences.
 *
 * @returns {UseDateFormatterReturn} Object containing date formatting functions
 *
 * @example
 * ```tsx
 * const { formatShort, formatLong, formatDateTime } = useDateFormatter();
 *
 * // Short format: "Jan 15, 2025"
 * const shortDate = formatShort("2025-01-15T14:30:00Z");
 *
 * // Long format: "January 15, 2025"
 * const longDate = formatLong("2025-01-15T14:30:00Z");
 *
 * // Date with time: "Jan 15, 2025, 2:30 PM"
 * const dateTime = formatDateTime("2025-01-15T14:30:00Z");
 * ```
 */
export const useDateFormatter = (): UseDateFormatterReturn => {
  const { i18n } = useTranslation("default");

  const formatDate = (
    date: DateOrString,
    format: DateFormat = "short",
  ): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;

      // Validate date
      if (isNaN(dateObj.getTime())) {
        return typeof date === "string" ? date : date.toString();
      }

      const options = formatOptions[format] || {};
      return new Intl.DateTimeFormat(i18n.language, options).format(dateObj);
    } catch {
      // Fallback to original string if formatting fails
      return typeof date === "string" ? date : date.toString();
    }
  };

  const formatShort = (date: DateOrString): string => formatDate(date, "short");
  const formatLong = (date: DateOrString): string => formatDate(date, "long");
  const formatDateTime = (date: DateOrString): string =>
    formatDate(date, "datetime");

  return {
    formatDate,
    formatShort,
    formatLong,
    formatDateTime,
  };
};
