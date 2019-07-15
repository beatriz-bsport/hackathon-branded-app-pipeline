// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { CoachesState } from './types';

import {
  associated,
  performance,
  upsert,
  setPaymentRule,
  sessionPaymentRule,
} from './actions';

const initialState: CoachesState = Immutable({
  loading: false,
  error: '',
  companyAssociated: [],
  // Performance
  performance: {},
  // Upsert
  upsert: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [associated.success]: (state, { payload }) => {
      return state.set('companyAssociated', payload);
    },
    [associated.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [associated.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [performance.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['performance', payload.associatedCoachId, 'loading'],
        payload.loading,
      );
    },
    [performance.error]: (state, { payload }) => {
      return state.setIn(
        ['performance', payload.associatedCoachId, 'error'],
        payload.error,
      );
    },
    [performance.success]: (state, { payload }) => {
      return state.setIn(
        ['performance', payload.associatedCoachId, 'result'],
        payload.result,
      );
    },
    [upsert.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsert.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsert.success]: (state, { payload }) => {
      return state.setIn(['upsert', 'result'], payload);
    },
    [setPaymentRule.success]: (state, { payload }) => {
      const coach = state.companyAssociated.find(
        (c) => c.id === payload.coachId,
      );
      const updatedCoach = { ...coach, ...payload.data };
      return state.merge({
        companyAssociated: [updatedCoach].concat(
          state.companyAssociated.filter((c) => c.id !== payload.coachId),
        ),
      });
    },
    [sessionPaymentRule.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [sessionPaymentRule.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [sessionPaymentRule.success]: (state, { payload }) => {
      const index = state.performance.result.findIndex(
        (s) => s.id === payload.sessionId,
      );
      const session = state.performance.result[index];
      const updatedSession = { ...session, ...payload.data };
      return state.setIn(['performance', 'result', index], updatedSession);
    },
  },
  initialState,
);
