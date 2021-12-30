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
import { getPaymenComboDataDict as getPaymentComboById } from '../payment-combo/selectors';

import type { Subscription } from './types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PaymentCombo } from '#libs/payment-combo/types';

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

export const getActiveContractList = createSelector(
  getAvailableContractList,
  (contractList) => contractList.filter((c) => !c.disabled),
);

export const getInactiveContractList = createSelector(
  getAvailableContractList,
  (contractList) => contractList.filter((c) => c.disabled),
);

export const getAvailableContractListManager = createSelector(
  getActiveContractList,
  (contractList) => contractList.filter((c) => !!c.manager_only),
);

export const getAvailableContractListCustomer = createSelector(
  getActiveContractList,
  (contractList) => contractList.filter((c) => !c.manager_only),
);

export const getAvailableContractListWithPaymentPack = createSelector(
  [getActiveContractList, getPaymentPackList],
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

export const get: Subscription<PrivatePass, PaymentPack, PaymentCombo> =
  createSelector(
    [
      _getSubscriptionData,
      (state, id) => id,
      getPaymentPackById,
      getPrivatePassById,
      getPaymentComboById,
    ],
    (subscriptionData, id, packData, privatePassData, paymentComboData) => {
      const subscription = subscriptionData[id];
      if (!subscription) return null;
      return {
        ...subscription,
        payment_pack: packData[subscription.payment_pack],
        private_pass: privatePassData[subscription.private_pass],
        payment_combo: paymentComboData[subscription.payment_combo],
      };
    },
  );

export const withPaymentPack = memoize((selector: (State) => any) =>
  createSelector(
    [selector, getPaymentPackById, getPrivatePassById, getPaymentComboById],
    (contracts, paymentPackData, privatePassData, paymentComboData) => {
      if (!contracts) return null;
      if (!Array.isArray(contracts)) {
        return {
          ...contracts,
          payment_pack: paymentPackData[contracts.payment_pack],
          private_pass: privatePassData[contracts.private_pass],
          payment_combo: paymentComboData[contracts.payment_combo],
        };
      }
      return contracts.map((c) => ({
        ...c,
        payment_pack: paymentPackData[c.payment_pack],
        private_pass: privatePassData[c.private_pass],
        payment_combo: paymentComboData[c.payment_combo],
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

const _getContractPauseData = (state) => state.subscription.contractPause.byId;
const _getContractPauseIds = (state) => state.subscription.contractPause.allIds;

export const getContractPauseList = createSelector(
  [_getContractPauseIds, _getContractPauseData, _getSubscriptionData],
  (ids, data, subData) =>
    ids
      .map((id) => data[id])
      .map((cp) => {
        return {
          ...cp,
          billing_plan_invalid_ids: [
            ...cp.billing_plan_errors,
            ...cp.billing_plan_impossible,
          ].map((t) => t[0]),
          billing_plan_success_ids: cp.billing_plan_success.map((t) => t[0]),
          billing_plan_success: cp.billing_plan_success.map(
            (id) => subData[id[0]],
          ),
          billing_plan_invalid: [
            ...cp.billing_plan_errors,
            ...cp.billing_plan_impossible,
          ].map((id) => subData[id[0]]),
        };
      }),
);

export default { get };
