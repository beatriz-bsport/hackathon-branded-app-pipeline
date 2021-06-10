// @flow

import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { MemberRelation } from './types';

import { getAllMembers } from '../member/selectors';
import { getConsumerPacksWithPaymentPack } from '../consumer-payment-pack/selectors';
import { getPrivateConsumerPassList } from '../private-service/selectors/private-consumer-pass';

const _getMemberRelations = (state: RootState): Array<MemberRelation> =>
  state.relationship.member_relation.items;

export const getMemberRelations = createSelector(
  [getAllMembers, _getMemberRelations],
  (members, relations) =>
    relations.map((r) => {
      const dst_member = members.find((m) => m.id === r.dst_member);
      const src_member = members.find((m) => m.id === r.src_member);
      return {
        ...r,
        src_member: src_member || { id: r.src_member },
        dst_member: dst_member || { id: r.dst_member },
      };
    }),
);

export const getMemberRelationById = (state: RootState, id: number) =>
  getMemberRelations(state).find((mr) => mr.id === id);

const _getConsumerPackLinks = (state: RootState) =>
  state.relationship.consumer_payment_pack_link.items;

export const getAllSharedConsumerPaymentPacks = createSelector(
  [_getConsumerPackLinks, getConsumerPacksWithPaymentPack],
  (consumerPackLinks, consumerPacks) =>
    consumerPackLinks
      .map((link) => ({
        ...link,
        src: consumerPacks.find((cpp) => cpp.id === link.src),
        dst: consumerPacks.find((cpp) => cpp.id === link.dst),
      }))
      .filter(
        (cpp_link) =>
          (cpp_link.src && cpp_link.src.id) ||
          (cpp_link.dst && cpp_link.dst.id),
      ),
);

export const getSharedConsumerPacksByRelation = (
  state: RootState,
  relationId: number,
) =>
  getAllSharedConsumerPaymentPacks(state).filter(
    (scpp) => scpp.member_relation === relationId,
  );

const _getPrivateConsumerPassLinks = (state: RootState) =>
  state.relationship.private_consumer_pass_link.items;

export const getAllSharedPrivateConsumerPasses = createSelector(
  [_getPrivateConsumerPassLinks, getPrivateConsumerPassList],
  (privateConsumerPassLinks, privateConsumerPasses) =>
    privateConsumerPassLinks
      .map((link) => ({
        ...link,
        src: privateConsumerPasses.find((pcp) => pcp.id === link.src),
        dst: privateConsumerPasses.find((pcp) => pcp.id === link.dst),
      }))
      .filter(
        (pcp_link) =>
          (pcp_link.src && pcp_link.src.id) ||
          (pcp_link.dst && pcp_link.dst.id),
      ),
);

export const getSharedPrivateConsumerPassesByRelation = (
  state: RootState,
  relationId: number,
) =>
  getAllSharedPrivateConsumerPasses(state).filter(
    (spcp) => spcp.member_relation === relationId,
  );

export const getMyRelatedMemberList = (state: RootState) =>
  state.relationship.my_related_members.list;
