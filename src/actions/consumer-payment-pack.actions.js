// @flow

import { createAction } from 'redux-actions';

import api from '../api';
import type { Dispatch } from '../state/types';
import { snackbarSuccess, snackbarError } from './snackbar.actions';

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
};

export function fetchByPaymentPack(paymentPackId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.isLoading(true));
    dispatch(byPaymentPack.error(null));
    dispatch(byPaymentPack.success([]));
    try {
      const response = await api.consumerPaymentPack.fetchByPaymentPack(
        paymentPackId,
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
      const apiCall =
        api.paymentPack[nbCredit >= 0 ? 'addCredit' : 'subCredit'];
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

/* dead code actually
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
      dispatch(byMember.error(error));
    }
    dispatch(byMember.isLoading(false));
  };
}
*/
