import moment from 'moment-timezone';
import { getCurrencyDisplay } from '../theme/selectors';

export const DAILY_DURATION_DISPLAY_LIMIT = 1;
export const WEEKLY_DURATION_DISPLAY_LIMIT = 15;
export const MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS = 60;
export const MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS = 100;

export const dateFormatter = (domain) => {
  const duration = moment.duration(moment(domain[1]).diff(moment(domain[0])));
  if (duration.asDays() > MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS) {
    return (d) => moment(d).format('MMM YYYY');
  }
  if (duration.asDays() > WEEKLY_DURATION_DISPLAY_LIMIT) {
    return (d) => moment(d).add(3, 'days').format('DD MMM');
  }
  if (duration.asDays() > DAILY_DURATION_DISPLAY_LIMIT) {
    return (d) => moment(d).format('ddd DD MMM');
  }
  return (d) => moment(d).format('LT');
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

export const tooltipLabelFormatter = (domain: Moment[]) => (date: string) => {
  const duration = moment.duration(moment(domain[1]).diff(moment(domain[0])));
  if (
    duration.asDays() <= MONTHLY_DURATION_DISPLAY_LIMIT_100_DAYS &&
    duration.asDays() > WEEKLY_DURATION_DISPLAY_LIMIT
  ) {
    return `${moment(date).startOf('week').format('DD-MMM')} - ${moment(date)
      .endOf('week')
      .format('DD-MMM')}`;
  }
  return date;
};
