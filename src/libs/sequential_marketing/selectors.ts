import { createSelector } from 'reselect';

import type { RootState } from '../../reducers';

import {
  INITIAL_GLOBAL_METRICS,
  INITIAL_MEMBERS_IN_DATA,
  INITIAL_MEMBERS_OUT_DATA,
} from './constants';

const _getCadenceAllIds = (state: RootState) => state.cadence.cadence.allIds;
const _getCadencebyId = (state: RootState) => state.cadence.cadence.byId;
const _getStepAllIIds = (state: RootState) => state.cadence.step.allIds;
const _getStepById = (state: RootState) => state.cadence.step.byId;
const _getStepMarketingActionsAllIds = (state: RootState) =>
  state.cadence.marketingActions.allIds;
const _getStepMarketingActionsById = (state: RootState) =>
  state.cadence.marketingActions.byId;
const _getStepMarketingActionsByStepId = (state: RootState) =>
  state.cadence.marketingActions.byStepId;

const _getGlobalMetricsByCadenceId = (state: RootState) =>
  state.cadence.metrics.globalMetrics.byCadenceId;
const _getMembersPresentByCadenceId = (state: RootState) =>
  state.cadence.metrics.membersPresent.byCadenceId;
const _getMembersHistoricByCadenceId = (state: RootState) =>
  state.cadence.metrics.membersHistoric.byCadenceId;

export const getCadenceLoading = (state: RootState) =>
  state.cadence.cadence.loading;

export const getCadenceError = (state: RootState) =>
  state.cadence.cadence.error;

export const getStepLoading = (state: RootState) => state.cadence.step.loading;

export const getCadencesList = createSelector(
  [_getCadenceAllIds, _getCadencebyId],
  (ids, data) => ids.map((_id) => data[_id]),
);

export const getCadence = (state: RootState, id: number) =>
  _getCadencebyId(state)[id];

export const getCadenceStep = (state: RootState, id: number) =>
  _getStepById(state)[id];

export const getCadenceOnlyActiveCTs = createSelector(
  [getCadence],
  (cadence) => ({
    ...cadence,
    entries: cadence?.entries?.filter(
      (connected_trigger) => !connected_trigger.disabled,
    ),
    exits: cadence?.cadence_exits?.filter(
      (connected_trigger) => !connected_trigger.disabled,
    ),
  }),
);

export const getEnabledCadencesList = createSelector(
  [getCadencesList],
  (cadenceList) => cadenceList.filter((cadence) => !cadence.archived),
);

export const getArchivedCadencesList = createSelector(
  [getCadencesList],
  (cadenceList) => cadenceList.filter((cadence) => cadence.archived),
);

export const getStepsList = createSelector(
  [_getStepAllIIds, _getStepById],
  (ids, data) => ids.map((_id) => data[_id]),
);

export const getCadenceStepList = createSelector(
  [getStepsList, (_, cadenceId: number) => cadenceId],
  (stepList, id) => stepList.filter((step) => step?.cadence === id),
);

export const getEnabledStepsList = createSelector([getStepsList], (stepList) =>
  stepList.filter((step) => !step.disabled),
);

export const getDisabledStepsList = createSelector([getStepsList], (stepList) =>
  stepList.filter((step) => step.disabled),
);

export const getStepMarketingActionsLoading = (state: RootState) =>
  state.cadence.marketingActions.loading;
export const getStepMarketingActionsUpsertLoading = (state: RootState) =>
  state.cadence.marketingActions.upsert.loading;

export const getMarketingActionsList = createSelector(
  [_getStepMarketingActionsAllIds, _getStepMarketingActionsById],
  (ids, data) => ids.map((_id) => data[_id]),
);

export const getEnabledMarketingActionsList = createSelector(
  [getMarketingActionsList],
  (marketingAction) =>
    marketingAction.filter((marketing_action) => !marketing_action.disabled),
);

export const getDisablededMarketingActionsList = createSelector(
  [getMarketingActionsList],
  (marketingAction) =>
    marketingAction.filter((marketing_action) => marketing_action.disabled),
);

export const getStepMarketingActionsByStepId = createSelector(
  [_getStepMarketingActionsByStepId, (_: RootState, id: number) => id],
  (marketingActionbyStepId, id) => marketingActionbyStepId[id] ?? [],
);

export const getStepMemberCount = (state: RootState, stepId: number) =>
  state.cadence.step.memberIdsInStepByStepId?.data[stepId]?.length ?? 0;

export const getCadenceGlobalMetrics = createSelector(
  [_getGlobalMetricsByCadenceId, (_: RootState, id: number) => id],
  (globalMetricsByCadenceId, cadenceId) =>
    globalMetricsByCadenceId[cadenceId] ?? INITIAL_GLOBAL_METRICS,
);

export const getCadenceMembersHistoric = createSelector(
  [_getMembersHistoricByCadenceId, (_: RootState, id: number) => id],
  (membersHistoricByCadenceId, cadenceId) =>
    membersHistoricByCadenceId[cadenceId] ?? INITIAL_MEMBERS_OUT_DATA,
);

export const getCadenceMembersPresent = createSelector(
  [_getMembersPresentByCadenceId, (_: RootState, id: number) => id],
  (membersPresentByCadenceId, cadenceId) =>
    membersPresentByCadenceId[cadenceId] ?? INITIAL_MEMBERS_IN_DATA,
);

export const getCadenceGlobalMetricsLoading = (state: RootState): boolean =>
  state.cadence.metrics.globalMetrics.loading;

export const getCadenceMembersHistoricLoading = (state: RootState): boolean =>
  state.cadence.metrics.membersHistoric.loading;

export const getCadenceMembersPresentLoading = (state: RootState): boolean =>
  state.cadence.metrics.membersPresent.loading;
