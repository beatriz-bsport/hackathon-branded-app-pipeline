import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  extensionListActions,
  extensionCreateActions,
  extensionDeleteActions,
  byPaymentPack,
  byMember,
  universalbyMember,
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
  universalbyMember: {
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
    [partialRefundActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'loading'], payload);
    },
    [partialRefundActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'error'], payload);
    },
    [partialRefundActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [partialRefundActions.list.toString()]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'items'], payload);
    },
    [partialRefundActions.listReset.toString()]: (state) => {
      return state.setIn(['partialRefund', 'items'], []);
    },
    [extensionCreateActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'create', 'loading'], payload);
    },
    [extensionCreateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'create', 'error'], payload);
    },
    [extensionCreateActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['extension', 'items'],
        [payload, ...state.extension.items],
      );
    },

    [extensionDeleteActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'delete', 'loading'], payload);
    },
    [extensionDeleteActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'delete', 'error'], payload);
    },
    [extensionDeleteActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['extension', 'items'],
        state.extension.items.filter((e) => e.id !== payload),
      );
    },

    [extensionListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'loading'], payload);
    },
    [extensionListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'error'], payload);
    },
    [extensionListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['extension', 'items'], payload);
    },
    [massExtensionActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['massExtension', 'loading'], payload);
    },
    [massExtensionActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['massExtension', 'error'], payload);
    },
    [massExtensionActions.success.toString()]: (state, { payload }: any) => {
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
    [massExtensionActions.create.toString()]: (state, { payload }) => {
      return state.setIn(['massExtension', 'byId', payload.id], payload);
    },
    [byMember.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byMember.success.toString()]: (state, { payload }) => {
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
    [universalbyMember.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['universalbyMember', 'loading'], payload);
    },
    [universalbyMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['universalbyMember', 'error'], payload);
    },
    [universalbyMember.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['universalbyMember', 'page'], payload.page)
        .setIn(['universalbyMember', 'count'], payload.count)
        .setIn(
          ['universalbyMember', 'allIds'],
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
    [byPaymentPack.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'loading'], payload);
    },
    [byPaymentPack.success.toString()]: (state, { payload }) => {
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
    [byPaymentPack.error.toString()]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'error'], payload);
    },
    [forBookingActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['forBooking', 'loading'], payload);
    },
    [forBookingActions.reset.toString()]: (state) => {
      return state.setIn(['forBooking', 'allIds'], []);
    },
    [forBookingActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [forBookingActions.success.toString()]: (state, { payload }) => {
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
    [byOfferByMember.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byOfferByMember', 'loading'], payload);
    },
    [byOfferByMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['byOfferByMember', 'error'], payload);
    },
    [byOfferByMember.success.toString()]: (state, { payload }) => {
      return state.setIn(['byOfferByMember', 'items'], payload);
    },
    [nonCompatibleByOfferByMember.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['nonCompatibleByOfferByMember', 'loading'], payload);
    },
    [nonCompatibleByOfferByMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['nonCompatibleByOfferByMember', 'error'], payload);
    },
    [nonCompatibleByOfferByMember.success.toString()]: (state, { payload }) => {
      return state.setIn(['nonCompatibleByOfferByMember', 'items'], payload);
    },
    [updateConsumerPack.success.toString()]: (state, { payload }) => {
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
    [updateConsumerPack.isLoading.toString()]: (state, { payload }) => {
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
    [retrieveBulk.success.toString()]: (state, { payload }) => {
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
    [listConsumerPaymentPackCompatibleActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatible', 'loading'], payload);
    },
    [listConsumerPaymentPackCompatibleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatible', 'error'], payload);
    },
    [listConsumerPaymentPackCompatibleActions.reset.toString()]: (state) => {
      return state.setIn(['compatible', 'allIds'], []);
    },
    [listConsumerPaymentPackCompatibleActions.success.toString()]: (
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
    [listConsumerPaymentPackPenaltyActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['penalty', 'loading'], payload);
    },
    [consumerPaymentPackMaxoutBookingAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['maxout_booking', 'loading'], payload);
    },
    [consumerPaymentPackMaxoutBookingAction.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['maxout_booking', 'error'], payload);
    },
    [consumerPaymentPackMaxoutBookingAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge({ maxout_booking: { byId: payload } }, { deep: true });
    },
    [listConsumerPaymentPackCompatibleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['penalty', 'error'], payload);
    },
    [listConsumerPaymentPackPenaltyActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['penalty', 'items'], payload.results)
        .setIn(['penalty', 'page'], payload.page)
        .setIn(['penalty', 'count'], payload.count);
    },
    [listConsumerPaymentPackActions.isLoading.toString().toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['basePaginationState', 'loading'], payload);
    },
    [listConsumerPaymentPackActions.error.toString().toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['basePaginationState', 'error'], payload);
    },
    [listConsumerPaymentPackActions.reset.toString()]: (state) => {
      return state
        .setIn(['basePaginationState', 'allIds'], [])
        .setIn(['basePaginationState', 'count'], 0)
        .setIn(['basePaginationState', 'page'], 1)
        .setIn(['basePaginationState', 'loading'], false);
    },
    [listConsumerPaymentPackActions.success.toString().toString()]: (
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
