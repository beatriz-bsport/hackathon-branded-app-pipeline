import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { State } from '../../state/types';
import { getEventState } from '../event/selectors';
import {
  getPaymentPackById,
  getAllPaymentPacks as getPaymentPackList,
} from '#src/libs/payment-packs/selectors';
import { getPrivatePassById } from '../private-service/selectors/private-pass';
import { getPaymentComboDataDict as getPaymentComboById } from '../payment-combo/selectors';
import { withMember } from '../order/selectors';

import type { ContractWithPaymentPack, Subscription } from './types';
import { RootState } from '../../reducers';

const _getContractIds = (state: State) => state.subscription.contract.allIds;
export const getContractsById = (state: State) =>
  state.subscription.contract.byId;

export const getContract = (state: State, id: number) => {
  return state.subscription.contract.byId[id];
};

const _getContractMarketplaceIds = (state: State) =>
  state.subscription.contract.byMarketplace.allIds;

export const getAvailableContractList = createSelector(
  [_getContractIds, getContractsById],
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
  (contractList) =>
    contractList.filter(
      (contract) => contract.manager_only || !contract.is_usable_by_staff,
    ),
);

export const getAvailableContractListCustomer = createSelector(
  getActiveContractList,
  (contractList) =>
    contractList.filter(
      (contract) => !contract.manager_only && contract.is_usable_by_staff,
    ),
);

// @ts-expect-error
export const getAvailableContractListWithPaymentPack: (
  state: RootState,
) => ContractWithPaymentPack<number, number> = createSelector(
  [getActiveContractList, getPaymentPackList],
  (contractsList, paymentPackList) =>
    contractsList
      .filter((contract) => contract.is_usable_by_staff)
      .map((contract) => ({
        ...contract,
        payment_pack: paymentPackList.find(
          (paymentPack) => paymentPack.id === contract.payment_pack,
        ),
      })),
);

export const getMarketplaceContractList = createSelector(
  [getContractsById, _getContractMarketplaceIds],
  (contractData, ids) => ids.map((id) => contractData[id]),
);

// @ts-expect-error
const _getSubscriptionIds = (state) => state.subscription.list.allIds;
// @ts-expect-error
const _getSubscriptionData = (state) => state.subscription.byId;

export const getSubscriptionDetail = (state: RootState, id: number) =>
  state.subscription.byId[id] ?? {};

export const getSubscriptionList = createSelector(
  [_getSubscriptionIds, _getSubscriptionData],
  // @ts-expect-error
  (ids, data) => ids.map((id) => data[id]),
);

// @ts-expect-error
const _getSubscriptionIdsByMember = (state) =>
  state.subscription.byMember.allIds;

export const getSubscriptionListByMember = createSelector(
  [_getSubscriptionIdsByMember, _getSubscriptionData],
  // @ts-expect-error
  (ids, data) => ids.map((id) => data[id]),
);

// @ts-expect-error
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

// @ts-expect-error
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
      return contracts.map((c) => {
        let allPaymentPacks = [];
        if (c.payment_pack) {
          allPaymentPacks = paymentPackData[c.payment_pack]
            ? [paymentPackData[c.payment_pack]]
            : [];
        }
        if (c.payment_combo) {
          allPaymentPacks =
            paymentComboData[c.payment_combo]?.payment_packs
              ?.map((pp) => paymentPackData[pp.id])
              .filter((pp_) => !!pp_) ?? [];
        }
        return {
          ...c,
          payment_pack: paymentPackData[c.payment_pack],
          private_pass: privatePassData[c.private_pass],
          payment_combo: paymentComboData[c.payment_combo],
          allPaymentPacks,
        };
      });
    },
  ),
);

export const getSubscriptionByMemberPendingAction = createSelector(
  getSubscriptionListByMember,
  (subList) =>
    subList.filter(
      // @ts-expect-error
      (sub) =>
        sub.payment_method === 2 &&
        !!sub.recurrent_price &&
        !(sub.has_ended || !!sub.canceled_at),
    ),
);

const _getContractForBookingIds = (state: State) =>
  state.subscription.contract.forBooking.allIds;

