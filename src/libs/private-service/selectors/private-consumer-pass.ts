import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { PrivateConsumerPass } from '../types';
import { getMemberListData } from '../../member/selectors';
import { RootState } from '../../../reducers';
import { Member } from '#libs/member/types';

const _getPrivateConsumerPassIdList = (state: RootState) =>
  state.privateService.privateConsumerPass.allIds;

export const getPrivateConsumerPassDict = (state: RootState) =>
  state.privateService.privateConsumerPass.byId;

export const getPrivateConsumerPass = (state: RootState, id: number) =>
  getPrivateConsumerPassDict(state)[id];

export const getPrivateConsumerPassList = createSelector(
  [_getPrivateConsumerPassIdList, getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]),
);

export const getPrivateConsumerPassListWithCredit = createSelector(
  [getPrivateConsumerPassList],
  (privateConsumerPassList) =>
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

const _getPrivateConsumerPassByPrivateIds = (state: RootState) =>
  state.privateService.privateConsumerPass.byPrivatePass.allIds;

export const getPrivateConsumerPassByPrivatePass = createSelector(
  [_getPrivateConsumerPassByPrivateIds, getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]).filter((cpp) => !!cpp),
);

export const withMember = memoize(
  (
    selector: (
      state: RootState,
    ) => PrivateConsumerPass | Array<PrivateConsumerPass>,
  ) =>
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

export const getConsumerPrivatePassByPrivatePassWithMember: (
  state: RootState,
) => Array<PrivateConsumerPass<Member>> = createSelector(
  [getPrivateConsumerPassByPrivatePass, getMemberListData],
  (cpps, membersDict) =>
    cpps.map((cpp) => ({ ...cpp, member: membersDict[cpp.member] })),
);

const _getPrivateConsumerPassCompatibleListIds = (state: RootState) =>
  state.privateService.privateConsumerPass.compatible.allIds;

const _getPrivateConsumerPassNonCompatibleListIds = (state: RootState) =>
  state.privateService.privateConsumerPass.noncompatible.allIds;

export const getConsumerPassIncompatibilitiesReasons = (state: RootState) =>
  state.privateService.privateConsumerPass.incompatibilitiesBySlotByConsumerPass
    .byId;

export const getPrivateConsumerPassCompatibleList = createSelector(
  [_getPrivateConsumerPassCompatibleListIds, getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]).filter((cpp) => !!cpp),
);

export const getPrivateConsumerPassNonCompatibleList = createSelector(
  [_getPrivateConsumerPassNonCompatibleListIds, getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]).filter((cpp) => !!cpp),
);

export const getPrivateConsumerPassNonCompatibleIsLoading = (
  state: RootState,
) => state.privateService.privateConsumerPass.noncompatible.loading;

const _getIdsByMember = (state: RootState) =>
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
) =>
  state.privateService.privateSlot.unpaidBookingAvailability.byId[id] || false;
