import { TFunction } from 'i18next';
import moment from 'moment-timezone';
import { formatAsDate, formatAsDatetime } from '../../utils/datetime';
import type { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import type { VideoPurchase } from '../video/types';
import { PaymentPack } from './types';

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

export const getPackDate = (consumerPack: ConsumerPaymentPack) => {
  const { ending_date, starting_date } = consumerPack;
  return [
    `${formatAsDate(starting_date)}→${formatAsDate(ending_date)}`,
    moment(ending_date).isBefore(moment().add(6, 'day')),
  ];
};
export const getStatusText = (video: VideoPurchase, t: TFunction) => {
  const { consumer_payment_pack } = video;
  if (!consumer_payment_pack || !consumer_payment_pack.payment_pack) {
    return [[t('loading'), 'secondary']];
  }

  const { payment_pack } = consumer_payment_pack;

  if (!payment_pack) {
    return [[t('loading'), 'secondary']];
  }
  const [packDates, soonExpired] = getPackDate(consumer_payment_pack);
  if (payment_pack.unlimited) {
    return [
      [`${payment_pack.name}`, 'secondary'],
      [
        `${packDates} - illimité${
          video.was_refunded ? ` (${t('wasRefunded')})` : ''
        }`,
        soonExpired ? 'error' : 'primary',
      ],
    ];
  }
  const { available_credits } = consumer_payment_pack;
  const { credits } = payment_pack;
  return [
    [payment_pack.name, 'secondary'],
    [
      ` ${packDates} - ${available_credits}/${credits}${
        video.was_refunded ? `, (${t('wasRefunded')})` : ''
      }`,
      available_credits / credits < 0.1 || soonExpired ? 'error' : 'primary',
    ],
  ];
};

export const getHeading = (
  date_created: string,
  video: VideoPurchase,
  timezone: string,
) => {
  return `${video.video.name || ''} - ${formatAsDatetime(
    date_created,
    timezone,
  )}`;
};
