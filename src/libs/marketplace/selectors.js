// @flow
//
/* eslint-disable */
import _ from 'lodash';
import type { State } from '../../state/types';
import { createSelector } from 'reselect';
import moment from 'moment';

const _getOffers = (state: State) => state.marketplacev2.offers.items;

const getEstablishments = (state: State) =>
  state.marketplacev2.establishments.items;

const getCoaches = (state: State) => state.marketplacev2.coaches.items;

const getMetaActivities = (state: State) =>
  state.marketplacev2.metaActivities.items;

const _getPaymentPacks = (state: State) =>
  state.marketplacev2.paymentPack.items;

const getCategories = (state: State) => state.category.SCTs;

export const getWorkshops = createSelector(
  getMetaActivities,
  (metaActivities) => metaActivities.filter((ma) => ma.is_workshop === true),
);

export const getOffers = createSelector(
  [_getOffers, getEstablishments, getMetaActivities, getCoaches],
  (_offers, establishments, metaActivities, coaches) => {
    return _offers
      .map((o) => ({
        ...o,
        coach_override: o.coach_override
          ? coaches.find((c) => c.id === o.coach_override)
          : null,
        establishment_override: o.establishment_override
          ? establishments.find((e) => e.id === e.establishment_override)
          : null,
        coach: coaches.find((c) => c.id === o.coach),
        establishment: establishments.find((e) => e.id === o.establishment),
        meta_activity: metaActivities.find((ma) => ma.id === o.meta_activity),
      }))
      .filter(
        (o) =>
          (o.establishment_override || o.establishment) &&
          (o.coach_override || o.coach) &&
          o.meta_activity,
      );
  },
);

export const getOffersFiltered = (state: State, filters: *) => {
  let offersFiltered = getOffers(state);
  if ((filters.establishments || []).length) {
    offersFiltered = offersFiltered.filter(
      (o) =>
        (filters.establishments.includes(o.establishment.id) &&
          !o.establishment_override) ||
        (o.establishment_override &&
          filters.establishments.includes(o.establishment_override.id)),
    );
  }
  if ((filters.coaches || []).length) {
    offersFiltered = offersFiltered.filter(
      (o) =>
        (filters.coaches.includes(o.coach.id) && !o.coach_override) ||
        (o.coach_override && filters.coaches.includes(o.coach_override.id)),
    );
  }
  if ((filters.levels || []).length) {
    offersFiltered = offersFiltered.filter((o) =>
      filters.levels.includes(o.level),
    );
  }
  if ((filters.metaActivities || []).length) {
    offersFiltered = offersFiltered.filter((o) =>
      filters.metaActivities.includes(o.meta_activity.id),
    );
  }
  return offersFiltered;
};

export const getOffersWorkshop = createSelector(
  getOffers,
  (offers) =>
    offers
      .filter(
        (o) => o.available && o.meta_activity && o.meta_activity.is_workshop,
      )
      .filter((o) => moment(o.date_start).isSameOrAfter(moment())),
);

export const getPaymentPacks = createSelector(
  [_getPaymentPacks, getMetaActivities, getEstablishments, getCategories],
  (paymentPacks, _metaActivities, _establishments, _categories) =>
    paymentPacks
      .map((pp) => ({
        ...pp,
        metaActivities: (pp.metaActivities || []).map((ma) =>
          _metaActivities.find((m) => m.id === ma),
        ),
        establishments: (pp.establishments || []).map((ma) =>
          _establishments.find((m) => m.id === ma),
        ),
        categories: (pp.categories || []).map((c) =>
          _categories.find((sct) => sct.id === c),
        ),
      }))
      .filter(
        (pp) =>
          !pp.establishments.includes(null) &&
          !pp.metaActivities.includes(null) &&
          !pp.categories.includes(null),
      ),
);

export const getOffersEstablishments = createSelector(
  [getOffers, getEstablishments],
  (filtredOffers, establishments) => {
    return (establishments || []).filter((e) =>
      filtredOffers.find(
        (o) => (o.establishment || o.establishment_override).id === e.id,
      ),
    );
  },
);

export const getOffersCoaches = createSelector(
  [getOffers, getCoaches],
  (filtredOffers, coaches) => {
    return (coaches || []).filter((c) =>
      filtredOffers.find((o) => (o.coach || o.coach_override).id === c.id),
    );
  },
);

export const getOffersMetaActivities = createSelector(
  [getOffers, getMetaActivities],
  (filtredOffers, metaActivities) => {
    return (metaActivities || []).filter((ma) =>
      filtredOffers.find((o) => o.meta_activity.id === ma.id),
    );
  },
);

export const isMarketplaceLoading = (state: State) =>
  state.marketplacev2.metaActivities.loading ||
  state.marketplacev2.establishments.loading ||
  state.marketplacev2.coaches.loading;

export const isOfferLoading = (state: State) =>
  state.marketplacev2.offers.loading ||
  state.marketplacev2.metaActivities.loading ||
  state.marketplacev2.establishments.loading ||
  state.marketplacev2.coaches.loading;

export default {
  getOffers,
  isOfferLoading,
  getOffersFiltered,
  getWorkshops,
  getOffersWorkshop,
  getOffersEstablishments,
  getOffersCoaches,
  getOffersMetaActivities,
};
