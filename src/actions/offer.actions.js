//@flow

import api from '../api';
import types from './offer.types';
import moment from 'moment';

export function fetchAllOffers() {
  return async (dispatch, getState) => {
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
