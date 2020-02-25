// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listPartnershipActions,
  updatePartnershipActions,
  requestPartnershipActions,
} from './actions';

import type { PartnershipState } from './types';

const initialState: PartnershipState = Immutable({
  byId: {},
  allids: [],
  loading: false,
  error: null,
  createOrUpdate: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [requestPartnershipActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [requestPartnershipActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updatePartnershipActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [updatePartnershipActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updatePartnershipActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [listPartnershipActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listPartnershipActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listPartnershipActions.success]: (state, { payload }) => {
      return state
        .set(
          'byId',
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        )
        .set('allIds', payload.map((pc) => pc.id));
    },
  },
  initialState,
);
