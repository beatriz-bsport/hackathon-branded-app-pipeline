// @flow
import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import {
  getAll as getPaymentPacks,
  getPaymentPackById,
} from '../payment-packs/selectors';
import { getAllMembers } from '../member/selectors';
import type { State } from '../../state/types.ts';

const getState = (state) => state.consumerPaymentPack;

const getAllData = (state) => getState(state).byId;

export const getByPaymentPack = createSelector(
  getState,
  ({ byId, byPaymentPack }) => byPaymentPack.allIds.map((id) => byId[id]),
);

export const getConsumerPack = (state: State, id: number) =>
  state.consumerPaymentPack.byId[id];

export const getConsumerPaymentPackExtensions = (state: State) =>
  state.consumerPaymentPack.extension.items;

export const getConsumerPacksWithPaymentPack = createSelector(
  [getAllData, getPaymentPacks, getPaymentPackById],
  (consumerPacks, paymentPacks, paymentPackData) =>
    Object.values(consumerPacks).map((cpp) => ({
      ...cpp,
      payment_pack:
        paymentPacks.find(
          (pp) => pp.id === parseInt(cpp.payment_pack_id, 10),
        ) || paymentPackData[cpp.payment_pack],
    })),
);

export const getConsumerPacksByPackWithMember = createSelector(
  [getByPaymentPack, getAllMembers],
  (cpps, members) =>
    cpps
      .map((cpp) => ({
        ...cpp,
        consumer: members.find((m) => m.id === cpp.member_id),
      }))
      .map((cpp) => ({ ...cpp, member: cpp.consumer })),
);

const _getIdsByMember = (state) => getState(state).byMember.allIds;

export const getConsumerPaymentPackByMember = createSelector(
  [getAllData, _getIdsByMember],
  (data, ids) => ids.map((id) => data[id]),
);

export const getConsumerPacksByMemberWithPaymentPack = createSelector(
  [getConsumerPaymentPackByMember, getPaymentPacks, getPaymentPackById],
  (consumerPacks, paymentPacks, paymentPackData) =>
    consumerPacks.map((cpp) => ({
      ...cpp,
      payment_pack:
        paymentPacks.find(
          (pp) => pp.id === parseInt(cpp.payment_pack_id, 10),
        ) || paymentPackData[parseInt(cpp.payment_pack_id, 10)],
    })),
);

const _getForBookingIds = (state) =>
  state.consumerPaymentPack.forBooking.allIds;

export const getConsumerPaymentPackForBooking = createSelector(
  [_getForBookingIds, getAllData],
  (ids, data) => ids.map((id) => data[id]),
);

const _getByOfferByMemberBase = (state) => {
  return state.consumerPaymentPack.byOfferByMember.items;
};

export const getByOfferByMember = createSelector(
  _getByOfferByMemberBase,
  (consumerPackList) => consumerPackList.filter((cpp) => !cpp.reverted),
);

const _getNonCompatibleByOfferByMemberBase = (state) => {
  return state.consumerPaymentPack.nonCompatibleByOfferByMember.items;
};

export const getNonCompatibleByOfferByMember = createSelector(
  _getNonCompatibleByOfferByMemberBase,
  (consumerPackList) => consumerPackList.filter((cpp) => !cpp.reverted),
);

export const withPaymentPack = memoize((selector: (State) => any) =>
  createSelector(
    [selector, getPaymentPackById],
    (consumerPaymentPacks, paymentPackData) => {
      if (!consumerPaymentPacks) return consumerPaymentPacks;
      if (!Array.isArray(consumerPaymentPacks)) {
        return {
          ...consumerPaymentPacks,
          payment_pack:
            paymentPackData[
              consumerPaymentPacks.payment_pack
                ? consumerPaymentPacks.payment_pack
                : consumerPaymentPacks.payment_pack_id
            ],
        };
      }
      return consumerPaymentPacks.map((cpp) => ({
        ...cpp,
        payment_pack:
          paymentPackData[
            cpp.payment_pack ? cpp.payment_pack : cpp.payment_pack_id
          ],
      }));
    },
  ),
);

const _getConsumerPaymentPackCompatibleListIds = (state) =>
  state.consumerPaymentPack.compatible.allIds;

export const getConsumerPaymentPackCompatibleList = createSelector(
  [getAllData, _getConsumerPaymentPackCompatibleListIds],
  (data, ids) => {
    return ids.map((id) => data[id]);
  },
);
