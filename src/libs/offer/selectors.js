import { createSelector } from 'reselect';
import moment from 'moment';
import { Moment } from '../../i18n';

import { getAllCoachesDict } from '../associated-coach/selectors';
import { getMetaActivitiesDict } from '../meta-activity/selectors';
import { getAllEstablishmentsDict } from '../establishment/selectors';

const getState = (state) => state.offer;

const getAll = (state) => getState(state).offers;

export const getDetailedOffer = (state) => getState(state).retrieve.data;

// this will remove the offers already ended simply
export const todayOffers = createSelector(
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

export const withMetaActivity = (selector) =>
  createSelector(
    [selector, getMetaActivitiesDict],
    (offers, metaActivityData) =>
      offers.map((o) => ({
        ...o,
        meta_activity: metaActivityData[o.meta_activity] || o.meta_activity,
      })),
  );

export const withEstablishment = (selector) =>
  createSelector(
    [selector, getAllEstablishmentsDict],
    (offers, establishmentData) =>
      offers.map((o) => ({
        ...o,
        establishment_override: o.establishment_override
          ? establishmentData[o.establishment_override] ||
            o.establishment_override
          : null,
        establishment: establishmentData[o.establishment] || o.establishment,
      })),
  );

export const withCoach = (selector) =>
  createSelector(
    [selector, getAllCoachesDict],
    (offers, coachData) =>
      offers.map((o) => ({
        ...o,
        coach: coachData[o.coach] || o.coach,
        coach_override: o.coach_override
          ? coachData[o.coach_override] || o.coach_override
          : null,
      })),
  );

export const getSimilars = createSelector(
  [
    _getSimilars,
    getAllCoachesDict,
    getMetaActivitiesDict,
    getAllEstablishmentsDict,
  ],
  (offers, coachData, metaActivityData, establishmentData) => {
    return offers
      .map((o) => ({
        ...o,
        establishment_override: o.establishment_override
          ? establishmentData[o.establishment]
          : null,
        establishment: establishmentData[o.establishment],
        coach: coachData[o.coach],
        coach_override: o.coach_override ? coachData[o.coach_override] : null,
        meta_activity: metaActivityData[o.meta_activity],
      }))
      .filter(
        (o) => o.activity && o.establishment && o.coach && o.meta_activity,
      );
  },
);

export const getEventsByMetaActivity = (state) =>
  state.offer.calendarByObject.metaActivity;

export const getEventsByEstablishment = (state) =>
  state.offer.calendarByObject.establishment;

export const getManagerFilters = (state) => state.offer.managerFilter.filters;
export const getManagerFiltersOpen = (state) => state.offer.managerFilter.open;

const _getOfferByDayIds = (state) => state.offer.byDay.allIds;
const _getOfferData = (state) => state.offer.byId;

export const getOffersByDay = createSelector(
  [_getOfferByDayIds, _getOfferData],
  (ids, data) => (ids || []).map((id) => data[id]),
);

export const getManagerOffersFiltered = createSelector(
  [getOffersByDay, getManagerFilters, getManagerFiltersOpen],
  (offers, filters, open) => {
    if (!open) return offers;
    let offersFiltered = offers;
    if ((filters.establishments || []).length) {
      offersFiltered = offersFiltered.filter(
        (o) =>
          (filters.establishments.includes(o.establishment) &&
            !o.establishment_override) ||
          (o.establishment_override &&
            filters.establishments.includes(o.establishment_override)),
      );
    }
    if ((filters.coaches || []).length) {
      offersFiltered = offersFiltered.filter(
        (o) =>
          (filters.coaches.includes(o.coach) && !o.coach_override) ||
          (o.coach_override && filters.coaches.includes(o.coach_override)),
      );
    }
    if ((filters.levels || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.levels.includes(o.level),
      );
    }
    if ((filters.metaActivities || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.metaActivities.includes(o.meta_activity),
      );
    }
    return offersFiltered;
  },
);

const _getMarketplaceIds = (state) => state.offer.marketplace.allIds;

export const getMarketplaceOfferList = createSelector(
  [_getOfferData, _getMarketplaceIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getListCalendarOfferFromNow = createSelector(
  [_getOfferData, _getMarketplaceIds],
  (data, ids) =>
    ids
      .map((id) => data[id])
      .filter((o) => moment(o.date_start).isSameOrAfter(moment())),
);

export default { getAll, todayOffers, getSimilars };
