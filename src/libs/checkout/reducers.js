// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { retrieveBasket, currentBasket, generatedObjectsActions } from './actions';

import type { CheckoutState } from './types';

const initialState: CheckoutState = Immutable({
  basket: {
    byId: {},
    current: {
      data: null,
      loading: false,
      updating: false,
      error: null,
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
