import moment, { MomentInput } from 'moment-timezone';
import { DateTime } from 'luxon';
import type {
  Offer,
  OfferDataListItem,
  OfferFormRecurrenceWeekDay,
  OfferFormValues,
  Offer_FULL,
} from './types';
import { OFFER_RECURRENCE } from './constants';
import type { Coach } from '#libs/associated-coach/types';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { Level } from '#libs/level/types';
import type { LuxonDateTime } from '#src/types';

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
    dateIntervalEnd.diff(DateTime.now()).years > 3
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
    end.diff(DateTime.now()).years > 3
  ) {
    return [start];
  }

  let dateIteration = start.setZone(timezone);

  while (dateIteration.startOf('day') <= end.startOf('day')) {
    if (recurrence === OFFER_RECURRENCE.WEEKLY) {
      // eslint-disable-next-line
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

export const getOffersWithMoreInformation = (
  offers: Offer[],
  coaches: Coach[],
  establishments: Establishment[],
  metaActivities: MetaActivity[],
  customLevels: Level[],
): OfferDataListItem[] =>
  // @ts-ignore typescript is not inferring correctly the type of offer ...
  (offers ?? []).map((offer) => {
    return {
      ...offer,
      coach: coaches?.find((coach) => offer.coach === coach.id),
      coach_override: coaches?.find(
        (coach) => offer.coach_override === coach.id,
      ),
      meta_activity: metaActivities?.find(
        (metaActivity) => offer.meta_activity === metaActivity.id,
      ),
      establishment: establishments?.find(
        (establishment) => offer.establishment === establishment.id,
      ),
      customLevel: customLevels?.find(
        (level) => offer.custom_level === level.id,
      ),
    };
  });
