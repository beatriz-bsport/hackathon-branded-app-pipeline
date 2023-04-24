// @ts-nocheck
import moment from 'moment-timezone';
import memoize from 'memoize-one';
import { Coach } from '#libs/associated-coach/types';
import { Level } from '#libs/level/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { OfferMinimal } from '#libs/offer/types';
import { CompatibleCoachesByCategory } from './types';
import {
  REPLACEMENT_REQUEST_DISABLED_REASONS,
  ReplacementDisplays,
} from './constants';

export const computeNbCompatibleCoaches = (
  coaches: Coach[],
): CompatibleCoachesByCategory => {
  let nbCompatibleWithAllActivities = 0;
  let nbCompatibleWithAllWorkshops = 0;
  let nbCompatibleWithAllSCTs = 0;

  const compatibleCoachesDraft: CompatibleCoachesByCategory = {
    ...coaches.reduce(
      (acc, coach) => {
        const new_acc: CompatibleCoachesByCategory = { ...acc };
        // activities
        if (coach.is_teaching_all_activities) {
          nbCompatibleWithAllActivities += 1;
        } else {
          coach.meta_activities_taught.forEach((activityId) => {
            new_acc.activities[activityId] =
              (new_acc.activities[activityId] ?? 0) + 1;
          });
        }

        // workshops
        if (coach.is_teaching_all_workshops) {
          nbCompatibleWithAllWorkshops += 1;
        } else {
          coach.workshops_taught.forEach((workshopId) => {
            new_acc.workshops[workshopId] =
              (new_acc.workshops[workshopId] ?? 0) + 1;
          });
        }

        // SCTs
        if (coach.is_teaching_all_categories) {
          nbCompatibleWithAllSCTs += 1;
        } else {
          coach.categories_taught.forEach((SCTId) => {
            new_acc.SCTs[SCTId] = (new_acc.SCTs[SCTId] ?? 0) + 1;
          });
        }

        return new_acc;
      },
      {
        activities: {},
        workshops: {},
        SCTs: {},
      },
    ),
  };

  const compatibleCoachesFinal: CompatibleCoachesByCategory = {
    activities: {},
    workshops: {},
    SCTs: {},
  };
  for (const activityId of Object.keys(compatibleCoachesDraft.activities)) {
    compatibleCoachesFinal.activities[activityId] =
      compatibleCoachesDraft.activities[activityId] +
      nbCompatibleWithAllActivities;
  }

  for (const workshopId of Object.keys(compatibleCoachesDraft.workshops)) {
    compatibleCoachesFinal.workshops[workshopId] =
      compatibleCoachesDraft.workshops[workshopId] +
      nbCompatibleWithAllWorkshops;
  }

  for (const SCTid of Object.keys(compatibleCoachesDraft.SCTs)) {
    compatibleCoachesFinal.SCTs[SCTid] =
      compatibleCoachesDraft.SCTs[SCTid] + nbCompatibleWithAllSCTs;
  }

  return {
    activities: {
      ...compatibleCoachesFinal.activities,
      all: nbCompatibleWithAllActivities,
    },
    workshops: {
      ...compatibleCoachesFinal.workshops,
      all: nbCompatibleWithAllWorkshops,
    },
    SCTs: {
      ...compatibleCoachesFinal.SCTs,
      all: nbCompatibleWithAllSCTs,
    },
  };
};

export const isReplacementRequestToBeCreatedLate = (
  offer: OfferMinimal<Coach, Establishment, MetaActivity, Level>,
  daysBeforeOfferReplacementRequestIsLate: number,
) => {
  if (!daysBeforeOfferReplacementRequestIsLate) return false;
  return moment().isAfter(
    moment(offer.date_start)
      .tz(offer.timezone_name)
      .subtract(daysBeforeOfferReplacementRequestIsLate, 'days'),
  );
};

export const reasonCoachCannotAskForReplacement = (
  coach: Coach,
  offer: OfferMinimal<Coach, Establishment, MetaActivity, Level>,
  hasPendingReplacementRequest: boolean,
  hasRefusedReplacementRequest: boolean,
  nbLateRequestsLeft: number,
  daysBeforeOfferReplacementRequestIsLate: number,
) => {
  if (moment(offer.date_start).tz(offer.timezone_name).isBefore(moment())) {
    return REPLACEMENT_REQUEST_DISABLED_REASONS.REPLACEMENT_REQUEST_DISABLED_OFFER_ALREADY_PASSED;
  }
  if (hasPendingReplacementRequest) {
    return REPLACEMENT_REQUEST_DISABLED_REASONS.REPLACEMENT_REQUEST_DISABLED_ALREADY_ASKED_FOR;
  }
  if (hasRefusedReplacementRequest) {
    return REPLACEMENT_REQUEST_DISABLED_REASONS.REPLACEMENT_REQUEST_DISABLED_REFUSED_BY_MANAGER;
  }
  if (offer.coach_override?.id === coach.id) {
    return REPLACEMENT_REQUEST_DISABLED_REASONS.REPLACEMENT_REQUEST_DISABLED_ALREADY_REPLACING_OFFER;
  }
  if (
    isReplacementRequestToBeCreatedLate(
      offer,
      daysBeforeOfferReplacementRequestIsLate,
    ) &&
    nbLateRequestsLeft === 0
  ) {
    return REPLACEMENT_REQUEST_DISABLED_REASONS.REPLACEMENT_REQUEST_DISABLED_NO_LATE_REQUESTS_LEFT;
  }
  return '';
};

export const replacementEmptyChipTranslationKey = memoize(
  (replacementDisplay: ReplacementDisplays) => {
    switch (replacementDisplay) {
      case ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR:
        return 'replacement:noListItem.calendar';
      default:
        return 'replacement:noListItem.replacementRequest';
    }
  },
);
