// @flow

import memoize from 'memoize-one';
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { ConsumerPaymentPackLink, MemberRelation } from './types';

import { getMemberDetailData, getMemberListData } from '../member/selectors';
import { getConsumerPacksWithPaymentPack } from '../consumer-payment-pack/selectors';
import { getPrivateConsumerPassList } from '../private-service/selectors/private-consumer-pass';

const _getMemberRelations = (state: RootState): Array<MemberRelation> =>
  state.relationship.member_relation.items;

export const getMemberControlable = createSelector(
  [_getMemberRelations, (_: RootState, id: number) => id],
  (memberRelations, id) =>
    memberRelations.reduce((acc, memberRelation) => {
      if (
        memberRelation.dst_member === id &&
        memberRelation.is_dst_autorized_to_control_src
      ) {
        acc.push(memberRelation.src_member);
        return acc;
      }
      if (
        memberRelation.src_member === id &&
        memberRelation.is_src_autorized_to_control_dst
      ) {
        acc.push(memberRelation.dst_member);
        return acc;
      }
      return acc;
    }, []),
);

export const getMemberRelations = createSelector(
  [getMemberListData, _getMemberRelations, getMemberDetailData],
  (memberListData, relations, memberDetailData) =>
    relations.map((r) => ({
      ...r,
      src_member: memberListData?.[r.src_member] ||
        memberDetailData?.[r.src_member] || { id: r.src_member },
      dst_member: memberListData?.[r.dst_member] ||
        memberDetailData?.[r.dst_member] || { id: r.dst_member },
    })),
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

const _getConsumerPackWithLinks = (
  state: RootState,
): Array<ConsumerPaymentPackLink> =>
  state.relationship.consumer_payment_pack_link.byId;

export const withIsSharedActive = memoize((selector) =>
  createSelector([selector, _getConsumerPackWithLinks], (cppList, links) =>
    cppList.map((cpp) => ({
      ...cpp,
      isSharedActive:
        links[cpp.id] && links[cpp.id].length
          ? links[cpp.id].reduce((acc: number, e: ConsumerPaymentPackLink) => {
              return acc || e.is_active;
            }, 0)
          : false,
    })),
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

export const getMyControlableMemberList = (state: RootState) =>
  state.relationship.my_controlable_members.list;
