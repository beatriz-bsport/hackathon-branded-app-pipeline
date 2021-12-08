import { TFunction } from 'i18next';
import moment from 'moment-timezone';
import uniq from 'lodash/uniq';

import {
  PrivateConsumerPass,
  PrivatePass,
  PrivateService,
  ResourceAttributionEnum,
  ServiceCompatibilityPass,
  PrivateSlot,
} from './types';

export const getMissingResourceForBooking = (
  service: PrivateService,
  data: any,
  asManager?: boolean,
) => {
  if (!service || !data) return ['private_service'];
  const missing = [];
  if (service.is_home_service && asManager) {
    missing.push('address');
  } else if (
    service.establishments.length &&
    !data.establishment &&
    (asManager ||
      service.establishment_attribution === ResourceAttributionEnum.consumer)
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
  interval_list: Array<Array<string>>,
  duration_minutes = 0,
  booking_interval = 15,
) => {
  const slots: any[] = [];
  interval_list.map(([start, end]) => {
    const slotToGenerate =
      parseInt(
        // @ts-ignore
        (moment(end) - moment(start)) / (1000 * 60 * booking_interval),
        10,
      ) + 1;
    let n = 0;
    while (
      n < slotToGenerate &&
      moment(start)
        .add(n * booking_interval + duration_minutes, 'minutes')
        .isSameOrBefore(moment(end))
    ) {
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

export const groupSessionsByDayMoment = (
  sessionList: string[],
  timezoneName: string,
  date: string,
) => {
  const morningGroup = sessionList.filter(
    (d) => moment(d).tz(timezoneName).hour() < 12,
  );
  const noonGroup = sessionList.filter(
    (d) =>
      moment(d).tz(timezoneName).hour() < 15 &&
      moment(d).tz(timezoneName).hour() >= 12,
  );
  const afternoonGroup = sessionList.filter(
    (d) =>
      moment(d).tz(timezoneName).hour() < 18 &&
      moment(d).tz(timezoneName).hour() >= 15,
  );
  const eveningGroup = sessionList.filter(
    (d) => moment(d).tz(timezoneName).hour() >= 18,
  );

  return [
    { identifier: 'morning', list: morningGroup, date },
    { identifier: 'noon', list: noonGroup, date },
    { identifier: 'afternoon', list: afternoonGroup, date },
    { identifier: 'evening', list: eveningGroup, date },
  ];
};

export const getValidityInfo = (
  pack: PrivatePass,
  t: TFunction,
  start_method: boolean = false,
  fullText: boolean = false,
) => {
  let dateInfo = fullText
    ? t('privatePass.form.duration.fullText')
    : t('privatePass.form.duration.valid');
  const { duration_days, duration_months, duration_years, start_date_method } =
    pack;

  if (duration_years) {
    dateInfo += t('privatePass.form.duration.years', {
      count: duration_years,
    });
  }
  if (duration_years && duration_months && duration_days) {
    dateInfo += ', ';
  }
  if (duration_years && duration_months && !duration_days) {
    dateInfo += t('privatePass.form.duration.and');
  }
  if (duration_months) {
    dateInfo += t('privatePass.form.duration.months', {
      count: duration_months,
    });
  }
  if ((duration_years || duration_months) && duration_days) {
    dateInfo += t('privatePass.form.duration.and');
  }
  if (duration_days) {
    dateInfo += t('privatePass.form.duration.days', { count: duration_days });
  }
  if (start_method) {
    if (start_date_method === 0) {
      dateInfo += t('privatePass.form.start_date_method_detail.on_booking');
    }
    if (start_date_method === 1) {
      dateInfo += t('privatePass.form.start_date_method_detail.on_attendance');
    }
    if (start_date_method === 2) {
      dateInfo += t('privatePass.form.start_date_method_detail.on_purchase');
    }
  }
  if (fullText) {
    dateInfo += '.';
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

export const getFormInitial = (
  pass: PrivatePass,
  compatibleServicePass: ServiceCompatibilityPass[] = [],
) => {
  if (
    compatibleServicePass?.length > 0 &&
    compatibleServicePass?.filter(
      (c: ServiceCompatibilityPass) => c.excluded_slot_ids,
    ).length !== 0
  ) {
    const private_services = compatibleServicePass.map(
      (cs: ServiceCompatibilityPass) => ({
        private_service: cs.private_service.id,
        excluded_slot_ids: cs.excluded_slot_ids,
      }),
    );
    const initialPass = { ...pass, compatibility: private_services };
    delete initialPass.private_services;
    return initialPass;
  }
  const updatedPass = { ...pass, compatibility: [] };
  delete updatedPass.private_services;
  return updatedPass;
};

export const getExcludedSlotsDialogTitle = (
  t: TFunction,
  selectedService: PrivateService,
) => {
  return t('privateServiceCompatibility.excludedSlots.title', {
    service: selectedService && selectedService.name,
  });
};

export const getCompatibilityText = (
  t: TFunction,
  compByService: ServiceCompatibilityPass,
) => {
  const compatibility = { ...compByService };
  if (!compatibility.excluded_slot_ids) {
    compatibility.excluded_slot_ids = [];
  }

  if (compatibility.excluded_slot_ids.length) {
    if (compatibility.included_slots?.length) {
      return `${t('privateServiceCompatibility.forSlots')} ${
        compatibility.included_slots
          .filter((s) => s && s.name)
          .map((s) => (s && s.name) || '')
          .join(', ') || null
      }`;
    }
    return `${t('privateServiceCompatibility.forSlots')} ${t(
      'privateServiceCompatibility.none',
    )}`;
  }
  return t('privateServiceCompatibility.allSlots');
};

export const getCompatibilityTextWithSlots = (
  t: TFunction,
  excluded_slots?: number[],
  included_slots?: PrivateSlot[],
) => {
  if (excluded_slots?.length) {
    if (included_slots?.length) {
      return `${t('privateServiceCompatibility.forSlots')} ${
        included_slots
          .filter((s) => s && s.name)
          .map((s) => (s && s.name) || '')
          .join(', ') || null
      }`;
    }
    return `${t('privateServiceCompatibility.forSlots')} ${t(
      'privateServiceCompatibility.none',
    )}`;
  }
  return t('privateServiceCompatibility.allSlots');
};
