// @flow

import { push as pushRouter } from 'react-router-redux';
import { createAction } from 'redux-actions';
import api from '../api';
import types from './invoice.types';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
import { fetchMember } from '../libs/member/actions';

import type { Dispatch } from '../state/types';
import type { Invoice, Payment } from '../api/types';

import { fetch as fetchAlerting } from '../libs/alerting/actions';

export const invoiceConfigurationPatchActions = {
  isLoading: createAction('INVOICE-CONFIGURATION/PATCH/IS_LOADING'),
  error: createAction('INVOICE-CONFIGURATION/PATCH/ERROR'),
};

export function patchInvoiceConfiguration(data: *) {
  return async (dispatch: Dispatch) => {
    dispatch(invoiceConfigurationPatchActions.isLoading(true));
    try {
      const response = await api.invoice.patchConfiguration(data);
      dispatch(invoiceConfigurationDetailActions.success(response.data));
    } catch (err) {
      dispatch(invoiceConfigurationPatchActions.error(err));
    }
    dispatch(invoiceConfigurationPatchActions.isLoading(false));
  };
}

export const invoiceConfigurationDetailActions = {
  isLoading: createAction('INVOICE-CONFIGURATION/DETAIL/IS_LOADING'),
  error: createAction('INVOICE-CONFIGURATION/DETAIL/ERROR'),
  success: createAction('INVOICE-CONFIGURATION/DETAIL/SUCCESS'),
};

export function fetchInvoiceConfiguration() {
  return async (dispatch: Dispatch) => {
    dispatch(invoiceConfigurationDetailActions.isLoading(true));
    try {
      const response = await api.invoice.fetchConfiguration();
      dispatch(invoiceConfigurationDetailActions.success(response.data));
    } catch (err) {
      dispatch(invoiceConfigurationDetailActions.error(err));
    }
    dispatch(invoiceConfigurationDetailActions.isLoading(false));
  };
}

export const finalizeInvoiceActions = {
  isLoading: createAction('INVOICE/FINALIZE/IS_LOADING'),
  error: createAction('INVOICE/FINALIZE/ERROR'),
  success: createAction('INVOICE/FINALIZE/SUCCESS'),
};

export function finalizeInvoice(uuid: string) {
  return async (dispatch: Dispatch) => {
    dispatch(finalizeInvoiceActions.isLoading({ uuid, loading: true }));
    try {
      const response = await api.invoice.finalize(uuid);
      dispatch(finalizeInvoiceActions.success(response.data));
    } catch (err) {
      dispatch(finalizeInvoiceActions.error(err));
    }
    dispatch(finalizeInvoiceActions.isLoading({ uuid, loading: false }));
  };
}

export function revertQuickInvoice(uuid: string, callback: ?() => void) {
  return async (dispatch: Dispatch) => {
    dispatch(revertInvoice(uuid, callback));
    dispatch(resetQuickInvoices(uuid));
    dispatch(fetchAlerting());
  };
}

export function revertInvoice(uuid: string, callback: ?() => void) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.invoice.revert(uuid);
      const invoice = response.data;
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice());
    }
    if (typeof callback === 'function') {
      callback();
    }
    dispatch(fetchAlerting());
  };
}

export function startCreateQuickInvoice() {
  return { type: types.INVOICE_QUICK_CREATE_START };
}
export function errorCreatingQuickInvoice() {
  return { type: types.INVOICE_QUICK_CREATE_ERROR };
}
export function resetQuickInvoices(uuid: ?string) {
  return { type: types.INVOICE_QUICK_RESET, uuid };
}
export function createdQuickInvoice(invoice: Invoice) {
  return { type: types.INVOICE_QUICK_CREATE_SUCCESS, invoice };
}
export function createQuickInvoice(
  data: {
    memberId: number,
    offerId: number,
    paymentPackId: number,
  },
  callback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(startCreateQuickInvoice());
    try {
      const response = await api.invoice.createQuick(data);
      const invoice = response.data;
      dispatch(createdQuickInvoice(invoice));
      if (typeof callback === 'function') {
        callback();
      }
    } catch (err) {
      dispatch(errorCreatingQuickInvoice());
    }
    dispatch(fetchAlerting());
  };
}

