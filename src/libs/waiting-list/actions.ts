import { createAction } from 'redux-actions';

import { OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK } from '@bsport/common/lib/master-data/error-codes/waitinglist-can-not-be-joined';
import {
  fetchConfiguration as fetchConfigurationAPI,
  fetchCompanyConfiguration as fetchCompanyConfigurationAPI,
  patchConfiguration as patchConfigurationAPI,
  fetchFilteredBookingOptions as fetchFilteredBookingOptionsAPI,
  fetchFilteredBookingOptionsPaginated as fetchFilteredBookingOptionsPaginatedAPI,
  discardBookingOption as discardBookingOptionAPI,
  registerOptionToWaitingList as registerOptionToWaitingListAPI,
  fetchAllWaitingListPositions as fetchAllWaitingListPositionsAPI,
} from './api';

import { snackbarError } from '../snackbar/actions';

import type {
  Dispatch,
  OptionCallback,
  OptionPaginatedCallback,
  PaginatedResponse,
  ThunkAction,
} from '../../state/types';

import { EXCEPTION_STAFF_ROLE_OVERBOOKING_IN_WAITING_LIST_NOT_ALLOWED } from '#libs/role/constants';
import {
  WaitingListBookingOption,
  WaitingListBookingOptionPaginatedQueryParams,
  WaitingListBookingOptionQueryParams,
  WaitingListConfiguration,
} from './types';

import { OfferStatusWaitingListPosition } from '#libs/offer/types';

export const configurationDetail = {
  error: createAction<Error>('WAITING_LIST_CONFIGURATION/DETAIL/ERROR'),
  isLoading: createAction<boolean>(
    'WAITING_LIST_CONFIGURATION/DETAIL/IS_LOADING',
  ),
  success: createAction<WaitingListConfiguration>(
    'WAITING_LIST_CONFIGURATION/DETAIL/SUCCESS',
  ),
};

export const configurationUpdate = {
  error: createAction<Error>('WAITING_LIST_CONFIGURATION/UPDATE/ERROR'),
  isLoading: createAction<boolean>(
    'WAITING_LIST_CONFIGURATION/UPDATE/IS_LOADING',
  ),
};

export function patchConfiguration(
  data: WaitingListConfiguration,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationUpdate.isLoading(true));
    dispatch(configurationUpdate.error(null));

    try {
      const response = await patchConfigurationAPI(data);

      dispatch(configurationDetail.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(configurationUpdate.error(err));
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
    } catch (err) {
      console.error(err);
      dispatch(configurationDetail.error(err));
    }

    dispatch(configurationDetail.isLoading(false));
  };
}

export function fetchCompanyConfiguration(company?: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationDetail.isLoading(true));
    dispatch(configurationDetail.error(null));

    try {
      const response = await fetchCompanyConfigurationAPI(
        company ? { company } : {},
      );

      dispatch(configurationDetail.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(configurationDetail.error(err));
    }

    dispatch(configurationDetail.isLoading(false));
  };
}

export const byOfferActions = {
  error: createAction<Error>('WAITING_LIST/OPTION//BY_OFFER/ERROR'),
  isLoading: createAction<boolean>('WAITING_LIST/OPTION/BY_OFFER/IS_LOADING'),
  success: createAction<WaitingListBookingOption[]>(
    'WAITING_LIST/OPTION/BY_OFFER/SUCCESS',
  ),
};

