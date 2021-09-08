import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveBasket,
  currentBasket,
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
    [retrieveBasket.error]: (state, { payload }) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [retrieveBasket.isLoading]: (state, { payload }) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [retrieveBasket.success]: (state, { payload }) => {
      return state.setIn(['basket', 'byId', payload.id], payload);
    },
    [currentBasket.isLoading]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'loading'], payload);
    },
    [currentBasket.isUpdating]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'updating'], payload);
    },
    [currentBasket.error]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'error'], payload);
    },
    [basketHistoryActions.error]: (state, { payload }) => {
      return state.setIn(['basket', 'history', 'error'], payload);
    },
    [basketHistoryActions.isLoading]: (state, { payload }) => {
      return state.setIn(['basket', 'history', 'loading'], payload);
    },
    [basketHistoryActions.success]: (state, { payload }) => {
      return state.setIn(['basket', 'history', 'items'], payload).merge(
        {
          basket: {
            byId: payload.reduce((acc, b) => ({ ...acc, [b.id]: b }), {}),
          },
        },
        { deep: true },
      );
    },
    [currentBasket.success]: (state, { payload }) => {
      return state.setIn(['basket', 'current', 'data'], payload);
    },
    [generatedObjectsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['basket', 'generatedObjects', 'loading'], payload);
    },
    [generatedObjectsActions.error]: (state, { payload }) => {
      return state.setIn(['basket', 'generatedObjects', 'error'], payload);
    },
    [generatedObjectsActions.success]: (state, { payload }) => {
      return state.setIn(['basket', 'generatedObjects', 'data'], payload);
    },
  },
  initialState,
);
