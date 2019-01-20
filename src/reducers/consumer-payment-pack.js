import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  byOfferByMember,
  byPaymentPack,
} from '../actions/consumer-payment-pack.actions';

const initialState = Immutable({
  byPaymentPack: {
    error: null,
    loading: false,
    paymentPackId: null,
    items: [],
  },
  byOfferByMember: {
    loading: false,
    error: false,
    items: [],
  },
  /* dead code
  byMember: {
    loading: false,
    error: false,
    items: [],
  },
  */
});

export default handleActions(
  {
    [byPaymentPack.isLoading]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'loading'], payload);
    },
    [byPaymentPack.success]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'items'], payload);
    },
    [byPaymentPack.error]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'error'], payload);
    },
    [byOfferByMember.isLoading]: (state, { payload }) => {
      return state.setIn(['byOfferByMember', 'loading'], payload);
    },
    [byOfferByMember.error]: (state, { payload }) => {
      return state.setIn(['byOfferByMember', 'error'], payload);
    },
    [byOfferByMember.success]: (state, { payload }) => {
      return state.setIn(['byOfferByMember', 'items'], payload);
    },
    /* dead code
    [byOfferByMember.isLoading]: (state, { payload }) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byOfferByMember.error]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byOfferByMember.success]: (state, { payload }) => {
      return state.setIn(['byMember', 'items'], payload);
    },
    */
  },
  initialState,
);
