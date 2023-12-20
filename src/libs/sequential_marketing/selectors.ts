import { createSelector } from 'reselect';

import type { RootState } from '../../reducers';

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

// TODO: make it use actual information of the workflows
export const getStepMemberCount = (state: RootState, id: number) => id * 200;
