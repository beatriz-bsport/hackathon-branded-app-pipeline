import { TFunction } from 'i18next';
import { DateTime, Info, Settings, SystemZone } from 'luxon';
import { MarketPlaceDaysFormatDisplay } from '@bsport/common/lib/master-data/personalization.js';
import * as Sentry from '@sentry/react';

import type { Theme } from '#src/libs/theme/types';

/**
 * Returns a calendar date from an ISO date
 * @param date A formatted ISO date
 * @param tzname An optional timezone name
 * @example
 * const date = formatAsDate(DateTime.now().toISO()); // 15/5/2024
 */
export function formatAsDate(date: string, tzname?: string) {
  const luxonDate = date ? DateTime.fromISO(date) : DateTime.now();
  return luxonDate.setZone(tzname).toLocaleString(DateTime.DATE_SHORT);
}

/**
 Format date following the LL format with month as word  e.g : March 16, 1990, or 16 March 1990 depending on the locale.
 We also inject the weekday at the beging of the formated date. It follows the rules set by theme.days_format_display
 - Default = Friday March 16, 1990
 - One letter = March 16, 1990 -> As having a date like S March 16, 1990 is not clear, we don't display the day
 - Three letters = Fri March 16, 1990
 */
export function formatAsDateWithWeekday(
  date: DateTime | null,
  theme: Theme,
  format: string,
) {
  if (!date || !date.isValid) return '';

  const formattedDate = date.toFormat(format);

  if (!theme)
    return `${Info.weekdays('long')[date.weekday - 1]} ${formattedDate}`;

  switch (theme.days_format_display) {
    case MarketPlaceDaysFormatDisplay.ONE_LETTER:
      return formattedDate;
    case MarketPlaceDaysFormatDisplay.THREE_LETTERS:
      return `${Info.weekdays('short')[
        date.weekday - 1
      ].toUpperCase()} ${formattedDate}`;
    default:
      return `${Info.weekdays('long')[date.weekday - 1]} ${formattedDate}`;
  }
}

export const formatISOStringAsTime = (date: string, tzname?: string) => {
  const datetime = tzname
    ? DateTime.fromISO(date).setZone(tzname)
    : DateTime.fromISO(date);
  return datetime.toLocaleString(DateTime.TIME_SIMPLE);
};

/**
 * Formats a date adapted to an optional timezone
 * @param date The datetime as isoString or unix timestamp
 * @param format The desired output date format
 * @param tzname The timezone name
 * @param isUnix Boolean passed if date is unix. Required if `date` is a unix timestamp value
 * @example
 * const date = formatAsDatetimeAdapted(offer.date_start, 'DDDD t') // Tuesday, February 20, 2024 12:10 PM
 * const unixToDate = formatAsDatetimeAdapted(1704189471, 'DDDD t', '', true) // Tuesday, January 2, 2024 10:57 AM
 */
export function formatAsDatetimeAdapted(
  date: string | number,
  format: string,
  tzname?: string,
  isUnix?: boolean,
) {
  let datetime = isUnix
    ? DateTime.fromSeconds(date as number)
    : DateTime.fromISO(date as string);

  if (tzname) {
    datetime = datetime.setZone(tzname);
  }
  return datetime.toFormat(format);
}

export function formatAsDatetime(date: string, tzname?: string) {
  return `${formatAsDate(date)} - ${formatISOStringAsTime(date, tzname)}`;
}

export const getUserZone = () => {
  const zone = new SystemZone();
  return zone.name;
};

export function formatMinutes(
  minutesNumber: number,
  t: TFunction,
  longIdentifier?: boolean,
) {
  if (minutesNumber === 999999) {
    return t('datetime:never');
  }
  let dayIdentifier = 'datetime:shortDayIdentifier';
  let hourIdentifier = 'datetime:shortHourIdentifier';
  let minuteIdentifier = 'datetime:shortMinuteIdentifier';
  if (longIdentifier) {
    dayIdentifier = 'datetime:longDayIdentifer';
    hourIdentifier = 'datetime:longHourIdentifier';
    minuteIdentifier = 'datetime:longMinuteIdentifier';
  }
  const minutesMinusDays = minutesNumber % (60 * 24);
  const minutesMinusHours = minutesNumber % 60;

  const days = parseInt((minutesNumber / (60 * 24)).toString(), 0);
  const hours = parseInt((minutesMinusDays / 60).toString(), 10);

  let readableDuration = '';
  if (days) {
    readableDuration += `${days}${'\u00A0'}${t(dayIdentifier)} `;
  }
  if (hours) {
    readableDuration += `${hours}${'\u00A0'}${t(hourIdentifier)} `;
  }

  if (minutesMinusHours || readableDuration === '') {
    readableDuration += `${minutesMinusHours}${'\u00A0'}${t(minuteIdentifier)}`;
  }

  return readableDuration;
}

/**
 * Output a formatted date from a luxon instance
 * @param date A luxon DateTime instance
 * @example
 * const title = `${formatAsTitle(someDate)} - ${formatAsTitle(someOtherDate)}`;
 * // Sun 05/05 - Sat 11/05
 */
