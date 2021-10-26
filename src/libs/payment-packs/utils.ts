import { TFunction } from 'i18next';
import moment from 'moment-timezone';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import { formatAsDate, formatAsDatetime } from '../../utils/datetime';
import type { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import type { VideoPurchase } from '../video/types';
import { PaymentPack } from './types';

export const getValidityInfo = (
  pack: PaymentPack,
  t: TFunction,
  startInfo: boolean = false,
) => {
  let dateInfo = t('validForDuration.valid');
  if (startInfo) {
    dateInfo += t('validForDuration.validFor');
  }
  const {
    validity_daterange,
    duration_days,
    duration_months,
    duration_years,
    start_date_method,
  } = pack;

  if (duration_years) {
    dateInfo += t('validForDuration.years', {
      count: duration_years,
    });
  }
  if (duration_years && duration_months && duration_days) {
    dateInfo += ', ';
  }
  if (duration_years && duration_months && !duration_days) {
    dateInfo += t('validForDuration.and');
  }
  if (duration_months) {
    dateInfo += t('validForDuration.months', {
      count: duration_months,
    });
  }
  if ((duration_years || duration_months) && duration_days) {
    dateInfo += t('validForDuration.and');
  }
  if (duration_days) {
    dateInfo += t('validForDuration.days', { count: duration_days });
  }
  if (validity_daterange) {
    dateInfo = `${t('validity')}${formatAsDate(
      moment(JSON.parse(validity_daterange).lower),
    )}${t('validityTo')}${formatAsDate(
      moment(JSON.parse(validity_daterange).upper),
    )}`;
  }
  if (!validity_daterange && !!dateInfo && startInfo) {
    if (start_date_method === 0) {
      dateInfo += ` ${t('validForDuration.booking')}`;
    }
    if (start_date_method === 1) {
      dateInfo += ` ${t('validForDuration.attendance')}`;
    }
    if (start_date_method === 2) {
      dateInfo += ` ${t('validForDuration.purchase')}`;
    }
  }

  return dateInfo;
};

export const getTagInfo = (pack: PaymentPack, t: TFunction) => {
  const { blacklist_tags, whitelist_tags } = pack;
  const nb_whitelistTags = whitelist_tags.length;
  const nb_blacklistTags = blacklist_tags.length;
  let tagInfo = '';
  if (nb_blacklistTags && nb_whitelistTags) {
    tagInfo = `${t('tags.whiteList', {
      count: nb_whitelistTags,
    })} - ${t('tags.blackList', {
      count: nb_blacklistTags,
    })}`;
  }
  if (nb_blacklistTags && !nb_whitelistTags) {
    tagInfo = t('tags.blackList', {
      count: nb_blacklistTags,
    });
  }

  if (!nb_blacklistTags && nb_whitelistTags) {
    tagInfo = t('tags.whiteList', {
      count: nb_whitelistTags,
    });
  }

  return tagInfo;
};

export const getPaymentPackTimeLimitation = (
  paymentPack: PaymentPack,
  baseDate: string,
) => {
  const { validity_daterange, duration_days, duration_months, duration_years } =
    paymentPack;

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

export const paymentPackTagsAndMemberTagsCompatibilty = (
  paymentPack: PaymentPack,
  TagList: Array<number>,
) => {
  if (
    paymentPack?.whitelist_tags?.length === 0 &&
    paymentPack?.blacklist_tags?.length === 0
  ) {
    return false;
  }

  return !(
    (paymentPack?.whitelist_tags?.length !== 0 &&
      paymentPack?.whitelist_tags?.some((tag) => TagList?.includes(tag))) ||
    (paymentPack?.blacklist_tags?.length !== 0 &&
      !paymentPack?.blacklist_tags?.some((tag) => TagList?.includes(tag)))
  );
};

export const getCompatibilityInfo = (pack: PaymentPack, t: TFunction) => {
  const { categories, establishments, metaActivities } = pack;
  const nb_categories = categories.length;
  const nb_activities = metaActivities.length;
  const nb_establishments = establishments.length;
  if (!nb_categories && !establishments.length && !metaActivities.length) {
    return t('compatibility.all');
  }

  let compatibilityInfo = t('compatibility.compatible');
  if (nb_categories) {
    compatibilityInfo += t('compatibility.categories', {
      count: nb_categories,
    });
  }
  if (nb_categories && nb_activities && nb_establishments) {
    compatibilityInfo += ', ';
  }
  if (nb_categories && nb_activities && !nb_establishments) {
    compatibilityInfo += t('compatibility.and');
  }
  if (nb_activities) {
    compatibilityInfo += t('compatibility.activities', {
      count: nb_activities,
    });
  }
  if ((nb_categories || metaActivities.length) && nb_establishments) {
    compatibilityInfo += t('compatibility.and');
  }
  if (nb_establishments) {
    compatibilityInfo += t('compatibility.establishments', {
      count: nb_establishments,
    });
  }

  return compatibilityInfo;
};

export const getCreditInfo = (
  pack: PaymentPack,
  t: TFunction,
  isManager: boolean = false,
) => {
  const { unlimited, theorical_margin_value, credits } = pack;
  let creditInfo: string = '';
  if (!unlimited) {
    creditInfo = `${credits}\u00A0${t('credits', {
      count: credits,
    }).toLowerCase()}`;
  } else {
    creditInfo = t('unlimitedPlural');
    if (isManager) {
      if (theorical_margin_value > 0) {
        creditInfo +=
          t('unlimitedAndMargin') +
          getCurrencyDisplayWithPrice(theorical_margin_value);
      } else {
        creditInfo += t('unlimitedAndCalculatedMargin');
      }
    }
  }
  return creditInfo;
};
