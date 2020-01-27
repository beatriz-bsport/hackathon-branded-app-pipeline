// @flow

import { createAction } from 'redux-actions';

import api, {
  updatePlannedInvoicePrice as updatePlannedInvoicePriceAPI,
  updateSubscriptionRenewal as updateSubscriptionRenewalAPI,
  freezeSubscription as freezeSubscriptionAPI,
  switchSubscriptionPaymentPack as switchSubscriptionPaymentPackAPI,
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAPI,
} from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

export const listSubscriptionActions = {
  error: createAction('SUBSCRIPTION/LIST/ERROR'),
  isLoading: createAction('SUBSCRIPTION/LIST/IS_LOADING'),
  success: createAction('SUBSCRIPTION/LIST/SUCCESS'),
};

export function fetchSubscriptionList(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listSubscriptionActions.isLoading(true));
    dispatch(listSubscriptionActions.error(null));

    try {
      const response = await api.fetchSubscriptionList(params);
      dispatch(listSubscriptionActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(listSubscriptionActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(listSubscriptionActions.isLoading(false));
  };
}

export const byMemberSubscriptionActions = {
  error: createAction('SUBSCRIPTION/BY_MEMBER/ERROR'),
  isLoading: createAction('SUBSCRIPTION/BY_MEMBER/IS_LOADING'),
  success: createAction('SUBSCRIPTION/BY_MEMBER/SUCCESS'),
};

export function fetchSubscriptionListByMember(
  member: number,
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberSubscriptionActions.isLoading(true));
    dispatch(byMemberSubscriptionActions.error(null));

    try {
      const response = await api.fetchSubscriptionList({ ...params, member });
      dispatch(byMemberSubscriptionActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(byMemberSubscriptionActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(byMemberSubscriptionActions.isLoading(false));
  };
}

export const detailActions = {
  error: createAction('SUBSCRIPTION/LOAD/ERROR'),
  isLoading: createAction('SUBSCRIPTION/LOAD/IS_LOADING'),
  success: createAction('SUBSCRIPTION/LOAD/SUCCESS'),
};

export const stopActions = {
  error: createAction('SUBSCRIPTION/STOP/ERROR'),
  isLoading: createAction('SUBSCRIPTION/STOP/IS_LOADING'),
  success: createAction('SUBSCRIPTION/STOP/SUCCESS'),
};

export function fetch(id: number, options: OptionCallback): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(detailActions.isLoading(true));
    dispatch(detailActions.error(null));

    try {
      const response = await api.fetchDetail(id);

      dispatch(detailActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(detailActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(detailActions.isLoading(false));
  };
}

export function stop(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(stopActions.isLoading(true));
    dispatch(stopActions.error(null));

    try {
      const response = await api.stop(id);

      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(stopActions.error(error));
    }

    dispatch(stopActions.isLoading(false));
  };
}

export const contractListActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/LIST/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/LIST/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/LIST/SUCCESS'),
};

export const contractCreateOrUpdateActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/CREATE_OR_UPDATE/SUCCESS'),
};

export const contractDeleteActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/DELETE/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/DELETE/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/DELETE/SUCCESS'),
};

export function fetchContractList(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractListActions.error(null));
    dispatch(contractListActions.isLoading(true));
    try {
      const response = await api.fetchContractList(params);
      dispatch(contractListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractListActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractListActions.isLoading(false));
  };
}

export function createOrUpdateContract(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractCreateOrUpdateActions.error(null));
    dispatch(contractCreateOrUpdateActions.isLoading(true));
    try {
      const response = await api.createOrUpdateContract(data);
      dispatch(contractCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractCreateOrUpdateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractCreateOrUpdateActions.isLoading(false));
  };
}

export function deleteContract(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractDeleteActions.error(null));
    dispatch(contractDeleteActions.isLoading(true));
    try {
      await api.deleteContract(id);
      dispatch(contractDeleteActions.success(id));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (err) {
      console.error(err);
      dispatch(contractDeleteActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractDeleteActions.isLoading(false));
  };
}

export const contractMarketplaceListActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/MARKETPLACE_LIST/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/MARKETPLACE_LIST/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/MARKETPLACE_LIOST/SUCCESS'),
};

