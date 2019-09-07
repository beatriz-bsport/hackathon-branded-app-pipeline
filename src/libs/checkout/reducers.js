// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { currentBasket } from './actions';

import type { CheckoutState } from './types';

const initialState: CheckoutState = Immutable({
  basket: {
    items: [],
    current: {
      data: null,
      loading: false,
      updating: false,
      error: null,
    },
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
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
  },
  initialState,
);
