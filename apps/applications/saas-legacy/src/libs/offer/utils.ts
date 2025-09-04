import { DateTime } from 'luxon';
import type { LuxonDateTime } from '#src/types';
import { OFFER_RECURRENCE } from './constants';
import type {
  Offer,
  OfferFormRecurrenceWeekDay,
  OfferFormValues,
  Offer_FULL,
} from './types';

export function isDateTooFar(dateISO: string) {
  return (
    DateTime.fromISO(dateISO).diff(DateTime.now(), 'years').as('years') > 3
  );
}

export function getCoachOrSubstitute(offer: Offer) {
  return offer?.coach_override ?? offer?.coach;
}

export function getIsoWeekDay() {
  return DateTime.now().weekday;
}

export function getOfferRecurrenceDates(
  formikValues: Pick<
    OfferFormValues,
    'recurrence' | 'recurrenceWeekDay' | 'dateIntervalStart' | 'dateIntervalEnd'
  >,
  timezone: string,
) {
  const { recurrence, recurrenceWeekDay, dateIntervalStart, dateIntervalEnd } =
    formikValues;

  if (
    !recurrence ||
    ![
      OFFER_RECURRENCE.WEEKLY,
      OFFER_RECURRENCE.MONTHLY,
      OFFER_RECURRENCE.DAILY,
    ].includes(recurrence) ||
    dateIntervalEnd.diff(DateTime.now(), 'years').as('years') > 3
  ) {
    return [dateIntervalStart];
  }

  const selectedDayRecurrence = Object.keys(recurrenceWeekDay)
    .filter((day: OfferFormRecurrenceWeekDay) => recurrenceWeekDay[day])
    .map((day) => parseInt(day));

  return _generateRecurrenceDates(
    dateIntervalStart,
    dateIntervalEnd,
    recurrence,
    timezone,
    selectedDayRecurrence,
  );
}

export function _generateRecurrenceDates(
  start: LuxonDateTime,
  end: LuxonDateTime,
  recurrence: OFFER_RECURRENCE,
  timezone: string,
  isoWeekdayRecurrenceArray?: number[],
) {
  const dates: LuxonDateTime[] = [];

  if (
    !recurrence ||
    ![
      OFFER_RECURRENCE.WEEKLY,
      OFFER_RECURRENCE.MONTHLY,
      OFFER_RECURRENCE.DAILY,
    ].includes(recurrence) ||
    end.diff(DateTime.now(), 'years').as('years') > 3
  ) {
    return [start];
  }

  let dateIteration = start.setZone(timezone);

  while (dateIteration.startOf('day') <= end.startOf('day')) {
    if (recurrence === OFFER_RECURRENCE.WEEKLY) {
      [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
        const currentDateOfTheWeek = dateIteration.plus({ days: i });
        if (
          currentDateOfTheWeek.startOf('day') >= start.startOf('day') &&
          currentDateOfTheWeek.startOf('day') <= end.startOf('day') &&
          isoWeekdayRecurrenceArray.includes(currentDateOfTheWeek.weekday)
        ) {
          dates.push(currentDateOfTheWeek);
        }
      });
    } else {
      dates.push(dateIteration);
    }

    dateIteration = dateIteration.plus({ [recurrence]: 1 });
  }

  return dates;
}

export function getEditPermission(
  offer: Offer_FULL,
  hasEditActivityPermission: boolean,
  hasEditWorkshopPermission: boolean,
) {
  if (!offer.meta_activity) return false;

  if (offer.meta_activity?.is_workshop) {
    return hasEditWorkshopPermission;
  }
  if (offer.meta_activity?.is_workshop === false) {
    return hasEditActivityPermission;
  }
  return false;
}

export function getDeletePermission(
  offer: Offer_FULL,
  hasDeleteActivityPermission: boolean,
  hasDeleteWorkshopPermission: boolean,
) {
  if (offer.meta_activity?.is_workshop) {
    return hasDeleteWorkshopPermission;
  }
  if (offer.meta_activity?.is_workshop === false) {
    return hasDeleteActivityPermission;
  }
  return false;
}

export function getCreatePermission(
  offer: Offer_FULL,
  hasCreateActivityPermission: boolean,
  hasCreateWorkshopPermission: boolean,
) {
  if (offer.meta_activity?.is_workshop) {
    return hasCreateWorkshopPermission;
  }
  if (offer.meta_activity?.is_workshop === false) {
    return hasCreateActivityPermission;
  }
  return false;
}
