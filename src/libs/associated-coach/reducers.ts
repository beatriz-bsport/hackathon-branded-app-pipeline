// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';
import { CoachState } from './types';

import {
  coachListAction,
  additionalCoachListActions,
  coachPaginatedListActions,
  coachDetailAction,
  performance,
  upsert,
  resetAction,
  setCoachPaymentRuleActions,
  setCoachWorkshopPaymentRuleActions,
  setCoachPrivatePaymentRuleActions,
  setCoachPaymentRuleGroupActions,
  bulkRetrieveActions,
  restoreActions,
  updateCoachPrivateSlotsPaymentRulsActions,
  editAccessToCoachSpaceActions,
  retrieveMyAssociatedCoachProfileActions,
  assignDisciplineGroupActions,
  retrieveLateReplacementRequestStatus,
} from './actions';

const initialState: Immutable.Immutable<CoachState> = Immutable<CoachState>({
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
  editAccessToCoachSpaceActions: {
    loading: false,
    error: null,
  },
  myAssociatedCoachProfile: {
    error: null,
    loading: false,
    me: null,
  },
  lateReplacementRequestStatus: {
    loading: false,
    error: null,
    data: null,
  },
});

export default handleActions(
  {
    [bulkRetrieveActions.success.toString().toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['allIds'],
          payload.map((coach) => coach.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, coach) => {
              acc[coach.id] = coach;
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
    [additionalCoachListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge({ byId: payload.coachDict }, { deep: true })
        .setIn(
          ['allIds'],
          uniq([...state.allIds, ...(payload?.coachIdList ?? [])]),
        );
    },
    [additionalCoachListActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [additionalCoachListActions.error.toString()]: (state, { payload }) => {
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
    [resetAction]: (state) => {
      return state.setIn(['allIds'], []);
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
    [editAccessToCoachSpaceActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['editAccessToCoachSpaceActions', 'error'], payload);
    },
    [editAccessToCoachSpaceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['editAccessToCoachSpaceActions', 'loading'], payload);
    },
    [editAccessToCoachSpaceActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.id, 'has_access_to_coach_space'],
        payload.has_access_to_coach_space,
      );
    },
    [retrieveMyAssociatedCoachProfileActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['myAssociatedCoachProfile', 'error'], payload);
    },
    [retrieveMyAssociatedCoachProfileActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['myAssociatedCoachProfile', 'loading'], payload);
    },
    [retrieveMyAssociatedCoachProfileActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['myAssociatedCoachProfile', 'me'], payload)
        .setIn(['byId', payload.id], payload);
    },
    [assignDisciplineGroupActions.error.toString()]: (state, { payload }) =>
      state.setIn(['error'], payload),
    [assignDisciplineGroupActions.loading.toString()]: (state, { payload }) =>
      state.setIn(['loading'], payload),
    [assignDisciplineGroupActions.success.toString()]: (state, { payload }) =>
      state.setIn(
        ['byId', payload.associated_coach.id],
        payload.associated_coach,
      ),
    [retrieveLateReplacementRequestStatus.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['lateReplacementRequestStatus', 'loading'], payload),
    [retrieveLateReplacementRequestStatus.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['lateReplacementRequestStatus', 'error'], payload),
    [retrieveLateReplacementRequestStatus.success.toString()]: (
      state,
      { payload },
    ) => state.setIn(['lateReplacementRequestStatus', 'data'], payload),
  },
  initialState,
) as () => CoachState;
