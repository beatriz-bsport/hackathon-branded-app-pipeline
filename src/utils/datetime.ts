import moment from 'moment-timezone';
import { TFunction } from 'i18next';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function formatAsDate(date: string) {
  const momentDate = moment(date);
  if (momentDate.locale() === 'en-gb' || momentDate.locale() === 'en-US') {
    momentDate.locale('en');
  }
  return momentDate.format('L');
}

export function formatAsTime(date: string, tzname: string) {
  const momentDate = moment(date);
  if (tzname) {
    momentDate.tz(tzname);
  }
  if (momentDate.locale() === 'en-gb' || momentDate.locale() === 'en-US') {
    momentDate.locale('en');
  }
  return momentDate.format('LT');
}

export function formatAsDatetime(date: string, tzname?: string) {
  return `${formatAsDate(date)} - ${formatAsTime(date, tzname)}`;
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
