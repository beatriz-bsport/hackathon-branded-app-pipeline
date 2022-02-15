import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import { CoachState } from './types';

import {
  coachListAction,
  coachPaginatedListActions,
  coachDetailAction,
  performance,
  upsert,
  setCoachPaymentRuleActions,
  setCoachWorkshopPaymentRuleActions,
  setCoachPrivatePaymentRuleActions,
  setCoachPaymentRuleGroupActions,
  bulkRetrieveActions,
  restoreActions,
  updateCoachPrivateSlotsPaymentRulsActions,
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
    [bulkRetrieveActions.success.toString().toString()]: (
      state,
      { payload },
    ) => {
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
    [bulkRetrieveActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [bulkRetrieveActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [coachListAction.success.toString()]: (state, { payload }) => {
      return state
        .merge({ byId: payload.coachDict }, { deep: true })
        .setIn(['allIds'], payload.coachIdList);
    },
    [coachListAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [coachListAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [coachPaginatedListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge({ byId: payload.coachDict }, { deep: true })
        .setIn(['allIds'], uniq([...state.allIds, ...payload.coachIdList]));
    },
    [coachPaginatedListActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [coachPaginatedListActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },

    [coachDetailAction.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [coachDetailAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [coachDetailAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [performance.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(
        ['performance', payload.associatedCoachId, 'loading'],
        payload.loading,
      );
    },
    [performance.error.toString()]: (state, { payload }) => {
      return state.setIn(
        ['performance', payload.associatedCoachId, 'error'],
        payload.error.toString(),
      );
    },
    [performance.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['performance', payload.associatedCoachId, 'result'],
        payload.result,
      );
    },
    [upsert.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsert.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsert.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [setCoachPaymentRuleActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['byId', payload.coachId, 'coach_payment_rule_id'],
        payload.coach_payment_rule_id,
      );
    },
    [setCoachWorkshopPaymentRuleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.coachId, 'workshop_coach_payment_rule_id'],
        payload.workshop_coach_payment_rule_id,
      );
    },
    [setCoachPrivatePaymentRuleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.coachId, 'private_coach_payment_rule_id'],
        payload.private_coach_payment_rule_id,
      );
    },
    [setCoachPaymentRuleGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.associated_coach.id],
        payload.associated_coach,
      );
    },
    [updateCoachPrivateSlotsPaymentRulsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.id, 'private_slots_coach_payment_rules'],
        payload.private_slots_coach_payment_rules,
      );
    },
    [restoreActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
  },
  initialState,
) as () => CoachState;
