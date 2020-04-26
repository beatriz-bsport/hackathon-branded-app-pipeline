// @flow

import { createAction } from 'redux-actions';

import paymentPackAPI from '../payment-packs/api';
import type { Dispatch, OptionCallback } from '../../state/types';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import {
  fetchByOfferByMember as fetchByOfferByMemberAPI,
  fetchNonCompatibleByOfferByMember as fetchNonCompatibleByOfferByMemberAPI,
  fetchConsumerPackList as fetchConsumerPaymentPackListAPI,
  fetchExtensions as fetchExtensionListAPI,
  createExtension as createExtensionAPI,
  deleteExtension as deleteExtensionAPI,
} from './api';

export const byOfferByMember = {
  isLoading: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/SUCCESS'),
};

export function fetchByOfferByMember(offer: number, member: number) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferByMember.isLoading(true));
    dispatch(byOfferByMember.error(null));
    dispatch(byOfferByMember.success([]));
    try {
      const response = await fetchByOfferByMemberAPI(offer, { member });
      dispatch(byOfferByMember.success(response.data));
    } catch (error) {
      dispatch(byOfferByMember.error(error));
    }
    dispatch(byOfferByMember.isLoading(false));
  };
}

export const nonCompatibleByOfferByMember = {
  isLoading: createAction(
    'CONSUMER_PACK/NON_COMPATIBLE_BY_OFFER_BY_MEMBER/IS_LOADING',
  ),
  error: createAction('CONSUMER_PACK/NON_COMPATIBLE_BY_OFFER_BY_MEMBER/ERROR'),
  success: createAction(
    'CONSUMER_PACK/NON_COMPATIBLE_BY_OFFER_BY_MEMBER/SUCCESS',
  ),
};

export function fetchNonCompatibleByOfferByMember(
  offer: number,
  member: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(nonCompatibleByOfferByMember.success([]));
    dispatch(nonCompatibleByOfferByMember.isLoading(true));
    try {
      const response = await fetchNonCompatibleByOfferByMemberAPI(offer, {
        member,
      });
      dispatch(nonCompatibleByOfferByMember.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(nonCompatibleByOfferByMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(nonCompatibleByOfferByMember.isLoading(false));
  };
}

export const byPaymentPack = {
  isLoading: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/ERROR'),
  success: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/SUCCESS'),
};

export function resetByPaymentPack() {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.success({ results: [], count: 0, page: 1 }));
    dispatch(byPaymentPack.isLoading(false));
  };
}

export function fetchByPaymentPack(
  paymentPackId: number,
  page?: number,
  page_size?: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.isLoading(true));
    dispatch(byPaymentPack.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        payment_pack: paymentPackId,
        page,
        page_size,
      });
      dispatch(byPaymentPack.success({ ...response.data, page: page || 1 }));
      if (options && options.onSuccess) {
        if (response.data.results) {
          options.onSuccess(response.data.results);
        } else {
          options.onSuccess(response.data);
        }
      }
    } catch (error) {
      dispatch(byPaymentPack.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(byPaymentPack.isLoading(false));
  };
}

export const updateConsumerPack = {
  isLoading: createAction('CONSUMER_PACK/UPDATE/IS_LOADING'),
  error: createAction('CONSUMER_PACK/UPDATE/ERROR'),
  success: createAction('CONSUMER_PACK/UPDATE/SUCCESS'),
};

export function updateCredit(consumerPackId: number, nbCredit: number) {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: true }),
    );
    try {
      const apiCall = paymentPackAPI[nbCredit >= 0 ? 'addCredit' : 'subCredit'];
      const response = await apiCall(
        consumerPackId,
        nbCredit >= 0 ? nbCredit : -nbCredit,
      );
      if (response.status === 200) {
        dispatch(updateConsumerPack.success(response.data));
        dispatch(snackbarSuccess('paymentPack.credit.updated'));
      }
    } catch (err) {
      dispatch(updateConsumerPack.error(err));
      dispatch(snackbarSuccess('paymentPack.credit.error'));
    }
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: false }),
    );
  };
}

export const byMember = {
  isLoading: createAction('CONSUMER_PACK/BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_MEMBER/SUCCESS'),
  reset: createAction('CONSUMER_PACK/BY_MEMBER/RESET'),
};

