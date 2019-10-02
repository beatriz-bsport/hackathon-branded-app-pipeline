// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { CoachState } from './types';

import {
  coachListAction,
  coachDetailAction,
  performance,
  upsert,
  setPaymentRule,
  sessionPaymentRule,
} from './actions';

const initialState: CoachState = Immutable({
  loading: false,
  error: '',
  byId: {},
  allIds: [],
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
    [coachListAction.success]: (state, { payload }) => {
      return state
        .merge({ byId: payload.coachDict }, { deep: true })
        .setIn(['allIds'], payload.coachIdList);
    },
    [coachListAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [coachListAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [coachDetailAction.success]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [coachDetailAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [coachDetailAction.error]: (state, { payload }) => {
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
      return state.merge({ byId: payload }, { deep: true });
    },
    [setPaymentRule.success]: (state, { payload }) => {
      return state.setIn(
        ['byId', payload.coachId, 'default_payment_rule_id'],
        payload.default_payment_rule_id,
      );
    },
    [sessionPaymentRule.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [sessionPaymentRule.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [sessionPaymentRule.success]: (state, { payload }) => {
      const index = state.performance[
        payload.associatedCoachId
      ].result.findIndex((s) => s.id === payload.sessionId);
      const session =
        state.performance[payload.associatedCoachId].result[index];
      const updatedSession = { ...session, ...payload.data };
      return state.setIn(
        ['performance', payload.associatedCoachId, 'result', index],
        updatedSession,
      );
    },
  },
  initialState,
);
