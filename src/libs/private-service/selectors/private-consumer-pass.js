// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { State } from '../../../state/types';
import type { PrivateConsumerPass } from '../types';
import { getMemberListData } from '../../member/selectors';
import { RootState } from '../../../reducers';

const _getPrivateConsumerPassIdList: (State) => Array<number> = (state) =>
  state.privateService.privateConsumerPass.allIds;

export const getPrivateConsumerPassDict: (State) => {
  [id: number]: PrivateConsumerPass,
} = (state) => state.privateService.privateConsumerPass.byId;

export const getPrivateConsumerPass = (state: State, id: number) =>
  getPrivateConsumerPassDict(state)[id];

export const getPrivateConsumerPassList: (State) => Array<PrivateConsumerPass> =
  createSelector(
    [_getPrivateConsumerPassIdList, getPrivateConsumerPassDict],
    (ids, data) => ids.map((id) => data[id]),
  );

export const getPrivateConsumerPassListWithCredit: (State) => Array<PrivateConsumerPass> =
  createSelector([getPrivateConsumerPassList], (privateConsumerPassList) =>
    privateConsumerPassList.filter(
      (pcp) => pcp.used_credits < pcp.private_pass.credits,
    ),
  );
export const excludeUnPaidPrivateConsumerPass = memoize(
  (
    selector: (
      state: RootState,
    ) => Array<PrivateConsumerPass> | PrivateConsumerPass,
  ) =>
    createSelector([selector], (pcpObject) => {
      if (!pcpObject) return null;
      if (!Array.isArray(pcpObject)) {
        return pcpObject.private_pass &&
          pcpObject.private_pass?.is_unpaid_private_booking_integration
          ? null
          : pcpObject;
      }
      return pcpObject.filter(
        (pcp: PrivateConsumerPass) =>
          !pcp.private_pass?.is_unpaid_private_booking_integration,
      );
    }),
);

export const withoutUniversalPrivateConsumerPass = memoize(
  (
    selector: (
      state: RootState,
    ) => Array<PrivateConsumerPass> | PrivateConsumerPass,
  ) =>
    createSelector([selector], (pcpObject) => {
      if (!pcpObject) return null;
      if (Array.isArray(pcpObject)) {
        return pcpObject.filter(
          (pcp: PrivateConsumerPass) => !pcp.linked_consumer_payment_pack,
        );
      }
      return pcpObject;
    }),
);

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

const _getIdsByMember = (state) =>
  state.privateService.privateConsumerPass.byMember.allIds;

export const getPrivateConsumerPassByMember = createSelector(
  [getPrivateConsumerPassDict, _getIdsByMember],
  (data, ids) => ids.map((id) => data[id]),
);

export const getPrivateConsumerPassMassExtension = (state: RootState) => {
  return state.privateService.privateConsumerPass.massExtension.allIds.map(
    (id) => {
      return state.privateService.privateConsumerPass.massExtension.byId[id];
    },
  );
};

export const getUnPaidBookingAvailabilityForPrivateslot = (
  state: RootState,
  id: number,
) => {
  return (
    state.privateService.privateSlot.unpaidBookingAvailability.byId[id] || false
  );
};
