// @flow
import moment from 'moment';
import uniq from 'lodash/uniq';
import type { TFunction } from 'react-i18next';
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';

export const getMissingResourceForBooking = (
  service: PrivateService,
  data: any,
  asManager: ?boolean,
) => {
  if (!service || !data) return ['private_service'];
  const missing = [];
  if (service.is_home_service && asManager) {
    missing.push('address');
  } else if (
    service.establishments.length &&
    !data.establishment &&
    (asManager ||
      service.establishment_attribution === RESOURCE_ATTRIBUTION_CONSUMER)
  ) {
    missing.push('establishment');
  }
  if (service.coaches.length && !data.coach && asManager) {
    missing.push('coach');
  }
  if (!data.private_service) {
    missing.push('private_service');
  }
  if (!data.private_slot) {
    missing.push('private_slot');
  }

  return missing;
};

export const splitIntervalList = (
  interval_list,
  duration_minutes = 0,
  booking_interval = 15,
) => {
  const slots = [];
  interval_list.map(([start, end]) => {
    const slotToGenerate =
      parseInt(
        (moment(end).add(-duration_minutes, 'minutes') - moment(start)) /
          (1000 * 60 * booking_interval),
        10,
      ) + 1;
    let n = 0;
    while (n < slotToGenerate) {
      slots.push(
        moment(start)
          .add(n * booking_interval, 'minutes')
          .format(),
      );
      n += 1;
    }
    return null;
  });
  return uniq(slots);
};

export const getValidityInfo = (pack: PrivatePass, t: TFunction) => {
  let dateInfo = '';
  const { duration_days, duration_months, duration_years } = pack;
  if (duration_days && duration_months && duration_years) {
    dateInfo = t('privatePass.validForDuration.general', {
      duration_days,
      duration_months,
      duration_years,
    });
  }
  if (duration_days && !duration_months && !duration_years) {
    dateInfo = t('privatePass.validForDuration.days', {
      duration_days,
    });
  }
  if (!duration_days && duration_months && !duration_years) {
    dateInfo = t('privatePass.validForDuration.months', {
      duration_months,
    });
  }
  if (!duration_days && !duration_months && duration_years) {
    dateInfo = t('privatePass.validForDuration.years', {
      duration_years,
    });
  }
  return dateInfo;
};

export const getExpirationDate = (privateConsumerPass: PrivateConsumerPass) => {
  return moment(privateConsumerPass.date_bought)
    .add(
      'day',
      privateConsumerPass.private_pass.duration_days +
        (privateConsumerPass.extension_days || 0),
    )
    .add('month', privateConsumerPass.private_pass.duration_months)
    .add('year', privateConsumerPass.private_pass.duration_years)
    .format('YYYY-MM-DD');
};
