import { createSelector } from 'reselect';
import { Moment } from '../../i18n';

import { getAllCoaches } from '../associated-coach/selectors';
import { getMetaActivities } from '../meta-activity/selectors';
import { getAllEstablishments } from '../establishment/selectors';

const getState = (state) => state.offer;

const getAll = (state) => getState(state).offers;

const get = (state, id) => getState(state).offers.find((o) => o.id === id);

// this will remove the offers already ended simply
const todayOffers = createSelector(
  getAll,
  (offers) =>
    offers.filter((offer) => {
      const momentDate = Moment();
      return (
        momentDate.isBefore(Moment(offer.date_start)) ||
        momentDate.isBetween(Moment(offer.date_start), Moment(offer.date_end))
      );
    }),
);

export const compatiblePacksWithOffer = (state) =>
  state.offer.compatiblePacks.items;

export const compatiblePacksWithOfferAndEnabled = createSelector(
  compatiblePacksWithOffer,
  (items) => items.filter((pp) => !pp.disabled),
);

export const _getSimilars = (state) => state.offer.similarOffers.items;

export const getSimilars = createSelector(
  [_getSimilars, getAllCoaches, getMetaActivities, getAllEstablishments],
  (offers, coaches, metaActivities, establishments) => {
    return offers
      .map((o) => ({
        ...o,
        coach_override: o.coach_override
          ? coaches.find((c) => c.id === o.coach_override)
          : null,
        establishment_override: o.establishment_override
          ? establishments.find((e) => e.id === e.establishment_override)
          : null,
        meta_activity: metaActivities.find((ma) => ma.id === o.meta_activity),
        establishment: establishments.find((e) => e.id === o.establishment),
        coach: coaches.find((c) => c.id === o.coach),
      }))
      .filter(
        (o) => o.activity && o.establishment && o.coach && o.meta_activity,
      );
  },
);

export const getEventsByMetaActivity = (state) =>
  state.offer.calendarByObject.metaActivity;

const getManagerOffers = (state) => state.offer.offers;

export const getManagerFilters = (state) => state.offer.managerFilter.filters;
export const getManagerFiltersOpen = (state) => state.offer.managerFilter.open;

export const getManagerOffersFiltered = createSelector(
  [getManagerOffers, getManagerFilters, getManagerFiltersOpen],
  (offers, filters, open) => {
    if (!open) return offers;
    let offersFiltered = offers;
    if ((filters.establishments || []).length) {
      offersFiltered = offersFiltered.filter(
        (o) =>
          (filters.establishments.includes(o.etablissement.id) &&
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
        filters.levels.includes(o.level_id),
      );
    }
    if ((filters.metaActivities || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.metaActivities.includes(o.meta_activity_id),
      );
    }
    return offersFiltered;
  },
);

export default { get, getAll, todayOffers, getSimilars };
