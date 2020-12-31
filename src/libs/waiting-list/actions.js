// @flow
// options: OptionCallBack,

import { createAction } from 'redux-actions';

import {
  fetchConfiguration as fetchConfigurationAPI,
  patchConfiguration as patchConfigurationAPI,
  fetchFilteredBookingOptions as fetchFilteredBookingOptionsAPI,
  discardBookingOption as discardBookingOptionAPI,
  registerOptionToWaitingList as registerOptionToWaitingListAPI,
} from './api';

import type { Dispatch, ThunkAction, OptionCallBack } from '../../state/types';

export const configurationDetail = {
  error: createAction('WAITING_LIST_CONFIGURATION/DETAIL/ERROR'),
  isLoading: createAction('WAITING_LIST_CONFIGURATION/DETAIL/IS_LOADING'),
  success: createAction('WAITING_LIST_CONFIGURATION/DETAIL/SUCCESS'),
};

export const configurationUpdate = {
  error: createAction('WAITING_LIST_CONFIGURATION/UPDATE/ERROR'),
  isLoading: createAction('WAITING_LIST_CONFIGURATION/UPDATE/IS_LOADING'),
};

export function patchConfiguration(data: *): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationUpdate.isLoading(true));
    dispatch(configurationUpdate.error(null));

    try {
      const response = await patchConfigurationAPI(data);

      dispatch(configurationDetail.success(response.data));
    } catch (error) {
      dispatch(configurationUpdate.error(error));
    }

    dispatch(configurationUpdate.isLoading(false));
  };
}

export function fetchConfiguration(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationDetail.isLoading(true));
    dispatch(configurationDetail.error(null));

    try {
      const response = await fetchConfigurationAPI();

      dispatch(configurationDetail.success(response.data));
    } catch (error) {
      dispatch(configurationDetail.error(error));
    }

    dispatch(configurationDetail.isLoading(false));
  };
}

export const byOfferActions = {
  error: createAction('WAITING_LIST/OPTION//BY_OFFER/ERROR'),
  isLoading: createAction('WAITING_LIST/OPTION/BY_OFFER/IS_LOADING'),
  success: createAction('WAITING_LIST/OPTION/BY_OFFER/SUCCESS'),
};

export function fetchByOffer(
  offer: number,
  params: any,
  options: OptionCallBack,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.error(null));
    dispatch(byOfferActions.isLoading(true));
    try {
      const response = await fetchFilteredBookingOptionsAPI({
        offer,
        as_manager: true,
        ...(params || {}),
      });
      dispatch(byOfferActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(byOfferActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byOfferActions.isLoading(false));
  };
}

export const discardOptionActions = {
  error: createAction('WAITING_LIST/OPTION/DISCARD/ERROR'),
  isLoading: createAction('WAITING_LIST/OPTION/DISCARD/IS_LOADING'),
  success: createAction('WAITING_LIST/OPTION/DISCARD/SUCCESS'),
};

export function discardBookingOption(
  bookingOptionId: number,
  params: any,
  options: OptionCallBack,
) {
  return async (dispatch: Dispatch) => {
    dispatch(discardOptionActions.isLoading(true));
    dispatch(discardOptionActions.error(null));

    try {
      const response = await discardBookingOptionAPI(bookingOptionId, params);

      dispatch(discardOptionActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(bookingOptionId);
    } catch (err) {
      console.error(err);
      dispatch(discardOptionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(discardOptionActions.isLoading(false));
  };
}
export const registerOptionActions = {
  error: createAction('WAITING_LIST/OPTION/REGISTER/ERROR'),
  isLoading: createAction('WAITING_LIST/OPTION/REGISTER/IS_LOADING'),
  success: createAction('WAITING_LIST/OPTION/REGISTER/SUCCESS'),
};

export function registerToWaitingList(
  offerId: number,
  memberId: ?number,
  options: OptionCallBack,
) {
  return async (dispatch: Dispatch) => {
    dispatch(registerOptionActions.isLoading(true));
    dispatch(registerOptionActions.error(null));
    try {
      const response = await registerOptionToWaitingListAPI(offerId, memberId);
      dispatch(registerOptionActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(registerOptionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(registerOptionActions.isLoading(false));
  };
}

export const asConsumerActions = {
  error: createAction('WAITING_LIST/OPTION/AS_CONSUMER/ERROR'),
  isLoading: createAction('WAITING_LIST/OPTION/AS_CONSUMER/IS_LOADING'),
  success: createAction('WAITING_LIST/OPTION/AS_CONSUMER/SUCCESS'),
};

export function fetchBookingOptionAsConsumer(
  company: number,
  params: any = {},
  options: OptionCallBack,
) {
  return async (dispatch: Dispatch) => {
    dispatch(asConsumerActions.error(null));
    dispatch(asConsumerActions.isLoading(true));
    try {
      const response = await fetchFilteredBookingOptionsAPI({
        company,
        ...params,
      });
      dispatch(asConsumerActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(asConsumerActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(asConsumerActions.isLoading(false));
  };
}

export const forBookingActions = {
  error: createAction('WAITING_LIST/OPTION/FOR_BOOKING/ERROR'),
  isLoading: createAction('WAITING_LIST/OPTION/FOR_BOOKING/IS_LOADING'),
  success: createAction('WAITING_LIST/OPTION/FOR_BOOKING/SUCCESS'),
  reset: createAction('WAITING_LIST/OPTION/FOR_BOOKING/RESET'),
};

export const resetBookingOptionForBooking = forBookingActions.reset;

export function fetchBookingOptionForBooking(
  offer: number,
  options: OptionCallBack,
) {
  return async (dispatch: Dispatch) => {
    dispatch(forBookingActions.error(null));
    dispatch(forBookingActions.isLoading(true));
    try {
      const response = await fetchFilteredBookingOptionsAPI({
        offer,
        mine: true,
        no_related_field: true,
      });
      dispatch(forBookingActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(forBookingActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(forBookingActions.isLoading(false));
  };
}
