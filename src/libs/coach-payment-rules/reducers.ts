import omit from 'lodash/omit';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchAllPaymentRules,
  coachPaymentRuleSetUpsert,
  coachPaymentRuleSetDelete,
  fetchAllPaymentRuleGroups,
  upsertPaymentGroupActions,
  coachPaymentRuleGroupDelete,
  coachPaymentSimulation,
  coachSessionPerformanceActions,
  coachBulkSessionPerformanceActions,
  coachPrivateServicePerformanceActions,
  coachBulkPrivateServicePerformanceActions,
  sessionCoachPaymentRule,
  setPrivateBookingCoachPaymentRuleActions,
  showDialog,
  showSimulationDialog,
  showGroupDialog,
  fetchCoachPerformanceCachedDataActions,
} from './actions';
import { CoachPaymentRuleState, CoachPerformanceCachedData } from './types';

const initialState: Immutable.Immutable<CoachPaymentRuleState> =
  Immutable<CoachPaymentRuleState>({
    items: {},
    loading: false,
    error: null,
    upsert: {
      loading: true,
      error: null,
    },
    dialog: false,
    simulationDialog: false,
    groupDialog: false,
    simulation: {
      error: null,
      result: {},
      loading: false,
    },
    performance: {
      session: {
        allIds: [],
        byAssociatedCoachId: {},
      },
      private_service: {
        allIds: [],
        byAssociatedCoachId: {},
      },

      loading: false,
      error: null,
      cached_data: {
        loading: false,
        error: null,
        allTimestamps: [],
        byTimestamp: {},
      },
    },
    groups: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
  });

