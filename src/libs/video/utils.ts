import { TFunction } from 'i18next';
import moment from 'moment/moment';
import { VideoPurchase } from '#libs/video/types';
import { formatAsDatetime } from '../../utils/datetime';
import { getPackDate } from '#libs/payment-packs/utils';

export const getExpirationDate = (videoPurchase: VideoPurchase) => {
  return moment(videoPurchase.date_created).add(
    videoPurchase.video.rental_days,
    'days',
  );
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

export const getStatusText = (videoPurchase: VideoPurchase, t: TFunction) => {
  const { consumer_payment_pack } = videoPurchase;
  if (!consumer_payment_pack || !consumer_payment_pack.payment_pack) {
    return [[t('loading'), 'secondary']];
  }

  const { payment_pack } = consumer_payment_pack;

  if (!payment_pack) {
    return [[t('loading'), 'secondary']];
  }
  const [packDates, soonExpired] = getPackDate(consumer_payment_pack);
  if (videoPurchase.video.rental_days > 0) {
    const expiration_date = getExpirationDate(videoPurchase);
    return [
      [t('video:video.rental.forRent'), 'primary'],
      [
        `${
          !videoPurchase.available
            ? t('video:video.rental.expired')
            : t('video:video.rental.valid')
        } - 
        ${expiration_date.format('L')}`,
        !videoPurchase.available ? 'error' : 'black',
      ],
    ];
  }
  if (payment_pack.unlimited) {
    return [
      [`${payment_pack.name}`, 'secondary'],
      [
        `${packDates} - illimité${
          videoPurchase.was_refunded ? ` (${t('wasRefunded')})` : ''
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
        videoPurchase.was_refunded ? `, (${t('wasRefunded')})` : ''
      }`,
      available_credits / credits < 0.1 || soonExpired ? 'error' : 'primary',
    ],
  ];
};
