// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import type { State } from '../../state/types';
import { getEventState } from '../event/selectors';
import {
  getPaymentPackById,
  getAllPaymentPacks as getPaymentPackList,
} from '../payment-packs/selectors';
import { getPrivatePassById } from '../private-service/selectors/private-pass';

const _getContractIds = (state: State) => state.subscription.contract.allIds;
const _getContractData = (state: State) => state.subscription.contract.byId;

export const getContract = (state: State, id: number) => {
  return state.subscription.contract.byId[id];
};

const _getContractMarketplaceIds = (state: State) =>
  state.subscription.contract.byMarketplace.allIds;

export const getAvailableContractList = createSelector(
  [_getContractIds, _getContractData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getAvailableContractListManager = createSelector(
  getAvailableContractList,
  (contractList) => contractList.filter((c) => !!c.manager_only),
);

export const getAvailableContractListCustomer = createSelector(
  getAvailableContractList,
  (contractList) => contractList.filter((c) => !c.manager_only),
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
  [_getContractData, _getContractMarketplaceIds],
  (contractData, ids) => ids.map((id) => contractData[id]),
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

export const get = createSelector(
  [
    _getSubscriptionData,
    (state, id) => id,
    getPaymentPackById,
    getPrivatePassById,
  ],
  (subscriptionData, id, packData, privatePassData) => {
    const subscription = subscriptionData[id];
    if (!subscription) return null;
    return {
      ...subscription,
      payment_pack: packData[subscription.payment_pack],
      private_pass: privatePassData[subscription.private_pass],
    };
  },
);

export const withPaymentPack = memoize((selector: (State) => any) =>
  createSelector(
    [selector, getPaymentPackById, getPrivatePassById],
    (contracts, paymentPackData, privatePassData) => {
      if (!contracts) return null;
      if (!Array.isArray(contracts)) {
        return {
          ...contracts,
          payment_pack: paymentPackData[contracts.payment_pack],
          private_pass: privatePassData[contracts.private_pass],
        };
      }
      return contracts.map((c) => ({
        ...c,
        payment_pack: paymentPackData[c.payment_pack],
        private_pass: privatePassData[c.private_pass],
      }));
    },
  ),
);

export const getSubscriptionByMemberPendingAction = createSelector(
  getSubscriptionListByMember,
  (subList) =>
    subList.filter(
      (sub) =>
        sub.payment_method === 2 &&
        !!sub.recurrent_price &&
        !(sub.has_ended || !!sub.canceled_at),
    ),
);

const _getContractForBookingIds = (state: State) =>
  state.subscription.contract.forBooking.allIds;

export const getContractForBooking = createSelector(
  [_getContractForBookingIds, _getContractData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getSubscriptionEventState = (state: State) =>
  getEventState(state.event, 'subscription');

export const getSubscriptionEventList = createSelector(
  [getSubscriptionEventState, _getSubscriptionData],
  (eventState, subscriptionData) => {
    return eventState.items.map((e) => ({
      ...e,
      subscription: subscriptionData[e.data.billing_plan],
    }));
  },
);

const _getPlannedInvoiceIds = (state) =>
  state.subscription.plannedInvoice.allIds;
const _getPlannedInvoiceData = (state) =>
  state.subscription.plannedInvoice.byId;

export const getPlannedInvoiceList = createSelector(
  [_getPlannedInvoiceIds, _getPlannedInvoiceData],
  (ids, data) => ids.map((id) => data[id]).filter((pl) => !!pl),
);

export default { get };
