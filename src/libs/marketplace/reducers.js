// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { companyDetail } from './actions';

import type { MarketPlaceState } from './types';

const initialState: MarketPlaceState = Immutable({
  company: {
    data: null,
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    // company
    [companyDetail.isLoading]: (state, { payload }) => {
      return state.setIn(['company', 'loading'], payload);
    },
    [companyDetail.error]: (state, { payload }) => {
      return state.setIn(['company', 'error'], payload);
    },
    [companyDetail.success]: (state, { payload }) => {
      return state.setIn(['company', 'data'], payload);
    },
  },
  initialState,
);
