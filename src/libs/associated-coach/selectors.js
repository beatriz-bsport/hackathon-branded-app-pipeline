// @flow

import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';
import type { CoachPerformanceContainer } from './types';

const EMPTY_PERFORMANCE: CoachPerformanceContainer = Immutable({
  loading: false,
  result: [],
  error: null,
});

export const getAllCoachesDict = (state: State): Array<Coach> =>
  state.coach.byId;

export const getCoachesList = (state: State): Array<Coach> =>
  state.coach.allIds;

export const getAllCoaches = createSelector(
  getAllCoachesDict,
  (coaches) => Immutable(Object.values(coaches)),
);

export const getActiveCoaches = createSelector(
  getAllCoaches,
  (coaches) => Immutable(Object.values(coaches)).filter((c) => !c.disabled),
);

export const getCoach = (state: State, id: number): Coach =>
  state.coach.byId[id];

export const getCoachWithPaymentRule = createSelector(
  getActiveCoaches,
  (coaches) => coaches.filter((coach) => !!coach.default_payment_rule_id),
);

export const associatedCoachSelector = {
  get: (state: State, coachId: number) =>
    Immutable(Object.values(getAllCoaches(state))).find(
      (co) => co.associated_coach_id === coachId,
    ),
  getActive: (state: State) =>
    Object.values(state.coach.byId).filter((c) => !c.disabled),
  withPaymentRule: (state: State) =>
    Object.values(state.coach.byId).filter(
      (x) => !!x.default_payment_rule_id && !x.disabled,
    ),
};

export const coachSelector = (state: State, coachId: number) =>
  state.coach.byId[coachId];

const getCoachPerformanceState = (state: State) => state.coach.performance;

const getCoachPerformanceStateById = (
  state: State,
  associatedCoachId: number,
) => {
  const performanceContainer = getCoachPerformanceState(state)[
    associatedCoachId
  ];
  if (performanceContainer) {
    return performanceContainer;
  }
  return EMPTY_PERFORMANCE;
};

const getCoachPerformance = createCachedSelector(
  [getCoachPerformanceStateById],
  (performanceContainer) => performanceContainer.result,
)((state, associatedCoachId) => associatedCoachId);

const isLoadingCoachPerformance = createCachedSelector(
  [getCoachPerformanceStateById],
  (performanceContainer) => performanceContainer.loading,
)((state, associatedCoachId) => associatedCoachId);

export const coachPerformanceSelector = {
  getPerformance: getCoachPerformance,
  isLoading: isLoadingCoachPerformance,
};
