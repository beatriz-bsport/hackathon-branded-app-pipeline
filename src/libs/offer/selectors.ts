import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import memoize from 'memoize-one';
import { Moment } from '../../i18n';

import { getAllCoachesDict } from '../associated-coach/selectors';
import {
  getWorkshopActivitiesDict,
  getMetaActivityAbstractDict,
} from '../meta-activity/selectors';
import { getAllEstablishmentsDict } from '../establishment/selectors';
import themeSelectors from '../theme/selectors';
import { RootState } from '../../reducers';
import { Offer } from './types';
import { PaymentPack } from '../payment-packs/types';

const getState = (state: RootState) => state.offer;

const getAll = (state: RootState) => getState(state).offers;

export const getDetailedOffer = (state: RootState) =>
  getState(state).retrieve.data;

export const getOfferById = (state: RootState, id: number) =>
  getState(state).byId[id];

export const getBookedOffers = (state: RootState) =>
  getState(state).registered.allIds;

// this will remove the offers already ended simply
export const todayOffers = createSelector(getAll, (offers) =>
  offers.filter((offer: Offer) => {
    const momentDate = Moment();
    return (
      momentDate.isBefore(Moment(offer.date_start)) ||
      momentDate.isBetween(Moment(offer.date_start), Moment(offer.date_end))
    );
  }),
);

export const compatiblePacksWithOffer = (state: RootState) =>
  state.offer.compatiblePacks.items;

export const compatiblePacksWithOfferAndEnabled = createSelector(
  compatiblePacksWithOffer,
  (items) => items.filter((pp: PaymentPack) => !pp.disabled),
);

export const getOfferFromList = (state: RootState, ids: Array<number>) =>
  ids.map((id) => state.offer.byId[id]);

export const getSimilars = (state: RootState) =>
  state.offer.similarOffers.items;

export const withMetaActivity = memoize((selector: (state: RootState) => any) =>
  createSelector(
    [selector, getMetaActivityAbstractDict, getWorkshopActivitiesDict],
    (offers, metaActivityData, workshopData) => {
      if (!offers) return null;
      if (!Array.isArray(offers)) {
        return {
          ...offers,
          meta_activity:
            metaActivityData[offers.meta_activity] ||
            workshopData[offers.meta_activity],
        };
      }
      return offers.map((o) => ({
        ...o,
        meta_activity:
          metaActivityData[o.meta_activity] ||
          workshopData[o.meta_activity] ||
          o.meta_activity,
      }));
    },
  ),
);

export const withEstablishment = memoize(
  (selector: (state: RootState) => any) =>
    createSelector(
      [selector, getAllEstablishmentsDict],
      (offers, establishmentData) => {
        if (!offers) return null;
        if (!Array.isArray(offers)) {
          return {
            ...offers,
            establishment_override: offers.establishment_override
              ? establishmentData[offers.establishment_override] ||
                offers.establishment_override
              : null,
            establishment: establishmentData[offers.establishment],
          };
        }

        return offers
          .filter((o) => !!o)
          .map((o) => ({
            ...o,
            establishment_override: o.establishment_override
              ? establishmentData[o.establishment_override] ||
                o.establishment_override
              : null,
            establishment:
              establishmentData[o.establishment] || o.establishment,
          }));
      },
    ),
);

export const withSpecificCoach = memoize(
  (selector: (state: RootState) => any) =>
    createSelector([selector, getAllCoachesDict], (offers, coachData) => {
      if (!offers) return null;
      return {
        ...offers,
        coach: coachData[offers.coach.id] || offers.coach,
        coach_override: offers.coach_override
          ? coachData[
              typeof offers.coach_override === 'number'
                ? offers.coach_override
                : offers.coach_override.id
            ]
          : null,
      };
    }),
);

