import lodash from 'lodash';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchAllPaymentRules,
  coachPaymentRuleSetUpsert,
  coachPaymentRuleSetDelete,
  coachPaymentSimulation,
  coachSessionPerformanceActions,
  coachPrivateServicePerformanceActions,
  sessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRuleActions,
  showDialog,
  showSimulationDialog,
} from './actions';
import { CoachPaymentRuleState } from './types';

const initialState: CoachPaymentRuleState = Immutable({
  items: {},
  loading: false,
  error: null,
  upsert: {
    loading: true,
    error: null,
  },
  dialog: false,
  simulationDialog: false,
  simulation: {
    error: null,
    result: {},
    loading: false,
  },
  performance: {
    session: {
      byAssociatedCoachId: {},
    },
    private_service: {
      byAssociatedCoachId: {},
    },

    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [fetchAllPaymentRules.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchAllPaymentRules.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchAllPaymentRules.success]: (state, { payload }) => {
      return state.merge(
        {
          items: payload.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [coachPaymentRuleSetUpsert.success]: (state, { payload }) => {
      return state.setIn(['items', payload.id], payload);
    },
    [coachPaymentRuleSetUpsert.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [coachPaymentRuleSetUpsert.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [coachPaymentRuleSetDelete.success]: (state, { payload }) => {
      return state.set('items', lodash.omit(state.items, payload.id));
    },
    [coachPaymentSimulation.success]: (state, { payload }) => {
      return state.setIn(['simulation', 'result', payload.id], payload);
    },
    [coachPaymentSimulation.isLoading]: (state, { payload }) => {
      return state.setIn(['simulation', 'loading'], payload);
    },
    [coachPaymentSimulation.error]: (state, { payload }) => {
      return state.setIn(['simulation', 'error'], payload);
    },
    [coachPaymentSimulation.reset]: (state) => {
      return state.setIn(['simulation', 'result'], {});
    },
    [coachSessionPerformanceActions.success]: (state, { payload }) => {
      if (payload.sessionId) {
        const index = state.performance.session.byAssociatedCoachId[
          payload.associatedCoachId
        ].findIndex(
          (sessionperf) => sessionperf.session_id === payload.sessionId,
        );
        return state.setIn(
          [
            'performance',
            'session',
            'byAssociatedCoachId',
            payload.associatedCoachId,
            index,
          ],
          payload.data[0],
        );
      }
      return state.setIn(
        [
          'performance',
          'session',
          'byAssociatedCoachId',
          [payload.associatedCoachId],
        ],
        payload.data,
      );
    },
    [coachSessionPerformanceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['performance', 'loading'], payload);
    },
    [coachSessionPerformanceActions.error]: (state, { payload }) => {
      return state.setIn(['performance', 'error'], payload);
    },
    [coachPrivateServicePerformanceActions.success]: (state, { payload }) => {
      if (payload.privateBookingId) {
        const index = state.performance.private_service.byAssociatedCoachId[
          payload.associatedCoachId
        ].findIndex(
          (privateperf) =>
            privateperf.private_booking_id === payload.privateBookingId,
        );
        return state.setIn(
          [
            'performance',
            'private_service',
            'byAssociatedCoachId',
            payload.associatedCoachId,
            index,
          ],
          payload.data[0],
        );
      }
      return state.setIn(
        [
          'performance',
          'private_service',
          'byAssociatedCoachId',
          [payload.associatedCoachId],
        ],
        payload.data,
      );
    },
    [coachPrivateServicePerformanceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['performance', 'loading'], payload);
    },
    [coachPrivateServicePerformanceActions.error]: (state, { payload }) => {
      return state.setIn(['performance', 'error'], payload);
    },
    [sessionCoachPaymentRule.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [sessionCoachPaymentRule.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [sessionCoachPaymentRule.success]: (state, { payload }) => {
      const index = state.performance.session.byAssociatedCoachId[
        payload.associatedCoachId
      ].findIndex((s) => s.session_id === payload.sessionId);
      const session =
        state.performance.session.byAssociatedCoachId[
          payload.associatedCoachId
        ][index];
      const updatedSession = { ...session, ...payload.data };
      return state.setIn(
        [
          'performance',
          'session',
          'byAssociatedCoachId',
          payload.associatedCoachId,
          index,
        ],
        updatedSession,
      );
    },
    [setPrivateBookingCoachPaymentRuleActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [setPrivateBookingCoachPaymentRuleActions.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [setPrivateBookingCoachPaymentRuleActions.success]: (
      state,
      { payload },
    ) => {
      const index = state.performance.private_service.byAssociatedCoachId[
        payload.associatedCoachId
      ].findIndex((s) => s.private_booking_id === payload.privateBookingId);
      const private_service =
        state.performance.private_service.byAssociatedCoachId[
          payload.associatedCoachId
        ][index];
      const updatedPrivateService = {
        ...private_service,
        ...payload.data,
      };
      return state.setIn(
        [
          'performance',
          'private_service',
          'byAssociatedCoachId',
          payload.associatedCoachId,
          index,
        ],
        updatedPrivateService,
      );
    },
    [showDialog]: (state, { payload }) => {
      return state.set('dialog', payload);
    },
    [showSimulationDialog]: (state, { payload }) => {
      return state.set('simulationDialog', payload);
    },
  },
  initialState,
);
