import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  fetchConsumerPaymentPackExtensionListActions,
  createConsumerPaymentPackExtensionActions,
  deleteConsumerPaymentPackExtensionActions,
  byPaymentPack,
  byMember,
  universalbyMember,
  retrieveBulk,
  updateConsumerPack,
  byOfferByMember,
  nonCompatibleByOfferByMember,
  incompatibilitiesReasonsByOfferByConsumerPack,
  forBookingActions,
  partialRefundActions,
  listConsumerPaymentPackCompatibleActions,
  listConsumerPaymentPackPenaltyActions,
  consumerPaymentPackMaxoutBookingAction,
  listConsumerPaymentPackActions,
  fetchConsumerPackAction,
} from './actions';

import {
  ConsumerPaymentPack,
  ConsumerPaymentPackExtension,
  ConsumerPaymentPackState,
} from './types';
import type { PaginatedResponse } from '../../state/types';

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
  incompatibilitiesByOfferByConsumerPack: {
    byId: {},
    error: null,
    loading: false,
  },
  compatible: {
    allIds: [],
    error: null,
    loading: false,
  },
  loading: false,
  error: null,
  updatingById: {},
  partialRefund: {
    loading: false,
    error: null,
    items: [],
  },
  extension: {
    allIds: [],
    byId: {},
    count: 0,
    error: null,
    loading: false,
    next_page: 1,
    page: 1,
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
  // @ts-expect-error
  {
    [partialRefundActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'loading'], payload);
    },
    [partialRefundActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'error'], payload);
    },
    [partialRefundActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['byId', payload.id], payload);
    },
    [partialRefundActions.list.toString()]: (state, { payload }) => {
      return state.setIn(['partialRefund', 'items'], payload);
    },
    [partialRefundActions.listReset.toString()]: (state) => {
      return state.setIn(['partialRefund', 'items'], []);
    },
    [fetchConsumerPaymentPackExtensionListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['extension', 'loading'], payload);
    },
    [fetchConsumerPaymentPackExtensionListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['extension', 'error'], payload);
    },
    [fetchConsumerPaymentPackExtensionListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ConsumerPaymentPackExtension> },
    ) => {
      const { page, next_page, count, results } = payload;
      return state
        .setIn(['extension', 'page'], page)
        .setIn(['extension', 'next_page'], next_page)
        .setIn(['extension', 'count'], count)
        .setIn(
          ['extension', 'allIds'],
          results.map((extension) => extension.id),
        )
        .merge(
          {
            extension: {
              byId: results.reduce<{
                [extensionId: number]: ConsumerPaymentPackExtension;
              }>((accumulator, extension) => {
                accumulator[extension.id] = extension;
                return accumulator;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [createConsumerPaymentPackExtensionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['extension', 'create', 'loading'], payload);
    },
    [createConsumerPaymentPackExtensionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['extension', 'create', 'error'], payload);
    },
    [deleteConsumerPaymentPackExtensionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['extension', 'delete', 'loading'], payload);
    },
    [deleteConsumerPaymentPackExtensionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['extension', 'delete', 'error'], payload);
    },
    [incompatibilitiesReasonsByOfferByConsumerPack.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          incompatibilitiesByOfferByConsumerPack: {
            // @ts-expect-error
            byId: payload,
          },
        },
        { deep: true },
      );
    },
    [incompatibilitiesReasonsByOfferByConsumerPack.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['incompatibilitiesByOfferByConsumerPack', 'loading'],
        payload,
      );
    },
    [incompatibilitiesReasonsByOfferByConsumerPack.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['incompatibilitiesByOfferByConsumerPack', 'error'],
        payload,
      );
    },

    [incompatibilitiesReasonsByOfferByConsumerPack.reset.toString()]: (
      state,
    ) => {
      return state.setIn(
        ['incompatibilitiesByOfferByConsumerPack', 'byId'],
        {},
      );
    },
    [byMember.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byMember.success.toString()]: (state, { payload }) => {
      return (
        state
          // @ts-expect-error
          .setIn(['byMember', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['byMember', 'count'], payload.count)
          .setIn(
            ['byMember', 'allIds'],
            // @ts-expect-error
            payload.results.map((cpp) => cpp.id),
          )
          .merge(
            {
              // @ts-expect-error
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
            { deep: true },
          )
      );
    },
    [universalbyMember.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['universalbyMember', 'loading'], payload);
    },
    [universalbyMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['universalbyMember', 'error'], payload);
    },
    [universalbyMember.success.toString()]: (state, { payload }) => {
      return (
        state
          // @ts-expect-error
          .setIn(['universalbyMember', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['universalbyMember', 'count'], payload.count)
          .setIn(
            ['universalbyMember', 'allIds'],
            // @ts-expect-error
            payload.results.map((cpp) => cpp.id),
          )
          .merge(
            {
              // @ts-expect-error
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
            { deep: true },
          )
      );
    },
    [byPaymentPack.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byPaymentPack', 'loading'], payload);
    },
    [byPaymentPack.success.toString()]: (state, { payload }) => {
      return (
        state
          .setIn(
            ['byPaymentPack', 'allIds'],
            // @ts-expect-error
            payload.results.map((cpp) => cpp.id),
          )
          .merge(
            {
              // @ts-expect-error
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
            { deep: true },
          )
          // @ts-expect-error
          .setIn(['byPaymentPack', 'count'], payload.count)
          // @ts-expect-error
          .setIn(['byPaymentPack', 'page'], payload.page)
      );
    },
    [universalbyMember.reset.toString()]: (state) => {
      return state
        .setIn(['universalbyMember', 'page'], 1)
        .setIn(['universalbyMember', 'count'], 0)
        .setIn(['universalbyMember', 'allIds'], []);
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
          // @ts-expect-error
          payload.map((cpp) => cpp.id),
        )
        .merge(
          {
            // @ts-expect-error
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
      const consumerPaymentPacks: ConsumerPaymentPack[] = Array.isArray(payload)
        ? payload
        : [];
      const consumerPaymentPacksById = consumerPaymentPacks.reduce<
        Record<number, ConsumerPaymentPack>
      >((accumulator, consumerPaymentPack) => {
        accumulator[consumerPaymentPack.id] = consumerPaymentPack;
        return accumulator;
      }, {});

      return state
        .setIn(['byOfferByMember', 'items'], consumerPaymentPacks)
        .merge(
          {
            byId: consumerPaymentPacksById,
          },
          { deep: true },
        );
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
        // @ts-expect-error
        (cpp) => cpp.id === payload.id,
      );
      if (indexByMember >= 0) {
        newState = newState.setIn(
          // @ts-expect-error
          ['byOfferByMember', 'items', indexByMember],
          payload,
        );
      }
      // @ts-expect-error
      return newState.setIn(['byId', payload.id], payload);
    },
    [updateConsumerPack.isLoading.toString()]: (state, { payload }) => {
      if (!payload.loading) {
        // @ts-expect-error
        return state.setIn(['updatingById', payload.id], false);
      }
      // @ts-expect-error
      return state.setIn(['updatingById', payload.id], true);
    },
    [retrieveBulk.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          // @ts-expect-error
          byId: payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [fetchConsumerPackAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['loading'], payload);
    },
    [fetchConsumerPackAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['error'], payload);
    },
    [fetchConsumerPackAction.success.toString()]: (
      state,
      { payload }: { payload: ConsumerPaymentPack },
    ) => {
      return state.setIn(['byId', payload.id], payload);
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
          // @ts-expect-error
          payload.map((cpp) => cpp.id),
        )
        .merge(
          {
            // @ts-expect-error
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
      // @ts-expect-error
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
      return (
        state
          // @ts-expect-error
          .setIn(['penalty', 'items'], payload.results)
          // @ts-expect-error
          .setIn(['penalty', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['penalty', 'count'], payload.count)
      );
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
      return (
        state
          .setIn(
            ['basePaginationState', 'allIds'],
            // @ts-expect-error
            payload.results.map((cpp) => cpp.id),
          )
          // @ts-expect-error
          .setIn(['basePaginationState', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['basePaginationState', 'count'], payload.count)
          .merge(
            {
              // @ts-expect-error
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
            { deep: true },
          )
      );
    },
  },
  initialState,
);
