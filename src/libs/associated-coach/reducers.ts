import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { CoachState } from './types';

import {
  coachListAction,
  coachDetailAction,
  performance,
  upsert,
  setCoachPaymentRuleActions,
  setCoachPrivatePaymentRuleActions,
  bulkRetrieveActions,
  restoreActions,
} from './actions';

const initialState: CoachState = Immutable<CoachState>({
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
    [bulkRetrieveActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [bulkRetrieveActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [bulkRetrieveActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
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
    [setCoachPaymentRuleActions.success]: (state, { payload }) => {
      return state.setIn(
        ['byId', payload.coachId, 'coach_payment_rule_id'],
        payload.coach_payment_rule_id,
      );
    },
    [setCoachPrivatePaymentRuleActions.success]: (state, { payload }) => {
      return state.setIn(
        ['byId', payload.coachId, 'private_coach_payment_rule_id'],
        payload.private_coach_payment_rule_id,
      );
    },
    [restoreActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
  },
  initialState,
) as () => CoachState;
