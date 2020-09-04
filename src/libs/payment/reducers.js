// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { listSavedPaymentMethodListActions } from './actions';

const initialState = Immutable({
  paymentMethod: {
    loading: false,
    error: null,
    items: [],
  },
});

export default handleActions(
  {
    [listSavedPaymentMethodListActions.success]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'items'], payload);
    },
    [listSavedPaymentMethodListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'loading'], payload);
    },
    [listSavedPaymentMethodListActions.error]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'error'], payload);
    },
  },
  initialState,
);
