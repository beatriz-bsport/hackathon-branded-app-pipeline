// @flow

import { createAction } from 'redux-actions';
import * as Sentry from '@sentry/react';

import { COMPANY_EVENTS } from './components/event.utils';
import api, {
  updatePlannedInvoicePrice as updatePlannedInvoicePriceAPI,
  updateSubscriptionRenewal as updateSubscriptionRenewalAPI,
  freezeSubscription as freezeSubscriptionAPI,
  switchSubscriptionPaymentPack as switchSubscriptionPaymentPackAPI,
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAPI,
  fetchPlannedInvoiceList as fetchPlannedInvoiceListAPI,
  fetchContractDetail as fetchContractDetailAPI,
  flagPlannedInvoiceAsLast as flagPlannedInvoiceAsLastAPI,
  unflagPlannedInvoiceAsLast as unflagPlannedInvoiceAsLastAPI,
  cancelPause as cancelPauseAPI,
  updatePlannedInvoiceDate as updatePlannedInvoiceDateAPI,
  restoreContract as restoreContractAPI,
  fetchContractPauseList as fetchContractPauseListAPI,
  fetchContractPause as fetchContractPauseAPI,
  createContractPause as createContractPauseAPI,
} from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import {
  snackbarSuccess,
  snackbarWarning,
  snackbarError,
} from '../../actions/snackbar.actions';
import { monitorBackgroundTask } from '../background-task/actions';

import { fetchEventList } from '../event/actions';

export const fetchSubscriptionEventList = (params = {}, options) =>
  fetchEventList(
    'subscription',
    {
      ...params,
      event_types:
        params.event_types && params.event_types.length
          ? params.event_types
          : Object.keys(COMPANY_EVENTS),
    },
    options,
  );

export const listPlannedInvoiceActions = {
  error: createAction('SUBSCRIPTION/PLANNED_INVOICE/ERROR'),
  isLoading: createAction('SUBSCRIPTION/PLANNED_INVOICE/IS_LOADING'),
  success: createAction('SUBSCRIPTION/PLANNED_INVOICE/SUCCESS'),
  reset: createAction('SUBSCRIPTION/PLANNED_INVOICE/RESET'),
};

export const resetPlannedInvoiceList = listPlannedInvoiceActions.reset;

export function fetchPlannedInvoiceList(
  page: number = 1,
  params: any = {},
  pageSize: number = 10,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPlannedInvoiceActions.error(null));
    dispatch(listPlannedInvoiceActions.isLoading(true));
    try {
      const response = await fetchPlannedInvoiceListAPI(page, pageSize, params);
      dispatch(listPlannedInvoiceActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPlannedInvoiceActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listPlannedInvoiceActions.isLoading(false));
  };
}

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

export const subscriptionBulkActions = {
  error: createAction('SUBSCRIPTION/BULK/ERROR'),
  isLoading: createAction('SUBSCRIPTION/BULK/IS_LOADING'),
  success: createAction('SUBSCRIPTION/BULK/SUCCESS'),
};