export function fetchByOffer(
  offerId: number,
  params: WaitingListBookingOptionQueryParams,
  options?: OptionCallback<WaitingListBookingOption[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.error(null));
    dispatch(byOfferActions.isLoading(true));
    try {
      const response = await fetchFilteredBookingOptionsAPI({
        offer: offerId,
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
  error: createAction<Error>('WAITING_LIST/OPTION/DISCARD/ERROR'),
  isLoading: createAction<boolean>('WAITING_LIST/OPTION/DISCARD/IS_LOADING'),
  success: createAction<WaitingListBookingOption>(
    'WAITING_LIST/OPTION/DISCARD/SUCCESS',
  ),
};

export function discardBookingOption(
  bookingOptionId: number,
  params: { disable_notification?: boolean; update_waiting_list?: boolean },
  options?: OptionCallback<number>,
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
  error: createAction<Error>('WAITING_LIST/OPTION/REGISTER/ERROR'),
  isLoading: createAction<boolean>('WAITING_LIST/OPTION/REGISTER/IS_LOADING'),
  success: createAction<WaitingListBookingOption>(
    'WAITING_LIST/OPTION/REGISTER/SUCCESS',
  ),
};

export function registerToWaitingList(
  offerId: number,
  memberId?: number,
  options?: OptionCallback<WaitingListBookingOption>,
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
      if (
        err.response?.status === 499 &&
        err.response?.data?.error_code ===
          EXCEPTION_STAFF_ROLE_OVERBOOKING_IN_WAITING_LIST_NOT_ALLOWED
      ) {
        dispatch(
          snackbarError(
            'role.noMasterControl.overbookingNotAllowedInWaitingList',
          ),
        );
      } else if (
        err.response?.status === 499 &&
        err.response?.data?.error_code ===
          OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK
      ) {
        dispatch(
          snackbarError(
            `canNotBuyErrorCode.${OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK}`,
          ),
        );
      }
      if (options && options.onError) options.onError(err);
    }
    dispatch(registerOptionActions.isLoading(false));
  };
}

export const asConsumerActions = {
  error: createAction<Error>('WAITING_LIST/OPTION/AS_CONSUMER/ERROR'),
  isLoading: createAction<boolean>(
    'WAITING_LIST/OPTION/AS_CONSUMER/IS_LOADING',
  ),
  success: createAction<WaitingListBookingOption[]>(
    'WAITING_LIST/OPTION/AS_CONSUMER/SUCCESS',
  ),
};

export function fetchBookingOptionAsConsumer(
  company: number,
  params: WaitingListBookingOptionQueryParams,
  options?: OptionCallback<WaitingListBookingOption[]>,
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

export const forMemberActions = {
  error: createAction<Error>('WAITING_LIST/OPTION/FOR_MEMBER/ERROR'),
  isLoading: createAction<boolean>('WAITING_LIST/OPTION/FOR_MEMBER/IS_LOADING'),
  reset: createAction<void>('WAITING_LIST/OPTION/FOR_MEMBER/RESET'),
  success: createAction<PaginatedResponse<WaitingListBookingOption>>(
    'WAITING_LIST/OPTION/FOR_MEMBER/SUCCESS',
  ),
};

export function fetchBookingOptionForMember(
  params: WaitingListBookingOptionPaginatedQueryParams,
  options?: OptionPaginatedCallback<WaitingListBookingOption>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(forMemberActions.error(null));
    dispatch(forMemberActions.isLoading(true));
    if (params && params.page === 1) {
      dispatch(forMemberActions.reset());
    }

    try {
      const response = await fetchFilteredBookingOptionsPaginatedAPI({
        page: 1,
        page_size: 5,
        ...params,
      });

      dispatch(
        forMemberActions.success({
          ...response.data,
          page: params.page,
        }),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(forMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(forMemberActions.isLoading(false));
  };
}

export const forBookingActions = {
  error: createAction<Error>('WAITING_LIST/OPTION/FOR_BOOKING/ERROR'),
  isLoading: createAction<boolean>(
    'WAITING_LIST/OPTION/FOR_BOOKING/IS_LOADING',
  ),
  success: createAction<WaitingListBookingOption[]>(
    'WAITING_LIST/OPTION/FOR_BOOKING/SUCCESS',
  ),
  reset: createAction<void>('WAITING_LIST/OPTION/FOR_BOOKING/RESET'),
};

export const resetBookingOptionForBooking = forBookingActions.reset;

export function fetchBookingOptionForBooking(
  offer: number,
  options?: OptionCallback<WaitingListBookingOption[]>,
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

export const allWaitingListPositionsActions = {
  isLoading: createAction<boolean>('WAITING_LIST/ALL_POSITIONS/IS_LOADING'),
  error: createAction<Error | null>('WAITING_LIST/ALL_POSITIONS/ERROR'),
  success: createAction<OfferStatusWaitingListPosition[]>(
    'WAITING_LIST/ALL_POSITIONS/SUCCESS',
  ),
};

export function fetchAllWaitingListPositions(
  offerId: number,
  options?: OptionCallback<OfferStatusWaitingListPosition[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(allWaitingListPositionsActions.error(null));
    dispatch(allWaitingListPositionsActions.isLoading(true));

    try {
      const response = await fetchAllWaitingListPositionsAPI(offerId);
      dispatch(allWaitingListPositionsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(allWaitingListPositionsActions.error(error));
      options?.onError?.(error);
    }

    dispatch(allWaitingListPositionsActions.isLoading(false));
  };
}
