import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveBasket,
  currentBasket,
  createOrRefreshInternalAccountPrepaidLineActions,
  generatedObjectsActions,
  basketHistoryActions,
} from './actions';

import { CheckoutState } from './types';

const initialState: Immutable<CheckoutState> = Immutable({
  basket: {
    byId: {},
    current: {
      data: null,
      loading: false,
      updating: false,
      error: null,
    },
    history: {
      loading: false,
      error: null,
      items: [],
    },
    loading: false,
    error: null,
    generatedObjects: {
      loading: false,
      error: null,
      data: null,
    },
  },
});

export default handleActions(
  {
    [retrieveBasket.error.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [retrieveBasket.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [retrieveBasket.success.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'byId', payload.id], payload);
    },
    [currentBasket.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'loading'], payload);
    },
    [currentBasket.isUpdating.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'updating'], payload);
    },
    [currentBasket.error.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'error'], payload);
    },
    [currentBasket.success.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'data'], payload);
    },
    [createOrRefreshInternalAccountPrepaidLineActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['basket', 'current', 'updating'], payload);
    },
    [createOrRefreshInternalAccountPrepaidLineActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['basket', 'current', 'error'], payload);
    },
    [createOrRefreshInternalAccountPrepaidLineActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['basket', 'current', 'data'], payload);
    },
    [basketHistoryActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'history', 'error'], payload);
    },
    [basketHistoryActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'history', 'loading'], payload);
    },
    [basketHistoryActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'history', 'items'], payload).merge(
        {
          basket: {
            byId: payload.reduce((acc, b) => ({ ...acc, [b.id]: b }), {}),
          },
        },
        { deep: true },
      );
    },

    [generatedObjectsActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'generatedObjects', 'loading'], payload);
    },
    [generatedObjectsActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'generatedObjects', 'error'], payload);
    },
    [generatedObjectsActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['basket', 'generatedObjects', 'data'], payload);
    },
  },
  initialState,
);