export function fetchSubscriptionBulk(
  ids: Array<number>,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subscriptionBulkActions.isLoading(true));
    dispatch(subscriptionBulkActions.error(null));

    if (!ids || ids.length === 0) return;

    try {
      const response = await api.fetchSubscriptionList({ id__in: ids });
      dispatch(subscriptionBulkActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(subscriptionBulkActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(subscriptionBulkActions.isLoading(false));
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

export function stop(
  id: number,
  params: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(stopActions.isLoading(true));
    dispatch(stopActions.error(null));

    try {
      const response = await api.stop(id, params);

      dispatch(detailActions.success(response.data));
      dispatch(snackbarSuccess('subscription.stop.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(stopActions.error(error));
      if (error.response && error.response.status === 423) {
        dispatch(snackbarWarning('subscription.stop.warning'));
      } else {
        dispatch(snackbarError('subscription.stop.error'));
        Sentry.captureException(error);
      }
      if (options && options.onError) options.onError(error);
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

export const contractDetailActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/DETAIL/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/DETAIL/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/DETAIL/SUCCESS'),
};

export function fetchContractDetail(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractDetailActions.isLoading(true));
    dispatch(contractDetailActions.error(null));
    try {
      const response = await fetchContractDetailAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(contractDetailActions.success(payload));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractDetailActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractDetailActions.isLoading(false));
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

export const contractRestoreActions = {
  isLoading: createAction('SUBSCRIPTION_CONTRACT/RESTORE/IS_LOADING'),
};

export function restoreContract(id: Number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractRestoreActions.isLoading(true));
    try {
      const response = await restoreContractAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(contractDetailActions.success(payload));
      dispatch(snackbarSuccess('subscription.contract.restore.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('subscription.contract.restore.error'));
      if (options && options.onError) options.onError(error);
    }
    dispatch(contractRestoreActions.isLoading(false));
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
        disabled: false,
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
      dispatch(snackbarSuccess('subscription.updatePrice.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updatePlannedInvoiceActions.error(err));
      dispatch(snackbarError('subscription.updatePrice.error'));
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
      dispatch(snackbarSuccess('subscription.freeze.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(freezeSubscriptionActions.error(err));
      if (err && err.response && err.response.status === 423) {
        dispatch(snackbarWarning('subscription.freeze.locked'));
      } else {
        dispatch(snackbarError('subscription.freeze.error'));
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
      dispatch(snackbarSuccess('subscription.switchPack.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPaymentPackActions.error(err));
      dispatch(snackbarError('subscription.switchPack.error'));
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
  data: {
    payment_engine?: number,
    payment_method_identifier: number,
    source: string,
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(switchPaymentMethodActions.error(null));
    dispatch(switchPaymentMethodActions.isLoading(true));
    try {
      const response = await switchSubscriptionPaymentMethodAPI(id, data);
      dispatch(switchPaymentMethodActions.success(response.data));
      dispatch(snackbarSuccess('subscription.switchPaymentMethod.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPaymentMethodActions.error(err));
      dispatch(snackbarError('subscription.switchPaymentMethod.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(switchPaymentMethodActions.isLoading(false));
  };
}

export const subscriptionForBookingActions = {
  error: createAction('SUBSCRIPTION/FOR_BOOKING/ERROR'),
  isLoading: createAction('SUBSCRIPTION/FOR_BOOKING/IS_LOADING'),
  success: createAction('SUBSCRIPTION/FOR_BOOKING/SUCCESS'),
  reset: createAction('SUBSCRIPTION/FOR_BOOKING/RESET'),
};

export const resetContractForBooking = subscriptionForBookingActions.reset;

export function fetchContractForBooking(
  offer: number,
  company: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subscriptionForBookingActions.isLoading(true));
    dispatch(subscriptionForBookingActions.error(null));

    try {
      const response = await api.fetchContractList({
        offer,
        company,
        manager_only: false,
        disabled: false,
      });
      dispatch(subscriptionForBookingActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(subscriptionForBookingActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(subscriptionForBookingActions.isLoading(false));
  };
}

export function flagPlannedInvoiceAsLast(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    try {
      await flagPlannedInvoiceAsLastAPI(id);
      if (options && options.onSuccess) options.onSuccess();
      dispatch(snackbarSuccess('subscriptionScheduledStop.create.success'));
    } catch (error) {
      console.error(error);
      if (options && options.onError) options.onError();
      dispatch(snackbarError('subscriptionScheduledStop.create.error'));
    }
  };
}

export function unflagPlannedInvoiceAsLast(
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      await unflagPlannedInvoiceAsLastAPI(id);
      if (options && options.onSuccess) options.onSuccess();
      dispatch(snackbarSuccess('subscriptionScheduledStop.delete.success'));
    } catch (error) {
      console.error(error);
      if (options && options.onError) options.onError();
      dispatch(snackbarError('subscriptionScheduledStop.delete.error'));
    }
  };
}

export const cancelPauseActions = {
  error: createAction('SUBSCRIPTION/PAUSE_CANCEL/ERROR'),
  isLoading: createAction('SUBSCRIPTION/PAUSE_CANCEL/IS_LOADING'),
  success: createAction('SUBSCRIPTION/PAUSE_CANCEL/SUCCESS'),
};

export function cancelPause(
  billingPlanId: number,
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(cancelPauseActions.error(null));
    dispatch(cancelPauseActions.isLoading(true));
    try {
      const response = await cancelPauseAPI(billingPlanId, id);
      dispatch(cancelPauseActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(cancelPauseActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(cancelPauseActions.isLoading(false));
  };
}

export const updatePlannedInvoiceDateActions = {
  error: createAction('SUBSCRIPTION/PLANNED_INVOICE/UPDATE_DATE/ERROR'),
  isLoading: createAction(
    'SUBSCRIPTION/PLANNED_INVOICE/UPDATE_DATE/IS_LOADING',
  ),
  success: createAction('SUBSCRIPTION/PLANNED_INVOICE/UPDATE_DATE/SUCCESS'),
};

export function updatePlannedInvoiceDate(
  id: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePlannedInvoiceDateActions.error(null));
    dispatch(updatePlannedInvoiceDateActions.isLoading(true));
    try {
      const response = await updatePlannedInvoiceDateAPI(id, data);
      dispatch(updatePlannedInvoiceDateActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updatePlannedInvoiceDateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updatePlannedInvoiceDateActions.isLoading(false));
  };
}

export const listContractPauseActions = {
  error: createAction('CONTRACT_PAUSE/LIST/ERROR'),
  isLoading: createAction('CONTRACT_PAUSE/LIST/IS_LOADING'),
  success: createAction('CONTRACT_PAUSE/LIST/SUCCESS'),
  reset: createAction('CONTRACT_PAUSE/LIST/RESET'),
};

export function fetchContractPauseList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listContractPauseActions.isLoading(true));
    dispatch(listContractPauseActions.error(null));

    try {
      const response = await fetchContractPauseListAPI(params);
      dispatch(listContractPauseActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(listContractPauseActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(listContractPauseActions.isLoading(false));
  };
}

export const addContractPauseActions = {
  error: createAction('CONTRACT_PAUSE/CREATE/ERROR'),
  isLoading: createAction('CONTRACT_PAUSE/CREATE/IS_LOADING'),
  success: createAction('CONTRACT_PAUSE/CREATE/SUCCESS'),
};

export function createContractPause(data: any = {}, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(addContractPauseActions.isLoading(true));
    dispatch(addContractPauseActions.error(null));

    try {
      const response = await createContractPauseAPI(data);
      dispatch(addContractPauseActions.success(response.data));

      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            dispatch(fetchContractPause(response.data.id));
          },
        }),
      );

      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(addContractPauseActions.error(error));
      dispatch(snackbarError('contractPause.create.error'));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(addContractPauseActions.isLoading(false));
  };
}

export const retrieveContractPauseActions = {
  error: createAction('CONTRACT_PAUSE/RETRIEVE/ERROR'),
  isLoading: createAction('CONTRACT_PAUSE/RETRIEVE/IS_LOADING'),
  success: createAction('CONTRACT_PAUSE/RETRIEVE/SUCCESS'),
};

export function fetchContractPause(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveContractPauseActions.isLoading(true));
    dispatch(retrieveContractPauseActions.error(null));

    try {
      const response = await fetchContractPauseAPI(id);
      dispatch(retrieveContractPauseActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(retrieveContractPauseActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(retrieveContractPauseActions.isLoading(false));
  };
}
