import { createAction } from 'redux-actions';
import * as Sentry from '@sentry/react';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { COMPANY_EVENTS } from './event.utils';
import api, {
  updatePlannedInvoicePrice as updatePlannedInvoicePriceAPI,
  updateSubscriptionRenewal as updateSubscriptionRenewalAPI,
  freezeSubscription as freezeSubscriptionAPI,
  switchSubscriptionPaymentPack as switchSubscriptionPaymentPackAPI,
  switchSubscriptionPrivatePass as switchSubscriptionPrivatePassAPI,
  switchSubscriptionPaymentCombo as switchSubscriptionPaymentComboAPI,
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
  createOrUpdateContractPause as createOrUpdateContractPauseAPI,
  deleteContractPause as deleteContractPauseAPI,
  updateOnlyContractPauseName as updateOnlyContractPauseNameAPI,
  registerContractBackground as registerContractBackgroundAPI,
  registerContractSubscriptionUnauthenticated as registerContractBackgroundUnauthenticatedAPI,
  downloadPDFContractTermsForContract as downloadPDFContractTermsForContractAPI,
  downloadPDFContractTermsForBillingPlan as downloadPDFContractTermsForBillingPlanAPI,
  fetchContractTemplateList as fetchContractTemplateListAPI,
  deleteContractTemplate as deleteContractTemplateAPI,
  restoreContractTemplate as restoreContractTemplateAPI,
  fetchMemberSubscriptionsInAllFranchise as fetchMemberSubscriptionsInAllFranchiseAPI,
  fetchContractTemplateDetail as fetchContractTemplateDetailAPI,
  fetchContractTemplateRelatedBillingPlans as fetchContractTemplateRelatedBillingPlansAPI,
  createOrUpdateContractTemplate as createOrUpdateContractTemplateAPI,
  createContract as createContractAPI,
  updateContract as updateContractAPI,
} from './api';

import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  OptionBackgroundCallback,
  PaginatedResponse,
} from '#src/state/types';
import {
  snackbarSuccess,
  snackbarWarning,
  snackbarError,
} from '../snackbar/actions';
import { monitorBackgroundTask } from '../background-task/actions';
import type {
  PauseRequestData,
  Subscription,
  SubscriptionQueryParams,
  ContractPauseRequestData,
  ContractPauseDetails,
  RegisterBackgroundReturnValue,
  ContractTemplate,
  Contract,
  ContractTemplatePaginatedQueryParams,
  ContractTemplatePayload,
  SubscriptionREST,
  PauseRequestResults,
  PauseRequestErrorResults,
  SubscriptionPaymentMethodParams,
  ContractPayload,
} from './types';
import type { PaginationFilterParams } from '#src/libs/types';
import {
  CONTRACT_TEMPLATE_PAGE_SIZE,
  SUBSCRIBED_MEMBER_LIST_PAGE_SIZE,
} from './constants';
import { fetchEventList } from '../event/actions';
import { downloadDocument } from '../../utils/downloader';
import { RootState } from '#src/reducers';
import type { BackgroundTask } from '#src/libs/background-task/types';

