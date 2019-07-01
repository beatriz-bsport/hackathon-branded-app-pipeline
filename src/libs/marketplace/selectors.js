// @flow
import _ from 'lodash';
import type { MarketPlaceState, Offer } from './types';

const _getOffers = (state: MarketPlaceState) => state.offers.items;

const _getActivities = (state: MarketPlaceState) => state.activities.items;

const _getEstablishments = (state: MarketPlaceState) =>
  state.establishments.items;

const _getCoaches = (state: MarketPlaceState) => state.coaches.items;

const _getMetaActivities = (state: MarketPlaceState) =>
  state.metaActivities.items;

/**
 * get all offers related to a specific activity
 */
const getOffersByActivity = (
  state: MarketPlaceState,
  activityId: number,
): Array<Offer> =>
  _.filter(_getOffers(state), (offer: Offer) => offer.activity === activityId);

/**
 * get offers of a specific coach
 */
const getOffersByCoach = (
  state: MarketPlaceState,
  coachId: number,
): Array<Offer> => {
  const _offers = [];
  _.forEach(_getOffers(state), (offer: Offer) => {
    const activity = _.find(_getActivities(state), (a) => a.coach === coachId);
    // check if the coach overide first
    if (
      offer.coach_override === coachId ||
      (activity.coach === coachId && offer.activity === activity.id)
    ) {
      _offers.push(offer);
    }
  });
  return _offers;
};

/**
 * get offers of a specific coach
 */
const getOffersByEstablishment = (
  state: MarketPlaceState,
  establishmentiId: number,
): Array<Offer> => {
  const _offers = [];
  _.forEach(_getOffers(state), (offer: Offer) => {
    const activity = _.find(
      _getActivities(state),
      (a) => a.establishment === establishmentiId,
    );
    // check if the coach overide first
    if (
      offer.establishment_override === establishmentiId ||
      (activity.establishment === establishmentiId &&
        activity.id === offer.activity)
    ) {
      _offers.push(offer);
    }
  });
  return _offers;
};

/**
 * get offers of a specific coach
 */
const getOffersByMetaActivity = (
  state: MarketPlaceState,
  metaActivityId: number,
): Array<Offer> => {
  const _offers = [];
  _.forEach(_getOffers(state), (offer: Offer) => {
    const activity = _.find(
      _getActivities(state),
      (a) => a.meta_activity === metaActivityId,
    );
    // check if the coach overide first
    if (offer.activity === activity.id) {
      _offers.push(offer);
    }
  });
  return _offers;
};

const getOffersByLevel = (
  state: MarketPlaceState,
  levelId: number,
): Array<Offer> => {
  const _offers = [];
  _.forEach(_getOffers(state), (offer: Offer) => {
    const activity = _.find(_getActivities(state), (a) => a.level === levelId);
    // check if the coach overide first
    if (offer.activity === activity.id) {
      _offers.push(offer);
    }
  });
  return _offers;
};

export function offerBuilderSelector(state: MarketPlaceState) {
  return _getOffers(state).map((offer) => {
    const offerActivity = _getActivities(state).find(
      (a) => a.id === offer.activity,
    );
    const establishment =
      _getEstablishments(state).find((e) =>
        offerActivity ? e.id === offerActivity.establishment : false,
      ) || null;
    const metaActivity =
      _getMetaActivities(state).find((ma) =>
        offerActivity ? ma.id === offerActivity.meta_activity : false,
      ) || null;
    const coach =
      _getCoaches(state).find((c) =>
        offerActivity ? c.id === offerActivity.coach : false,
      ) || null;
    const coach_override =
      _getCoaches(state).find((c) =>
        offerActivity ? c.id === offer.coach_override : false,
      ) || null;
    const establishment_override =
      _getEstablishments(state).find((c) =>
        c.id === offerActivity ? offer.establishment_override : false,
      ) || null;
    const activity = Object.assign({}, offerActivity, {
      coach,
      establishment,
    });
    return Object.assign({}, offer, {
      activity,
      metaActivity,
      coach_override,
      establishment_override,
    });
  });
}

export default {
  getOffersByCoach,
  getOffersByActivity,
  getOffersByEstablishment,
  getOffersByMetaActivity,
  getOffersByLevel,
};
