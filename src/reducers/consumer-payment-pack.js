import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  byOfferByMember,
  byPaymentPack,
  updateConsumerPack,
} from '../actions/consumer-payment-pack.actions';

const initialState = Immutable({
  byPaymentPack: {
    error: null,
    loading: false,
    paymentPackId: null,
    items: [],
    page: null,
    count: null,
  },
  byOfferByMember: {
    loading: false,
    error: false,
    items: [],
  },
  updatingConsumerPacks: [],
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
    [byPaymentPack.setPage]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'page'], payload);
    },
    [byPaymentPack.success]: (state, { payload }) => {
      return state
        .setIn(['byPaymentPack', 'items'], payload.results)
        .setIn(['byPaymentPack', 'count'], payload.count);
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
    [updateConsumerPack.success]: (state, { payload }) => {
      const indexByMember = state.byOfferByMember.items.findIndex(
        (cpp) => cpp.id === payload.id,
      );
      const indexByPaymentPack = state.byPaymentPack.items.findIndex(
        (cpp) => cpp.id === payload.id,
      );
      if (indexByMember >= 0 && indexByPaymentPack >= 0) {
        return state
          .setIn(['byOfferByMember', 'items', indexByMember], payload)
          .setIn(['byPaymentPack', 'items', indexByPaymentPack], payload);
      }
      if (indexByMember >= 0) {
        return state.setIn(
          ['byOfferByMember', 'items', indexByMember],
          payload,
        );
      }
      if (indexByPaymentPack >= 0) {
        return state.setIn(
          ['byPaymentPack', 'items', indexByPaymentPack],
          payload,
        );
      }
      return state;
    },
    [updateConsumerPack.isLoading]: (state, { payload }) => {
      if (!payload.loading) {
        return state.setIn(
          ['updatingConsumerPacks'],
          state.updatingConsumerPacks.filter((id) => id !== payload.id),
        );
      }
      return state.setIn(
        ['updatingConsumerPacks'],
        [...state.updatingConsumerPacks, payload.id],
      );
    },
  },
  initialState,
);
