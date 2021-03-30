// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  paymentComboListActions,
  paymentComboDeleteActions,
  paymentComboCreateOrUpdateActions,
  paymentComboRetrieveActions,
  paymentComboPurchaseListActions,
  paymentComboForBookingActions,
  relatedPrivatePassBulkActions,
} from './actions';

import type { PaymentComboState } from './types';

const initialState: PaymentComboState = Immutable({
  relatedPrivatePass: {
    loading: false,
  },
  byId: {},
  allIds: [],
  loading: false,
  error: null,
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

export default handleActions(
  {
    [paymentComboForBookingActions.success]: (state, { payload }) => {
      return state
        .set(
          'byId',
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        )
        .setIn(
          ['forBooking', 'allIds'],
          payload.map((pc) => pc.id),
        );
    },

    [paymentComboForBookingActions.isLoading]: (state, { payload }) => {
      return state.setIn(['forBooking', 'loading'], payload);
    },
    [paymentComboForBookingActions.reset]: (state) => {
      return state.setIn(['forBooking', 'allIds'], []);
    },
    [paymentComboForBookingActions.error]: (state, { payload }) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [paymentComboListActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [paymentComboListActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [paymentComboCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [paymentComboCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [paymentComboCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [paymentComboRetrieveActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [paymentComboDeleteActions.success]: (state, { payload }) => {
      return state.set(
        'allIds',
        state.allIds.filter((id) => id !== payload),
      );
    },
    [paymentComboListActions.success]: (state, { payload }) => {
      return state
        .set(
          'byId',
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        )
        .set(
          'allIds',
          payload.map((pc) => pc.id),
        );
    },

    [paymentComboPurchaseListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['purchase', 'loading'], payload);
    },
    [paymentComboPurchaseListActions.error]: (state, { payload }) => {
      return state.setIn(['purchase', 'error'], payload);
    },
    [paymentComboPurchaseListActions.success]: (state, { payload }) => {
      return state
        .setIn(['purchase', 'items'], payload.results)
        .setIn(['purchase', 'page'], payload.page)
        .setIn(['purchase', 'count'], payload.count);
    },
    [relatedPrivatePassBulkActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['relatedPrivatePass', 'loading'], payload);
    },
    [relatedPrivatePassBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['relatedPrivatePass', 'error'], payload);
    },
    [relatedPrivatePassBulkActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['relatedPrivatePass', 'byId'],
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
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
