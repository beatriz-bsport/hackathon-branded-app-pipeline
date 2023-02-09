import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { RootState } from '../../reducers';

import type {
  Cadence,
  CadenceConnectedTriggerConfig,
  CadenceStep,
} from './types';
import { getSmartListDict } from '#libs/smart-list/selectors';

type Selector<S> = (state: RootState, id: number) => S;

const _getCadenceAllIds = (state: RootState) => state.cadence.cadence.allIds;
const _getCadencebyId = (state: RootState) => state.cadence.cadence.byId;
const _getStepAllIIds = (state: RootState) => state.cadence.step.allIds;
const _getStepById = (state: RootState) => state.cadence.step.byId;

export const getCadenceLoading = (state: RootState) =>
  state.cadence.cadence.loading;

export const getStepLoading = (state: RootState) => state.cadence.step.loading;

export const getCadencesList = createSelector(
  [_getCadenceAllIds, _getCadencebyId],
  (ids, data) => ids.map((_id) => data[_id]),
);

export const getCadence: Selector<Cadence> = (state: RootState, id: number) =>
  _getCadencebyId(state)[id];

export const getCadenceStep: Selector<CadenceStep> = (
  state: RootState,
  id: number,
) => _getStepById(state)[id];

export const getCadenceOnlyActiveCTs = createSelector(
  [getCadence],
  (cadence) => ({
    ...cadence,
    entries: cadence?.entries?.filter((ct) => !ct.disabled),
    exits: cadence?.exits?.filter((ct) => !ct.disabled),
  }),
);

export const getEnabledCadencesList = createSelector(
  [getCadencesList],
  (cadenceList) => cadenceList.filter((cadence) => !cadence.archived),
);

export const getDisabledCadencesList = createSelector(
  [getCadencesList],
  (cadenceList) => cadenceList.filter((cadence) => cadence.archived),
);

export const getStepsList = createSelector(
  [_getStepAllIIds, _getStepById],
  (ids, data) => ids.map((_id) => data[_id]),
);

export const getEnabledStepsList = createSelector([getStepsList], (stepList) =>
  stepList.filter((step) => !step.disabled),
);

export const getDisabledStepsList = createSelector([getStepsList], (stepList) =>
  stepList.filter((step) => step.disabled),
);

export const withSteps = memoize((selector: Selector<Cadence>) =>
  createSelector([selector, _getStepById], (cadences, stepsData) => {
    if (!cadences) {
      return cadences;
    }
    if (Array.isArray(cadences)) {
      return cadences.map((cadence) => ({
        ...cadence,
        steps: cadence.steps.map((_step: number) => stepsData[_step]),
      }));
    }
    return {
      ...cadences,
      steps: cadences.steps?.map((_step) => stepsData[_step]),
    };
  }),
);

export const withSmartLists = memoize((selector: Selector<Cadence>) =>
  createSelector([selector, getSmartListDict], (cadence, smartListDict) => {
    if (!cadence) {
      return cadence;
    }
    return {
      ...cadence,
      entries: cadence.entries?.map((entry: CadenceConnectedTriggerConfig) => {
        return {
          ...entry,
          filtering_config: {
            ...entry?.filtering_config,
            smartlist: smartListDict[entry?.filtering_config?.smartlist_pk],
          },
        };
      }),
      exits: cadence.exits?.map((exit: CadenceConnectedTriggerConfig) => ({
        ...exit,
        filtering_config: {
          ...exit?.filtering_config,
          smartlist: smartListDict[exit?.filtering_config?.smartlist_pk],
        },
      })),
    };
  }),
);
