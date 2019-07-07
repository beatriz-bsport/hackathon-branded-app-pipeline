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

export const getOffersFiltered = (state: MarketPlaceState, filters: *) => {
  let offersFiltered = getOffers(state);
  if ((filters.establishments || []).length) {
    offersFiltered = offersFiltered.filter(
      (o) =>
        (filters.establishments.includes(o.activity.establishment.id) &&
          !o.establishment_override) ||
        (o.establishment_override &&
          filters.establishments.includes(o.establishment_override.id)),
    );
  }
  if ((filters.coaches || []).length) {
    offersFiltered = offersFiltered.filter(
      (o) =>
        (filters.coaches.includes(o.activity.coach.id) && !o.coach_override) ||
        (o.coach_override && filters.coaches.includes(o.coach_override.id)),
    );
  }
  if ((filters.levels || []).length) {
    offersFiltered = offersFiltered.filter((o) =>
      filters.levels.includes(o.activity.level),
    );
  }
  if ((filters.metaActivities || []).length) {
    offersFiltered = offersFiltered.filter((o) =>
      filters.metaActivities.includes(o.activity.meta_activity.id),
    );
  }
  return offersFiltered;
};

export const isOfferLoading = (state: MarketPlaceState) =>
  state.offers.loading ||
  state.metaActivities.loading ||
  state.establishments.loading ||
  state.coaches.loading ||
  state.activities.loading;

export default {
  getOffers,
  isOfferLoading,
  getOffersFiltered,
};
