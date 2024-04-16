import { createSelector } from 'reselect';

import type { RootState } from '../../reducers';

const getMemberVisitIds = (state: RootState) =>
  state.accessControl.memberVisit.allIds;

const getMemberVisitData = (state: RootState) =>
  state.accessControl.memberVisit.byId;

export const getMemberVisit = createSelector(
  [getMemberVisitData, (_, memberVisitId: number) => memberVisitId],
  (memberVisitData, memberVisitId) => {
    return memberVisitData?.[memberVisitId];
  },
);

export const getAllMemberVisits = createSelector(
  [getMemberVisitIds, getMemberVisitData],
  (allIds, memberVisitData) => {
    return allIds
      ?.map((id) => memberVisitData?.[id])
      ?.filter((memberVisit) => !!memberVisit);
  },
);

export const getMemberVisitIsLoading = (state: RootState) =>
  state.accessControl.memberVisit.loading;

export const getMemberVisitLiveHistoryIsLoading = (state: RootState) => {
  return (
    state.accessControl.memberVisit.loading ||
    state.establishment.loading ||
    state.establishment.establishmentGroup.loading
  );
};

export const getAccessControlPolicy = (state: RootState) =>
  state.accessControl.policy.policy;