export function startFetchSpecificInvoice() {
  return { type: types.INVOICE_SPECIFIC_START_FETCH };
}
export function errorFetchingSpeciicInvoice() {
  return { type: types.INVOICE_SPECIFIC_ERROR_FETCHING };
}
export function fetchedSpecificInvoice(invoice: Invoice) {
  return { type: types.INVOICE_SPECIFIC_SUCCESS_FETCH, invoice };
}

export function fetchByQueryInvoice(params: *) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchSpecificInvoice());

    try {
      const response = await api.invoice.fetchByQuery(params);
      const invoice = response.data[0];
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice());
    }
  };
}

export function fetchSpecificInvoice(invoiceId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchSpecificInvoice());

    try {
      const response = await api.invoice.fetchSpecific(invoiceId);
      const invoice = response.data;
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice());
    }
  };
}

export function startUpdatePaymentStatus() {
  return { type: types.PAYMENT_ITEM_START_UPDATE_STATUS };
}
export function errorUpdatingPaymentStatus() {
  return { type: types.PAYMENT_ITEM_ERROR_PAYMENT_STATUS };
}
export function updatedPaymentStatus(payment: Payment) {
  return { type: types.PAYMENT_ITEM_UPDATED_PAYMENT_STATUS, payment };
}

export function updatePaymentMethod(uuid: string, newMethod: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startUpdatePaymentStatus());

    try {
      const response = await api.invoice.updatePaymentMethod(uuid, newMethod);
      const payment = response.data;
      dispatch(updatedPaymentStatus(payment));
    } catch (err) {
      dispatch(errorUpdatingPaymentStatus());
    }
  };
}

export function createOrUpdateInvoice(
  invoiceData: [*],
  noRedirect: ?boolean,
  callback: number | (() => void),
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateInvoice(invoiceData));

    const createOrUpdate = invoiceData.uuid
      ? api.invoice.update
      : api.invoice.create;
    try {
      const response = await createOrUpdate(invoiceData);
      const invoice = response.data;
      if (invoiceData.uuid) {
        dispatch(actionUpdateInvoiceSuccess(invoice));
        dispatch(snackbarSuccess('invoice.forms.update.success'));
        dispatch(resetQuickInvoices(invoiceData.uuid));
      } else {
        dispatch(actionCreateInvoiceSuccess(invoice));
        dispatch(snackbarSuccess('invoice.forms.create.success'));
      }
      if (typeof callback === 'function') {
        callback();
      }
      if (typeof callback === 'number') {
        // FIXME
        dispatch(fetchMember(callback));
      }
      if (!noRedirect) {
        dispatch(pushRouter('/invoice'));
      }
    } catch (e) {
      dispatch(snackbarError('invoice.forms.error'));
      dispatch(actionCreateOrUpdateInvoiceError(e));
    }
    dispatch(fetchAlerting());
  };
}

export function createOrUpdateReset() {
  return { type: types.INVOICE_CREATE_OR_UPDATE_RESET };
}

export function actionCreateOrUpdateInvoice(invoiceData: [*]) {
  return { type: types.INVOICE_CREATE_OR_UPDATE, invoice: invoiceData };
}
export function actionCreateInvoiceSuccess(invoice: Invoice) {
  return { type: types.INVOICE_CREATE_SUCCESS, invoice };
}
export function actionUpdateInvoiceSuccess(invoice: Invoice) {
  return { type: types.INVOICE_UPDATE_SUCCESS, invoice };
}
export function actionCreateOrUpdateInvoiceError(error: ?Object) {
  return {
    type: types.INVOICE_CREATE_OR_UPDATE_ERROR,
    error: JSON.stringify(error),
  };
}
