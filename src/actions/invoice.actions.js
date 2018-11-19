import { push as pushRouter } from 'react-router-redux';
import api from '../api';
import types from './invoice.types';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
import { fetchAll as fetchAllPaymentPacks } from './paymentPack.actions';
import { fetchAll as fetchAllMembers } from './member.actions';

export function startFetchInvoices() {
  return { type: types.START_FETCH_INVOICES };
}
export function errorFetchingInvoices() {
  return { type: types.ERROR_FETCHING_INVOICES };
}
export function fetchedInvoices(invoices) {
  return { type: types.HAS_FETCHED_INVOICES, invoices };
}
export function fetchAll() {
  return async (dispatch) => {
    dispatch(startFetchInvoices());

    try {
      const response = await api.invoice.fetchAll();
      const invoices = response.data;
      dispatch(fetchedInvoices(invoices));
    } catch (err) {
      dispatch(errorFetchingInvoices());
    }
  };
}

export function startFetchSpecificInvoice() {
  return { type: types.INVOICE_SPECIFIC_START_FETCH };
}
export function errorFetchingSpeciicInvoice() {
  return { type: types.INVOICE_SPECIFIC_ERROR_FETCHING };
}
export function fetchedSpecificInvoice(invoice) {
  return { type: types.INVOICE_SPECIFIC_SUCCESS_FETCH, invoice };
}

export function fetchSpecificInvoice(invoiceId) {
  return async (dispatch) => {
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
export function updatedPaymentStatus(payment) {
  return { type: types.PAYMENT_ITEM_UPDATED_PAYMENT_STATUS, payment };
}

export function updatePaymentStatus(uuid, newStatus) {
  return async (dispatch) => {
    dispatch(startUpdatePaymentStatus());

    try {
      const response = await api.invoice.updatePaymentStatus(uuid, newStatus);
      const payment = response.data;
      dispatch(updatedPaymentStatus(payment));
    } catch (err) {
      dispatch(errorUpdatingPaymentStatus());
    }
  };
}

export function createOrUpdateInvoice(invoiceData, noRedirect) {
  return async (dispatch) => {
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
      } else {
        dispatch(actionCreateInvoiceSuccess(invoice));
        dispatch(snackbarSuccess('invoice.forms.create.success'));
      }
      dispatch(fetchAllPaymentPacks());
      dispatch(fetchAllMembers()); // TODO optimize not to reload everything
      if (!noRedirect) {
        dispatch(pushRouter('/invoice'));
      }
    } catch (e) {
      dispatch(snackbarError('invoice.forms.error'));
      dispatch(actionCreateOrUpdateInvoiceError(e));
    }
  };
}

export function createOrUpdateReset() {
  return { type: types.INVOICE_CREATE_OR_UPDATE_RESET };
}

export function actionCreateOrUpdateInvoice(invoiceData) {
  return { type: types.INVOICE_CREATE_OR_UPDATE, invoice: invoiceData };
}
export function actionCreateInvoiceSuccess(invoice) {
  return { type: types.INVOICE_CREATE_SUCCESS, invoice };
}
export function actionUpdateInvoiceSuccess(invoice) {
  return { type: types.INVOICE_UPDATE_SUCCESS, invoice };
}
export function actionCreateOrUpdateInvoiceError(error) {
  return {
    type: types.INVOICE_CREATE_OR_UPDATE_ERROR,
    error: JSON.stringify(error),
  };
}
