// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { State } from '../../../state/types.ts';
import type { PrivateConsumerPass } from '../types.ts';
import { getMemberListData } from '../../member/selectors';

const _getPrivateConsumerPassIdList: (State) => Array<number> = (state) =>
  state.privateService.privateConsumerPass.allIds;

export const getPrivateConsumerPassDict: (State) => {
  [id: number]: PrivateConsumerPass,
} = (state) => state.privateService.privateConsumerPass.byId;

export const getPrivateConsumerPass = (state: State, id: number) =>
  getPrivateConsumerPassDict(state)[id];

export const getPrivateConsumerPassList: (State) => Array<PrivateConsumerPass> = createSelector(
  [_getPrivateConsumerPassIdList, getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]),
);

// eslint-disable-next-line
export const getPrivateConsumerPassListWithCredit: (State) => Array<PrivateConsumerPass> = createSelector(
  [getPrivateConsumerPassList],
  (privateConsumerPassList) =>
    privateConsumerPassList.filter(
      (pcp) => pcp.used_credits < pcp.private_pass.credits,
    ),
);

// -------------------------

const _getPrivateConsumerPassDict = (state) =>
  state.privateService.privateConsumerPass.byId;
const _getPrivateConsumerPassByPrivateIds = (state) =>
  state.privateService.privateConsumerPass.byPrivatePass.allIds;

export const getPrivateConsumerPassByPrivatePass = createSelector(
  [_getPrivateConsumerPassByPrivateIds, _getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]).filter((cpp) => !!cpp),
);

export const withMember = memoize((selector) =>
  createSelector(
    [selector, getMemberListData],
    (privateConsumerPass, memberData) => {
      if (!privateConsumerPass) return privateConsumerPass;
      if (Array.isArray(privateConsumerPass)) {
        return privateConsumerPass.map((cpp) => ({
          ...cpp,
          member: memberData[cpp.member],
        }));
      }
      return {
        ...privateConsumerPass,
        member: memberData[privateConsumerPass.member],
      };
    },
  ),
);

export const getConsumerPrivatePassByPrivatePassWithMember = createSelector(
  [getPrivateConsumerPassByPrivatePass, getMemberListData],
  (cpps, membersDict) =>
    cpps.map((cpp) => ({ ...cpp, member: membersDict[cpp.member] })),
);

const _getPrivateConsumerPassCompatibleListIds = (state) =>
  state.privateService.privateConsumerPass.compatible.allIds;

export const getPrivateConsumerPassCompatibleList = createSelector(
  [_getPrivateConsumerPassCompatibleListIds, _getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]).filter((cpp) => !!cpp),
);

const _getIdsByMember = (state) => state.privateService.privateConsumerPass.byMember.allIds;

export const getPrivateConsumerPassByMember = createSelector(
  [getPrivateConsumerPassDict, _getIdsByMember],
  (data, ids) => ids.map((id) => data[id]),
);
