import groupBy from 'lodash/groupBy';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { DateTime } from 'luxon';
import memoize from 'memoize-one';
import { getGroupOffersStatusById } from '#src/libs/group-offer/selectors';
import { getAllTagsWithTagGroup } from '../tag/selectors';

import { getAllCoachesDict, getCoach } from '../associated-coach/selectors';
import {
  getWorkshopActivitiesDict,
  getMetaActivitiesDict,
  getMetaActivityAbstractDict,
  getMetaActivity,
} from '../meta-activity/selectors';
import {
  getAllEstablishmentsDict,
  getEstablishment,
} from '../establishment/selectors';
import themeSelectors from '../theme/selectors';
import { RootState } from '../../reducers';
import { Offer } from './types';
import { PaymentPack } from '../payment-packs/types';
import { getUserPreferencesCalendarFilter } from '../user-preference/selectors';
import { marketplaceByMetaActivityEmptyState } from './reducers';

const getState = (state: RootState) => state.offer;

// @ts-expect-error
const getAll = (state: RootState) => getState(state).offers;

export const getRetrieveOfferLoading = (state: RootState) =>
  state.offer.retrieve.loading;

export const getOfferCalendarState = (state: RootState) =>
  getState(state).paginatedCalendar;

export const getOfferCalendarStateData = (state: RootState) =>
  getOfferCalendarState(state).results;
export const getDetailedOffer = (state: RootState) =>
  getState(state).retrieve.data;

export const getOfferById = (state: RootState, id: number) =>
  getState(state).byId[id];

export const getBookedOffers = (state: RootState) =>
  getState(state).registered.allIds;

// this will remove the offers already ended simply
export const todayOffers = createSelector(getAll, (offers) =>
  offers.filter((offer: Offer) => {
    const momentDate = DateTime.now();
    return momentDate < DateTime.fromISO(offer.date_end);
  }),
);

export const compatiblePacksWithOffer = (state: RootState) =>
  state.offer.compatiblePacks.items;

export const compatiblePacksWithOfferAndEnabled = createSelector(
  compatiblePacksWithOffer,
  (paymentPackList) =>
    paymentPackList.filter(
      (paymentPack: PaymentPack) =>
        !paymentPack.disabled && paymentPack.is_usable_by_staff,
    ),
);

export const getOfferFromList = (state: RootState, ids: Array<number>) =>
  ids.map((id) => state.offer.byId[id]);

export const getSimilars = (state: RootState) =>
  state.offer.similarOffers.items;

export const getSimilarsPage = (state: RootState) =>
  // @ts-expect-error
  state.offer.similarOffers.page;

export const getSimilarsCount = (state: RootState) =>
  state.offer.similarOffers.count;

export const withMetaActivity = memoize(
  (selector: (state: RootState, offerId?: number | number[]) => any) =>
    createSelector(
      [selector, getMetaActivityAbstractDict, getWorkshopActivitiesDict],
      (offers, metaActivityData, workshopData) => {
        if (!offers) return null;
        if (!Array.isArray(offers)) {
          return {
            ...offers,
            meta_activity:
              metaActivityData[offers.meta_activity] ||
              // @ts-expect-error
              workshopData[offers.meta_activity],
          };
        }
        return offers.map((o) => ({
          ...o,
          meta_activity:
            metaActivityData[o.meta_activity] ||
            // @ts-expect-error
            workshopData[o.meta_activity] ||
            o.meta_activity,
        }));
      },
    ),
);

