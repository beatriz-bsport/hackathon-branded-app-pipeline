// @flow

import { push as pushRouter } from 'connected-react-router';
import { createAction } from 'redux-actions';
import api from '../api';
import types from './invoice.types';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
import { fetchMember } from '../libs/member/actions';

import type { Dispatch } from '../state/types';
import type { Invoice, Payment } from '../api/types';

import { fetchAll as fetchAlerting } from '../libs/alerting/actions';

export const invoiceConfigurationPatchActions = {
  isLoading: createAction('INVOICE-CONFIGURATION/PATCH/IS_LOADING'),
  error: createAction('INVOICE-CONFIGURATION/PATCH/ERROR'),
};

export function patchInvoiceConfiguration(data: *) {
  return async (dispatch: Dispatch) => {
    dispatch(invoiceConfigurationPatchActions.isLoading(true));
    dispatch(invoiceConfigurationPatchActions.error(null));
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
    dispatch(invoiceConfigurationDetailActions.error(null));
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

export function finalizeInvoice(uuid: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(finalizeInvoiceActions.isLoading({ uuid, loading: true }));
    dispatch(finalizeInvoiceActions.error(null));
    try {
      const response = await api.invoice.finalize(uuid);
      dispatch(finalizeInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(finalizeInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(finalizeInvoiceActions.isLoading({ uuid, loading: false }));
  };
}

export const returnPaymentActions = {
  isLoading: createAction('INVOICE/RETURN_PAYMENT/IS_LOADING'),
  error: createAction('INVOICE/RETURN_PAYMENT/ERROR'),
  success: createAction('INVOICE/RETURN_PAYMENT/SUCCESS'),
};

export function returnPayment(
  payment: string,
  invoice: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(returnPaymentActions.isLoading(true));
    dispatch(returnPaymentActions.error(null));
    try {
      const response = await api.invoice.returnPayment(payment);
      dispatch(returnPaymentActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(returnPaymentActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchSpecificInvoice(invoice));
    dispatch(returnPaymentActions.isLoading(false));
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
    dispatch(errorFetchingSpeciicInvoice(null));
    try {
      const response = await api.invoice.revert(uuid);
      const invoice = response.data;
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice(err));
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
export function errorCreatingQuickInvoice(error: ?Error) {
  return { type: types.INVOICE_QUICK_CREATE_ERROR, error };
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
    keep_credits?: boolean,
  },
  callback: ?() => void,
) {
  return async (dispatch: Dispatch) => {
    dispatch(startCreateQuickInvoice());
    dispatch(errorCreatingQuickInvoice(null));
    try {
      const response = await api.invoice.createQuick(data);
      const invoice = response.data;
      dispatch(createdQuickInvoice(invoice));
      if (typeof callback === 'function') {
        callback();
      }
    } catch (err) {
      dispatch(errorCreatingQuickInvoice(err));
    }
    dispatch(fetchAlerting());
  };
}

export function startFetchSpecificInvoice() {
  return { type: types.INVOICE_SPECIFIC_START_FETCH };
}
export function errorFetchingSpeciicInvoice(error: ?Error) {
  return { type: types.INVOICE_SPECIFIC_ERROR_FETCHING, error };
}
export function fetchedSpecificInvoice(invoice: Invoice) {
  return { type: types.INVOICE_SPECIFIC_SUCCESS_FETCH, invoice };
}

export function fetchByQueryInvoice(params: *) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchSpecificInvoice());
    dispatch(errorFetchingSpeciicInvoice(null));

    try {
      const response = await api.invoice.fetchByQuery(params);
      const invoice = response.data[0];
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice(err));
    }
  };
}

export function fetchSpecificInvoice(
  invoiceId: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchSpecificInvoice());
    dispatch(errorFetchingSpeciicInvoice(null));

    try {
      const response = await api.invoice.fetchSpecific(invoiceId);
      const invoice = response.data;
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export function fetchByInvoiceItem(
  buyable_item_identifier: number,
  buyable_item_id: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchSpecificInvoice());
    dispatch(errorFetchingSpeciicInvoice(null));

    try {
      const response = await api.invoice.fetchByInvoiceItem(
        buyable_item_identifier,
        buyable_item_id,
      );
      const invoice = response.data;
      dispatch(fetchedSpecificInvoice(invoice));
    } catch (err) {
      dispatch(errorFetchingSpeciicInvoice(err));
    }
  };
}

export function startUpdatePaymentStatus() {
  return { type: types.PAYMENT_ITEM_START_UPDATE_STATUS };
}
export function errorUpdatingPaymentStatus(error: ?Error) {
  return { type: types.PAYMENT_ITEM_ERROR_PAYMENT_STATUS, error };
}
export function updatedPaymentStatus(payment: Payment) {
  return { type: types.PAYMENT_ITEM_UPDATED_PAYMENT_STATUS, payment };
}

export function updatePaymentMethod(uuid: string, newMethod: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startUpdatePaymentStatus());
    dispatch(errorUpdatingPaymentStatus(null));

    try {
      const response = await api.invoice.updatePaymentMethod(uuid, newMethod);
      const payment = response.data;
      dispatch(updatedPaymentStatus(payment));
    } catch (err) {
      dispatch(errorUpdatingPaymentStatus(err));
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
    dispatch(actionCreateOrUpdateInvoiceError(null));

    const createOrUpdate = invoiceData.uuid
      ? api.invoice.update
      : api.invoice.create;
    try {
      const response = await createOrUpdate(invoiceData);
      const invoice = response.data;
      if (invoiceData.uuid) {
        dispatch(actionUpdateInvoiceSuccess(invoice));
        dispatch(snackbarSuccess('invoice.update.success'));
        dispatch(resetQuickInvoices(invoiceData.uuid));
      } else {
        dispatch(actionCreateInvoiceSuccess(invoice));
        dispatch(snackbarSuccess('invoice.create.success'));
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
      dispatch(snackbarError('invoice.error'));
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
    error,
  };
}
