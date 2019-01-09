// @flow

import { createAction } from 'redux-actions';

import api from '../api';
import type { Dispatch } from '../state/types';

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

export function fetchAllOffers() {
  return async (dispatch: Dispatch) => {
    dispatch(offers.isLoading(true));
    dispatch(offers.error(null));

    try {
      const response = await api.offer.fetchAllEvents();
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
};

export function fetchOffersByDay(day: {
  year: number,
  month: number,
  day: number,
}) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.isLoading(true));
    dispatch(offerByDay.error(null));

    try {
      const response = await api.offer.fetchOffersByDay(day);
      dispatch(offerByDay.success(response.data));
    } catch (error) {
      dispatch(offerByDay.error(error));
    }
    dispatch(offerByDay.isLoading(false));
  };
}
