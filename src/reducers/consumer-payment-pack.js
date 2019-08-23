import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  byOfferByMember,
  byPaymentPack,
  byMember,
  byId,
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
  // TODO move every items in this one:
  items: [],
  loading: false,
  error: null,
  updatingConsumerPacks: [],
  byMember: {
    loading: false,
    error: false,
  },
});

export default handleActions(
  {
    [byMember.isLoading]: (state, { payload }) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byMember.error]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byMember.success]: (state, { payload }) => {
      return state.set('items', payload);
    },
    [byId.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [byId.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [byId.success]: (state, { payload }) => {
      const items = state.items.filter((cpp) => cpp.id !== payload.id);
      return state.set('items', [...items, payload]);
    },
    [byPaymentPack.isLoading]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'loading'], payload);
    },
    [byPaymentPack.setPage]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'page'], payload);
    },
    [byPaymentPack.success]: (state, { payload }) => {
      return state
        .setIn(['byPaymentPack', 'items'], payload.results || [])
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
      let newState = state;
      const indexByMember = state.byOfferByMember.items.findIndex(
        (cpp) => cpp.id === payload.id,
      );
      const indexByPaymentPack = state.byPaymentPack.items.findIndex(
        (cpp) => cpp.id === payload.id,
      );
      const index = state.items.findIndex((cpp) => cpp.id === payload.id);
      if (indexByMember >= 0) {
        newState = newState.setIn(
          ['byOfferByMember', 'items', indexByMember],
          payload,
        );
      }
      if (index >= 0) {
        newState = newState.setIn(['items', index], payload);
      }
      if (indexByPaymentPack >= 0) {
        newState = newState.setIn(
          ['byPaymentPack', 'items', indexByPaymentPack],
          payload,
        );
      }
      return newState;
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
