/**
 * Internal type for date parsing
 */
export type MappedDate = {
  year?: string;
  month?: string;
  day?: string;
};

/**
 * Comprehensive list of supported datetime formats
 */
export const DATETIME_FORMATS = {
  // Date formats
  /** ISO date format: "2024-10-15" */
  ISO_DATE: "iso-date",
  /** Full date format: "October 15, 2024" */
  FULL_DATE: "full-date",
  /** Medium date format: "Oct 15, 2024" */
  MEDIUM_DATE: "medium-date",
  /** Short date format: "10/15/24" */
  SHORT_DATE: "short-date",
  /** Year Month-Day format: "15 Oct-2024" */
  YEAR_MONTH_DAY: "year-month-day",
  /** Day Month Year format: "15 October 2024" */
  DAY_MONTH_YEAR: "day-month-year",
  /** Month Day format: "Oct 15" */
  MONTH_DAY: "month-day",
  /** Day Month format: "15 Oct" */
  DAY_MONTH: "day-month",

  // Time formats
  /** Hour:Minutes format: "14:30" */
  TIME_SIMPLE: "time-simple",
  /** Time with seconds: "14:30:45" */
  TIME_WITH_SECONDS: "time-with-seconds",
  /** 12-hour time: "2:30 PM" */
  TIME_12_HOUR: "time-12-hour",
  /** 12-hour time with seconds: "2:30:45 PM" */
  TIME_12_HOUR_WITH_SECONDS: "time-12-hour-with-seconds",

  // Combined date and time formats
  /** Full datetime: "October 15, 2024 at 2:30 PM" */
  FULL_DATETIME: "full-datetime",
  /** Medium datetime: "Oct 15, 2024, 2:30 PM" */
  MEDIUM_DATETIME: "medium-datetime",
  /** Short datetime: "10/15/24, 2:30 PM" */
  SHORT_DATETIME: "short-datetime",
  /** ISO datetime: "2024-10-15T14:30:00" */
  ISO_DATETIME: "iso-datetime",
  /** ISO datetime with timezone: "2024-10-15T14:30:00+02:00" */
  ISO_DATETIME_WITH_ZONE: "iso-datetime-with-zone",

  // Relative formats
  /** Relative time: "2 hours ago", "in 3 days" */
  RELATIVE: "relative",
  /** Relative with date fallback: "2 hours ago" or "Oct 15, 2024" for older dates */
  RELATIVE_WITH_FALLBACK: "relative-with-fallback",

  // Business-specific formats
  /** Business hours format: "2:30 PM" */
  BUSINESS_TIME: "business-time",
  /** Event date format: "Monday, October 15" */
  EVENT_DATE: "event-date",
  /** Schedule format: "Mon 15 Oct, 2:30 PM" */
  SCHEDULE: "schedule",
} as const;

/**
 * Type for available datetime formats
 */
export type DateTimeFormat =
  (typeof DATETIME_FORMATS)[keyof typeof DATETIME_FORMATS];

/**
 * Options for datetime formatting
 */
export interface DateTimeFormatOptions {
  /** User's locale for formatting (e.g., "en-US", "fr-FR") */
  locale?: string;
  /** User's timezone (e.g., "Europe/Paris", "America/New_York") */
  timeZone?: string;
  /** Whether to show timezone information when applicable */
  showTimeZone?: boolean;
  /** Fallback date format for relative formatting (defaults to MEDIUM_DATE) */
  relativeFallbackFormat?: DateTimeFormat;
  /** Number of days after which relative dates fall back to absolute format */
  relativeFallbackDays?: number;
}
