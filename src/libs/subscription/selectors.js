// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import { getAllPaymentPacks as getPaymentPackList } from '../payment-packs/selectors';

const get = (state: State, id: number) => state.subscription.byId[id];

const _getContractIds = (state: State) => state.subscription.contract.allIds;
const _getContractData = (state: State) => state.subscription.contract.byId;

export const getContract = (state, id) => state.subscription.contract.byId[id];

const _getContractMarketplaceIds = (state: State) =>
  state.subscription.contract.byMarketplace.allIds;

export const getAvailableContractList = createSelector(
  [_getContractIds, _getContractData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getAvailableContractListWithPaymentPack = createSelector(
  [getAvailableContractList, getPaymentPackList],
  (contractsList, packList) =>
    contractsList.map((c) => ({
      ...c,
      payment_pack: packList.find((pp) => pp.id === c.payment_pack),
    })),
);

export const getMarketplaceContractList = createSelector(
  [_getContractData, _getContractMarketplaceIds, getPaymentPackList],
  (contractData, ids, packList) =>
    ids
      .map((id) => contractData[id])
      .map((c) => ({
        ...c,
        payment_pack: packList.find((pp) => pp.id === c.payment_pack),
      })),
);

const _getSubscriptionIds = (state) => state.subscription.list.allIds;
const _getSubscriptionData = (state) => state.subscription.byId;

export const getSubscriptionList = createSelector(
  [_getSubscriptionIds, _getSubscriptionData],
  (ids, data) => ids.map((id) => data[id]),
);

const _getSubscriptionIdsByMember = (state) =>
  state.subscription.byMember.allIds;

export const getSubscriptionListByMember = createSelector(
  [_getSubscriptionIdsByMember, _getSubscriptionData],
  (ids, data) => ids.map((id) => data[id]),
);

export default { get };
