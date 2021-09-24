import { memoize } from 'lodash';
import { createSelector } from 'reselect';

import { RootState } from '../../reducers';
import { getMembership } from '../membership/selectors';

export const getMemberDetailData = (state: RootState) =>
  state.member.detailData;
const _getMemberListIds = (state: RootState) => state.member.allIds;
const _getSearchedMemberIds = (state: RootState) =>
  state.member.search.allIds || [];
const _getMemberHistoryIds = (state: RootState) => state.member.historyListIds;

export const getMemberListData = (state: RootState) => state.member.listData;

export const getAllMembers = createSelector(
  [getMemberListData, _getMemberListIds],
  (data, ids) => ids.map((id) => data[id]).filter((m) => !!m),
);

export const getSearchedMembers = createSelector(
  [_getSearchedMemberIds, getMemberListData],
  (ids, data) => ids.map((id) => data[id]).filter((m) => !!m),
);

export const getMember = (state: RootState, id: number) => {
  const detail = getMemberDetailData(state)[id];
  if (detail) return detail;
  return getMemberListData(state)[id];
};

export const getMemberDetail = (state: RootState, id: number) => {
  return getMemberDetailData(state)[id];
};

export const getMemberThroughMembership = memoize(
  (selector: (state: RootState) => any) =>
    createSelector([selector, getMembership], (memberdetail, membership) => {
      if (!memberdetail || !membership) return null;
      return memberdetail[membership.id];
    }),
);

export const getMemberHistory = createSelector(
  [getMemberListData, _getMemberHistoryIds],
  (data, ids) => ids.map((id) => data[id]).filter((m) => !!m),
);

export default { getAllMembers };
export const getMemberDict = (state: RootState) => state.member.byId;

export const getMemberListId = (state: RootState) =>
  state.member.communication.allPageIds;

export const getPaginatedMembers = createSelector(
  [getMemberDict, getMemberListId],
  (memberDict, IdList) => IdList.map((id) => memberDict[id]),
);

export const getListCountMembers = (state: RootState) => state.member.listCount;
