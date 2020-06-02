import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  extensionListActions,
  extensionCreateActions,
  extensionDeleteActions,
  byPaymentPack,
  byMember,
  retrieveBulk,
  updateConsumerPack,
  byOfferByMember,
  nonCompatibleByOfferByMember,
  forBookingActions,
  partialRefundActions,
} from './actions';

const initialState = Immutable({
  byOfferByMember: {
    loading: false,
    error: false,
    items: [],
  },
  nonCompatibleByOfferByMember: {
    loading: false,
    error: false,
    items: [],
  },
  // TODO move every items in this one:
  loading: false,
  error: null,
  updatingConsumerPacks: [],
  partialRefund: {
    loading: false,
    error: null,
    items: [],
  },
  extension: {
    items: [],
    loading: false,
    error: null,
    create: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
  },

  byPaymentPack: {
    error: null,
    loading: false,
    paymentPackId: null,
    allIds: [],
    page: null,
    count: null,
  },
  byMember: {
    loading: false,
    error: null,
    allIds: [],
    page: 1,
    count: 0,
  },
  forBooking: {
    loading: false,
    error: null,
    allIds: [],
  },
  byId: {},
});

export default handleActions(
  {
    [partialRefundActions.isLoading]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'loading'], payload);
    },
    [partialRefundActions.error]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'error'], payload);
    },
    [partialRefundActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [partialRefundActions.list]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'items'], payload);
    },
    [partialRefundActions.listReset]: (state) => {
      return state.setIn(['partialRefund', 'items'], []);
    },
    [extensionCreateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['extension', 'create', 'loading'], payload);
    },
    [extensionCreateActions.error]: (state, { payload }) => {
      return state.setIn(['extension', 'create', 'error'], payload);
    },
    [extensionCreateActions.success]: (state, { payload }) => {
      return state.setIn(
        ['extension', 'items'],
        [payload, ...state.extension.items],
      );
    },

    [extensionDeleteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['extension', 'delete', 'loading'], payload);
    },
    [extensionDeleteActions.error]: (state, { payload }) => {
      return state.setIn(['extension', 'delete', 'error'], payload);
    },
    [extensionDeleteActions.success]: (state, { payload }) => {
      return state.setIn(
        ['extension', 'items'],
        state.extension.items.filter((e) => e.id !== payload),
      );
    },

    [extensionListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['extension', 'loading'], payload);
    },
    [extensionListActions.error]: (state, { payload }) => {
      return state.setIn(['extension', 'error'], payload);
    },
    [extensionListActions.success]: (state, { payload }) => {
      return state.setIn(['extension', 'items'], payload);
    },
    [byMember.isLoading]: (state, { payload }) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byMember.error]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byMember.success]: (state, { payload }) => {
      return state
        .setIn(['byMember', 'page'], payload.page)
        .setIn(['byMember', 'count'], payload.count)
        .setIn(['byMember', 'allIds'], payload.results.map((cpp) => cpp.id))
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [byPaymentPack.isLoading]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'loading'], payload);
    },
    [byPaymentPack.success]: (state, { payload }) => {
      return state
        .setIn(
          ['byPaymentPack', 'allIds'],
          payload.results.map((cpp) => cpp.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['byPaymentPack', 'count'], payload.count)
        .setIn(['byPaymentPack', 'page'], payload.page);
    },
    [byPaymentPack.error]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'error'], payload);
    },
    [forBookingActions.isLoading]: (state, { payload }) => {
      return state.setIn(['forBooking', 'loading'], payload);
    },
    [forBookingActions.reset]: (state) => {
      return state.setIn(['forBooking', 'allIds'], []);
    },
    [forBookingActions.error]: (state, { payload }) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [forBookingActions.success]: (state, { payload }) => {
      return state
        .setIn(['forBooking', 'allIds'], payload.map((cpp) => cpp.id))
        .merge(
          {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
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
    [nonCompatibleByOfferByMember.isLoading]: (state, { payload }) => {
      return state.setIn(['nonCompatibleByOfferByMember', 'loading'], payload);
    },
    [nonCompatibleByOfferByMember.error]: (state, { payload }) => {
      return state.setIn(['nonCompatibleByOfferByMember', 'error'], payload);
    },
    [nonCompatibleByOfferByMember.success]: (state, { payload }) => {
      return state.setIn(['nonCompatibleByOfferByMember', 'items'], payload);
    },
    [updateConsumerPack.success]: (state, { payload }) => {
      let newState = state;
      const indexByMember = state.byOfferByMember.items.findIndex(
        (cpp) => cpp.id === payload.id,
      );
      if (indexByMember >= 0) {
        newState = newState.setIn(
          ['byOfferByMember', 'items', indexByMember],
          payload,
        );
      }
      return newState.setIn(['byId', payload.id], payload);
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
    [retrieveBulk.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
  },
  initialState,
);
