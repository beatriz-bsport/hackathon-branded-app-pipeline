import { createSelector } from 'reselect';

import { Coach } from './types';
import { RootState } from '../../reducers';

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

export const getCoachLoading = (state: RootState) => state.coach.loading;

export const getAllCoaches = createSelector(
  [getAllCoachesId, getAllCoachesDict],
  (ids, data) => ids.map((id) => data[id]),
);

export const getCoachesBulk = (
  state: RootState,
  idList: Array<number>,
): Array<Coach> =>
  idList?.length ? idList.map((id) => state.coach.byId[id]) : [];

export const getActiveCoachesBulk = createSelector(getCoachesBulk, (coaches) =>
  coaches.filter((c) => !c.disabled),
);

export const getActiveCoaches = createSelector(getAllCoaches, (coaches) =>
  coaches.filter((c) => !c.disabled),
);

export const getInactiveCoaches = createSelector(getAllCoaches, (coaches) =>
  coaches.filter((c) => c.disabled),
);

export const getCoach = (state: RootState, id: number): Coach =>
  state.coach.byId[id];

export const getCoachById = (state: RootState) => (id: number) => {
  return state.coach.byId[id];
};

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

export const getFreshCoachIds = createSelector(getAllCoachesDict, (coachDict) =>
  Object.keys(coachDict).map((k) => parseInt(k, 10)),
);

export const getAllCoachesSelectedInRole = (state: RootState) =>
  state.auth.coaches_selected_in_role;

export const getCoachesSelectedInRole = createSelector(
  [getActiveCoaches, getAllCoachesSelectedInRole],
  (allCoaches, selectedCoaches) =>
    allCoaches.filter((c) => selectedCoaches?.includes(c.id)),
);

export const getInactiveCoachesSelectedInRole = createSelector(
  [getInactiveCoaches, getAllCoachesSelectedInRole],
  (allCoaches, selectedCoaches) =>
    allCoaches.filter((c) => selectedCoaches?.includes(c.id)),
);

export const getCoachLateReplacementRequestStatus = (state: RootState) =>
  state.coach.lateReplacementRequestStatus.data;

export const getCoachesByAssociatedCoachId = (state: RootState) =>
  state.coach.byAssociatedCoachId;
