// @flow

import { push as pushRouter } from 'connected-react-router';
import { createAction } from 'redux-actions';
import {
  revert as revertAPI,
  createQuick as createQuickAPI,
  fetchSpecific as fetchSpecificAPI,
  fetchByQuery as fetchByQueryAPI,
  fetchByInvoiceItem as fetchByInvoiceItemAPI,
  create as createAPI,
  update as updateAPI,
  updatePaymentMethod as updatePaymentMethodAPI,
  returnPayment as returnPaymentAPI,
  patchConfiguration as patchConfigurationAPI,
  fetchConfiguration as fetchConfigurationAPI,
  finalize as finalizeAPI,
  fetchInvoiceItemList as fetchInvoiceItemListAPI,
  fetchPaymentList as fetchPaymentListAPI,
  checkInvoiceInfo as checkInvoiceInfoAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import { fetchMember } from '../member/actions';

import type { Dispatch } from '../../state/types';

import { fetchAll as fetchAlerting } from '../alerting/actions';

export const invoiceConfigurationPatchActions = {
  isLoading: createAction('INVOICE-CONFIGURATION/PATCH/IS_LOADING'),
  error: createAction('INVOICE-CONFIGURATION/PATCH/ERROR'),
};

export function patchInvoiceConfiguration(data: *) {
  return async (dispatch: Dispatch) => {
    dispatch(invoiceConfigurationPatchActions.isLoading(true));
    dispatch(invoiceConfigurationPatchActions.error(null));
    try {
      const response = await patchConfigurationAPI(data);
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
      const response = await fetchConfigurationAPI();
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
      const response = await finalizeAPI(uuid);
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
      const response = await returnPaymentAPI(payment);
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

export function revertQuickInvoice(uuid: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(revertInvoice(uuid, options));
    dispatch(quickInvoiceActions.reset(uuid));
    dispatch(fetchAlerting());
  };
}

export function revertInvoice(uuid: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.error(null));
    dispatch(retrieveInvoiceActions.isLoading(true));
    try {
      const response = await revertAPI(uuid);
      dispatch(retrieveInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
    dispatch(fetchAlerting());
  };
}

export const quickInvoiceActions = {
  isLoading: createAction('INVOICE/QUICK_CREATE/LOADING'),
  error: createAction('INVOICE/QUICK_CREATE/ERROR'),
  success: createAction('INVOICE/QUICK_CREATE/SUCCESS'),
  reset: createAction('INVOICE/QUICK_CREATE/RESET'),
};

export const resetQuickInvoices = quickInvoiceActions.reset;

export function createQuickInvoice(
  data: {
    memberId: number,
    offerId: number,
    paymentPackId: number,
    keep_credits?: boolean,
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(quickInvoiceActions.isLoading(true));
    dispatch(quickInvoiceActions.error(null));
    try {
      const response = await createQuickAPI(data);
      const invoice = response.data;
      dispatch(quickInvoiceActions.success(invoice));
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
    } catch (err) {
      dispatch(quickInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchAlerting());
    dispatch(quickInvoiceActions.isLoading(false));
  };
}

export const retrieveInvoiceActions = {
  isLoading: createAction('INVOICE/RETRIEVE/LOADING'),
  error: createAction('INVOICE/RETRIEVE/ERROR'),
  success: createAction('INVOICE/RETRIEVE/SUCCESS'),
};

export function fetchByQueryInvoice(params: *, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.isLoading(true));
    dispatch(retrieveInvoiceActions.error(null));

    try {
      const response = await fetchByQueryAPI(params);
      const invoice = response.data[0];
      dispatch(retrieveInvoiceActions.success(invoice));
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
  };
}

export function fetchSpecificInvoice(
  invoiceId: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.isLoading(true));
    dispatch(retrieveInvoiceActions.error(null));

    try {
      const response = await fetchSpecificAPI(invoiceId);
      const invoice = response.data;
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
      dispatch(retrieveInvoiceActions.success(invoice));
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
  };
}

export function fetchByInvoiceItem(
  buyable_item_identifier: number,
  buyable_item_id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.isLoading(true));
    dispatch(retrieveInvoiceActions.error(null));

    try {
      const response = await fetchByInvoiceItemAPI(
        buyable_item_identifier,
        buyable_item_id,
      );
      dispatch(retrieveInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
  };
}

export const updatePaymentMethodActions = {
  isLoading: createAction('INVOICE/UPATE_PAYMENT_METHOD/LOADING'),
  error: createAction('INVOICE/UPATE_PAYMENT_METHOD/ERROR'),
  success: createAction('INVOICE/UPATE_PAYMENT_METHOD/SUCCESS'),
};

export function updatePaymentMethod(uuid: string, newMethod: number) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentMethodActions.isLoading(true));
    dispatch(updatePaymentMethodActions.error(null));

    try {
      const response = await updatePaymentMethodAPI(uuid, newMethod);
      const payment = response.data;
      dispatch(updatePaymentMethodActions.success(payment));
    } catch (err) {
      dispatch(updatePaymentMethodActions.error(err));
    }
    dispatch(updatePaymentMethodActions.isLoading(false));
  };
}

