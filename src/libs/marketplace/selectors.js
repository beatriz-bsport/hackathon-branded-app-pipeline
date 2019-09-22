// @flow
//
/* eslint-disable */
import _ from 'lodash';
import type { State } from '../../state/types';
import { createSelector } from 'reselect';
import moment from 'moment';

const _getOffers = (state: State) => state.marketplacev2.offers.items;

const getActivities = (state: State) => state.marketplacev2.activities.items;

const getEstablishments = (state: State) =>
  state.marketplacev2.establishments.items;

const getCoaches = (state: State) => state.marketplacev2.coaches.items;

const getMetaActivities = (state: State) =>
  state.marketplacev2.metaActivities.items;

export const getWorkshops = (state: State) =>
  state.marketplacev2.metaActivities.items.filter(
    (ma) => ma.is_workshop === true,
  );

export const getOffers = createSelector(
  [_getOffers, getEstablishments, getActivities, getMetaActivities, getCoaches],
  (_offers, establishments, _activities, metaActivities, coaches) => {
    const activities = _activities.map((a) => ({
      ...a,
      coach: coaches.find((c) => c.id === a.coach),
      establishment: establishments.find((e) => e.id === a.establishment),
      meta_activity: metaActivities.find((ma) => ma.id === a.meta_activity),
    }));
    return _offers
      .map((o) => ({
        ...o,
        coach_override: o.coach_override
          ? coaches.find((c) => c.id === o.coach_override)
          : null,
        establishment_override: o.establishment_override
          ? establishments.find((e) => e.id === e.establishment_override)
          : null,
        activity: activities.find((a) => a.id === o.activity),
      }))
      .filter(
        (o) =>
          o.activity &&
          o.activity.establishment &&
          o.activity.coach &&
          o.activity.meta_activity,
      );
  },
);

export const getOffersFiltered = (state: State, filters: *) => {
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

export const getOffersWorkshop = (state: State) =>
  getOffers(state)
    .filter(
      (o) =>
        o.available &&
        o.activity &&
        o.activity.meta_activity &&
        o.activity.meta_activity.is_workshop,
    )
    .filter((o) => moment(o.date_start).isSameOrAfter(moment()));

export const getPaymentPacks = (state: State) =>
  state.marketplacev2.paymentPack.items
    .map((pp) => ({
      ...pp,
      metaActivities: (pp.metaActivities || []).map((ma) =>
        state.marketplacev2.metaActivities.items.find((m) => m.id === ma),
      ),
      establishments: (pp.establishments || []).map((ma) =>
        state.marketplacev2.establishments.items.find((m) => m.id === ma),
      ),
      categories: (pp.categories || []).map((c) =>
        state.category.SCTs.find((sct) => sct.id === c),
      ),
    }))
    .filter(
      (pp) =>
        !pp.establishments.includes(null) &&
        !pp.metaActivities.includes(null) &&
        !pp.categories.includes(null),
    );

export const getOffersEstablishments = (state: State) => {
  const filtredOffers = getOffers(state) || [];
  return (getEstablishments(state) || []).filter((e) =>
    filtredOffers.find(
      (o) => (o.activity.establishment || o.establishment_override).id === e.id,
    ),
  );
};

export const getOffersCoaches = (state: State) => {
  const filtredOffers = getOffers(state) || [];
  return (getCoaches(state) || []).filter((c) =>
    filtredOffers.find(
      (o) => (o.activity.coach || o.coach_override).id === c.id,
    ),
  );
};

export const getOffersMetaActivities = (state: State) => {
  const filtredOffers = getOffers(state) || [];
  return (getMetaActivities(state) || []).filter((ma) =>
    filtredOffers.find((o) => o.activity.meta_activity.id === ma.id),
  );
};

export const isMarketplaceLoading = (state: State) =>
  state.marketplacev2.metaActivities.loading ||
  state.marketplacev2.establishments.loading ||
  state.marketplacev2.coaches.loading ||
  state.marketplacev2.activities.loading;

export const isOfferLoading = (state: State) =>
  state.marketplacev2.offers.loading ||
  state.marketplacev2.metaActivities.loading ||
  state.marketplacev2.establishments.loading ||
  state.marketplacev2.coaches.loading ||
  state.marketplacev2.activities.loading;

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
