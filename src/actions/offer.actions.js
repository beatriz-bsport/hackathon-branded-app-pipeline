// @flow

import { createAction } from 'redux-actions';
import moment from 'moment';
import api from '../api';
import type { Dispatch, OptionCallback } from '../state/types';

export const similarOffers = {
  isLoading: createAction('OFFERS/SIMILAR/IS_LOADING'),
  error: createAction('OFFERS/SIMILAR/ERROR'),
  success: createAction('OFFERS/SIMILAR/SUCCESS'),
};

export function fetchSimilarOffers(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(similarOffers.isLoading(true));
    dispatch(similarOffers.error(null));
    dispatch(similarOffers.success([]));
    try {
      const response = await api.offer.fetchSimilarOffers(offerId);
      dispatch(similarOffers.success(response.data));
    } catch (error) {
      dispatch(similarOffers.error(error));
    }
    dispatch(similarOffers.isLoading(false));
  };
}

export const offers = {
  isLoading: createAction('OFFERS/LIST/IS_LOADING'),
  error: createAction('OFFERS/LIST/ERROR'),
  success: createAction('OFFERS/LIST/SUCCESS'),
  delete: createAction('OFFERS/LIST/DELETE'),
};

export function deleteOffer(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(offers.delete(id));
    dispatch(offerByDay.delete(id));
  };
}

export const offersByMetaActivity = {
  isLoading: createAction('OFFERS/BY_META_ACTIVITY/IS_LOADING'),
  error: createAction('OFFERS/BY_META_ACTIVITY/ERROR'),
  success: createAction('OFFERS/BY_META_ACTIVITY/SUCCESS'),
};

export function fetchMetaActivityOffers(id: number, params: any = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(offersByMetaActivity.isLoading(true));
    dispatch(offersByMetaActivity.error(null));

    try {
      const response = await api.offer.fetchAllEvents({
        meta_activity: id,
        ...params,
      });
      dispatch(offersByMetaActivity.success(response.data));
    } catch (err) {
      dispatch(offersByMetaActivity.error(err));
    }
    dispatch(offersByMetaActivity.isLoading(false));
  };
}

export const offersByEstablishment = {
  isLoading: createAction('OFFERS/BY_ESTABLISHMENT/IS_LOADING'),
  error: createAction('OFFERS/BY_ESTABLISHMENT/ERROR'),
  success: createAction('OFFERS/BY_ESTABLISHMENT/SUCCESS'),
};

export function fetchEstablishmentEvents(id: number, params: any = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(offersByEstablishment.isLoading(true));
    dispatch(offersByEstablishment.error(null));

    try {
      const response = await api.offer.fetchAllEvents({
        establishment: id,
        ...params,
      });
      dispatch(offersByEstablishment.success(response.data));
    } catch (err) {
      dispatch(offersByEstablishment.error(err));
    }
    dispatch(offersByEstablishment.isLoading(false));
  };
}

export function fetchAllOffers(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(offers.isLoading(true));
    dispatch(offers.error(null));

    try {
      const response = await api.offer.fetchAllEvents(params);
      dispatch(offers.success(response.data));
    } catch (err) {
      dispatch(offers.error(err));
    }
    dispatch(offers.isLoading(false));
  };
}

export const compatiblePacks = {
  isLoading: createAction('OFFERS/COMPATIBLE_PACKS/IS_LOADING'),
  error: createAction('OFFERS/COMPATIBLE_PACKS/ERROR'),
  success: createAction('OFFERS/COMPATIBLE_PACKS/SUCCESS'),
};

export function fetchCompatiblePacks(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(compatiblePacks.isLoading(true));
    dispatch(compatiblePacks.error(null));
    dispatch(compatiblePacks.success([]));

    try {
      const response = await api.offer.fetchCompatiblePacks(offerId);
      dispatch(compatiblePacks.success(response.data));
    } catch (error) {
      dispatch(compatiblePacks.error(error));
    }
    dispatch(compatiblePacks.isLoading(false));
  };
}

export const offerByDay = {
  isLoading: createAction('OFFERS/DAY/IS_LOADING'),
  error: createAction('OFFERS/DAY/ERROR'),
  success: createAction('OFFERS/DAY/SUCCESS'),
  delete: createAction('OFFERS/DAY/DELETE'),
  reset: createAction('OFFER/DAY/RESET'),
};

export function refreshOffersByDay(
  day: {
    year: number,
    month: number,
    day: number,
  },
  options,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.error(null));
    try {
      const date = moment(`${day.year}-${day.month}-${day.day}`).format(
        'YYYY-MM-DD',
      );
      const response = await api.offer.fetchOffersByDay({ date });
      dispatch(offerByDay.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(offerByDay.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(offerByDay.isLoading(false));
  };
}

export function fetchOffersByDay(
  day: {
    year: number,
    month: number,
    day: number,
  },
  options,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.isLoading(true));
    dispatch(refreshOffersByDay(day, options));
  };
}

export const retrieveActions = {
  success: createAction('OFFER/RETRIEVE/SUCCESS'),
  error: createAction('OFFER/RETRIEVE/ERROR'),
  isLoading: createAction('OFFER/RETRIEVE/IS_LOADING'),
};

export function fetchOfferById(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));

    try {
      const response = await api.offer.fetchById(id);
      dispatch(retrieveActions.success(response.data));
    } catch (error) {
      dispatch(retrieveActions.error(error));
    }
    dispatch(retrieveActions.isLoading(false));
  };
}

export const offerWaitingListActions = {
  success: createAction('OFFER/UPDATE_WAITING_LIST/SUCCESS'),
  error: createAction('OFFER/UPDATE_WAITING_LIST/ERROR'),
  isLoading: createAction('OFFER/UPDATE_WAITING_LIST/IS_LOADING'),
};

export function toogleWaitingListFreeze(
  offerId: number,
  newFreezeState: boolean,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerWaitingListActions.isLoading(true));
    dispatch(offerWaitingListActions.error(null));
    try {
      const offer = await api.offer.toogleWaitingListFreeze(
        offerId,
        newFreezeState,
      );
      dispatch(offerWaitingListActions.success(offer));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(offerWaitingListActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(offerWaitingListActions.isLoading(false));
  };
}

export const offersFilterActions = {
  toogleOpen: createAction('OFFER/FILTER/TOOGLE_OPEN'),
  setFilters: createAction('OFFER/FILTER/SET_FILTER'),
};

export function toogleFilter() {
  return async (dispatch: Dispatch) => {
    dispatch(offersFilterActions.toogleOpen());
  };
}

export function setFilters(filters) {
  return async (dispatch: Dispatch) => {
    dispatch(offersFilterActions.setFilters(filters));
  };
}
