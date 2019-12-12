import { createSelector } from 'reselect';
import { getAll as getPaymentPacks } from '../payment-packs/selectors';
import { getAll as getAllMembers } from '../member/selectors';

const getState = (state) => state.consumerPaymentPack;

const getAllData = (state) => getState(state).byId;

export const getByPaymentPack = createSelector(
  getState,
  ({ byId, byPaymentPack }) => byPaymentPack.allIds.map((id) => byId[id]),
);

export const getConsumerPack = (state, id) =>
  state.consumerPaymentPack.byId[id];

export const getConsumerPaymentPackExtensions = (state) =>
  state.consumerPaymentPack.extension.items;

export const getConsumerPacksWithPaymentPack = createSelector(
  [getAllData, getPaymentPacks],
  (consumerPacks, paymentPacks) =>
    Object.values(consumerPacks).map((cpp) => ({
      ...cpp,
      payment_pack: paymentPacks.find(
        (pp) => pp.id === parseInt(cpp.payment_pack_id, 10),
      ),
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
  [getConsumerPaymentPackByMember, getPaymentPacks],
  (consumerPacks, paymentPacks) =>
    Object.values(consumerPacks).map((cpp) => ({
      ...cpp,
      payment_pack: paymentPacks.find(
        (pp) => pp.id === parseInt(cpp.payment_pack_id, 10),
      ),
    })),
);
