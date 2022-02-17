import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import Immutable from 'seamless-immutable';
import { Coach, CoachPerformanceContainer } from './types';
import { RootState } from '../../reducers';

const EMPTY_PERFORMANCE: CoachPerformanceContainer = Immutable({
  loading: false,
  result: [],
  error: null,
});

export const getAllCoachesDict = (state: RootState): { [key: string]: Coach } =>
  state.coach.byId;
export const getMyAssociatedCoachProfile = (state: RootState) =>
  state.coach.myAssociatedCoachProfile.me;
export const getAllCoachesId = (state: RootState): Array<number> =>
  state.coach.allIds;
export const getCoaches = createSelector(getAllCoachesDict, (coach) =>
  Object.values(coach),
);

export const getCoachesList = (state: RootState): Array<Coach> =>
  state.coach.allIds;

export const getAllCoaches = createSelector(
  [getAllCoachesId, getAllCoachesDict],
  (ids, data) => ids.map((id) => data[id]),
);

export const getActiveCoaches = createSelector(getAllCoaches, (coaches) =>
  coaches.filter((c) => !c.disabled),
);

export const getInactiveCoaches = createSelector(getAllCoaches, (coaches) =>
  coaches.filter((c) => c.disabled),
);

export const getCoach = (state: RootState, id: number): Coach =>
  state.coach.byId[id];

export const getCoachWithPaymentRule = createSelector(
  getActiveCoaches,
  (coaches) => coaches.filter((coach) => !!coach.default_payment_rule_id),
);
export const getCoachWithCoachPaymentRule = createSelector(
  getActiveCoaches,
  (coaches) =>
    coaches.filter(
      (coach) =>
        !!coach.coach_payment_rule_id || !!coach.private_coach_payment_rule_id,
    ),
);

export const associatedCoachSelector = {
  get: (state: RootState, coachId: number) =>
    Object.values(getAllCoaches(state)).find(
      (co) => co.associated_coach_id === coachId,
    ),
  getActive: (state: RootState) =>
    Object.values(state.coach.byId).filter((c) => !c.disabled),
  withPaymentRule: (state: RootState) =>
    Object.values(state.coach.byId).filter(
      (x) => !!x.default_payment_rule_id && !x.disabled,
    ),
};

export const coachSelector = (state: RootState, coachId: number) =>
  state.coach.byId[coachId];

const getCoachPerformanceState = (state: RootState) => state.coach.performance;

const getCoachPerformanceStateById = (
  state: RootState,
  associatedCoachId: number,
) => {
  const performanceContainer =
    getCoachPerformanceState(state)[associatedCoachId];
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

export const getFreshCoachIds = createSelector(getAllCoachesDict, (coachDict) =>
  Object.keys(coachDict).map((k) => parseInt(k, 10)),
);
