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
  listConsumerPaymentPackCompatibleActions,
  listConsumerPaymentPackPenaltyActions,
  massExtensionActions,
  consumerPaymentPackMaxoutBookingAction,
  listConsumerPaymentPackActions,
} from './actions';

import { ConsumerPaymentPackState } from './types';

const initialState = Immutable<ConsumerPaymentPackState>({
  byOfferByMember: {
    loading: false,
    error: null,
    items: [],
  },
  nonCompatibleByOfferByMember: {
    loading: false,
    error: null,
    items: [],
  },
  compatible: {
    allIds: [],
    error: null,
    loading: false,
  },
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
  massExtension: {
    loading: false,
    firstLoadDone: false,
    error: null,
    byId: {},
    allIds: [],
    count: 0,
    page: 1,
    next_page: 1,
  },
  byPaymentPack: {
    error: null,
    loading: false,
    paymentPackId: null,
    allIds: [],
    page: null,
    count: null,
    next_page: null,
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
  penalty: {
    loading: false,
    error: null,
    items: [],
    page: 1,
    count: 0,
  },
  byId: {},
  basePaginationState: {
    page: 1,
    count: 0,
    loading: false,
    error: null,
    allIds: [],
  },
  maxout_booking: {
    byId: {},
    error: null,
    loading: false,
  },
});

export default handleActions<Immutable.Immutable<ConsumerPaymentPackState>>(
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
    [massExtensionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['massExtension', 'loading'], payload);
    },
    [massExtensionActions.error]: (state, { payload }) => {
      return state.setIn(['massExtension', 'error'], payload);
    },
    [massExtensionActions.success]: (state, { payload }: any) => {
      return state
        .setIn(
          ['massExtension', 'allIds'],
          payload.results.map((m) => m.id),
        )
        .setIn(['massExtension', 'count'], payload.count)
        .setIn(['massExtension', 'firstLoadDone'], true)
        .setIn(['massExtension', 'page'], payload.page)
        .setIn(['massExtension', 'next_page'], payload.next_page)
        .merge(
          {
            massExtension: {
              byId: payload.results.reduce((acc, mE) => {
                acc[mE.id] = mE;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [massExtensionActions.create]: (state, { payload }) => {
      return state.setIn(['massExtension', 'byId', payload.id], payload);
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
        .setIn(
          ['byMember', 'allIds'],
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
        .setIn(
          ['forBooking', 'allIds'],
          payload.map((cpp) => cpp.id),
        )
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
    [listConsumerPaymentPackCompatibleActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatible', 'loading'], payload);
    },
    [listConsumerPaymentPackCompatibleActions.error]: (state, { payload }) => {
      return state.setIn(['compatible', 'error'], payload);
    },
    [listConsumerPaymentPackCompatibleActions.reset]: (state) => {
      return state.setIn(['compatible', 'allIds'], []);
    },
    [listConsumerPaymentPackCompatibleActions.success]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['compatible', 'allIds'],
          payload.map((cpp) => cpp.id),
        )
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
    [listConsumerPaymentPackPenaltyActions.isLoading]: (state, { payload }) => {
      return state.setIn(['penalty', 'loading'], payload);
    },
    [consumerPaymentPackMaxoutBookingAction.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['maxout_booking', 'loading'], payload);
    },
    [consumerPaymentPackMaxoutBookingAction.error]: (state, { payload }) => {
      return state.setIn(['maxout_booking', 'error'], payload);
    },
    [consumerPaymentPackMaxoutBookingAction.success]: (state, { payload }) => {
      return state.merge({ maxout_booking: { byId: payload } }, { deep: true });
    },
    [listConsumerPaymentPackCompatibleActions.error]: (state, { payload }) => {
      return state.setIn(['penalty', 'error'], payload);
    },
    [listConsumerPaymentPackPenaltyActions.success]: (state, { payload }) => {
      return state
        .setIn(['penalty', 'items'], payload.results)
        .setIn(['penalty', 'page'], payload.page)
        .setIn(['penalty', 'count'], payload.count);
    },
    [listConsumerPaymentPackActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['basePaginationState', 'loading'], payload);
    },
    [listConsumerPaymentPackActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['basePaginationState', 'error'], payload);
    },
    [listConsumerPaymentPackActions.reset.toString()]: (state) => {
      return state
        .setIn(['basePaginationState', 'allIds'], [])
        .setIn(['basePaginationState', 'count'], 0)
        .setIn(['basePaginationState', 'page'], 1)
        .setIn(['basePaginationState', 'loading'], false);
    },
    [listConsumerPaymentPackActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['basePaginationState', 'allIds'],
          payload.results.map((cpp) => cpp.id),
        )
        .setIn(['basePaginationState', 'page'], payload.page)
        .setIn(['basePaginationState', 'count'], payload.count)
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
  },
  initialState,
);
