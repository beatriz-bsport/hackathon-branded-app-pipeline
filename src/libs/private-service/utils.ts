import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import uniq from 'lodash/uniq';
import memoize from 'memoize-one';
import { START_ON_PURCHASE } from '@bsport/common/lib/master-data/payment-pack';

import { Member } from '#src/libs/member/types';

import { EstablishmentWithAssociatedId } from '#src/libs/establishment/types';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import type {
  PrivateConsumerPass,
  PrivatePass,
  PrivateService,
  ResourceAttributionEnum,
  ServiceCompatibilityPass,
  PrivateSlot,
  PrivateServiceWithSlots,
  CompatiblePrivateService,
  PrivatePassTemplate,
  AvailabilitySlot,
  Selection,
  Interval,
  AvailabilityDetail,
  SlotsGroupedByResourceId,
  IntervalsGroupedByResourceId,
  IntervalsGroupedByRestriction,
  ResourceType,
  PrivateConsumerPassReworked,
} from './types';
import { sortByDate } from '../../utils/datetime';

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
      // @ts-expect-error
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
  interval_list: string[][],
  duration_minutes = 0,
  booking_interval = 15,
) => {
  const slots: string[] = [];
  interval_list.map(([start, end]) => {
    const slotToGenerate =
      parseInt(
        // @ts-expect-error
        (DateTime.fromISO(end) - DateTime.fromISO(start)) /
          (1000 * 60 * booking_interval),
        10,
      ) + 1;
    let n = 0;
    while (
      n < slotToGenerate &&
      DateTime.fromISO(start).plus({
        minutes: n * booking_interval + duration_minutes,
      }) <= DateTime.fromISO(end)
    ) {
      slots.push(
        DateTime.fromISO(start)
          .plus({ minutes: n * booking_interval })
          .toString(),
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
    (d) => DateTime.fromISO(d).setZone(timezoneName).hour < 12,
  );
  const noonGroup = sessionList.filter(
    (d) =>
      DateTime.fromISO(d).setZone(timezoneName).hour < 15 &&
      DateTime.fromISO(d).setZone(timezoneName).hour >= 12,
  );
  const afternoonGroup = sessionList.filter(
    (d) =>
      DateTime.fromISO(d).setZone(timezoneName).hour < 18 &&
      DateTime.fromISO(d).setZone(timezoneName).hour >= 15,
  );
  const eveningGroup = sessionList.filter(
    (d) => DateTime.fromISO(d).setZone(timezoneName).hour >= 18,
  );

  return [
    { identifier: 'morning', list: morningGroup, date },
    { identifier: 'noon', list: noonGroup, date },
    { identifier: 'afternoon', list: afternoonGroup, date },
    { identifier: 'evening', list: eveningGroup, date },
  ];
};

export const getValidityInfo = (
  pass: PrivatePass | PrivatePassTemplate,
  t: TFunction,
  start_method: boolean = false,
  fullText: boolean = false,
) => {
  let dateInfo = fullText
    ? t('privatePass.form.duration.fullText')
    : t('privatePass.form.duration.valid');
  const { duration_days, duration_months, duration_years, start_date_method } =
    pass;

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

export const getExpirationDate = (
  privateConsumerPass:
    | PrivateConsumerPassReworked
    | PrivateConsumerPass
    | PrivateConsumerPass<Member>,
) => {
  if (
    privateConsumerPass.private_pass.start_date_method !== START_ON_PURCHASE &&
    privateConsumerPass.no_private_booking_active
  ) {
    return DateTime.fromISO(privateConsumerPass.date_bought)
      .plus({
        days:
          privateConsumerPass.private_pass.expiration_days_before_first_use +
          (privateConsumerPass.extension_days || 0) -
          1,
      })
      .toISODate();
  }
  return DateTime.fromISO(privateConsumerPass.date_bought)
    .plus({
      days:
        privateConsumerPass.private_pass.duration_days +
        (privateConsumerPass.extension_days || 0) -
        1,
      months: privateConsumerPass.private_pass.duration_months,
      years: privateConsumerPass.private_pass.duration_years,
    })
    .toISODate();
};

export const getFormInitial = (
  pass: PrivatePass,
  compatibleServicePass: Array<ServiceCompatibilityPass> = [],
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
  // @ts-expect-error
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

export const filterPrivateService = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService> | Array<ServiceCompatibilityPass>,
  include: boolean,
): boolean => {
  if (cps?.length) {
    const cpsById = cps.map(
      (s: CompatiblePrivateService | ServiceCompatibilityPass) =>
        typeof s.private_service === 'number'
          ? s.private_service
          : s.private_service.id,
    );

    return include ? cpsById.includes(ps.id) : !cpsById.includes(ps.id);
  }
  return !include;
};

export const getPassDate = (
  privateConsumerPass: PrivateConsumerPass | PrivateConsumerPass<Member>,
) => {
  const ending_date = getExpirationDate(privateConsumerPass);
  return [
    `${DateTime.fromISO(
      privateConsumerPass.date_bought,
    ).toLocaleString()}→${DateTime.fromISO(ending_date).toLocaleString()}`,
    DateTime.fromISO(ending_date) < DateTime.now().plus({ days: 6 }),
  ];
};

export const PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME = 5;
export const PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT = 6;

export const joinIntervalList = (intervalList: Array<Array<string>>) => {
  if (intervalList?.length < 2) return intervalList;
  // Must filter on moments and not strings due to different date string format
  const sortedIntervalList = intervalList.sort((slot, _slot) =>
    DateTime.fromISO(slot[0]) > DateTime.fromISO(_slot[0]) ? 1 : -1,
  );
  const slots: Array<Array<string>> = [];
  sortedIntervalList.forEach(([start, end]) => {
    if (slots.length === 0) {
      slots.push([start, end]);
    } else {
      const previousSlotEnd = slots[slots.length - 1][1];
      if (DateTime.fromISO(start) <= DateTime.fromISO(previousSlotEnd)) {
        slots[slots.length - 1][1] =
          DateTime.fromISO(previousSlotEnd) < DateTime.fromISO(end)
            ? end
            : previousSlotEnd;
      } else {
        slots.push([start, end]);
      }
    }
  });
  return slots;
};

// *
// * Merge intervals together when consecutive or overlapping
// *
const _consolidate = memoize(
  (slots: Array<AvailabilitySlot>): Array<Interval> => {
    const sortedSlots = sortByDate(slots, 'date_start');

    if (!sortedSlots.length) return [];

    let { date_start, date_end } = sortedSlots[0];
    const intervals: Array<Interval> = [];
    for (let i = 1; i < sortedSlots.length; i += 1) {
      const { date_start: curr_date_start, date_end: curr_date_end } =
        sortedSlots[i];
      if (DateTime.fromISO(curr_date_start) <= DateTime.fromISO(date_end)) {
        date_end = DateTime.max(
          DateTime.fromISO(date_end),
          DateTime.fromISO(curr_date_end),
        ).toISO();
      } else {
        intervals.push({ date_start, date_end });
        date_start = curr_date_start;
        date_end = curr_date_end;
      }
    }

    intervals.push({ date_start, date_end });
    return intervals;
  },
);

// *
// * Groups availability slots by resource, and for each resource groups by
// * restriction_on_associated_establishments. When grouped by resource and restriction,
// * a list of availability slots becomes mergeable
// *
const groupSlotsByResourceAndRestriction = memoize(
  (slots: Array<AvailabilitySlot>): SlotsGroupedByResourceId => {
    return slots
      .filter((slot) => !slot.is_restriction)
      .reduce((acc: SlotsGroupedByResourceId, currentSlot) => {
        const resourceIdentifierKey = currentSlot.resource_identifier;
        const resourceIdentifierValue = acc[resourceIdentifierKey] ?? {};

        const restrictionOnEstablishmentsKey = JSON.stringify(
          [...currentSlot.restriction_on_associated_establishments].sort(
            (a, b) => a - b,
          ),
        );
        const restrictionOnEstablishmentValues =
          resourceIdentifierValue[restrictionOnEstablishmentsKey] ?? [];

        return {
          ...acc,
          [currentSlot.resource_identifier]: {
            ...resourceIdentifierValue,
            [restrictionOnEstablishmentsKey]: [
              ...restrictionOnEstablishmentValues,
              currentSlot,
            ],
          },
        };
      }, {});
  },
);

// *
// * Performs the merge operation on the grouped availability slots
// *
export const groupSlotsAndMerge = memoize(
  (slots: Array<AvailabilitySlot>): IntervalsGroupedByResourceId => {
    const slotsGroupedByResource = groupSlotsByResourceAndRestriction(slots);

    const mergedIntervalsGroupedByResource: IntervalsGroupedByResourceId = {};

    for (const [
      resourceIdentifier,
      groupedSlotsByRestriction,
    ] of Object.entries(slotsGroupedByResource)) {
      const mergedIntervalsGroupedByRestriction: IntervalsGroupedByRestriction =
        {};

      for (const [restrictionString, currentSlots] of Object.entries(
        groupedSlotsByRestriction,
      )) {
        const mergedIntervals = _consolidate(currentSlots);
        mergedIntervalsGroupedByRestriction[restrictionString] =
          mergedIntervals;
      }

      mergedIntervalsGroupedByResource[resourceIdentifier] =
        mergedIntervalsGroupedByRestriction;
    }

    return mergedIntervalsGroupedByResource;
  },
);

// *
// * Computes the intersection between the selection and all intervals
// *
export const intersectSelectionWithMergedIntervals = (
  selection: Selection,
  groupedMergedIntervals: IntervalsGroupedByResourceId,
) => {
  const intersectionIntervalsGroupedByResourceId: IntervalsGroupedByResourceId =
    {};

  for (const [
    resourceIdentifier,
    groupedIntervalsByRestriction,
  ] of Object.entries(groupedMergedIntervals)) {
    const intersectionIntervalsGroupedByRestriction: IntervalsGroupedByRestriction =
      {};
    for (const [restrictionString, intervals] of Object.entries(
      groupedIntervalsByRestriction,
    )) {
      const concurrentIntervals = intervals.filter(
        (interval) =>
          DateTime.fromISO(interval.date_start) <=
            DateTime.fromISO(selection.endStr) &&
          DateTime.fromISO(interval.date_end) >=
            DateTime.fromISO(selection.startStr),
      );

      if (concurrentIntervals.length) {
        const intersectionIntervals = concurrentIntervals
          .map((interval) => ({
            date_start: DateTime.max(
              DateTime.fromISO(interval.date_start),
              DateTime.fromISO(selection.startStr),
            ).toISO(),
            date_end: DateTime.min(
              DateTime.fromISO(interval.date_end),
              DateTime.fromISO(selection.endStr),
            ).toISO(),
          }))
          .filter(
            (interval) =>
              DateTime.fromISO(interval.date_start) <
              DateTime.fromISO(interval.date_end),
          );
        if (intersectionIntervals.length) {
          intersectionIntervalsGroupedByRestriction[restrictionString] =
            intersectionIntervals;
        }
      }
    }

    if (Object.values(intersectionIntervalsGroupedByRestriction).length)
      intersectionIntervalsGroupedByResourceId[resourceIdentifier] =
        intersectionIntervalsGroupedByRestriction;
  }

  return intersectionIntervalsGroupedByResourceId;
};

// *
// * Format data by injecting the resource's name and photo, and the
// * establishment's name for the restrictions
// *
export const formatSlotDetailData = memoize(
  (
    groupedIntervals: IntervalsGroupedByResourceId,
    establishments: Array<EstablishmentWithAssociatedId>,
    resourceAvailable: Array<{
      datatype: string;
      data: Array<{
        resource_id: number;
        name: string;
        photo: string | null;
      }>;
    }>,
  ) => {
    const detailByResourceType: Record<
      ResourceType,
      Array<AvailabilityDetail>
    > = {
      associated_coach: [],
      associated_establishment: [],
      private_service: [],
    };

    for (const [
      resourceIdentifier,
      groupedIntervalsByRestriction,
    ] of Object.entries(groupedIntervals)) {
      const [resourceType, resourceId] = resourceIdentifier.split(':') as [
        resourceType: ResourceType,
        resourceId: string,
      ];
      const matchingResource = resourceAvailable
        .find((r) => r.datatype === resourceType)
        .data.find((d) => d.resource_id.toString() === resourceId);

      const { name, photo } = matchingResource;

      let slots: Array<{
        date_start: string;
        date_end: string;
        restriction_on_associated_establishments: string[];
      }> = [];

      for (const [restrictionString, intervals] of Object.entries(
        groupedIntervalsByRestriction,
      )) {
        const restriction = JSON.parse(restrictionString);
        const restriction_on_associated_establishments = restriction.map(
          (id: number) =>
            establishments.find((e) => e.associated_establishment_id === id)
              ?.title,
        );
        const intervalsWithRestriction = intervals.map((i) => ({
          ...i,
          restriction_on_associated_establishments,
        }));

        slots = slots.concat(intervalsWithRestriction);
      }

      const sortedSlots = sortByDate(slots, 'date_start');
      const resourceDetail = {
        name,
        photo,
        slots: sortedSlots,
        resourceType,
        resourceId: parseInt(resourceId),
      };

      detailByResourceType[resourceType].push(resourceDetail);
    }

    const { associated_coach, associated_establishment, private_service } =
      detailByResourceType;

    const res = {};

    // Only include resource types that are not empty in result
    // @ts-expect-error
    if (associated_coach.length) res.associated_coach = associated_coach;
    if (associated_establishment.length)
      // @ts-expect-error
      res.associated_establishment = associated_establishment;
    // @ts-expect-error
    if (private_service.length) res.private_service = private_service;

    return res;
  },
);

export const conditionToHideSpecificTeacherAvailabilities = () => false;
// ['production', 'staging'].includes(Config.REACT_APP_SENTRY_ENVIRONMENT);

export const getSpecificIncompatibilitiesReasons = (
  // keys of allIncompatibilities look like '[private_slot_id: number, cpp_id: string]'
  allIncompatibilities: {
    [privateSlotAndCpp: string]: number[];
  },
  privateSlotId: number,
  cppId: number,
) => (allIncompatibilities || {})[`[${privateSlotId}, ${cppId}]`] ?? [];

export const getMarketplaceSearchItemIndicator = (
  privatePass: PrivatePass,
  t: TFunction,
) => {
  return privatePass?.credits > 1
    ? t('paymentPack:specifications.nbCredits_plural', {
        credits: getCreditsDividedDisplay(privatePass.credits),
      })
    : t('paymentPack:specifications.nbCredits', {
        credits: getCreditsDividedDisplay(privatePass.credits),
      });
};
