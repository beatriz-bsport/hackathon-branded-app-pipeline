import { TFunction } from 'i18next';
import moment from 'moment/moment';
import { VideoPurchase } from '#libs/video/types';
import { formatAsDatetime } from '../../utils/datetime';
import { getPackDate } from '#libs/payment-packs/utils';
import { getPassDate } from '#libs/private-service/utils';

export const getExpirationDate = (videoPurchase: VideoPurchase) => {
  return moment(videoPurchase.date_created).add(
    // @ts-ignore
    videoPurchase.video.rental_days,
    'days',
  );
};

export const getHeading = (
  date_created: string,
  video: VideoPurchase,
  timezone: string,
) => {
  // @ts-ignore
  return `${video.video.name || ''} - ${formatAsDatetime(
    date_created,
    timezone,
  )}`;
};

export const getStatusText = (videoPurchase: VideoPurchase, t: TFunction) => {
  const { consumer_payment_pack, private_consumer_pass } = videoPurchase;
  if (
    // @ts-ignore
    (!consumer_payment_pack || !consumer_payment_pack.payment_pack) &&
    // @ts-ignore
    (!private_consumer_pass || !private_consumer_pass.private_pass)
  ) {
    return [[t('loading'), 'secondary']];
  }

  let payment_pack = null;

  // @ts-ignore
  if (consumer_payment_pack) payment_pack = consumer_payment_pack.payment_pack;
  // @ts-ignore
  else payment_pack = private_consumer_pass.private_pass;

  if (!payment_pack) {
    if (!payment_pack) return [[t('loading'), 'secondary']];
  }
  const [packDates, soonExpired] = consumer_payment_pack
    ? // @ts-ignore
      getPackDate(consumer_payment_pack)
    : // @ts-ignore
      getPassDate(private_consumer_pass);
  // @ts-ignore
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
          // @ts-ignore
          videoPurchase.was_refunded ? ` (${t('wasRefunded')})` : ''
        }`,
        soonExpired ? 'error' : 'primary',
      ],
    ];
  }
  // @ts-ignore
  const { available_credits } =
    consumer_payment_pack ||
    // @ts-ignore
    payment_pack.credits - private_consumer_pass?.used_credits;
  const { credits } = payment_pack;
  return [
    [payment_pack.name, 'secondary'],
    [
      ` ${packDates} - ${available_credits}/${credits}${
        // @ts-ignore
        videoPurchase.was_refunded ? `, (${t('wasRefunded')})` : ''
      }`,
      available_credits / credits < 0.1 || soonExpired ? 'error' : 'primary',
    ],
  ];
};
