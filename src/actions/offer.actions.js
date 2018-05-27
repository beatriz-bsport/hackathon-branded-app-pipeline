//@flow

import api from '../api';
import types from './offer.types';

export function fetchAllOffers() {
  return async (dispatch) => {
    dispatch(startFetchAllOffers());

    try {
      const response = await api.offer.fetchAll();
      const offersFromServer = response.data.results;

      const offers = offersFromServer.map((o) => {
        return {
          ...o,
          title: o.name,
          start: new Date(o.date_start),
          end: new Date(o.date_end),
        };
      });
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