export function resetConsumerPackByMember() {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.success({ page: 1, count: 0, results: [] }));
  };
}

export function fetchByMember(
  member: number,
  page: number,
  page_size: number,
  params: any = {},
  options: ?OptionCallback = null,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.isLoading(true));
    dispatch(byMember.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member,
        page,
        page_size,
        ...params,
      });
      dispatch(byMember.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(byMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(byMember.isLoading(false));
  };
}

export const retrieveBulk = {
  isLoading: createAction('CONSUMER_PACK/RETRIEVE_BULK/IS_LOADING'),
  error: createAction('CONSUMER_PACK/RETRIEVE_BULK/ERROR'),
  success: createAction('CONSUMER_PACK/RETRIEVE_BULK/SUCCESS'),
};

export function retrieveConsumerPackBulk(
  ids: Array<number>,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    if (!ids || ids.length === 0) return;
    dispatch(retrieveBulk.isLoading(true));
    dispatch(retrieveBulk.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        id__in: ids,
        page_size: null,
      });
      dispatch(retrieveBulk.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(retrieveBulk.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(retrieveBulk.isLoading(false));
  };
}

export const forBookingActions = {
  isLoading: createAction('CONSUMER_PACK/FOR_BOOKING/IS_LOADING'),
  error: createAction('CONSUMER_PACK/FOR_BOOKING/ERROR'),
  success: createAction('CONSUMER_PACK/FOR_BOOKING/SUCCESS'),
  reset: createAction('CONSUMER_PACK/FOR_BOOKING/RESET'),
};

export const resetConsumerPackForBooking = forBookingActions.reset;

export function fetchConsumerPaymentPackForBooking(
  offer: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(forBookingActions.isLoading(true));
    dispatch(forBookingActions.error(null));
    dispatch(forBookingActions.success([]));
    try {
      const response = await fetchByOfferByMemberAPI(offer, { mine: true });
      dispatch(forBookingActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(forBookingActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(forBookingActions.isLoading(false));
  };
}

// BEGIN Extension
//
// ----------------------------
//
export const extensionListActions = {
  isLoading: createAction('CONSUMER_PACK_EXTENSION/LIST/IS_LOADING'),
  error: createAction('CONSUMER_PACK_EXTENSION/LIST/ERROR'),
  success: createAction('CONSUMER_PACK_EXTENSION/LIST/SUCCESS'),
};

export function fetchPackExtensions(consumerPaymentPackId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(extensionListActions.isLoading(true));
    dispatch(extensionListActions.error(null));
    try {
      const response = await fetchExtensionListAPI(consumerPaymentPackId);
      dispatch(extensionListActions.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(extensionListActions.error(error));
    }
    dispatch(extensionListActions.isLoading(false));
  };
}

export const extensionCreateActions = {
  isLoading: createAction('CONSUMER_PACK_EXTENSION/CREATE/IS_LOADING'),
  error: createAction('CONSUMER_PACK_EXTENSION/CREATE/ERROR'),
  success: createAction('CONSUMER_PACK_EXTENSION/CREATE/SUCCESS'),
};

export function createPackExtension(
  data: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(extensionCreateActions.isLoading(true));
    dispatch(extensionCreateActions.error(null));
    try {
      const response = await createExtensionAPI(data);
      dispatch(extensionCreateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(extensionCreateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(extensionCreateActions.isLoading(false));
  };
}

export const extensionDeleteActions = {
  isLoading: createAction('CONSUMER_PACK_EXTENSION/DELETE/IS_LOADING'),
  error: createAction('CONSUMER_PACK_EXTENSION/DELETE/ERROR'),
  success: createAction('CONSUMER_PACK_EXTENSION/DELETE/SUCCESS'),
};

export function deletePackExtension(
  id: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(extensionDeleteActions.isLoading(true));
    dispatch(extensionDeleteActions.error(null));
    try {
      await deleteExtensionAPI(id);
      dispatch(extensionDeleteActions.success(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(extensionDeleteActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(extensionDeleteActions.isLoading(false));
  };
}

//
// ----------------------------
//
// END Extension
