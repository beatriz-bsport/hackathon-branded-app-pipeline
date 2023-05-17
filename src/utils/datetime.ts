// @ts-nocheck
import moment from 'moment-timezone';
import { TFunction } from 'i18next';

import { MarketPlaceDaysFormatDisplay } from '@bsport/common/lib/master-data/personalization';

import type { Theme } from '#libs/theme/types';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function formatAsDate(date: string, tzname?: string) {
  const momentDate = tzname ? moment(date).tz(tzname) : moment(date);
  return momentDate.format('L');
}

/*
 Format date following the LL format with month as word  e.g : March 16, 1990, or 16 March 1990 depending on the locale.
 We also inject the weekday at the beging of the formated date. It follows the rules set by theme.days_format_display
 - Default = Friday March 16, 1990
 - One letter = March 16, 1990 -> As having a date like S March 16, 1990 is not clear, we don't display the day
 - Three letters = Fri March 16, 1990
 */
export function formatAsDateWithWeekday(
  date: string,
  theme: Theme,
  t: TFunction,
  format: string,
  tzname?: string,
) {
  const momentDate = tzname ? moment(date).tz(tzname) : moment(date);
  const formattedDate = momentDate.format(format);
  const dayOfTheWeek = momentDate.day();
  const readableDayOfTheWeek = t(
    `datetime:time.weekdayNumber.${(dayOfTheWeek + 8) % 7}`,
  );
  switch (theme?.days_format_display) {
    case MarketPlaceDaysFormatDisplay.ONE_LETTER:
      return formattedDate;
    case MarketPlaceDaysFormatDisplay.THREE_LETTERS:
      return `${readableDayOfTheWeek
        .slice(0, 3)
        .toUpperCase()} ${formattedDate}`;
    default:
      return `${readableDayOfTheWeek} ${formattedDate}`;
  }
}

export function formatAsTime(date: string | moment.Moment, tzname?: string) {
  if (moment().locale() === 'en-gb' || moment().locale() === 'en-US') {
    const momentDate = moment(date).locale('en');
    if (tzname) {
      momentDate.tz(tzname);
    }
    return momentDate.format('LT');
  }
  const momentDate = moment(date);
  if (tzname) {
    momentDate.tz(tzname);
  }
  return momentDate.format('LT');
}

const MOMENT_VALID_EN_GB_FORMATS = ['L', 'l'];

export function formatAsDatetimeAdapted(
  date: string | moment.Moment,
  format: string,
  tzname?: string,
) {
  const formatNeedsAdaptation = !MOMENT_VALID_EN_GB_FORMATS.includes(format);
  if (
    formatNeedsAdaptation &&
    (moment().locale() === 'en-gb' || moment().locale() === 'en-US')
  ) {
    const momentDate = moment(date).locale('en');
    if (tzname) {
      momentDate.tz(tzname);
    }
    return momentDate.format(format);
  }
  const momentDate = moment(date);
  if (tzname) {
    momentDate.tz(tzname);
  }
  return momentDate.format(format);
}

export function formatAsDatetime(date: string, tzname?: string) {
  return `${formatAsDate(date)} - ${formatAsTime(date, tzname)}`;
}
export function formatAsDatetimeWithoutHyphen(date: string, tzname?: string) {
  return `${formatAsDate(date)}\u00A0${formatAsTime(date, tzname)}`;
}

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

  const days = parseInt(minutesNumber / (60 * 24), 0);
  const hours = parseInt(minutesMinusDays / 60, 10);

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
 * format date as {day_name_short} {day/month} e.g : Mon. 10/09
 */
export function formatAsTitle(date: string) {
  const _date = moment(date, 'YYYY-MM-DD');

  const weekDays = moment.weekdaysShort(true);
  const dayShort = weekDays[_date.weekday()];

  const dateStr = moment(date, 'YYYY-MM-DD')
    .format('L')
    .replace(new RegExp(`[^.]?${moment().format('YYYY')}.?`), '');

  return `${dayShort} ${dateStr}`;
}

/**
 * Send back a new array sorted by the key for collection or directly in case of list
 */
export function sortByDate<T, K extends keyof T>(values: T[], key?: K) {
  if (!values) return [];
  if (key) {
    return [...values].sort((a, b) =>
      moment(a?.[key]).isBefore(moment(b?.[key])) ? -1 : 1,
    );
  }

  return [...values].sort((a, b) => (moment(a).isBefore(moment(b)) ? -1 : 1));
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
  const time = moment().format('LT');
  return time.includes('AM') || time.includes('PM');
}
