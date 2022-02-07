import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import {
  instalmentPaymentCreateOrUpdateActions,
  instalmentPaymentDisableActions,
  instalmentPaymentListActions,
  instalmentPaymentForBasketListActions,
} from './actions';
import { InstalmentPaymentState } from './types';

const initialState: Immutable.Immutable<InstalmentPaymentState> =
  Immutable<InstalmentPaymentState>({
    allIds: [],

    byId: {},
    byBasket: {
      loading: false,
      error: null,
      allIds: [],
      basketId: '',
    },
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
    disabled: {
      loading: false,
      error: null,
    },
  });

export default handleActions(
  {
    [instalmentPaymentCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [instalmentPaymentCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [instalmentPaymentCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['byId', payload.id], {
            ...payload,
          })
          .setIn(['allIds'], [...state.allIds, payload.id]);
      }
      return state.setIn(['byId', payload.id], {
        ...payload,
      });
    },
    [instalmentPaymentDisableActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['disabled', 'error'], payload);
    },
    [instalmentPaymentDisableActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['disabled', 'loading'], payload);
    },
    [instalmentPaymentDisableActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const instalmentPaymentDeleted = state.byId[payload];
      return state.setIn(['byId', payload], {
        ...instalmentPaymentDeleted,
        is_disabled: true,
      });
    },
    [instalmentPaymentListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [instalmentPaymentListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['loading'], payload);
    },
    [instalmentPaymentListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['allIds'],
          [...payload.map((instalmentPayment) => instalmentPayment.id)],
        )
        .merge(
          {
            byId: payload.reduce((acc, instalmentPayment) => {
              acc[instalmentPayment.id] = instalmentPayment;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [instalmentPaymentForBasketListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['error'], payload);
    },
    [instalmentPaymentForBasketListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['loading'], payload);
    },
    [instalmentPaymentForBasketListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['byBasket', 'allIds'],
          payload.items.map((instalmentPayment) => instalmentPayment.id),
        )
        .setIn(['byBasket', 'basketId'], payload.basketId)
        .merge(
          {
            byId: payload.items.reduce((acc, instalmentPayment) => {
              acc[instalmentPayment.id] = instalmentPayment;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
  },
  initialState,
);