export const withEstablishment = memoize(
  (selector: (state: RootState, offerId?: number | number[]) => any) =>
    createSelector(
      [selector, getAllEstablishmentsDict],
      (offers, establishmentData) => {
        if (!offers) return null;
        if (!Array.isArray(offers)) {
          return {
            ...offers,
            establishment: establishmentData[offers.establishment],
          };
        }

        return offers
          .filter((o) => !!o)
          .map((o) => ({
            ...o,
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
        coach: coachData[offers.coach?.id] ?? offers.coach,
        coach_override: offers.coach_override
          ? coachData[
              typeof offers.coach_override === 'number'
                ? offers.coach_override
                : offers.coach_override.id
            ] || offers.coach_override
          : null,
      };
    }),
);

export const withCoach = memoize(
  (selector: (state: RootState, ids?: number[]) => any) =>
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

export const getOffersDataByMetaActivity = (state: RootState, id: number) => {
  if (state.offer.marketplace.byMetaActivity[id]) {
    return state.offer.marketplace.byMetaActivity[id];
  }
  return marketplaceByMetaActivityEmptyState;
};

export const getOfferDataList = createSelector(_getOfferData, (offerData) =>
  Object.values(offerData),
);

export const getOffersByDay = createSelector(
  [_getOfferByDayIds, _getOfferData],
  (ids, data) => (ids ?? []).map((id) => data[id]),
);

export const withTags = memoize((selector: (state: RootState) => any) =>
  createSelector([selector, getAllTagsWithTagGroup], (offerObject, tagList) => {
    if (!offerObject) return null;
    const tagListById = groupBy(tagList, 'id');
    if (!Array.isArray(offerObject)) {
      return {
        ...offerObject,
        blacklist_tags: offerObject?.blacklist_tags
          // @ts-expect-error
          ?.map((id) => tagListById?.[id]?.[0])
          // @ts-expect-error
          .filter((tag) => tag),
        whitelist_tags: offerObject?.whitelist_tags
          // @ts-expect-error
          .map((id) => tagListById?.[id]?.[0])
          // @ts-expect-error
          .filter((tag) => tag),
      };
    }

    return offerObject.map((_off) => ({
      ..._off,
      blacklist_tags: _off?.blacklist_tags
        ?.map((id: number) => tagListById?.[id]?.[0])
        .filter((tag: number) => tag),
      whitelist_tags: _off?.whitelist_tags
        ?.map((id: number) => tagListById?.[id]?.[0])
        .filter((tag: number) => tag),
    }));
  }),
);

export const getManagerOffersFiltered = createSelector(
  [
    getOffersByDay,
    getManagerFilters,
    themeSelectors.getTheme,
    getUserPreferencesCalendarFilter,
  ],
  (offers, filters, theme, userCalendarFilter) => {
    let offersFiltered = offers;
    if ((filters.establishments ?? []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.establishments.includes(o.establishment),
      );
    }
    if ((filters.coaches ?? []).length) {
      offersFiltered = offersFiltered.filter(
        (o) =>
          (filters.coaches.includes(o.coach) && !o.coach_override) ||
          (o.coach_override && filters.coaches.includes(o.coach_override)),
      );
    }
    if ((filters.levels ?? []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.levels.includes(o.level),
      );
    }
    // @ts-expect-error
    if ((filters.metaActivities ?? []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        // @ts-expect-error
        filters.metaActivities.includes(o.meta_activity),
      );
    }
    if (userCalendarFilter.available === undefined) {
      if (!theme.show_cancelled_offers_manager) {
        offersFiltered = offersFiltered.filter((o) => o.available);
      }
    } else if (userCalendarFilter.available) {
      offersFiltered = offersFiltered.filter((o) => o.available);
    }
    return offersFiltered;
  },
);
export const getAvailableOffersFiltered = createSelector(
  [getOffersByDay, getManagerFilters],
  (offers, filters) => {
    let offersFiltered = offers;
    if ((filters.establishments ?? []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.establishments.includes(o.establishment),
      );
    }
    if ((filters.coaches ?? []).length) {
      offersFiltered = offersFiltered.filter(
        (o) =>
          (filters.coaches.includes(o.coach) && !o.coach_override) ||
          (o.coach_override && filters.coaches.includes(o.coach_override)),
      );
    }
    if ((filters.levels ?? []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.levels.includes(o.level),
      );
    }
    // @ts-expect-error
    if ((filters.metaActivities ?? []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        // @ts-expect-error
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
      .filter((o) => DateTime.fromISO(o.date_start) >= DateTime.now()),
);

export const getBookedGenderOffer = (state: RootState) =>
  state.offer.genderCount.byId;

// @ts-expect-error
export const withGender = memoize((selector: (State) => any) =>
  createSelector([selector, getBookedGenderOffer], (offers, genderData) => {
    if (!offers) return null;
    if (!Array.isArray(offers)) {
      return {
        ...offers,
        female: genderData[offers.id]?.nb_booked_female,
        male: genderData[offers.id]?.nb_booked_male,
        other: genderData[offers.id]?.nb_booked_other,
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

const _getOfferEventList = (state: RootState) => state.offer.calendar;
// @ts-expect-error
const periodFilterExtractor = (state, params, periodFilter) => periodFilter;

export const getOfferAsEventList = createSelector(
  [
    _getOfferEventList,
    periodFilterExtractor,
    getMetaActivitiesDict,
    getWorkshopActivitiesDict,
  ],
  (offerList, { start, end }, metaActivityData, workshopData) => {
    return offerList
      .filter(
        (o) =>
          DateTime.fromISO(o.date_start).startOf('day') <=
            DateTime.fromISO(end).startOf('day') &&
          DateTime.fromISO(o.date_start).startOf('day') >=
            DateTime.fromISO(start).startOf('day'),
      )
      .map((o) =>
        Immutable({
          ...o,
          meta_activity:
            metaActivityData[o.meta_activity] ||
            // @ts-expect-error
            workshopData[o.meta_activity] ||
            o.meta_activity,
        }),
      );
  },
);

export const getNumberOfMassDisabledOffer = (state: RootState) =>
  getState(state).numberOfMassDisabledOffer.number;

export const getMassDisabledOfferInGroupIds = (state: RootState) =>
  getState(state).numberOfMassDisabledOfferInGroup.allIds;

export const getMassDisabledOfferInGroup = createSelector(
  [getMassDisabledOfferInGroupIds, _getOfferData],
  (ids, data) => (ids ?? []).map((id) => data[id]),
);
export const getNextAvailableOffer = (state: RootState) =>
  getState(state).next.item;

export const getByMetactivity = (state: RootState) =>
  state.offer.marketplace?.byMetaActivity;

export default { getAll, todayOffers, getSimilars };

export const getRetrieveOffer = (state: RootState) =>
  getState(state).retrieve.data;

export const getOffersListByMetaActivity = createCachedSelector(
  [getOffersDataByMetaActivity, _getOfferData],
  (offerState, offersData) => {
    return {
      ...offerState,
      items: (offerState.allIds ?? []).map((id) => offersData[id]),
    };
  },
)((state: RootState, metaActivityId: number) => metaActivityId);

export const getOffersDataByGroup = (state: RootState, id: number) => {
  // @ts-expect-error
  return state.offer.groups?.[id] ?? { allIds: [] };
};

export const getOffersListByGroup = createCachedSelector(
  [getOffersDataByGroup, _getOfferData],
  (offerState, offersData) => {
    return offerState.allIds.map((id) => offersData[id]);
  },
)((state: RootState, groupId: number) => groupId);

export const getBookableStatusData = (state: RootState) =>
  state.offer.offerStatus.byId;

export const getOfferBookableStatus = createSelector(
  [getBookableStatusData, (_: RootState, offerId: number) => offerId],
  (bookableStatusData, offerId) => bookableStatusData[offerId]?.bookable_status,
);

export const withBookableStatus = memoize(
  (selector: (state: RootState) => any) =>
    createSelector(
      [selector, getBookableStatusData, getGroupOffersStatusById],
      (offers, bookableStatusData, groupBookableStatusData) => {
        if (!offers) return null;
        if (!Array.isArray(offers)) {
          return {
            ...offers,
            bookableStatus: bookableStatusData[offers.id],
          };
        }

        return offers.map((o) => ({
          ...o,
          bookableStatus:
            groupBookableStatusData[o.group]?.[o.id] ??
            bookableStatusData?.[o.id],
        }));
      },
    ),
);

export const getBookingGuestNumberLeft = (state: RootState) => {
  return state.offer.bookingGuest?.bookingGuestNumberLeft;
};

const selectOfferWithPendingReplacementRequest = (state: RootState) =>
  state.offer.hasPendingReplacementRequest.byOfferId;

export const getOfferHasPendingReplacementRequest = createSelector(
  [selectOfferWithPendingReplacementRequest],
  (offers) => {
    return (offerId: number): boolean => offers[offerId] ?? false;
  },
);

export const getOfferHasRefusedReplacementRequest =
  (state: RootState) =>
  (offerId: number): boolean =>
    state.offer?.hasRefusedReplacementRequest?.byOfferId[offerId] ?? false;

export const getOfferstatusWaitingListState = (state: RootState) =>
  state.offer.offerStatusWaitinglistPosition;

export const getOfferStatusWaitingListPositionById = (state: RootState) =>
  getOfferstatusWaitingListState(state).byId;

export const getOfferId = (_: RootState, id: number) => id;
export const getOfferIds = (_: RootState, ids: number[]) => ids;

export const getOfferStatusWaitingListPosition = createSelector(
  [getOfferStatusWaitingListPositionById, getOfferId],
  (offerStatusWaitingListpositionById, offerId) => {
    return offerStatusWaitingListpositionById[offerId] ?? {};
  },
);

export const getOfferStatusWaitingListPositionList = createSelector(
  [getOfferStatusWaitingListPositionById, getOfferIds],
  (offerStatusWaitingListpositionById, offerIds) => {
    return offerIds.map((id) => offerStatusWaitingListpositionById[id] ?? {});
  },
);

const getOfferMetaActivity = (state: RootState, offerId: number) => {
  const offer = getOfferById(state, offerId);
  return offer ? getMetaActivity(state, offer.meta_activity) : null;
};

const getOfferEtablishment = (state: RootState, offerId: number) => {
  const offer = getOfferById(state, offerId);
  if (!offer) return null;
  return getEstablishment(state, offer.establishment);
};

const getOfferCoach = (state: RootState, offerId: number) => {
  const offer = getOfferById(state, offerId);
  if (!offer) return null;
  return offer.coach_override
    ? getCoach(state, offer.coach_override)
    : getCoach(state, offer.coach);
};

/**
 * Selects and constructs an offer object enriched with associated details for Google Analytics tracking.
 * The selector retrieves details such as meta activity, establishment, and coach related to a specific offer.
 * Note: This selector is designed for use in the context of Google Analytics.
 *
 * @param {RootState} state - The Redux root state.
 * @param {number} offerId - The unique identifier of the offer to retrieve details for.
 * @returns {Object | null} An offer object enriched with associated details like meta activity, establishment, and coach, or null if data is not available.
 */
export const getOfferForAnalytics = createSelector(
  [getOfferById, getOfferMetaActivity, getOfferEtablishment, getOfferCoach],
  (offer, offerMetaActivity, offerEstablishment, offerCoach) => {
    if (!offer || !offerMetaActivity || !offerEstablishment || !offerCoach)
      return null;
    return {
      ...offer,
      meta_activity: offerMetaActivity,
      establishment: offerEstablishment,
      coach: offerCoach,
    };
  },
);

const getSimilarOffersState = (state: RootState) =>
  state.offer.similarOffersReworked;

/**
 * The similar offers endpoint includes the reference offer in the response.
 * `${API_V1_URI}/offer/${referenceOfferId}/similars/
 * However this selector returns the count of similar offers that are different
 * from the reference offer, hence the -1.
 *
 * @param {RootState} state - The Redux root state.
 * @returns {number} - The number of similar offers, distinct from the reference one.
 */
export const getSimilarOffersReworkedCount = (state: RootState) =>
  Math.max(getSimilarOffersState(state).count - 1, 0);

export const getSimilarOffersReworkedIsLoading = (state: RootState) =>
  getSimilarOffersState(state).loading;

export const getSimilarOffersReworkedNextPage = (state: RootState) =>
  getSimilarOffersState(state).next_page;

export const getSimilarOffersReworkedCurrentPage = (state: RootState) =>
  getSimilarOffersState(state).page;

export const getSimilarOffersReworkedPreviousPage = (state: RootState) =>
  getSimilarOffersState(state).previous_page;

export const getSimilarOffersReworkedAllIds = (state: RootState) =>
  getSimilarOffersState(state).offers.allIds;

export const getSimilarOffersReworkedById = (state: RootState) =>
  getSimilarOffersState(state).offers.byId;

export const getSimilarOffersReworkedByIdList = createSelector(
  [getSimilarOffersReworkedAllIds, getSimilarOffersReworkedById],
  (ids, data) => {
    return ids.map((id) => data[id]).filter((_offer) => !!_offer);
  },
);
