import { DateTime } from 'luxon';
import { getCurrencyDisplay } from '../theme/selectors';

export const DAILY_DURATION_DISPLAY_LIMIT = 1;
export const WEEKLY_DURATION_DISPLAY_LIMIT = 15;
export const MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS = 60;
export const MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS = 100;

export const parseRechartsDate = (date: string): DateTime => {
  const luxonDate = DateTime.fromISO(date);
  return luxonDate.isValid ? luxonDate : DateTime.fromFormat(date, 'yyyy-MM');
};

export const dateFormatter =
  ([start, end]: [string, string]) =>
  (date: string) => {
    const duration = Math.floor(
      parseRechartsDate(end).diff(parseRechartsDate(start)).as('days'),
    );
    const luxonDate = parseRechartsDate(date);

    if (duration > MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS) {
      return luxonDate.toFormat('MMM yyyy');
    }
    if (duration > WEEKLY_DURATION_DISPLAY_LIMIT) {
      return luxonDate.plus({ days: 3 }).toFormat('dd MMM');
    }
    if (duration > DAILY_DURATION_DISPLAY_LIMIT) {
      return luxonDate.toFormat('ccc dd MMM');
    }
    return luxonDate.toFormat('t');
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

export const tooltipLabelFormatter =
  ([start, end]: [string, string]) =>
  (date: string) => {
    const duration = Math.floor(
      parseRechartsDate(end).diff(parseRechartsDate(start)).as('days'),
    );

    if (
      duration <= MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS &&
      duration > WEEKLY_DURATION_DISPLAY_LIMIT
    ) {
      const startOfWeek = parseRechartsDate(date)
        .startOf('week')
        .toFormat('dd-MMM');
      const endOfWeek = parseRechartsDate(date)
        .endOf('week')
        .toFormat('dd-MMM');
      return `${startOfWeek} - ${endOfWeek}`;
    }
    return date;
  };
