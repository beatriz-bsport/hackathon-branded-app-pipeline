// @flow

import moment from 'moment-timezone';
import { formatAsDate } from '../../utils/datetime';

export const getValidityInfo = (pack: PaymentPack, t: TFunction) => {
  let dateInfo = '';
  const {
    validity_daterange,
    duration_days,
    duration_months,
    duration_years,
  } = pack;
  if (duration_days && duration_months && duration_years) {
    dateInfo = t('validForDuration.general', {
      duration_days,
      duration_months,
      duration_years,
    });
  }
  if (duration_days && !duration_months && !duration_years) {
    dateInfo = t('validForDuration.days', {
      duration_days,
    });
  }
  if (!duration_days && duration_months && !duration_years) {
    dateInfo = t('validForDuration.months', {
      duration_months,
    });
  }
  if (!duration_days && !duration_months && duration_years) {
    dateInfo = t('validForDuration.years', {
      duration_years,
    });
  }
  if (validity_daterange) {
    dateInfo = `${t('validity')} ${formatAsDate(
      moment(JSON.parse(validity_daterange).lower),
    )} - ${formatAsDate(moment(JSON.parse(validity_daterange).upper))}`;
  }
  return dateInfo;
};

export const getPaymentPackTimeLimitation = (paymentPack, baseDate) => {
  const {
    validity_daterange,
    duration_days,
    duration_months,
    duration_years,
  } = paymentPack;

  if (!paymentPack) {
    return { start: null, end: null };
  }
  if (validity_daterange) {
    return {
      start: moment(JSON.parse(validity_daterange).lower),
      end: moment(JSON.parse(validity_daterange).upper),
    };
  }
  return {
    start: moment(baseDate || moment()),
    end: moment(baseDate || moment())
      .add('days', duration_days || 0)
      .add('months', duration_months || 0)
      .add('years', duration_years || 0)
      .add('days', -1),
  };
};
