// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import { getAll as getPaymentPackList } from '../payment-packs/selectors';

const get = (state: State, id: number) => state.subscription.items[id];

const _getContractIds = (state: State) => state.subscription.contract.allIds;
const _getContractData = (state: State) => state.subscription.contract.byId;

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

export default { get };
