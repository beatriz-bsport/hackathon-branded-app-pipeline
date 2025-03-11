import type { RootState } from '#src/reducers';
import { createSelector } from 'reselect';
import { PaymentModuleState } from './reducers';

export const getPaymentModuleState = (state: RootState): PaymentModuleState =>
  state.paymentModule;

/*** 
@description Selector to provide uuid (string) to composed selector
***/
const _uuidParameterSelector = (_: RootState, uuid: string) => uuid;

export const getApplyBalance = createSelector(
  [getPaymentModuleState, _uuidParameterSelector],
  (paymentModuleState, uuid) => paymentModuleState.applyBalanceToInvoice[uuid],
);

export const getInvoiceClientSecret = createSelector(
  [getPaymentModuleState, _uuidParameterSelector],
  (paymentModuleState, uuid) => paymentModuleState.invoiceClientSecret[uuid],
);

/*** 
@description Selector to provide id (number) to composed selector
***/
const _idParameterSelector = (_: RootState, id: number) => id;

export const getPaymentStatusByPaymentGroupId = createSelector(
  [getPaymentModuleState, _idParameterSelector],
  (paymentModuleState, paymentGroupId) =>
    paymentModuleState.paymentGroupStatus[paymentGroupId],
);

export const getDetachPaymentMethod = createSelector(
  [getPaymentModuleState, _idParameterSelector],
  (paymentModuleState, memberId) =>
    paymentModuleState.detachPaymentMethod[memberId],
);

export const getPaymentMethodList = createSelector(
  [getPaymentModuleState, _idParameterSelector],
  (paymentModuleState, memberId) =>
    paymentModuleState.paymentMethodList[memberId],
);

/***
 * @description Selector to determine the backend status after payment
 * @param paymentGroupId The ID of the payment group
 * ***/
export const getBackendStatusAfterPayment = createSelector(
  [getPaymentModuleState, _idParameterSelector],
  (paymentModuleState, paymentGroupId) =>
    paymentModuleState.backendStatusAfterPayment[paymentGroupId],
);

/**
 * @description Selector to determine if the payment is currently processing
 * @param paymentGroupId The ID of the payment group
 * @returns boolean
 */
export const getIsPaymentProcessing = createSelector(
  [
    getPaymentModuleState,
    _idParameterSelector,
    getPaymentStatusByPaymentGroupId,
  ],
  (_paymentModuleState, _paymentGroupId, paymentStatus) => {
    return paymentStatus?.processing || false;
  },
);

/**
 * @description Selector to determine if the payment has succeeded
 * @param paymentGroupId The ID of the payment group
 * @returns boolean
 */
export const getHasPaymentSucceeded = createSelector(
  [
    getPaymentModuleState,
    _idParameterSelector,
    getPaymentStatusByPaymentGroupId,
  ],
  (_paymentModuleState, _paymentGroupId, paymentStatus) => {
    return paymentStatus?.succeeded || false;
  },
);

/**
 * @description Selector to determine if backend is processing invoice or basket after payment
 * @param paymentGroupId The ID of the payment group
 * @returns boolean
 */
export const getIsBackendProcessingAfterPayment = createSelector(
  [getPaymentModuleState, _idParameterSelector, getBackendStatusAfterPayment],
  (_paymentModuleState, _paymentGroupId, backendStatus) => {
    return backendStatus?.processing || false;
  },
);

export const getBasketClientSecret = createSelector(
  [getPaymentModuleState, _uuidParameterSelector],
  (paymentModuleState, basketId) =>
    paymentModuleState.basketClientSecret[basketId],
);
