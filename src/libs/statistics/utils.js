import { DateTime } from 'luxon';
import { getCurrencyDisplay } from '../theme/selectors';
import { STATISTICS_FORMAT } from './constants';

export const DAILY_DURATION_DISPLAY_LIMIT = 1;
export const WEEKLY_DURATION_DISPLAY_LIMIT = 15;
export const MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS = 60;
export const MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS = 100;

export const dateFormatter = (domain: string[]) => {
  const start = DateTime.fromFormat(domain[0], STATISTICS_FORMAT);
  const end = DateTime.fromFormat(domain[1], STATISTICS_FORMAT);
  const duration = end.diff(start, 'days');

  if (duration.days > MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS) {
    return (d) =>
      DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('MMM yyyy');
  }
  if (duration.days > WEEKLY_DURATION_DISPLAY_LIMIT) {
    return (d) =>
      DateTime.fromFormat(d, STATISTICS_FORMAT)
        .plus({ days: 3 })
        .toFormat('dd MMM');
  }
  if (duration.days > DAILY_DURATION_DISPLAY_LIMIT) {
    return (d) =>
      DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('ccc dd MMM');
  }
  return (d) => DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('t');
};

const hasArabicText = (str: string) => {
  const matchArabicUnicodeRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const arabicTextRegex = new RegExp(matchArabicUnicodeRegex);
  return arabicTextRegex.test(str);
};

// add spaces and if float, makes sure that displayd with 2 decimal digits
export const numberFormatter = (isCurrencyFormat) => (x) => {
  const parts = parseFloat(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length === 2) {
    if (parts[1].length === 1) parts[1] += '0';
    parts[1] = parts[1].slice(0, 2);
  }
  const currencyDisplay = getCurrencyDisplay();
  if (currencyDisplay === '€' || hasArabicText(currencyDisplay))
    return `${parts.join('.')}${isCurrencyFormat ? getCurrencyDisplay() : ''}`;

  return `${isCurrencyFormat ? getCurrencyDisplay() : ''}${parts.join('.')}`;
};

export const tooltipLabelFormatter = (domain: string[]) => (date: string) => {
  const start = DateTime.fromFormat(domain[0], STATISTICS_FORMAT);
  const end = DateTime.fromFormat(domain[1], STATISTICS_FORMAT);
  const duration = end.diff(start, 'days');

  if (
    duration.days <= MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS &&
    duration.days > WEEKLY_DURATION_DISPLAY_LIMIT
  ) {
    const startOfWeek = DateTime.fromFormat(date, STATISTICS_FORMAT)
      .startOf('week')
      .toFormat('dd-MMM');
    const endOfWeek = DateTime.fromFormat(date, STATISTICS_FORMAT)
      .endOf('week')
      .toFormat('dd-MMM');
    return `${startOfWeek} - ${endOfWeek}`;
  }
  return date;
};
