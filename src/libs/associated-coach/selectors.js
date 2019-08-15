// @flow

import createCachedSelector from 're-reselect';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';
import type { CoachPerformanceContainer } from './types';

const EMPTY_PERFORMANCE: CoachPerformanceContainer = Immutable({
  loading: false,
  result: [],
  error: null,
});

export const associatedCoachSelector = {
  get: (state: State, coachId: number) =>
    state.coach.companyAssociated.find(
      (x) => x.associated_coach_id === coachId,
    ),
  getActive: (state: State) =>
    state.coach.companyAssociated.filter((c) => !c.disabled),
  withPaymentRule: (state: State) =>
    state.coach.companyAssociated.filter(
      (x) => !!x.default_payment_rule_id && !x.disabled,
    ),
};

export const coachSelector = (state: State, coachId: number) =>
  state.coach.companyAssociated.find((x) => x.id === coachId);

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
