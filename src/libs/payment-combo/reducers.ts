// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  paymentComboListActions,
  paymentComboBulkActions,
  paymentComboDeleteActions,
  paymentComboCreateOrUpdateActions,
  paymentComboRetrieveActions,
  paymentComboPurchaseListActions,
  paymentComboForBookingActions,
  relatedPrivatePassBulkActions,
} from './actions';

import type { PaginatedResponse } from '../../state/types';
import type {
  PaymentCombo,
  PaymentComboPurchase,
  PaymentComboState,
} from './types';
import type { PrivatePass } from '#libs/private-service/types';

type ImmutablePaymentComboState = Immutable.Immutable<PaymentComboState>;
type PayloadReduceType<T> = { [id: number]: T };

const initialState: ImmutablePaymentComboState = Immutable<PaymentComboState>({
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  relatedPrivatePass: {
    loading: false,
    byId: {},
    error: null,
    allIds: [],
  },
  createOrUpdate: {
    loading: false,
    error: null,
  },
  purchase: {
    loading: false,
    items: [],
    error: null,
    count: 0,
  },
  forBooking: {
    loading: false,
    error: null,
    allIds: [],
  },
});

export default handleActions<ImmutablePaymentComboState, any>(
  {
    [paymentComboForBookingActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['forBooking', 'loading'], payload);
    },
    [paymentComboForBookingActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [paymentComboForBookingActions.reset.toString()]: (state) => {
      return state.setIn(['forBooking', 'allIds'], []);
    },
    [paymentComboForBookingActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentCombo[] },
    ) => {
      return state
        .set(
          'byId',
          payload.reduce<PayloadReduceType<PaymentCombo>>((acc, cV) => {
            acc[cV.id] = cV;
            return acc;
          }, {}),
        )
        .setIn(
          ['forBooking', 'allIds'],
          payload.map((pc: PaymentCombo) => pc.id),
        );
    },

    [paymentComboListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [paymentComboListActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.set('error', payload);
    },
    [paymentComboListActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentCombo[] },
    ) => {
      return state
        .set(
          'byId',
          payload.reduce<PayloadReduceType<PaymentCombo>>((acc, cV) => {
            acc[cV.id] = cV;
            return acc;
          }, {}),
        )
        .set(
          'allIds',
          payload.map((pc) => pc.id),
        );
    },

    [paymentComboBulkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [paymentComboBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.set('error', payload);
    },
    [paymentComboBulkActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentCombo[] },
    ) => {
      return state.merge(
        {
          byId: payload.reduce<PayloadReduceType<PaymentCombo>>((acc, cV) => {
            acc[cV.id] = cV;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },

    [paymentComboCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [paymentComboCreateOrUpdateActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [paymentComboCreateOrUpdateActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentCombo },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },

    [paymentComboRetrieveActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentCombo },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },

    [paymentComboDeleteActions.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.set(
        'allIds',
        state.allIds.filter((id) => id !== payload),
      );
    },

    [paymentComboPurchaseListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['purchase', 'loading'], payload);
    },
    [paymentComboPurchaseListActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['purchase', 'error'], payload);
    },
    [paymentComboPurchaseListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PaymentComboPurchase[]> },
    ) => {
      return state
        .setIn(['purchase', 'items'], payload.results)
        .setIn(['purchase', 'page'], payload.page)
        .setIn(['purchase', 'count'], payload.count);
    },

    [relatedPrivatePassBulkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['relatedPrivatePass', 'loading'], payload);
    },
    [relatedPrivatePassBulkActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['relatedPrivatePass', 'error'], payload);
    },
    [relatedPrivatePassBulkActions.success.toString()]: (
      state,
      { payload }: { payload: PrivatePass[] },
    ) => {
      return state
        .setIn(
          ['relatedPrivatePass', 'byId'],
          payload.reduce<PayloadReduceType<PrivatePass>>((acc, cV) => {
            acc[cV.id] = cV;
            return acc;
          }, {}),
        )
        .setIn(
          ['relatedPrivatePass', 'allIds'],
          payload.map((pc) => pc.id),
        );
    },
  },
  initialState,
);
