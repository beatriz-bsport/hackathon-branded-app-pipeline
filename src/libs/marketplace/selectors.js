// @flow
import type { MarketPlaceState, Offer } from './types';
import _ from 'lodash';

const _getOffers = (state: MarketPlaceState) => state.offers.items;
const _getEstablishments = (state: MarketPlaceState) =>
  state.establishments.items;

const _getMetaActivities = (state: MarketPlaceState) =>
  state.metaActivities.items;

const _getActivities = (state: MarketPlaceState) => state.activities.items;
const _getCoaches = (state: MarketPlaceState) => state.coaches.items;

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

export default {
  getOffersByCoach,
  getOffersByActivity,
  getOffersByEstablishment,
  getOffersByMetaActivity,
  getOffersByLevel,
};