export const withCoach = memoize((selector: (state: RootState) => any) =>
  createSelector([selector, getAllCoachesDict], (offers, coachData) => {
    if (!offers) return null;
    if (!Array.isArray(offers)) {
      return {
        ...offers,
        coach: coachData[offers.coach] || offers.coach,
        coach_override: offers.coach_override
          ? coachData[offers.coach_override]
          : null,
      };
    }
    return offers.map((o) => ({
      ...o,
      coach: coachData[o.coach] || o.coach,
      coach_override: o.coach_override
        ? coachData[o.coach_override] || o.coach_override
        : null,
    }));
  }),
);

export const getEventsByMetaActivity = (state: RootState) =>
  state.offer.calendarByObject.metaActivity;

export const getEventsByEstablishment = (state: RootState) =>
  state.offer.calendarByObject.establishment;

export const getManagerFilters = (state: RootState) =>
  state.offer.managerFilter.filters;
export const getManagerFiltersOpen = (state: RootState) =>
  state.offer.managerFilter.open;

const _getOfferByDayIds = (state: RootState) => state.offer.byDay.allIds;
export const _getOfferData = (state: RootState) => state.offer.byId;

export const getOfferDataList = createSelector(_getOfferData, (offerData) =>
  Object.values(offerData),
);

export const getOffersByDay = createSelector(
  [_getOfferByDayIds, _getOfferData],
  (ids, data) => (ids || []).map((id) => data[id]),
);

export const getManagerOffersFiltered = createSelector(
  [getOffersByDay, getManagerFilters, themeSelectors.getTheme],
  (offers, filters, theme) => {
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
    if (filters.available === undefined) {
      if (!theme.show_cancelled_offers_manager) {
        offersFiltered = offersFiltered.filter((o) => o.available);
      }
    } else if (filters.available) {
      offersFiltered = offersFiltered.filter((o) => o.available);
    }
    return offersFiltered;
  },
);
export const getAvailableOffersFiltered = createSelector(
  [getOffersByDay, getManagerFilters],
  (offers, filters) => {
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
    if (filters.available === undefined) {
      offersFiltered = offersFiltered.filter((o) => o.available);
    } else if (filters.available) {
      offersFiltered = offersFiltered.filter((o) => o.available);
    }
    return offersFiltered;
  },
);

const _getMarketplaceIds = (state: RootState) => state.offer.marketplace.allIds;

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

const _getBookedGenderOffer = (state: RootState) =>
  state.offer.genderCount.byId;

export const withGender = memoize((selector: (State) => any) =>
  createSelector([selector, _getBookedGenderOffer], (offers, genderData) => {
    if (!offers) return null;
    if (!Array.isArray(offers)) {
      return {
        ...offers,
        female: genderData[offers.id].nb_booked_female,
        male: genderData[offers.id].nb_booked_male,
        other: genderData[offers.id].nb_booked_other,
      };
    }
    return offers.map((o) => {
      if (!genderData[o.id]) return o;
      return {
        ...o,
        female: genderData[o.id].nb_booked_female,
        male: genderData[o.id].nb_booked_male,
        other: genderData[o.id].nb_booked_other,
      };
    });
  }),
);

export const getOfferWithRelated = (state: RootState, id: number) => {
  return withMetaActivity(
    withCoach(
      withEstablishment((state_) => {
        const offer = _getOfferData(state_)[id];
        if (offer) return [offer];
        return [];
      }),
    ),
  )(state);
};

const _getOfferEventList = (state) => state.offer.calendar;
const periodFilterExtractor = (state, params, periodFilter) => periodFilter;

export const getOfferAsEventList = createSelector(
  [_getOfferEventList, periodFilterExtractor],
  (offerList, { start, end }) => {
    return offerList.filter(
      (o) =>
        moment(o.date_start).isSameOrBefore(moment(end), 'day') &&
        moment(o.date_start).isSameOrAfter(moment(start), 'day'),
    );
  },
);

export const getNumberOfMassDisabledOffer = (state: RootState) =>
  getState(state).numberOfMassDisabledOffer.number;

export default { getAll, todayOffers, getSimilars };
