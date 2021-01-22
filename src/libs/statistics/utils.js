import moment from 'moment-timezone';

import { getCurrencyDisplay } from '../theme/selectors';

export const dateFormatter = (domain) => {
  const duration = moment.duration(moment(domain[1]).diff(moment(domain[0])));
  if (duration.asDays() > 100) {
    return (d) => moment(d).format('MMM YYYY');
  }
  if (duration.asDays() > 15) {
    return (d) => moment(d).format('DD MMM');
  }
  if (duration.asDays() > 1) {
    return (d) => moment(d).format('ddd DD MMM');
  }
  return (d) => moment(d).format('LT');
};

// add spaces and if float, makes sure that displayd with 2 decimal digits
export const numberFormatter = (isCurrencyFormat) => (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length === 2 && parts[1].length === 1) parts[1] += '0';
  return `${parts.join('.')}${isCurrencyFormat ? getCurrencyDisplay() : ''}`;
};