export const getContractForBooking = createSelector(
  [_getContractForBookingIds, getContractsById],
  (ids, data) => ids.map((id) => data[id]),
);

export const getSubscriptionEventState = (state: State) =>
  // @ts-expect-error
  getEventState(state.event, 'subscription');

export const getSubscriptionEventList = createSelector(
  [getSubscriptionEventState, _getSubscriptionData],
  (eventState, subscriptionData) => {
    return eventState.items.map((e) => ({
      ...e,
      subscription: subscriptionData[e.data?.billing_plan ?? e.data?.id],
    }));
  },
);

// @ts-expect-error
const _getPlannedInvoiceIds = (state) =>
  state.subscription.plannedInvoice.allIds;
// @ts-expect-error
const _getPlannedInvoiceData = (state) =>
  state.subscription.plannedInvoice.byId;

export const getPlannedInvoiceList = createSelector(
  [_getPlannedInvoiceIds, _getPlannedInvoiceData],
  // @ts-expect-error
  (ids, data) => ids.map((id) => data[id]).filter((pl) => !!pl),
);

// @ts-expect-error
const _getContractPauseData = (state) => state.subscription.contractPause.byId;
// @ts-expect-error
const _getContractPauseIds = (state) => state.subscription.contractPause.allIds;

export const getContractPauseList = createSelector(
  [_getContractPauseIds, _getContractPauseData, _getSubscriptionData],
  (ids, data, subData) =>
    ids
      // @ts-expect-error
      .map((id) => data[id])
      // @ts-expect-error
      .map((cp) => {
        return {
          ...cp,
          billing_plan_invalid_ids: [
            ...cp.billing_plan_errors,
            ...cp.billing_plan_impossible,
          ].map((t) => t[0]),
          // @ts-expect-error
          billing_plan_success_ids: cp.billing_plan_success.map((t) => t[0]),
          billing_plan_success: cp.billing_plan_success.map(
            // @ts-expect-error
            (id) => subData[id[0]],
          ),
          billing_plan_invalid: [
            ...cp.billing_plan_errors,
            ...cp.billing_plan_impossible,
          ].map((id) => subData[id[0]]),
        };
      }),
);

// @ts-expect-error
const _getSubscriptionListCount = (state) => state.subscription.list.count;

// @ts-expect-error
const _getSubscriptionListLoading = (state) => state.subscription.list.loading;

export const getContractDetailSubscription = createSelector(
  [
    _getSubscriptionListCount,
    withMember(getSubscriptionList),
    _getSubscriptionListLoading,
  ],
  (count, items, loading) => ({ count, items, loading }),
);

const _getActiveContractTemplateListAllIds = (state: RootState) =>
  state.subscription.contractTemplate.active.allIds;

const _getActiveContractTemplateListById = (state: RootState) =>
  state.subscription.contractTemplate.active.byId;

const _getDisabledContractTemplateListAllIds = (state: RootState) =>
  state.subscription.contractTemplate.disabled.allIds;

const _getDisabledContractTemplateListById = (state: RootState) =>
  state.subscription.contractTemplate.disabled.byId;

export const getActiveContractTemplateList = createSelector(
  [_getActiveContractTemplateListAllIds, _getActiveContractTemplateListById],
  (ids, data) => ids.map((id) => data[id]),
);

export const getDisabledContractTemplateList = createSelector(
  [
    _getDisabledContractTemplateListAllIds,
    _getDisabledContractTemplateListById,
  ],
  (ids, data) => ids.map((id) => data[id]),
);

export const getActiveContractTemplateById = (state: RootState, id: number) =>
  state.subscription.contractTemplate.active.byId[id];

const _getContractTemplateRelatedSubscriptionsById = (state: RootState) =>
  state.subscription.contractTemplate.billingPlans.byId;

const _getContractTemplateRelatedSubscriptionsAllIds = (state: RootState) =>
  state.subscription.contractTemplate.billingPlans.allIds;

export const getContractTemplateRelatedSubscriptions = createSelector(
  [
    _getContractTemplateRelatedSubscriptionsById,
    _getContractTemplateRelatedSubscriptionsAllIds,
  ],
  (byId, allIds) => allIds.map((id) => byId[id]),
);
export default { get };
