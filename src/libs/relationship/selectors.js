// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import type { MemberRelation } from './types';

import { getAll as getAllMember } from '../member/selectors';
import { getConsumerPacksWithPaymentPack } from '../consumer-payment-pack/selectors';

const _getMemberRelations = (state: State): Array<MemberRelation> =>
  state.relationship.member_relation.items;

export const getMemberRelations = createSelector(
  [getAllMember, _getMemberRelations],
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

export const getMemberRelationById = (state: State, id: number) =>
  getMemberRelations(state).find((mr) => mr.id === id);

const _getConsumerPackLinks = (state: State) =>
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
  state: State,
  relationId: number,
) =>
  getAllSharedConsumerPaymentPacks(state).filter(
    (scpp) => scpp.member_relation === relationId,
  );
