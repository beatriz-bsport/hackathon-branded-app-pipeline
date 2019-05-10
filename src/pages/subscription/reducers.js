// @flow

import lodash from 'lodash';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { detail } from './actions';

import type { SubscriptionState } from './types';

const initialState: SubscriptionState = Immutable({
  items: {},
  loading: false,
  error: null,
});

export default handleActions(
  {
    [detail.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [detail.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [detail.success]: (state, { payload }) => {
      const { id } = payload;
      return state.merge({
        items: { [id]: payload },
      });
    },
  },
  initialState,
);
