// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const getMemberDetailData = (state) => state.member.detailData;
const _getMemberListIds = (state) => state.member.allIds;
const _getSearchedMemberIds = (state) => state.member.search.allIds;
const _getMemberHistoryIds = (state) => state.member.historyListIds;

const getMemberListData = (state) => state.member.listData;

export const getAllMembers = createSelector(
  [getMemberListData, _getMemberListIds],
  (data, ids) => ids.map((id) => data[id]).filter((m) => !!m),
);

export const getSearchedMembers = createSelector(
  [_getSearchedMemberIds, getMemberListData],
  (ids, data) => ids.map((id) => data[id]).filter((m) => !!m),
);

export const getMember = (state: State, id: number) => {
  const detail = getMemberDetailData[id];
  if (detail) return detail;
  return getMemberListData[id];
};

export const getMemberDetail = (state, id) => {
  return getMemberDetailData(state)[id];
};

export const getMemberHistory = createSelector(
  [getMemberListData, _getMemberHistoryIds],
  (data, ids) => ids.map((id) => data[id]).filter((m) => !!m),
);

export default { getAllMembers };
