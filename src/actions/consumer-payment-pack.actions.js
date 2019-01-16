// @flow

import { createAction } from 'redux-actions';

import api from '../api';
import type { Dispatch } from '../state/types';

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
