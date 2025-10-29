import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';
import { PaymentGroup } from '#src/libs/invoice/types';
import { RootState } from '../../reducers';
import type { Payout, StripePayout } from './types';

const EMPTY_LIST = Immutable([]);
const _getPaymentMethodLoading = (state: RootState) =>
  state.paymentBackend.paymentMethod.loading;

const _getPaymentMethodItems = (state: RootState) =>
  state.paymentBackend.paymentMethod.items;

export const getSavedPaymentMethodList = createSelector(
  [_getPaymentMethodLoading, _getPaymentMethodItems],
  (paymentMethodLoading, paymentMethodItems) => {
    if (paymentMethodLoading) {
      return EMPTY_LIST;
    }
    return paymentMethodItems;
  },
);

export const getPaymentGroupData = (
  state: RootState,
): Immutable.Immutable<{ [id: string]: PaymentGroup }> => {
  return state.paymentBackend.paymentGroup.byId;
};

export const getPaymentGroupListIds = (
  state: RootState,
): Immutable.Immutable<Array<string>> => {
  return state.paymentBackend.paymentGroup.allIds;
};

export const getPaymentGroupList = createSelector(
  [getPaymentGroupData, getPaymentGroupListIds],
  (data, ids) => ids.map((id) => data[id]),
);

const secondParam = (state: RootState, params: any) => params;

export const getPaymentGroupRequiringActionList = createSelector(
  [getPaymentGroupList, secondParam],
  (groupList, uuid) =>
    groupList.filter((pg) => pg.status === 150 && pg.invoice === uuid),
);

const _getPayoutListIds = (
  state: RootState,
): Immutable.Immutable<Array<number>> => state.paymentBackend.payout.allIds;
const _getPayoutData = (state: RootState) => state.paymentBackend.payout.byId;

export const getPayoutList = createSelector(
  [_getPayoutListIds, _getPayoutData],
  (ids, data) => ids.map((id) => data[id]),
);

const _getIncrementalPayoutListIds = (
  state: RootState,
): Immutable.Immutable<Array<number>> =>
  state.paymentBackend.incrementalPayout.allIds;

const _getIncrementalPayoutData = (
  state: RootState,
): Immutable.Immutable<{ [id: number]: Payout }> =>
  state.paymentBackend.incrementalPayout.byId;

export const getIncrementalPayoutList = createSelector(
  [_getIncrementalPayoutListIds, _getIncrementalPayoutData],
  (ids, data) => ids.map((id) => data[id]),
);

const _getStripeBalanceAvailable = (state: RootState) =>
  state.paymentBackend.balance.amountAvailable;

const _getStripeBalancePending = (state: RootState) =>
  state.paymentBackend.balance.amountPending;

export const getStripeBalanceTotal = createSelector(
  [_getStripeBalanceAvailable, _getStripeBalancePending],
  (availableBalance, pendingBalance) => availableBalance + pendingBalance,
);

const _getPaymentGroupBeingProcessed = (state: RootState) =>
  state.paymentBackend.paymentGroupBeingProcessed;

const _getInvoiceUuid = (_: RootState, invoiceUuid: string) => invoiceUuid;

export const getInvoicePaymentGroupIsProcessing = createSelector(
  [_getPaymentGroupBeingProcessed, _getInvoiceUuid],
  (paymentGroupBeingProcessed, invoiceUuid) => {
    return (
      paymentGroupBeingProcessed?.byInvoiceUuid?.[invoiceUuid]?.loading ?? false
    );
  },
);

// -------------- STRIPE --------------

const _getStripePayoutAllIds = (
  state: RootState,
): Immutable.Immutable<Array<number>> =>
  state.paymentBackend.stripePayout.allIds;
const _getStripePayoutData = (
  state: RootState,
): { [id: number]: StripePayout } => state.paymentBackend.stripePayout.byId;

export const getStripePayoutList = createSelector(
  [_getStripePayoutAllIds, _getStripePayoutData],
  (ids, data) => (ids ?? []).map((id) => data[id]).filter((payout) => !!payout),
);

export const getStripeDomainListState = (state: RootState) =>
  state.paymentBackend.stripeDomainList;

export const getStripeDomainCheckLoading = (state: RootState) =>
  state.paymentBackend.stripeDomainCheck.loading;

export const getStripeDomainCheckIsRegistered = (state: RootState) =>
  state.paymentBackend.stripeDomainCheck.isRegistered;

// -------------- Bookkeeping Accounts --------------

const __getBookkeepingAccountList = (state: RootState) =>
  state.paymentBackend.bookkeepingAccounts.allIds;

export const getBookkeepingAccountById = (state: RootState) =>
  state.paymentBackend.bookkeepingAccounts.byId;

export const getBookkeepingAccountList = createSelector(
  [__getBookkeepingAccountList, getBookkeepingAccountById],
  (list, data) => list.map((id) => data[id]),
);

export const getBookkeepingAccountLoading = (state: RootState) =>
  state.paymentBackend.bookkeepingAccounts.loading;

export const getBookkeepingAccountError = (state: RootState) =>
  state.paymentBackend.bookkeepingAccounts.error;

export const getLinkedProductNames = (state: RootState) =>
  state.paymentBackend.bookkeepingAccounts.linkedProductNames;
