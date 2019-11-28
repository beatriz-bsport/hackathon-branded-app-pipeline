// @flow
import { createAction } from 'redux-actions';

import {
  fetchBookingList as fetchBookingListAPI,
  retrieveBooking as retrieveBookingAPI,
  confirmAttendance as confirmAttendanceAPI,
  discardAttendance as discardAttendanceAPI,
  cancelBooking as cancelBookingAPI,
  registerBooking as registerBookingAPI,
} from './api';
import type { Dispatch } from '../../state/types';


export const retrieveActions = {
  success: createAction('BOOKING/RETRIEVE/SUCCESS'),
  isLoading: createAction('BOOKING/RETRIEVE/IS_LOADING'),
  error: createAction('BOOKING/RETRIEVE/ERROR'),
};

export function retrieveBooking(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));

    try {
      const response = await retrieveBookingAPI(id);
      dispatch(retrieveActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(retrieveActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveActions.isLoading(false));
  };
}

export const updateActions = {
  success: createAction('BOOKING/UPDATE/SUCCESS'),
  isLoading: createAction('BOOKING/UPDATE/IS_LOADING'),
  error: createAction('BOOKING/UDPATE/ERROR'),
};

function updateBooking(
  id: number,
  data: any,
  options: OptionCallback,
  apiCall: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateActions.isLoading(true));
    dispatch(updateActions.error(null));

    try {
      const response = await apiCall(id, data);
      dispatch(updateActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(updateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateActions.isLoading(false));
  };
}

export const discardAttendance = (id, options) =>
  updateBooking(id, {}, options, discardAttendanceAPI);
export const confirmAttendance = (id, options) =>
  updateBooking(id, {}, options, confirmAttendanceAPI);
export const cancelBooking = (id, data, options) =>
  updateBooking(id, data, options, cancelBookingAPI);

export const byMemberActions = {
  success: createAction('BOOKING/BY_MEMBER/SUCCESS'),
  isLoading: createAction('BOOKING/BY_MEMBER/IS_LOADING'),
  error: createAction('BOOKING/BY_MEMBER/ERROR'),
};

export function fetchBookingsByMember(
  member: number,
  page: number,
  page_size: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberActions.isLoading(true));
    dispatch(byMemberActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        member,
        page,
        page_size,
      });
      dispatch(byMemberActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byMemberActions.isLoading(false));
  };
}

export const byConsumerPackActions = {
  success: createAction('BOOKING/BY_CONSUMER_PACK/SUCCESS'),
  isLoading: createAction('BOOKING/BY_CONSUMER_PACK/IS_LOADING'),
  error: createAction('BOOKING/BY_CONSUMER_PACK/ERROR'),
};

export function fetchBookingsByConsumerPack(
  consumer_payment_pack: number,
  page: number,
  page_size: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byConsumerPackActions.isLoading(true));
    dispatch(byConsumerPackActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        consumer_payment_pack,
        page,
        page_size,
      });
      dispatch(byConsumerPackActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byConsumerPackActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byConsumerPackActions.isLoading(false));
  };
}

export const byOfferActions = {
  success: createAction('BOOKING/BY_OFFER/SUCCESS'),
  isLoading: createAction('BOOKING/BY_OFFER/IS_LOADING'),
  error: createAction('BOOKING/BY_OFFER/ERROR'),
};

export function fetchBookingsByOffer(offer: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.isLoading(true));
    dispatch(refreshBookingsByOffer(offer, options));
  };
}

export function refreshBookingsByOffer(offer: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        in_offer: offer,
        page_size: 300,
      });
      dispatch(byOfferActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byOfferActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byOfferActions.isLoading(false));
  };
}

export const registerActions = {
  success: createAction('BOOKING/REGISTER/SUCCESS'),
  isLoading: createAction('BOOKING/REGISTER/IS_LOADING'),
  error: createAction('BOOKING/REGISTER/ERROR'),
};

export function registerBooking(
  offerId: number,
  consumer_payment_pack: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(registerActions.isLoading(true));
    dispatch(registerActions.error(null));

    try {
      const response = await registerBookingAPI(consumer_payment_pack, offerId);
      const booking = response.data;
      dispatch(registerActions.success(booking));

      if (options && options.onSuccess) {
        options.onSuccess(booking);
      }
    } catch (err) {
      console.error(err);
      dispatch(registerActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}
