// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { details } from '../actions/member-fetcher.actions';

const initialState = Immutable({
  details: [],
  loading: [],
  error: false,
});


export default handleActions(
  {
    [details.reset]: (state) => {
      return state
        .set('details', [])
        .set('loading', [])
        .set('error', false);
    },
    [details.isLoading]: (state, { payload }) => {
      return state.set('loading', [...state.loading, payload]);
    },
    [details.error]: (state, { payload }) => {
      return state
        .set('error', payload[0])
        .set('loading', state.loading.filter((id) => id !== payload[1]));
    },
    [details.success]: (state, { payload }) => {
      const indexInState = state.details.findIndex((m) => m.id === payload.id);
      if (indexInState > -1) {
        return state
          .setIn('details', indexInState, {
            ...payload,
            lastUpdated: +new Date(),
          })
          .set('loading', state.details.filter((id) => id !== payload.id));
      }
      return state.set('details', [
        ...state.details,
        { ...payload, lastUpdated: +new Date() },
      ]);
    },
  },
  initialState,
);
