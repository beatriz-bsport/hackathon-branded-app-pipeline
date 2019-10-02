// @flow

import { createAction } from 'redux-actions';

import api from '../api';
import paymentPackAPI from '../libs/payment-packs/api';
import { fetchConsumerPackAsManager as fetchConsumerPackAsManagerAPI } from '../api/consumer-payment-pack';
import type { Dispatch } from '../state/types';
import { snackbarSuccess } from './snackbar.actions';

export const byId = {
  isLoading: createAction('CONSUMER_PACK/BY_ID/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_ID/ERROR'),
  success: createAction('CONSUMER_PACK/BY_ID/SUCCESS'),
};

export function fetchById(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(byId.isLoading(true));
    dispatch(byId.error(null));
    try {
      const response = await api.consumerPaymentPack.fetchById(id);
      dispatch(byId.success(response.data));
    } catch (error) {
      dispatch(byId.error(error));
    }
    dispatch(byId.isLoading(false));
  };
}

export const byOfferByMember = {
  isLoading: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/SUCCESS'),
};

export function fetchByOfferByMember(offerId: number, memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferByMember.isLoading(true));
    dispatch(byOfferByMember.error(null));
    dispatch(byOfferByMember.success([]));
    try {
      const response = await api.consumerPaymentPack.fetchByOfferByMember(
        offerId,
        memberId,
      );
      dispatch(byOfferByMember.success(response.data));
    } catch (error) {
      dispatch(byOfferByMember.error(error));
    }
    dispatch(byOfferByMember.isLoading(false));
  };
}

export const byPaymentPack = {
  isLoading: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/ERROR'),
  success: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/SUCCESS'),
  setPage: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/SET_PAGE'),
};

export function resetByPaymentPack() {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.success({ results: [], count: 0 }));
    dispatch(byPaymentPack.setPage(1));
    dispatch(byPaymentPack.isLoading(false));
  };
}

export function fetchByPaymentPack(
  paymentPackId: number,
  page?: number,
  pageSize?: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.isLoading(true));
    dispatch(byPaymentPack.error(null));
    dispatch(byPaymentPack.setPage(page));
    try {
      const response = await api.consumerPaymentPack.fetchByPaymentPack(
        paymentPackId,
        page,
        pageSize,
      );
      dispatch(byPaymentPack.success(response.data));
    } catch (error) {
      dispatch(byPaymentPack.error(error));
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

export function fetchConsumerPackAsManager(consumerPackId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: true }),
    );
    try {
      const response = await fetchConsumerPackAsManagerAPI(consumerPackId);
      dispatch(updateConsumerPack.success(response.data));
      dispatch(snackbarSuccess('paymentPack.credit.updated'));
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
};

export function fetchByMember(memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.isLoading(true));
    dispatch(byMember.error(null));
    dispatch(byMember.success([]));
    try {
      const response = await api.consumerPaymentPack.fetchByMember(memberId);
      dispatch(byMember.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(byMember.error(error));
    }
    dispatch(byMember.isLoading(false));
  };
}

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
      const response = await api.consumerPaymentPack.fetchExtensions(
        consumerPaymentPackId,
      );
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
      const response = await api.consumerPaymentPack.createExtension(data);
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
      await api.consumerPaymentPack.deleteExtension(id);
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