export default handleActions(
  {
    [showDialog.toString().toString()]: (state, { payload }) => {
      return state.set('dialog', payload);
    },
    [showSimulationDialog.toString()]: (state, { payload }) => {
      return state.set('simulationDialog', payload);
    },
    [showGroupDialog.toString()]: (state, { payload }) => {
      return state.set('groupDialog', payload);
    },
    [fetchAllPaymentRules.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchAllPaymentRules.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchAllPaymentRules.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          // @ts-expect-error
          items: payload.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [coachPaymentRuleSetUpsert.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['items', payload.id], payload);
    },
    [coachPaymentRuleSetUpsert.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [coachPaymentRuleSetUpsert.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [coachPaymentRuleSetDelete.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.set('items', omit(state.items, payload.id));
    },
    [coachPaymentSimulation.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['simulation', 'result', payload.id], payload);
    },
    [coachPaymentSimulation.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['simulation', 'loading'], payload);
    },
    [coachPaymentSimulation.error.toString()]: (state, { payload }) => {
      return state.setIn(['simulation', 'error'], payload);
    },
    [coachPaymentSimulation.reset.toString()]: (state) => {
      return state.setIn(['simulation', 'result'], {});
    },
    [coachSessionPerformanceActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const allIds = [
        ...new Set([
          ...state.performance.session.allIds,
          // @ts-expect-error
          Number(payload.associatedCoachId),
        ]),
      ];
      // @ts-expect-error
      if (payload.sessionId) {
        // @ts-expect-error
        const index = state.performance.session.byAssociatedCoachId[
          // @ts-expect-error
          payload.associatedCoachId
        ].data.findIndex(
          // @ts-expect-error
          (sessionperf) => sessionperf.session_id === payload.sessionId,
        );
        return state.setIn(['performance', 'session', 'allIds'], allIds).setIn(
          [
            'performance',
            'session',
            'byAssociatedCoachId',
            // @ts-expect-error
            payload.associatedCoachId,
            'data',
            index,
          ],
          // @ts-expect-error
          payload.data[0],
        );
      }
      return state.setIn(['performance', 'session', 'allIds'], allIds).setIn(
        [
          'performance',
          'session',
          'byAssociatedCoachId',
          // @ts-expect-error
          [payload.associatedCoachId],
          'data',
        ],
        // @ts-expect-error
        payload.data,
      );
    },
    [coachSessionPerformanceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      if (!payload.associatedCoachId) {
        return state.setIn(['performance', 'loading'], payload.loading);
      }
      return state.setIn(['performance', 'loading'], payload.loading).setIn(
        [
          'performance',
          'session',
          'byAssociatedCoachId',
          // @ts-expect-error
          [payload.associatedCoachId],
          'loading',
        ],
        payload.loading,
      );
    },
    [coachSessionPerformanceActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['performance', 'error'], payload);
    },

    [coachBulkSessionPerformanceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'loading'], payload);
    },
    [coachBulkSessionPerformanceActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'error'], payload);
    },
    [coachBulkSessionPerformanceActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const allIds = [
        ...new Set([
          ...state.performance.session.allIds,
          ...Object.keys(payload).map((coachId) => Number(coachId)),
        ]),
      ];
      return state.merge(
        {
          performance: {
            session: {
              allIds: allIds,
              byAssociatedCoachId: payload,
            },
          },
        },
        { deep: true },
      );
    },
    [coachPrivateServicePerformanceActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const allIds = [
        ...new Set([
          ...state.performance.private_service.allIds,
          // @ts-expect-error
          Number(payload.associatedCoachId),
        ]),
      ];
      // @ts-expect-error
      if (payload.privateBookingId) {
        // @ts-expect-error
        const index = state.performance.private_service.byAssociatedCoachId[
          // @ts-expect-error
          payload.associatedCoachId
        ].data.findIndex(
          // @ts-expect-error
          (privateperf) =>
            // @ts-expect-error
            privateperf.private_booking_id === payload.privateBookingId,
        );
        return state
          .setIn(['performance', 'private_service', 'allIds'], allIds)
          .setIn(
            [
              'performance',
              'private_service',
              'byAssociatedCoachId',
              // @ts-expect-error
              payload.associatedCoachId,
              'data',
              index,
            ],
            // @ts-expect-error
            payload.data[0],
          );
      }
      return state
        .setIn(['performance', 'private_service', 'allIds'], allIds)
        .setIn(
          [
            'performance',
            'private_service',
            'byAssociatedCoachId',
            // @ts-expect-error
            [payload.associatedCoachId],
            'data',
          ],
          // @ts-expect-error
          payload.data,
        );
    },
    [coachPrivateServicePerformanceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      if (!payload.associatedCoachId) {
        return state.setIn(['performance', 'loading'], payload.loading);
      }
      return state.setIn(['performance', 'loading'], payload.loading).setIn(
        [
          'performance',
          'private_service',
          'byAssociatedCoachId',
          // @ts-expect-error
          [payload.associatedCoachId],
          'loading',
        ],
        payload.loading,
      );
    },
    [coachPrivateServicePerformanceActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'error'], payload);
    },

    [coachBulkPrivateServicePerformanceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'loading'], payload);
    },
    [coachBulkPrivateServicePerformanceActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'error'], payload);
    },
    [coachBulkPrivateServicePerformanceActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const allIds = [
        ...new Set([
          ...state.performance.private_service.allIds,
          ...Object.keys(payload).map((coachId) => Number(coachId)),
        ]),
      ];
      return state.merge(
        {
          performance: {
            private_service: {
              allIds: allIds,
              byAssociatedCoachId: payload,
            },
          },
        },
        { deep: true },
      );
    },
    [sessionCoachPaymentRule.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [sessionCoachPaymentRule.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [sessionCoachPaymentRule.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      const index = state.performance.session.byAssociatedCoachId[
        // @ts-expect-error
        payload.associatedCoachId
        // @ts-expect-error
      ].data.findIndex((s) => s.session_id === payload.sessionId);
      const session =
        // @ts-expect-error
        state.performance.session.byAssociatedCoachId[payload.associatedCoachId]
          .data[index];
      // @ts-expect-error
      const updatedSession = { ...session, ...payload.data };
      return state.setIn(
        [
          'performance',
          'session',
          'byAssociatedCoachId',
          // @ts-expect-error
          payload.associatedCoachId,
          'data',
          index,
        ],
        updatedSession,
      );
    },
    [setPrivateBookingCoachPaymentRuleActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [setPrivateBookingCoachPaymentRuleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [setPrivateBookingCoachPaymentRuleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      const index = state.performance.private_service.byAssociatedCoachId[
        // @ts-expect-error
        payload.associatedCoachId
      ].data.findIndex(
        // @ts-expect-error
        (s) => s.private_booking_id === payload.privateBookingId,
      );
      const private_service =
        // @ts-expect-error
        state.performance.private_service.byAssociatedCoachId[
          // @ts-expect-error
          payload.associatedCoachId
        ].data[index];
      const updatedPrivateService = {
        ...private_service,
        // @ts-expect-error
        ...payload.data,
      };
      return state.setIn(
        [
          'performance',
          'private_service',
          'byAssociatedCoachId',
          // @ts-expect-error
          payload.associatedCoachId,
          'data',
          index,
        ],
        updatedPrivateService,
      );
    },

    [fetchAllPaymentRuleGroups.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['groups', 'loading'], payload);
    },
    [fetchAllPaymentRuleGroups.error.toString()]: (state, { payload }) => {
      return state.setIn(['groups', 'error'], payload);
    },
    [fetchAllPaymentRuleGroups.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['groups', 'allIds'],
          // @ts-expect-error
          payload.map((g) => g.id),
        )
        .merge(
          {
            groups: {
              // @ts-expect-error
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [coachPaymentRuleGroupDelete.success.toString()]: (state, { payload }) => {
      return (
        state
          // @ts-expect-error
          .setIn(['groups', 'byId'], omit(state.groups.byId, payload.id))
          .setIn(
            ['groups', 'allIds'],
            // @ts-expect-error
            state.groups.allIds.filter((id) => id !== payload.id),
          )
      );
    },
    [upsertPaymentGroupActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      if (!state.groups.allIds.find((id) => id === payload.id)) {
        return (
          state
            // @ts-expect-error
            .setIn(['groups', 'byId', payload.id], payload)
            // @ts-expect-error
            .setIn(['groups', 'allIds'], [...state.groups.allIds, payload.id])
        );
      }
      // @ts-expect-error
      return state.setIn(['groups', 'byId', payload.id], payload);
    },
    [upsertPaymentGroupActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertPaymentGroupActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [fetchCoachPerformanceCachedDataActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['performance', 'cached_data', 'allTimestamps'],
          // @ts-expect-error
          payload?.map((data: CoachPerformanceCachedData) => data.timestamp),
        )
        .merge(
          {
            performance: {
              cached_data: {
                // @ts-expect-error
                byTimestamp: payload.reduce(
                  (
                    acc: { [timestamp: number]: CoachPerformanceCachedData },
                    ps: CoachPerformanceCachedData,
                  ) => {
                    acc[ps.timestamp] = ps;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [fetchCoachPerformanceCachedDataActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'cached_data', 'loading'], payload);
    },
    [fetchCoachPerformanceCachedDataActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['performance', 'cached_data', 'error'], payload);
    },
  },
  initialState,
);