export const fetchSubscriptionEventList = (
  params: { event_types?: any } = {},
  options: OptionCallback,
) =>
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
      // @ts-expect-error
      dispatch(listPlannedInvoiceActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        // @ts-expect-error
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

export function fetchSubscriptionList(
  params: SubscriptionQueryParams,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listSubscriptionActions.isLoading(true));
    dispatch(listSubscriptionActions.error(null));

    try {
      const response = await api.fetchSubscriptionList(params);
      dispatch(listSubscriptionActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
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
  options: OptionCallback<Subscription[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subscriptionBulkActions.isLoading(true));
    dispatch(subscriptionBulkActions.error(null));

    if (!ids || ids.length === 0) return;

    try {
      const response = await api.fetchSubscriptionList({ id__in: ids });
      dispatch(subscriptionBulkActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
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
  params: SubscriptionQueryParams = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberSubscriptionActions.isLoading(true));
    dispatch(byMemberSubscriptionActions.error(null));

    try {
      const response = await api.fetchSubscriptionList({ ...params, member });
      dispatch(byMemberSubscriptionActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
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

export const fetchMemberSubscriptionsInAllFranchise = (
  memberId: number,
  params: SubscriptionQueryParams,
  options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberSubscriptionActions.isLoading(true));
    dispatch(byMemberSubscriptionActions.error(null));
    try {
      const response = await fetchMemberSubscriptionsInAllFranchiseAPI(
        memberId,
        params,
      );
      dispatch(byMemberSubscriptionActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(byMemberSubscriptionActions.error(error));
      console.error(error);
      options?.onError?.(error);
    }
    dispatch(byMemberSubscriptionActions.isLoading(false));
  };
};

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

export function fetch(id: number, options?: OptionCallback): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(detailActions.isLoading(true));
    dispatch(detailActions.error(null));

    try {
      const response = await api.fetchDetail(id);

      dispatch(detailActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
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

export function fetchContractList(params?: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractListActions.error(null));
    dispatch(contractListActions.isLoading(true));
    try {
      const response = await api.fetchContractList(params);
      dispatch(contractListActions.success(response.data));
      // @ts-expect-error
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

export function fetchContractDetail(
  id: number,
  options?: OptionCallback<Contract>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(contractDetailActions.isLoading(true));
    dispatch(contractDetailActions.error(null));
    try {
      const response = await fetchContractDetailAPI(id);
      // @ts-expect-error
      const payload = { [response.data.id]: response.data };
      dispatch(contractDetailActions.success(payload));
      // @ts-expect-error
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
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractCreateOrUpdateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractCreateOrUpdateActions.isLoading(false));
  };
}

export function deleteContract(id: number, options: OptionCallback<number>) {
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

export function restoreContract(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractRestoreActions.isLoading(true));
    try {
      const response = await restoreContractAPI(id);
      // @ts-expect-error
      const payload = { [response.data.id]: response.data };
      dispatch(contractDetailActions.success(payload));
      dispatch(snackbarSuccess('subscription.contract.restore.success'));
      // @ts-expect-error
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
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(contractMarketplaceListActions.error(null));
    dispatch(contractMarketplaceListActions.isLoading(true));
    try {
      const response = await api.fetchContractList({
        company,
        manager_only: false,
        disabled: false,
        // @ts-expect-error
        page_size: 300,
      });
      // @ts-expect-error
      dispatch(contractMarketplaceListActions.success(response.data.results));
      if (options && options.onSuccess) {
        // @ts-expect-error
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
    planned_invoice: number;
    price: string;
    update_all: boolean;
    update_recurrent_price: boolean;
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePlannedInvoiceActions.error(null));
    dispatch(updatePlannedInvoiceActions.isLoading(true));
    try {
      const response = await updatePlannedInvoicePriceAPI(id, data);
      dispatch(updatePlannedInvoiceActions.success(response.data));
      dispatch(snackbarSuccess('subscription.updatePrice.success'));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updatePlannedInvoiceActions.error(err));
      if (options && options.onError) options.onError(err);

      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(
            `plannedInvoice.upsert.errors.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('subscription.updatePrice.error'));
      }
    }
    dispatch(updatePlannedInvoiceActions.isLoading(false));
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
        // @ts-expect-error
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
  data: PauseRequestData,
  options: OptionBackgroundCallback<
    void,
    PauseRequestResults,
    PauseRequestErrorResults
  >,
) {
  return async (dispatch: Dispatch) => {
    dispatch(freezeSubscriptionActions.error(null));
    dispatch(freezeSubscriptionActions.isLoading(true));
    try {
      const response = await freezeSubscriptionAPI(id, data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      options?.onSuccess?.();
      dispatch(
        monitorBackgroundTask<
          PauseRequestResults,
          BackgroundTask<PauseRequestErrorResults>
        >(backgroundTaskUuid, {
          onSuccess: (backgroundTaskData) => {
            dispatch(
              freezeSubscriptionActions.success(
                backgroundTaskData.return_value.subscription,
              ),
            );
            options?.onBackgroundSuccess?.(backgroundTaskData.return_value);
          },
          onError: (backgroundTaskData) => {
            options?.onBackgroundError?.(backgroundTaskData.return_value);
          },
        }),
      );
    } catch (err) {
      console.error(err);
      dispatch(freezeSubscriptionActions.error(err));
      dispatch(snackbarError('subscription.freeze.error'));
      options?.onError?.();
    }
    dispatch(freezeSubscriptionActions.isLoading(false));
  };
}

export const switchPaymentPackActions = {
  error: createAction('SUBSCRIPTION/SWITCH_PAYMENT_PACK/ERROR'),
  isLoading: createAction('SUBSCRIPTION/SWITCH_PAYMENT_PACK/IS_LOADING'),
  success: createAction('SUBSCRIPTION/SWITCH_PAYMENT_PACK/SUCCESS'),
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
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPaymentPackActions.error(err));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(
            `subscription.switchItemsErrors.paymentPack.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('subscription.switchPack.error'));
      }

      if (options && options.onError) options.onError(err);
    }
    dispatch(switchPaymentPackActions.isLoading(false));
  };
}

export const switchPrivatePassActions = {
  error: createAction('SUBSCRIPTION/SWITCH_PRIVATE_PASS/ERROR'),
  isLoading: createAction('SUBSCRIPTION/SWITCH_PRIVATE_PASS/IS_LOADING'),
  success: createAction('SUBSCRIPTION/SWITCH_PRIVATE_PASS/SUCCESS'),
};

export function switchSubscriptionPrivatePass(
  id: number,
  data: { private_pass: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(switchPrivatePassActions.error(null));
    dispatch(switchPrivatePassActions.isLoading(true));
    try {
      const response = await switchSubscriptionPrivatePassAPI(id, data);
      dispatch(switchPrivatePassActions.success(response.data));
      dispatch(snackbarSuccess('subscription.switchPrivatePass.success'));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPrivatePassActions.error(err));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(
            `subscription.switchItemsErrors.privatePass.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('subscription.switchPrivatePass.error'));
      }
      if (options && options.onError) options.onError(err);
    }
    dispatch(switchPrivatePassActions.isLoading(false));
  };
}
export const switchPaymentComboActions = {
  error: createAction('SUBSCRIPTION/SWITCH_PAYMENT_COMBO/ERROR'),
  isLoading: createAction('SUBSCRIPTION/SWITCH_PAYMENT_COMBO/IS_LOADING'),
  success: createAction('SUBSCRIPTION/SWITCH_PAYMENT_COMBO/SUCCESS'),
};

export function switchSubscriptionPaymentCombo(
  id: number,
  data: { payment_combo: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(switchPaymentComboActions.error(null));
    dispatch(switchPaymentComboActions.isLoading(true));
    try {
      const response = await switchSubscriptionPaymentComboAPI(id, data);
      dispatch(switchPaymentComboActions.success(response.data));
      dispatch(snackbarSuccess('subscription.switchPaymentCombo.success'));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(switchPaymentComboActions.error(err));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(
            `subscription.switchItemsErrors.paymentCombo.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('subscription.switchPaymentCombo.error'));
      }
      if (options && options.onError) options.onError(err);
    }
    dispatch(switchPaymentComboActions.isLoading(false));
  };
}

export const switchPaymentMethodActions = {
  error: createAction<Error | null>('SUBSCRIPTION/SWITCH_PAYMENT_METHOD/ERROR'),
  isLoading: createAction<boolean>(
    'SUBSCRIPTION/SWITCH_PAYMENT_METHOD/IS_LOADING',
  ),
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTION/SWITCH_PAYMENT_METHOD/SUCCESS',
  ),
};

export function switchSubscriptionPaymentMethod(
  data: SubscriptionPaymentMethodParams,
  options?: OptionCallback<SubscriptionREST>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(switchPaymentMethodActions.error(null));
    dispatch(switchPaymentMethodActions.isLoading(true));
    try {
      const response = await switchSubscriptionPaymentMethodAPI(data);
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
        // @ts-expect-error
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

export function flagPlannedInvoiceAsLast(
  id: number,
  note?: string,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      await flagPlannedInvoiceAsLastAPI(id, note);
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
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            dispatch(cancelPauseActions.success(id));
            if (options && options.onSuccess) {
              options.onSuccess(response.data);
              dispatch(snackbarSuccess('subscription.freeze.deleteSuccess'));
            }
          },
        }),
      );
    } catch (err) {
      console.error(err);
      dispatch(cancelPauseActions.error(err));
      dispatch(snackbarError('subscription.freeze.deleteFail'));
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
  data: {
    date: string;
    planned_invoice: number;
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePlannedInvoiceDateActions.error(null));
    dispatch(updatePlannedInvoiceDateActions.isLoading(true));
    try {
      const response = await updatePlannedInvoiceDateAPI(id, data);
      dispatch(updatePlannedInvoiceDateActions.success(id));
      if (options && options.onSuccess) {
        // @ts-expect-error
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
        // @ts-expect-error
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

export function createOrUpdateContractPause(
  data: ContractPauseRequestData,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(addContractPauseActions.isLoading(true));
    dispatch(addContractPauseActions.error(null));

    try {
      const response = await createOrUpdateContractPauseAPI(data);
      if (data.contract_pause_id) {
        // The contract pause is already in allIds
        dispatch(retrieveContractPauseActions.success(response.data));
      } else {
        dispatch(addContractPauseActions.success(response.data));
      }

      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            // @ts-expect-error
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

export function updateOnlyContractPauseName(
  data: {
    contract_pause_id: number;
    name: string;
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveContractPauseActions.isLoading(true));
    dispatch(retrieveContractPauseActions.error(null));
    try {
      const response = await updateOnlyContractPauseNameAPI(
        data.contract_pause_id,
        data.name,
      );
      dispatch(retrieveContractPauseActions.success(response.data));
      dispatch(snackbarSuccess('contractPause.updateName.success'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(retrieveContractPauseActions.error(error));
      dispatch(snackbarError('contractPause.updateName.error'));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(retrieveContractPauseActions.isLoading(false));
  };
}

export const deleteContractPauseActions = {
  error: createAction('CONTRACT_PAUSE/DELETE/ERROR'),
  isLoading: createAction('CONTRACT_PAUSE/DELETE/IS_LOADING'),
  success: createAction('CONTRACT_PAUSE/DELETE/SUCCESS'),
};

export function deleteContractPause(
  contractPause: ContractPauseDetails,
  options?: OptionCallback<any>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteContractPauseActions.isLoading(true));
    dispatch(deleteContractPauseActions.error(null));

    try {
      const contractPauseId = contractPause.id;
      const response = await deleteContractPauseAPI(contractPauseId);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            dispatch(deleteContractPauseActions.success(contractPauseId));
            dispatch(fetchContractDetail(response.data.contract_id));
          },
        }),
      );

      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(deleteContractPauseActions.error(error));
      dispatch(snackbarError('contractPause.delete.error'));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(deleteContractPauseActions.isLoading(false));
  };
}

export const retrieveContractPauseActions = {
  error: createAction('CONTRACT_PAUSE/RETRIEVE/ERROR'),
  isLoading: createAction('CONTRACT_PAUSE/RETRIEVE/IS_LOADING'),
  success: createAction('CONTRACT_PAUSE/RETRIEVE/SUCCESS'),
};

export function fetchContractPause(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveContractPauseActions.isLoading(true));
    dispatch(retrieveContractPauseActions.error(null));

    try {
      const response = await fetchContractPauseAPI(id);
      dispatch(retrieveContractPauseActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
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

export const registerContractBackgroundActions = {
  error: createAction('CONTRACT/REGISTER_BACKGROUND/ERROR'),
  isLoading: createAction('CONTRACT/REGISTER_BACKGROUND/IS_LOADING'),
  success: createAction('CONTRACT/REGISTER_BACKGROUND/SUCCESS'),
};

export function registerContractBackground(
  id: number,
  data: any,
  options?: OptionBackgroundCallback<void, RegisterBackgroundReturnValue>,
  noAuth: boolean = false,
  hideBackgroundTaskSnackbar: boolean = false,
) {
  return async (dispatch: Dispatch) => {
    dispatch(registerContractBackgroundActions.isLoading(true));
    dispatch(registerContractBackgroundActions.error(null));

    try {
      const apiCall = noAuth
        ? registerContractBackgroundUnauthenticatedAPI
        : registerContractBackgroundAPI;
      const response = await apiCall(id, data);

      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(
          backgroundTaskUuid,
          {
            onError: (err) => {
              console.error(err);
              if (options?.onBackgroundError) options.onBackgroundError(err);
            },
            onSuccess: (responseData) => {
              dispatch(
                registerContractBackgroundActions.success(response.data),
              );
              if (options && options.onBackgroundSuccess) {
                // @ts-expect-error
                options.onBackgroundSuccess(responseData?.return_value);
              }
            },
          },
          hideBackgroundTaskSnackbar,
        ),
      );

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(registerContractBackgroundActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(registerContractBackgroundActions.isLoading(false));
  };
}

export const downloadPDFContractTermsActions = {
  isLoading: createAction('CONTRACT_TERMS/PDF/IS_LOADING'),
  error: createAction('CONTRACT_TERMS/PDF/ERROR'),
};

export function downloadPDFContractTermsForContract(
  contractId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(downloadPDFContractTermsActions.isLoading(true));
    dispatch(downloadPDFContractTermsActions.error(null));
    try {
      const response = await downloadPDFContractTermsForContractAPI(contractId);
      downloadDocument(response.data.filepath);
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(downloadPDFContractTermsActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(downloadPDFContractTermsActions.isLoading(false));
  };
}

export function downloadPDFContractTermsForBillingPlan(
  billingPanId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(downloadPDFContractTermsActions.isLoading(true));
    dispatch(downloadPDFContractTermsActions.error(null));
    try {
      const response = await downloadPDFContractTermsForBillingPlanAPI(
        billingPanId,
      );
      downloadDocument(response.data.filepath);
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(downloadPDFContractTermsActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(downloadPDFContractTermsActions.isLoading(false));
  };
}

export const fetchActiveContractTemplateListActions = {
  error: createAction<Error | null>(
    'FRANCHISE/CONTRACT_TEMPLATE/ACTIVE_LIST/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/ACTIVE_LIST/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<ContractTemplate>>(
    'FRANCHISE/CONTRACT_TEMPLATE/ACTIVE_LIST/SUCCESS',
  ),
};

export function fetchActiveContractTemplateList(
  params?: ContractTemplatePaginatedQueryParams,
  options?: OptionCallback<ContractTemplate[]>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchActiveContractTemplateListActions.isLoading(true));
    dispatch(fetchActiveContractTemplateListActions.error(null));
    const page =
      params?.page ??
      getState().subscription?.contractTemplate?.active?.page ??
      1;
    try {
      const response = await fetchContractTemplateListAPI({
        ...params,
        page,
        page_size: params?.page_size ?? CONTRACT_TEMPLATE_PAGE_SIZE,
        disabled: false,
      });
      dispatch(fetchActiveContractTemplateListActions.success(response.data));

      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchActiveContractTemplateListActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchActiveContractTemplateListActions.isLoading(false));
  };
}

export const fetchDisabledContractTemplateListActions = {
  error: createAction<Error | null>(
    'FRANCHISE/CONTRACT_TEMPLATE/DISABLED_LIST/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/DISABLED_LIST/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<ContractTemplate>>(
    'FRANCHISE/CONTRACT_TEMPLATE/DISABLED_LIST/SUCCESS',
  ),
};

export const fetchDisabledContractTemplateList =
  (
    params?: ContractTemplatePaginatedQueryParams,
    options?: OptionCallback<ContractTemplate[]>,
  ) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchDisabledContractTemplateListActions.isLoading(true));
    dispatch(fetchDisabledContractTemplateListActions.error(null));

    const page =
      params?.page ??
      getState().subscription?.contractTemplate?.disabled?.page ??
      1;
    try {
      const response = await fetchContractTemplateListAPI({
        ...params,
        page,
        page_size: params?.page_size ?? CONTRACT_TEMPLATE_PAGE_SIZE,
        disabled: true,
      });
      dispatch(fetchDisabledContractTemplateListActions.success(response.data));

      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchDisabledContractTemplateListActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchDisabledContractTemplateListActions.isLoading(false));
  };

export const deleteContractTemplateActions = {
  error: createAction<Error | null>('FRANCHISE/CONTRACT_TEMPLATE/DELETE/ERROR'),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/DELETE/IS_LOADING',
  ),
};

export const deleteContractTemplate =
  (id: number, options: OptionCallback) => async (dispatch: Dispatch) => {
    dispatch(deleteContractTemplateActions.isLoading(true));
    dispatch(deleteContractTemplateActions.error(null));

    try {
      await deleteContractTemplateAPI(id);
      options.onSuccess?.();
      dispatch(snackbarSuccess('subscription.contractTemplate.deleteSuccess'));
    } catch (error) {
      dispatch(deleteContractTemplateActions.error(error));
      options.onError?.(error);
      dispatch(snackbarError('subscription.contractTemplate.deleteError'));
    }

    dispatch(deleteContractTemplateActions.isLoading(false));
  };

export const restoreContractTemplateActions = {
  error: createAction<Error | null>(
    'FRANCHISE/CONTRACT_TEMPLATE/RESTORE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/RESTORE/IS_LOADING',
  ),
};

export const restoreContractTemplate =
  (id: number, options: OptionCallback) => async (dispatch: Dispatch) => {
    dispatch(restoreContractTemplateActions.isLoading(true));
    dispatch(restoreContractTemplateActions.error(null));

    try {
      await restoreContractTemplateAPI(id);
      options.onSuccess?.();
      dispatch(snackbarSuccess('subscription.contractTemplate.restoreSuccess'));
    } catch (error) {
      dispatch(restoreContractTemplateActions.error(error));
      options.onError?.(error);
      dispatch(snackbarSuccess('subscription.contractTemplate.restoreSuccess'));
    }

    dispatch(restoreContractTemplateActions.isLoading(false));
  };

export const fetchContractTemplateDetailActions = {
  error: createAction<Error | null>('FRANCHISE/CONTRACT_TEMPLATE/DETAIL/ERROR'),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/DETAIL/IS_LOADING',
  ),
};
export const storeContractTemplateDetailAction = createAction<ContractTemplate>(
  'FRANCHISE/CONTRACT_TEMPLATE/DETAIL/SUCCESS',
);

export const fetchContractTemplateDetail =
  (id: number, options?: OptionCallback<ContractTemplate>) =>
  async (dispatch: Dispatch) => {
    dispatch(fetchContractTemplateDetailActions.isLoading(true));
    dispatch(fetchContractTemplateDetailActions.error(null));

    try {
      const response = await fetchContractTemplateDetailAPI(id);
      dispatch(storeContractTemplateDetailAction(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchContractTemplateDetailActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchContractTemplateDetailActions.isLoading(false));
  };

export const fetchContractTemplateRelatedBillingPlansActions = {
  error: createAction<Error | null>(
    'FRANCHISE/CONTRACT_TEMPLATE/SUBSCRIPTIONS/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/SUBSCRIPTIONS/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'FRANCHISE/CONTRACT_TEMPLATE/SUBSCRIPTIONS/SUCCESS',
  ),
};

export const fetchContractTemplateRelatedBillingPlans =
  (
    id: number,
    params?: PaginationFilterParams,
    options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
  ) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchContractTemplateRelatedBillingPlansActions.isLoading(true));
    dispatch(fetchContractTemplateRelatedBillingPlansActions.error(null));

    const page =
      params?.page ??
      getState().subscription?.contractTemplate?.billingPlans?.page ??
      1;
    try {
      const response = await fetchContractTemplateRelatedBillingPlansAPI(id, {
        ...params,
        page,
        page_size: params?.page_size ?? SUBSCRIBED_MEMBER_LIST_PAGE_SIZE,
      });
      dispatch(
        fetchContractTemplateRelatedBillingPlansActions.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchContractTemplateRelatedBillingPlansActions.error(error));
      options?.onError?.(error);
    }

    dispatch(fetchContractTemplateRelatedBillingPlansActions.isLoading(false));
  };

export const createOrUpdateContractTemplateActions = {
  error: createAction<Error | null>(
    'FRANCHISE/CONTRACT_TEMPLATE/CREATE_OR_UPDATE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'FRANCHISE/CONTRACT_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING',
  ),
};

export function createOrUpdateContractTemplate(
  data: ContractTemplatePayload,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateContractTemplateActions.error(null));
    dispatch(createOrUpdateContractTemplateActions.isLoading(true));
    try {
      const response = await createOrUpdateContractTemplateAPI(data);
      dispatch(storeContractTemplateDetailAction(response.data));
      options.onSuccess?.();
      data.id
        ? dispatch(snackbarSuccess('subscription.contractTemplate.editSuccess'))
        : dispatch(
            snackbarSuccess('subscription.contractTemplate.createSuccess'),
          );
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateContractTemplateActions.error(err));
      options.onError?.(err);
      data.id
        ? dispatch(snackbarError('subscription.contractTemplate.editError'))
        : dispatch(snackbarError('subscription.contractTemplate.createError'));
    }
    dispatch(createOrUpdateContractTemplateActions.isLoading(false));
  };
}

// ---------------------------------------- CONTRACT REVAMP ACTIONS ----------------------------------------

export const contractCreateActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/CREATE/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/CREATE/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/CREATE/SUCCESS'),
};
export function createContract(
  data: ContractPayload,
  options: OptionCallback<Contract>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(contractCreateActions.error(null));
    dispatch(contractCreateActions.isLoading(true));
    try {
      const response = await createContractAPI(data);
      dispatch(contractCreateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractCreateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractCreateActions.isLoading(false));
  };
}

export const contractUpdateActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/UPDATE/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/UPDATE/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/UPDATE/SUCCESS'),
};
export function updateContract(
  data: ContractPayload,
  options: OptionCallback<Contract>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(contractUpdateActions.error(null));
    dispatch(contractUpdateActions.isLoading(true));
    try {
      const response = await updateContractAPI(data);
      dispatch(contractUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractUpdateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractUpdateActions.isLoading(false));
  };
}
