// @flow
//
/* eslint-disable */
import _ from 'lodash';
import type { MarketPlaceState, Offer } from './types';
import { createSelector } from 'reselect';

const _getOffers = (state: MarketPlaceState) => state.offers.items;

const getActivities = (state: MarketPlaceState) => state.activities.items;

const getEstablishments = (state: MarketPlaceState) =>
  state.establishments.items;

const getCoaches = (state: MarketPlaceState) => state.coaches.items;

const getMetaActivities = (state: MarketPlaceState) =>
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
    const activity = _.find(getActivities(state), (a) => a.coach === coachId);
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
      getActivities(state),
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
      getActivities(state),
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
    const activity = _.find(getActivities(state), (a) => a.level === levelId);
    // check if the coach overide first
    if (offer.activity === activity.id) {
      _offers.push(offer);
    }
  });
  return _offers;
};

export const getOffers = createSelector(
  [_getOffers, getEstablishments, getActivities, getMetaActivities, getCoaches],
  (_offers, establishments, _activities, metaActivities, coaches) => {
    const activities = _activities.map((a) => ({
      ...a,
      coach: coaches.find((c) => c.id === a.coach),
      establishment: establishments.find((e) => e.id === a.establishment),
      meta_activity: metaActivities.find((ma) => ma.id === a.meta_activity),
    }));
    return _offers.map((o) => ({
      ...o,
      coach_override: o.coach_override
        ? coaches.find((c) => c.id === o.coach_override)
        : null,
      establishment_override: o.establishment_override
        ? establishments.find((e) => e.id === e.establishment_override)
        : null,
      activity: activities.find((a) => a.id === o.activity),
    }));
  },
);

export const isOfferLoading = (state: MarketPlaceState) =>
  state.offers.loading ||
  state.metaActivities.loading ||
  state.establishments.loading ||
  state.coaches.loading ||
  state.activities.loading;

export default {
  getOffers,
  isOfferLoading,
  getOffersByCoach,
  getOffersByActivity,
  getOffersByEstablishment,
  getOffersByMetaActivity,
  getOffersByLevel,
};
