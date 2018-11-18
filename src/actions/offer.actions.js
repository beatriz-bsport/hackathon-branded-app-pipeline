import api from '../api';
import types from './offer.types';

export function fetchAllOffers() {
  return async (dispatch) => {
    /*
    if (getState().offer.loading) {
      return dispatch(offerAlreadyLoading());
    }
    */
    dispatch(startFetchAllOffers());

    try {
      const response = await api.offer.fetchAllEvents();
      const offers = response.data;
      dispatch(fetchedAllOffers(offers));
    } catch (err) {
      dispatch(errorFetchingAllOffers());
    }
  };
}

export function fetchedAllOffers(offers) {
  return { type: types.HAS_FETCHED_ALL_OFFERS, offers };
}
export function startFetchAllOffers() {
  return { type: types.START_FETCH_ALL_OFFERS };
}

export function errorFetchingAllOffers() {
  return { type: types.ERROR_FETCHING_ALL_OFFERS };
}
export function offerAlreadyLoading() {
  return { type: types.OFFER_ALREADY_LOADING };
}

export function fetchCompatiblePacks(offerId) {
  return async (dispatch) => {
    /*
    if (getState().offer.loading) {
      return dispatch(offerAlreadyLoading());
    }
    */
    dispatch(startFetchCompatiblePacks());

    try {
      const response = await api.offer.fetchCompatiblePacks(offerId);
      const compatiblePacks = response.data;
      dispatch(fetchedCompatiblePacks(compatiblePacks));
    } catch (err) {
      dispatch(errorFetchingCompatiblePacks());
    }
  };
}

export function fetchedCompatiblePacks(compatiblePacks) {
  return { type: types.HAS_FETCHED_OFFER_COMPATIBLE_PACKS, compatiblePacks };
}
export function startFetchCompatiblePacks() {
  return { type: types.START_FETCH_OFFER_COMPATIBLE_PACKS };
}

export function errorFetchingCompatiblePacks() {
  return { type: types.ERROR_FETCHING_OFFER_COMPATIBLE_PACKS };
}

export function fetchOffersByDay({ year, month, day }) {
  return async (dispatch) => {
    dispatch(startFetchDetailedOffers());

    try {
      const response = await api.offer.fetchOffersByDay({ year, month, day });
      const offers = response.data;
      dispatch(fetchedDetailed(offers));
    } catch (err) {
      dispatch(errorFetchingDetailedOffers());
    }
  };
}

export function fetchedDetailed(offers) {
  return { type: types.HAS_FETCHED_DETAILED_OFFERS, offers };
}
export function startFetchDetailedOffers() {
  return { type: types.START_FETCH_DETAILED_OFFERS };
}

export function errorFetchingDetailedOffers() {
  return { type: types.ERROR_FETCHING_DETAILED_OFFERS };
}