export function fetchMarketplaceContractList(
  company: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(contractMarketplaceListActions.error(null));
    dispatch(contractMarketplaceListActions.isLoading(true));
    try {
      const response = await api.fetchContractList({
        company,
        manager_only: false,
        page_size: 300,
      });
      dispatch(contractMarketplaceListActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(contractMarketplaceListActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractMarketplaceListActions.isLoading(false));
  };
}

export const updatePlannedInvoiceActions = {
  error: createAction('PLANNED_INVOICE/UPDATE/ERROR'),
  isLoading: createAction('PLANNED_INVOICE/UPDATE/IS_LOADING'),
  success: createAction('PLANNED_INVOICE/UPDATE/SUCCESS'),
};

export function updatePlannedInvoicePrice(
  id: number,
  data: {
    planned_invoice: number,
    price: string,
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePlannedInvoiceActions.error(null));
    dispatch(
      updatePlannedInvoiceActions.isLoading({
        loading: true,
        planned_invoice: data.planned_invoice,
      }),
    );
    try {
      const response = await updatePlannedInvoicePriceAPI(id, data);
      dispatch(updatePlannedInvoiceActions.success(response.data));
      dispatch(snackbarSuccess('subscription:messages.updatePrice.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updatePlannedInvoiceActions.error(err));
      dispatch(snackbarError('subscription:messages.updatePrice.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(
      updatePlannedInvoiceActions.isLoading({
        loading: false,
        planned_invoice: data.planned_invoice,
      }),
    );
  };
}

export const updateSubscriptionActions = {
  error: createAction('SUBSCRIPTION/UPDATE/ERROR'),
  isLoading: createAction('SUBSCRIPTION/UPDATE/IS_LOADING'),
  success: createAction('SUBSCRIPTION/UPDATE/SUCCESS'),
};

export function updateSubscriptionRenewal(
  id: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateSubscriptionActions.error(null));
    dispatch(updateSubscriptionActions.isLoading(true));
    try {
      const response = await updateSubscriptionRenewalAPI(id, data);
      dispatch(updateSubscriptionActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updateSubscriptionActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateSubscriptionActions.isLoading(false));
  };
}

export const freezeSubscriptionActions = {
  error: createAction('SUBSCRIPTION/FREEZE/ERROR'),
  isLoading: createAction('SUBSCRIPTION/FREEZE/IS_LOADING'),
  success: createAction('SUBSCRIPTION/FREEZE/SUCCESS'),
};

export function freezeSubscription(
  id: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(freezeSubscriptionActions.error(null));
    dispatch(freezeSubscriptionActions.isLoading(true));
    try {
      const response = await freezeSubscriptionAPI(id, data);
      dispatch(freezeSubscriptionActions.success(response.data));
      dispatch(snackbarSuccess('subscription:messages.freeze.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(freezeSubscriptionActions.error(err));
      if (err && err.response && err.response.status === 423) {
        dispatch(snackbarError('subscription:messages.freeze.alreadyPaused'));
      } else {
        dispatch(snackbarError('subscription:messages.freeze.error'));
      }
      if (options && options.onError) options.onError(err);
    }
    dispatch(freezeSubscriptionActions.isLoading(false));
  };
}

export const switchPaymentPackActions = {
  error: createAction('SUBSCRIPTION/SWITCH_PAYUMENT_PACK/ERROR'),
  isLoading: createAction('SUBSCRIPTION/SWITCH_PAYMENT_PACK/IS_LOADING'),
  success: createAction('SUBSCRIPTION/SWITC_PAYMENT_PACK/SUCCESS'),
};

export function switchSubscriptionPaymentPack(
  id: number,
  data: { payment_pack: number },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(switchPaymentPackActions.error(null));
    dispatch(switchPaymentPackActions.isLoading(true));
    try {
      const response = await switchSubscriptionPaymentPackAPI(id, data);
      dispatch(switchPaymentPackActions.success(response.data));
      dispatch(snackbarSuccess('subscription:messages.switchPack.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPaymentPackActions.error(err));
      dispatch(snackbarError('subscription:messages.switchPack.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(switchPaymentPackActions.isLoading(false));
  };
}

export const switchPaymentMethodActions = {
  error: createAction('SUBSCRIPTION/SWITCH_PAYMENT_METHOD/ERROR'),
  isLoading: createAction('SUBSCRIPTION/SWITCH_PAYMENT_METHOD/IS_LOADING'),
  success: createAction('SUBSCRIPTION/SWITCH_PAYMENT_METHOD/SUCCESS'),
};

export function switchSubscriptionPaymentMethod(
  id: number,
  data: { payment_method_identifier: number, source: string },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(switchPaymentMethodActions.error(null));
    dispatch(switchPaymentMethodActions.isLoading(true));
    try {
      const response = await switchSubscriptionPaymentMethodAPI(id, data);
      dispatch(switchPaymentMethodActions.success(response.data));
      dispatch(
        snackbarSuccess('subscription:messages.switchPaymentMethod.success'),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPaymentMethodActions.error(err));
      dispatch(
        snackbarError('subscription:messages.switchPaymentMethod.error'),
      );
      if (options && options.onError) options.onError(err);
    }
    dispatch(switchPaymentMethodActions.isLoading(false));
  };
}
