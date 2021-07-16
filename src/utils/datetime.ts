import moment from 'moment-timezone';
import { TFunction } from 'react-i18next';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function formatAsDate(date: string) {
  const momentDate = moment(date);
  return momentDate.format('L');
}

export function formatAsTime(date: string, tzname: string) {
  const momentDate = moment(date);
  if (tzname) {
    momentDate.tz(tzname);
  }
  return momentDate.format('LT');
}

export function formatAsDatetime(date: string, tzname?: string) {
  return `${formatAsDate(date)} - ${formatAsTime(date, tzname)}`;
}

export function formatMinutes(minutesNumber: number, t: TFunction) {
  if (minutesNumber === 999999) {
    return t('datetime:never');
  }
  const minutesMinusDays = minutesNumber % (60 * 24);
  const minutesMinusHours = minutesNumber % 60;

  const days = parseInt(minutesNumber / (60 * 24), 0);
  const hours = parseInt(minutesMinusDays / 60, 10);

  let readableDuration = '';
  if (days) {
    readableDuration += `${days}${t('datetime:shortDayIdentifier')} `;
  }
  if (hours) {
    readableDuration += `${hours}${t('datetime:shortHourIdentifier')} `;
  }

  if (minutesMinusHours || readableDuration === '') {
    readableDuration += `${minutesMinusHours}${t(
      'datetime:shortMinuteIdentifier',
    )}`;
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
