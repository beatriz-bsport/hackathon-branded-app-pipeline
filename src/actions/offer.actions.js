//@flow

import api from '../api';
import types from './offer.types';
import moment from 'moment';

export function fetchAllOffers() {
  return async (dispatch) => {
    dispatch(startFetchAllOffers());

    try {
      const response = await api.offer.fetchAllOffers();
      const offersFromServer = response.data;
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
