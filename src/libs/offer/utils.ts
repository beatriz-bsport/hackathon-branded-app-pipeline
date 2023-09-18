import moment, { Moment, MomentInput } from 'moment-timezone';
import {
  Offer,
  OfferFormRecurrenceWeekDay,
  OfferFormValues,
  Offer_FULL,
} from './types';
import { OFFER_RECURRENCE } from './constants';

export function isDateTooFar(date: MomentInput) {
  return moment(date).diff(moment(), 'years', true) > 3;
}

export function getCoachOrSubstitute(offer: Offer) {
  return offer?.coach_override ?? offer?.coach;
}

export function getIsoWeekDay() {
  return moment().isoWeekday();
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
    moment(dateIntervalEnd).diff(moment(), 'years', true) > 3
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
  start: Moment,
  end: Moment,
  recurrence: OFFER_RECURRENCE,
  timezone: string,
  isoWeekdayRecurrenceArray?: number[],
) {
  const dates: Moment[] = [];

  if (
    !recurrence ||
    ![
      OFFER_RECURRENCE.WEEKLY,
      OFFER_RECURRENCE.MONTHLY,
      OFFER_RECURRENCE.DAILY,
    ].includes(recurrence) ||
    moment(end).diff(moment(), 'years', true) > 3
  ) {
    return [start];
  }

  const dateIteration = moment(start).tz(timezone);

  while (dateIteration.isSameOrBefore(end, 'day')) {
    if (recurrence === OFFER_RECURRENCE.WEEKLY) {
      [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
        const currentDateOfTheWeek = dateIteration.clone().add(i, 'day');
        if (
          currentDateOfTheWeek.isSameOrAfter(start, 'day') &&
          currentDateOfTheWeek.isSameOrBefore(end, 'day') &&
          isoWeekdayRecurrenceArray.includes(currentDateOfTheWeek.isoWeekday())
        ) {
          dates.push(currentDateOfTheWeek);
        }
      });
    } else {
      dates.push(dateIteration.clone());
    }

    dateIteration.add(1, recurrence);
  }

  return dates;
}

export function getEditPermission(
  offer: Offer_FULL,
  hasEditActivityPermission: boolean,
  hasEditWorkshopPermission: boolean,
) {
  if (offer.meta_activity.is_workshop) {
    return hasEditWorkshopPermission;
  }
  if (offer.meta_activity.is_workshop === false) {
    return hasEditActivityPermission;
  }
  return false;
}

export function getDeletePermission(
  offer: Offer_FULL,
  hasDeleteActivityPermission: boolean,
  hasDeleteWorkshopPermission: boolean,
) {
  if (offer.meta_activity.is_workshop) {
    return hasDeleteWorkshopPermission;
  }
  if (offer.meta_activity.is_workshop === false) {
    return hasDeleteActivityPermission;
  }
  return false;
}