export function formatAsTitle(date: DateTime) {
  const formattedDate = date.toFormat('ccc D');
  return formattedDate.substring(0, formattedDate.length - 5);
}

/**
 * Send back a new array sorted by the key for collection or directly in case of list
 */
export function sortByDate<T, K extends keyof T>(
  values: T[],
  key?: K,
  decreasingOrder?: boolean,
) {
  if (!values) return [];
  if (key) {
    const factor = decreasingOrder ? -1 : 1;
    return [...values].sort((a, b) => {
      const dateA = a?.[key] ? DateTime.fromISO(a[key] as string) : null;
      const dateB = b?.[key] ? DateTime.fromISO(b[key] as string) : null;
      return dateA < dateB ? -1 * factor : 1 * factor;
    });
  }

  return [...values].sort((a, b) =>
    // @ts-expect-error
    DateTime.fromISO(a) < DateTime.fromISO(b) ? -1 : 1,
  );
}

/*
Format the weekday according to the days_format_display settings from personalization form 
*/
export function formatWeekDay(weekDay: string, theme: Theme) {
  switch (theme?.days_format_display) {
    case MarketPlaceDaysFormatDisplay.ONE_LETTER:
      return weekDay.slice(0, 1);
    case MarketPlaceDaysFormatDisplay.THREE_LETTERS:
      return weekDay.slice(0, 3).toUpperCase();
    default:
      return weekDay;
  }
}

export function isAmPmTimeFormat() {
  const time = DateTime.now().toFormat('t');
  return time.includes('AM') || time.includes('PM');
}

/**
 * Retrieve the information to know if cancellation is made after max date defined by manager\
 * If the date of cancellation is after the limit => late cancellation
 * @param canceledDate The date when the booking has been cancelled by the member
 * @param maxDiscardMinutes The max number of minutes allowed for the member to cancel before it starts
 * @returns {boolean}
 */
export const getIsLateBookingCancellation = (
  canceledDate: string,
  maxDiscardMinutes: number,
  bookingStartDate: string,
) => {
  const maxCancellationDate = DateTime.fromISO(bookingStartDate).minus({
    minute: maxDiscardMinutes,
  });
  const isLateCancellation =
    DateTime.fromISO(canceledDate) > maxCancellationDate;

  return isLateCancellation;
};

/**
 * Returns whether the indicated date is in the past or not
 * @param date The date selected for comparison
 * @returns {boolean}
 */
export function isDateInThePast(date: string) {
  if (!date) return false;
  return DateTime.fromISO(date) < DateTime.now();
}

/**
 * Returns whether the indicated date is in the future or not
 * @param date The date selected for comparison
 * @returns {boolean}
 */
export function isDateInTheFuture(date?: string | null) {
  if (!date) return false;
  return DateTime.fromISO(date) > DateTime.now().endOf('day');
}

/**
 * Returns whether the indicated date is today or in the future
 * @param date The date selected for comparison
 * @returns {boolean}
 */
export function isDateTodayOrInTheFuture(date?: string | null) {
  if (!date) return false;
  return DateTime.fromISO(date) >= DateTime.now().startOf('day');
}

/**
 * Returns an array containing formatted weekdays depending on the
 * active locale
 *
 * @param {('narrow' | 'short' | 'long')} length The format to use
 * @example
 * // returns ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 * getLocaleWeekdays('short')
 *
 * // returns ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
 * getLocaleWeekdays('long')
 *
 * // returns ['S', 'M', 'T', 'W', 'T', 'F', 'S']
 * getLocaleWeekdays('narrow')
 */
export const getLocaleWeekdays = (length: 'narrow' | 'short' | 'long') => {
  const isoWeekdays = getWeekdaysWithExtraLogs(length);
  const startOfWeek = Info.getStartOfWeek();

  return Array(7)
    .fill('')
    .map((_, index) => isoWeekdays[(index + startOfWeek - 1) % 7]);
};

/*
 * A user seems to be locked into a situation where `Info.weekdays` throws
 * because of the timeZone being set to 'UTC'.
 * This function is an attempt to add extra logs to maybe find more context.
 * https://linear.app/bsport/issue/BOO-1382/user-cant-book-nor-access-schedule
 * It should also add a default timezone to hopefully allow the user to access
 * bsport schedules and be able to book.
 *
 * This is quite an edge case,
 * so if necessary, feel free to remove to simplify the code.
 */
const getWeekdaysWithExtraLogs = (length: 'narrow' | 'short' | 'long') => {
  try {
    return Info.weekdays(length);
  } catch (error) {
    const isErrorOfInterest =
      error instanceof RangeError &&
      error.message.startsWith('Invalid time zone specified: ');
    if (!isErrorOfInterest) {
      throw error;
    }
    Sentry.captureException(error, {
      contexts: {
        luxon: {
          defaultZone: Settings.defaultZone?.name,
          defaultZoneType: Settings.defaultZone?.type,
          defaultLocale: Settings.defaultLocale,
        },
      },
      extra: {
        length,
        userAgent: navigator?.userAgent,
        language: navigator?.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });
  }
  const fallBackTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  Settings.defaultZone = fallBackTimeZone;
  return Info.weekdays(length);
};