export function createOrUpdateInvoice(
  invoiceData: [*],
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateInvoiceActions.isLoading(true));
    dispatch(createOrUpdateInvoiceActions.error(null));

    const createOrUpdate = invoiceData.uuid ? updateAPI : createAPI;
    try {
      const response = await createOrUpdate(invoiceData);
      const invoice = response.data;
      dispatch(createOrUpdateInvoiceActions.success(invoice));
      if (invoiceData.uuid) {
        dispatch(snackbarSuccess('invoice.update.success'));
        dispatch(quickInvoiceActions.reset(invoiceData.uuid));
      } else {
        dispatch(snackbarSuccess('invoice.create.success'));
      }
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('invoice.error'));
      dispatch(createOrUpdateInvoiceActions.error(null));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(createOrUpdateInvoiceActions.isLoading(false));
    dispatch(fetchAlerting());
  };
}

export const createOrUpdateInvoiceActions = {
  isLoading: createAction('INVOICE/CREATE_OR_UPDATE/LOADING'),
  error: createAction('INVOICE/CREATE_OR_UPDATE/ERROR'),
  success: createAction('INVOICE/CREATE_OR_UPDATE/SUCCESS'),
  reset: createAction('INVOICE/CREATE_OR_UPDATE/RESET'),
};

export const listPaymentActions = {
  isLoading: createAction('PAYMENT/LIST/LOADING'),
  error: createAction('PAYMENT/LIST/ERROR'),
  success: createAction('PAYMENT/LIST/SUCCESS'),
};

export function fetchPaymentList(params: * = {}, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentActions.isLoading(true));
    dispatch(listPaymentActions.error(null));

    try {
      const response = await fetchPaymentListAPI(params);
      dispatch(listPaymentActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(listPaymentActions.error(e));
      if (options && options.onError) {
        options.onSuccess(e);
      }
      dispatch(listPaymentActions.isLoading(false));
    }
  };
}

export const listInvoiceItemActions = {
  isLoading: createAction('INVOICE_ITEM/LIST/LOADING'),
  error: createAction('INVOICE_ITEM/LIST/ERROR'),
  success: createAction('INVOICE_ITEM/LIST/SUCCESS'),
};

export function fetchInvoiceItemList(params: * = {}, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listInvoiceItemActions.isLoading(true));
    dispatch(listInvoiceItemActions.error(null));

    try {
      const response = await fetchInvoiceItemListAPI(params);
      dispatch(listInvoiceItemActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(listInvoiceItemActions.error(e));
      if (options && options.onError) {
        options.onSuccess(e);
      }
      dispatch(listInvoiceItemActions.isLoading(false));
    }
  };
}

export const listInvoiceActions = {
  isLoading: createAction('INVOICE/LIST/IS_LOADING'),
  error: createAction('INVOICE/LIST/ERROR'),
  success: createAction('INVOICE/LIST/SUCCESS'),
};

export function fetchInvoiceList(params: * = {}, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listInvoiceActions.isLoading(true));
    dispatch(listInvoiceActions.error(null));
    try {
      const response = await fetchByQueryAPI(params);
      dispatch(listInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(listInvoiceActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(listInvoiceActions.isLoading(false));
  };
}

export const checkInvoiceInfoActions = {
  isLoading: createAction('INVOICE/CHECK_INFO/IS_LOADING'),
  error: createAction('INVOICE/CHECK_INFO/ERROR'),
  success: createAction('INVOICE/CHECK_INFO/SUCCESS'),
  reset: createAction('INVOICE/CHECK_INFO/RESET'),
};

// a bit dirty all this stuff...
export function checkInvoiceInfo(uuid: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(checkInvoiceInfoActions.isLoading(true));
    dispatch(checkInvoiceInfoActions.error(null));
    try {
      const response = await checkInvoiceInfoAPI(uuid);
      if (
        response.data.errors &&
        response.data.errors.payments &&
        response.data.errors.payments.length
      ) {
        dispatch(checkInvoiceInfoActions.success(response.data));
        if (options && options.onSuccess) {
          options.onSuccess(response.data);
        }
      }
    } catch (err) {
      dispatch(checkInvoiceInfoActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(checkInvoiceInfoActions.isLoading(false));
  };
}
