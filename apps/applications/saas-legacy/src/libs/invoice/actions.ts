import { createAction } from 'redux-actions';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group.js';

import { SPOT_NOT_AVAILABLE } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import {
  LOCK_ACQUISITION_FAILURE_GENERIC,
  LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING,
} from '@bsport/common/lib/master-data/error-codes/lock.js';

import { UNEVEN_INVOICE_ALERT } from '@bsport/common/lib/master-data/alerting_kind.js';
import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';

import { EXCEPTION_STAFF_ROLE_OVERBOOKING_NOT_ALLOWED } from '#src/libs/role/constants';

import { refreshAlertingByKind } from '#src/libs/alerting/actions';
import { CouponErrorCodes } from '#src/libs/coupon/constants';
import { isErrorWithCustomCode } from '#src/libs/utils';

import type {
  Invoice,
  InvoiceConfigurationSerializer,
  InvoiceConfigurationMemberSerializer,
  InvoiceDetailsSerializer,
  InvoiceFilter,
  InvoiceInfoSerializer,
  InvoiceItemFilter,
  InvoiceV1Serializer,
  PaymentFilter,
  PlannedPaymentEvent,
  PlannedPaymentEventFilter,
  PlannedPaymentEventSerializer,
  BulkExportRequestErrorResults,
  OnboardingRequirementsResponse,
  FiskalySignEsInvoiceDetails,
  SequentialNumberingStatusResponse,
  InitializeLegalIdentifierLegacyResponse,
  InitializeLegalIdentifierLegacyRequest,
  InitializeLegalIdentifierOnboarding,
} from '#src/libs/invoice/types';
import type { PaymentItem } from '#src/libs/invoice/payment/types';
import type { InvoiceItem } from '#src/libs/invoice/invoice-item/types';
import type { Payment } from '#src/libs/payment/types';
import type {
  Dispatch,
  OptionBackgroundCallback,
  OptionCallback,
  PaginatedResponse,
} from '#src/state/types';
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
  fetchInvoiceConfigurationAsMember as fetchInvoiceConfigurationAsMemberAPI,
  finalize as finalizeAPI,
  generateInvoiceXml as generateInvoiceXmlAPI,
  generateInvoiceXmlBulk as generateInvoiceXmlBulkAPI,
  fetchInvoiceItemList as fetchInvoiceItemListAPI,
  fetchPaymentList as fetchPaymentListAPI,
  checkInvoiceInfo as checkInvoiceInfoAPI,
  allocateDebtToInvoice as allocateDebtToInvoiceAPI,
  applyBalanceToUnpaid as applyBalanceToUnpaidAPI,
  fetchPlannedPaymentEvent as fetchPlannedPaymentEventAPI,
  editCustomFooter as editCustomFooterAPI,
  editBillingEstablishent as editBillingEstablishentAPI,
  editEstablishmentBillingGroup as editEstablishmentBillingGroupAPI,
  cancelPlannedPaymentEvent as cancelPlannedPaymentEventAPI,
  enablePlannedPaymentEvent as enablePlannedPaymentEventAPI,
  registerNowPlannedPaymentEvent as registerNowPlannedPaymentEventAPI,
  schedulePayment as schedulePaymentAPI,
  sendInvoiceToQuickbooks as sendInvoiceToQuickbooksAPI,
  applyBalanceToInvoice as applyBalanceToInvoiceAPI,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAPI,
  changePaymentMethodAndRegisterPlannedPaymentEvent as changePaymentMethodAndRegisterPlannedPaymentEventAPI,
  getReceiptUrl as getReceiptUrlAPI,
  getSequentialNumberingStatus as getSequentialNumberingStatusAPI,
  initializeLegalIdentifierLegacy as initializeLegalIdentifierLegacyAPI,
  initializeLegalIdentifierOnboarding as initializeLegalIdentifierOnboardingAPI,
  checkFiskalyOnboardingStatus as checkFiskalyOnboardingStatusAPI,
  getFiskalyOnboardingRequirements as getFiskalyOnboardingRequirementsAPI,
  onboardFiskalyCompany as onboardFiskalyCompanyAPI,
  getLastGeneratedAgreementUrl as getLastGeneratedAgreementUrlAPI,
  getLastUploadedSignedAgreement as getLastUploadedSignedAgreementAPI,
  uploadSignedAgreement as uploadSignedAgreementAPI,
  getSoftwareRegistrationUrl as getSoftwareRegistrationUrlAPI,
  fetchFiskalySignEsInvoice as fetchFiskalySignEsInvoiceAPI,
  manuallySendInvoiceToSignEs as manuallySendInvoiceToSignEsAPI,
} from './api';
import { ExportInvoiceStatus } from './constants';
import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import { displayBackgroundDialog } from '#src/libs/background-dialog/actions';
import {
  BackgroundDialogActionMode,
  BackgroundDialogDisplayMode,
} from '#src/libs/background-dialog/types';
import type { BackgroundTask } from '#src/libs/background-task/types';

export const invoiceConfigurationPatchActions = {
  isLoading: createAction<boolean>('INVOICE-CONFIGURATION/PATCH/IS_LOADING'),
  error: createAction<Error | null>('INVOICE-CONFIGURATION/PATCH/ERROR'), // not used in reducers
};

export const refreshUnpaidInvoiceAlerting = () =>
  // @ts-expect-error
  refreshAlertingByKind(UNEVEN_INVOICE_ALERT);

export function patchInvoiceConfiguration(
  data: Partial<InvoiceConfigurationSerializer>,
  options: OptionCallback<InvoiceConfigurationSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(invoiceConfigurationPatchActions.isLoading(true));
    dispatch(invoiceConfigurationPatchActions.error(null));
    try {
      const response = await patchConfigurationAPI(data);
      dispatch(invoiceConfigurationDetailActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(invoiceConfigurationPatchActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(invoiceConfigurationPatchActions.isLoading(false));
  };
}

export const invoiceConfigurationDetailActions = {
  isLoading: createAction<boolean>('INVOICE-CONFIGURATION/DETAIL/IS_LOADING'),
  error: createAction<Error | null>('INVOICE-CONFIGURATION/DETAIL/ERROR'),
  success: createAction<
    InvoiceConfigurationSerializer | InvoiceConfigurationMemberSerializer
  >('INVOICE-CONFIGURATION/DETAIL/SUCCESS'),
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

export function fetchInvoiceConfigurationAsMember(company_id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(invoiceConfigurationDetailActions.isLoading(true));
    dispatch(invoiceConfigurationDetailActions.error(null));
    try {
      const response = await fetchInvoiceConfigurationAsMemberAPI(company_id);
      dispatch(invoiceConfigurationDetailActions.success(response.data));
    } catch (err) {
      dispatch(invoiceConfigurationDetailActions.error(err));
    }
    dispatch(invoiceConfigurationDetailActions.isLoading(false));
  };
}

export const finalizeInvoiceActions = {
  isLoading: createAction<{ uuid: string; loading: boolean }>(
    'INVOICE/FINALIZE/IS_LOADING',
  ),
  error: createAction<Error | null>('INVOICE/FINALIZE/ERROR'),
  success: createAction<InvoiceV1Serializer>('INVOICE/FINALIZE/SUCCESS'),
};

export function finalizeInvoice(
  uuid: string,
  options?: OptionCallback<InvoiceV1Serializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(finalizeInvoiceActions.isLoading({ uuid, loading: true }));
    dispatch(finalizeInvoiceActions.error(null));
    try {
      const response = await finalizeAPI(uuid);
      dispatch(finalizeInvoiceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(finalizeInvoiceActions.error(err));
      options?.onError?.(err);
    }
    dispatch(finalizeInvoiceActions.isLoading({ uuid, loading: false }));
  };
}

export const generateInvoiceXmlActions = {
  isLoading: createAction<boolean>('INVOICE/GENERATE_XML/IS_LOADING'),
  error: createAction<Error | null>('INVOICE/GENERATE_XML/ERROR'),
  success: createAction<InvoiceV1Serializer>('INVOICE/GENERATE_XML/SUCCESS'),
};

export function generateInvoiceXml(
  uuid: string,
  options?: OptionCallback<InvoiceV1Serializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(generateInvoiceXmlActions.isLoading(true));
    dispatch(generateInvoiceXmlActions.error(null));
    try {
      const response = await generateInvoiceXmlAPI(uuid);
      if (
        response.data.exported_invoice_status === ExportInvoiceStatus.SUCCESS
      ) {
        dispatch(snackbarSuccess('invoice.generateXml.success'));
      } else if (response.data.exported_invoice_error_code) {
        // If there is an error code, even if the status is 200, the export failed and the returned invoice
        // may have an error code.
        dispatch(
          snackbarError(
            `invoice.generateXml.errors.${response.data.exported_invoice_error_code}`,
          ),
        );
      } else {
        snackbarError('invoice.generateXml.errors.default');
      }
      dispatch(generateInvoiceXmlActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(snackbarError(`invoice.generateXml.errors.default`));
      dispatch(generateInvoiceXmlActions.error(err));
      options?.onError?.(err);
    }
    dispatch(generateInvoiceXmlActions.isLoading(false));
  };
}

export const getInvoiceReceiptUrlActions = {
  isLoading: createAction<boolean>('INVOICE/GET_RECEIPT_URL/IS_LOADING'),
  error: createAction<Error | null>('INVOICE/GET_RECEIPT_URL/ERROR'),
  success: createAction<string>('INVOICE/GET_RECEIPT_URL/SUCCESS'),
};

/**
 * Retrieves an invoice receipt URL. Only used for widget.
 * @param uuid The invoice uuid
 * @returns {string}
 */
export function getInvoiceReceiptUrl(
  uuid: string,
  options?: OptionCallback<string>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(generateInvoiceXmlBulkActions.isLoading(true));
    dispatch(generateInvoiceXmlBulkActions.error(null));
    try {
      const response = await getReceiptUrlAPI(uuid);
      dispatch(getInvoiceReceiptUrlActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(getInvoiceReceiptUrlActions.error(error));
      console.error(error);
      options?.onError?.(error);
    } finally {
      dispatch(generateInvoiceXmlBulkActions.isLoading(false));
    }
  };
}

export const generateInvoiceXmlBulkActions = {
  isLoading: createAction<boolean>('INVOICE/GENERATE_XML_BULK/IS_LOADING'),
  error: createAction<BackgroundTask<BulkExportRequestErrorResults> | null>(
    'INVOICE/GENERATE_XML_BULK/ERROR',
  ),
};

export function exportXmlBulk(
  options?: OptionBackgroundCallback<string> & {
    backgroundDialog?: {
      message: string;
      title: string;
    };
  },
) {
  return async (dispatch: Dispatch) => {
    dispatch(generateInvoiceXmlBulkActions.isLoading(true));
    dispatch(generateInvoiceXmlBulkActions.error(null));
    try {
      const response = await generateInvoiceXmlBulkAPI({
        unexported_yet: true,
        from_last_month: true,
      });
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];

      dispatch(
        monitorBackgroundTask<
          void,
          BackgroundTask<BulkExportRequestErrorResults>
        >(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onBackgroundSuccess?.();
            dispatch(generateInvoiceXmlBulkActions.isLoading(false));
            dispatch(
              displayBackgroundDialog(
                backgroundTaskUuid,
                options?.backgroundDialog?.title,
                options?.backgroundDialog?.message,
                response.data,
                BackgroundDialogActionMode.DOWNLOAD,
                BackgroundDialogDisplayMode.INFORMATION,
                'common:close',
              ),
            );
          },
          onError: (error) => {
            const errorCode = error?.return_value?.error_code;
            dispatch(
              snackbarError(
                `invoice.generateXml.errors.${errorCode || 'default'}`,
              ),
            );
            dispatch(generateInvoiceXmlBulkActions.error(error));
            dispatch(generateInvoiceXmlBulkActions.isLoading(false));
            options?.onBackgroundError?.();
          },
        }),
      );
    } catch (error) {
      const errorCode = error.response?.data?.error_code;
      dispatch(
        snackbarError(`invoice.generateXml.errors.${errorCode || 'default'}`),
      );
      dispatch(generateInvoiceXmlBulkActions.error(error));
      dispatch(generateInvoiceXmlBulkActions.isLoading(false));
      options?.onError?.();
    }
  };
}

export const returnPaymentActions = {
  isLoading: createAction<boolean>('INVOICE/RETURN_PAYMENT/IS_LOADING'),
  error: createAction<Error | null>('INVOICE/RETURN_PAYMENT/ERROR'),
  success: createAction<Payment>('INVOICE/RETURN_PAYMENT/SUCCESS'), // not used in reducers
};

export function returnPayment(
  payment: string,
  invoice: string,
  options: OptionCallback<Payment>,
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
        if (err.response && err.response.status_code === 423) {
          dispatch(snackbarError('invoice.returnPaymentLocked'));
        }
        options.onError(err);
      }
    }
    dispatch(fetchSpecificInvoice(invoice));
    dispatch(returnPaymentActions.isLoading(false));
  };
}

export function revertQuickInvoice(
  uuid: string,
  options: OptionCallback<InvoiceDetailsSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(revertInvoice(uuid, {}, options));
    dispatch(refreshUnpaidInvoiceAlerting());
  };
}

export function revertInvoice(
  uuid: string,
  params: {
    reverse_type?: number;
    payment_method_to_reverse?: string;
    revert_reason?: string;
  },
  options: OptionCallback<InvoiceDetailsSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.error(null));
    dispatch(retrieveInvoiceActions.isLoading(true));
    try {
      const response = await revertAPI(uuid, params);
      dispatch(retrieveInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(
            `invoice.revert.errors.${err.response.data.error_code}`,
          ),
        );
      }
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
    dispatch(refreshUnpaidInvoiceAlerting());
  };
}

export const quickInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/QUICK_CREATE/LOADING'),
  error: createAction<Error | null>('INVOICE/QUICK_CREATE/ERROR'),
};

export function createQuickInvoice(
  data: {
    memberId: number;
    offerId: number;
    paymentPackId: number;
    keep_credits?: boolean;
    establishment_billing_group_id?: number;
  },
  options: OptionCallback<InvoiceDetailsSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(quickInvoiceActions.isLoading(true));
    dispatch(quickInvoiceActions.error(null));
    try {
      const response = await createQuickAPI(data);
      const invoice = response.data;
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
    } catch (err) {
      dispatch(quickInvoiceActions.error(err));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        let translationKey = '';
        switch (err.response.data.error_code) {
          case EXCEPTION_STAFF_ROLE_OVERBOOKING_NOT_ALLOWED:
            translationKey = 'role.noMasterControl.overbookingNotAllowed';
            break;
          case LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING:
            translationKey = `canNotBuyErrorCode.${LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING}`;
            break;
          case LOCK_ACQUISITION_FAILURE_GENERIC:
            translationKey = `canNotBuyErrorCode.${LOCK_ACQUISITION_FAILURE_GENERIC}`;
            break;
          case SPOT_NOT_AVAILABLE:
            translationKey = `canNotBuyErrorCode.${SPOT_NOT_AVAILABLE}`;
            break;
          default:
            translationKey = 'canNotBuyErrorCode.generic';
            break;
        }
        dispatch(snackbarError(translationKey));
      }
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(refreshUnpaidInvoiceAlerting());
    dispatch(quickInvoiceActions.isLoading(false));
  };
}

export const retrieveInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/RETRIEVE/LOADING'),
  error: createAction<Error | null>('INVOICE/RETRIEVE/ERROR'),
  success: createAction<
    | PaginatedResponse<InvoiceV1Serializer>
    | InvoiceV1Serializer[]
    | InvoiceV1Serializer
    | InvoiceConfigurationSerializer
    | InvoiceDetailsSerializer
  >('INVOICE/RETRIEVE/SUCCESS'),
};

export function fetchByQueryInvoice(
  params: InvoiceFilter & {
    page: number;
    page_size?: number;
  },
  options: OptionCallback<InvoiceV1Serializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.isLoading(true));
    dispatch(retrieveInvoiceActions.error(null));

    try {
      const response = await fetchByQueryAPI(params);
      // @ts-expect-error
      const invoice = response.data[0];
      dispatch(retrieveInvoiceActions.success(invoice));
      options?.onSuccess?.(invoice);
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      options?.onError?.(err);
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
  };
}

export function fetchSpecificInvoice(
  invoiceId: string,
  options?: OptionCallback<InvoiceV1Serializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.isLoading(true));
    dispatch(retrieveInvoiceActions.error(null));

    try {
      const response = await fetchSpecificAPI(invoiceId);
      const invoice = response.data;
      options?.onSuccess?.(invoice);
      dispatch(retrieveInvoiceActions.success(invoice));
    } catch (err) {
      dispatch(retrieveInvoiceActions.error(err));
      options?.onError?.(err);
    }
    dispatch(retrieveInvoiceActions.isLoading(false));
  };
}

export const sendInvoiceToQuickbooksActions = {
  isLoading: createAction<boolean>('INVOICE/QUICKBOOKS/LOADING'),
  error: createAction<Error | null>('INVOICE/QUICKBOOKS/ERROR'),
  success: createAction<Object>('INVOICE/QUICKBOOKS/SUCCESS'), // not used in reducers
};
export function sendInvoiceToQuickbooks(
  invoiceId: string,
  options?: OptionCallback<Object>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(sendInvoiceToQuickbooksActions.isLoading(true));
    dispatch(sendInvoiceToQuickbooksActions.error(null));

    try {
      const response = await sendInvoiceToQuickbooksAPI(invoiceId);
      const invoice = response.data;
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
      dispatch(snackbarSuccess('invoice.sendToQuickbooks.success'));
      dispatch(sendInvoiceToQuickbooksActions.success(invoice));
    } catch (err) {
      dispatch(sendInvoiceToQuickbooksActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
      if (err?.response?.data?.error_code) {
        dispatch(
          snackbarError(
            `invoice.sendToQuickbooks.errors.${err.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('invoice.sendToQuickbooks.error'));
      }
    }
    dispatch(sendInvoiceToQuickbooksActions.isLoading(false));
  };
}
export function fetchByInvoiceItem(
  buyable_item_identifier: number,
  buyable_item_id: number,
  options: OptionCallback<InvoiceV1Serializer>,
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
  isLoading: createAction<boolean>('INVOICE/UPATE_PAYMENT_METHOD/LOADING'),
  error: createAction<Error | null>('INVOICE/UPATE_PAYMENT_METHOD/ERROR'),
  success: createAction<Payment>('INVOICE/UPATE_PAYMENT_METHOD/SUCCESS'),
};

export function updatePaymentMethod(
  uuid: string,
  newMethod: number,
  options: OptionCallback<Payment>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePaymentMethodActions.isLoading(true));
    dispatch(updatePaymentMethodActions.error(null));

    try {
      const response = await updatePaymentMethodAPI(uuid, newMethod);
      const payment = response.data;
      dispatch(updatePaymentMethodActions.success(payment));
      if (options && options.onSuccess) {
        options.onSuccess(payment);
      }
    } catch (err) {
      dispatch(updatePaymentMethodActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(updatePaymentMethodActions.isLoading(false));
  };
}

export function createOrUpdateInvoice(
  invoiceData: Invoice,
  options: OptionCallback<InvoiceV1Serializer>,
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
      } else {
        dispatch(snackbarSuccess('invoice.create.success'));
      }
      if (options && options.onSuccess) {
        options.onSuccess(invoice);
      }
    } catch (error) {
      console.error(error);
      if (
        isErrorWithCustomCode(error) &&
        error.response.data?.error_code === CouponErrorCodes.UNIQUE_CODE_LOCKED
      ) {
        dispatch(
          snackbarError(`coupon.errors.${error.response.data.error_code}`),
        );
      } else {
        dispatch(snackbarError('invoice.error'));
        if (options && options.onError) {
          options.onError(error);
        }
      }
      dispatch(createOrUpdateInvoiceActions.isLoading(false));
      dispatch(refreshUnpaidInvoiceAlerting());
    }
  };
}
export const createOrUpdateInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/CREATE_OR_UPDATE/LOADING'),
  error: createAction<Error | null>('INVOICE/CREATE_OR_UPDATE/ERROR'),
  success: createAction<InvoiceV1Serializer>(
    'INVOICE/CREATE_OR_UPDATE/SUCCESS',
  ),
  reset: createAction<void>('INVOICE/CREATE_OR_UPDATE/RESET'), // not used in reducers
};

export const listPaymentActions = {
  isLoading: createAction<boolean>('PAYMENT/LIST/LOADING'),
  error: createAction<Error | null>('PAYMENT/LIST/ERROR'),
  success: createAction<PaymentItem[] | PaginatedResponse<Payment>>(
    'PAYMENT/LIST/SUCCESS',
  ),
};

export function fetchPaymentList(
  params: PaymentFilter & {
    page: number;
    page_size?: number;
  },
  options?: OptionCallback<Payment[] | PaginatedResponse<Payment>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPaymentActions.isLoading(true));
    dispatch(listPaymentActions.error(null));

    try {
      const response = await fetchPaymentListAPI(params);
      // @ts-expect-error
      dispatch(listPaymentActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(listPaymentActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(listPaymentActions.isLoading(false));
  };
}

export const listInvoiceItemActions = {
  isLoading: createAction<boolean>('INVOICE_ITEM/LIST/LOADING'),
  error: createAction<Error | null>('INVOICE_ITEM/LIST/ERROR'),
  success: createAction<InvoiceItem[] | PaginatedResponse<InvoiceItem>>(
    'INVOICE_ITEM/LIST/SUCCESS',
  ),
};

export function fetchInvoiceItemList(
  params: InvoiceItemFilter & {
    page: number;
    page_size?: number;
  },
  options: OptionCallback<InvoiceItem[] | PaginatedResponse<InvoiceItem>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listInvoiceItemActions.isLoading(true));
    dispatch(listInvoiceItemActions.error(null));

    try {
      const response = await fetchInvoiceItemListAPI(params);
      dispatch(
        // @ts-expect-error
        listInvoiceItemActions.success(response.data.results || response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(listInvoiceItemActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(listInvoiceItemActions.isLoading(false));
  };
}

export const listInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/LIST/IS_LOADING'),
  error: createAction<Error | null>('INVOICE/LIST/ERROR'),
  success: createAction<
    PaginatedResponse<InvoiceV1Serializer> | InvoiceV1Serializer[]
  >('INVOICE/LIST/SUCCESS'),
  reset: createAction<void>('INVOICE/LIST/RESET'),
};

export function resetInvoiceList() {
  return (dispatch: Dispatch) => {
    dispatch(listInvoiceActions.reset());
  };
}

export function fetchInvoiceList(
  params: InvoiceFilter & {
    page?: number;
    page_size?: number;
  },
  options?: OptionCallback<
    PaginatedResponse<InvoiceV1Serializer> | InvoiceV1Serializer[]
  >,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listInvoiceActions.isLoading(true));
    dispatch(listInvoiceActions.error(null));
    try {
      // @ts-expect-error
      const response = await fetchByQueryAPI(params);
      // @ts-expect-error
      if (params?.page && response.data.results) {
        dispatch(
          listInvoiceActions.success({ ...response.data, page: params.page }),
        );
      } else {
        dispatch(listInvoiceActions.success(response.data));
      }
      // @ts-expect-error
      options?.onSuccess?.(response.data.results || response.data);
    } catch (err) {
      dispatch(listInvoiceActions.error(err));
      console.error(err);
      options?.onError?.(err);
    }
    dispatch(listInvoiceActions.isLoading(false));
  };
}

export const checkInvoiceInfoActions = {
  isLoading: createAction<boolean>('INVOICE/CHECK_INFO/IS_LOADING'),
  error: createAction<Error | null>('INVOICE/CHECK_INFO/ERROR'),
  success: createAction<InvoiceInfoSerializer>('INVOICE/CHECK_INFO/SUCCESS'),
  reset: createAction<void>('INVOICE/CHECK_INFO/RESET'),
};

// a bit dirty all this stuff...
export function checkInvoiceInfo(
  uuid: string,
  options: OptionCallback<InvoiceInfoSerializer>,
) {
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

export function allocateDebt(
  uuid: string,
  options: OptionCallback<InvoiceConfigurationSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveInvoiceActions.error(null));
    dispatch(retrieveInvoiceActions.isLoading(true));
    try {
      const response = await allocateDebtToInvoiceAPI(uuid);
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
    dispatch(refreshUnpaidInvoiceAlerting());
  };
}

export const applyBalanceToUnpaidActions = {
  isLoading: createAction<boolean>(
    'INVOICE/APPLY_BALANCE_TO_UNPAID/IS_LOADING',
  ), // not used in reducers
  success: createAction<string>('INVOICE/APPLY_BALANCE_TO_UNPAID/SUCCESS'), // not used in reducers
  error: createAction<Error | null>('INVOICE/APPLY_BALANCE_TO_UNPAID/ERROR'), // not used in reducers
};

// a bit dirty all this stuff...
export function applyBalanceToUnpaid(
  memberId: number,
  options: OptionCallback<string>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(applyBalanceToUnpaidActions.isLoading(true));
    dispatch(applyBalanceToUnpaidActions.error(null));
    try {
      const response = await applyBalanceToUnpaidAPI(memberId);
      dispatch(applyBalanceToUnpaidActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(applyBalanceToUnpaidActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(applyBalanceToUnpaidActions.isLoading(false));
  };
}

export const listPlannedPaymentEventActions = {
  isLoading: createAction<boolean>('PLANNED_PAYMENT_EVENT/LIST/LOADING'),
  error: createAction<Error | null>('PLANNED_PAYMENT_EVENT/LIST/ERROR'),
  success: createAction<
    | PaginatedResponse<PlannedPaymentEventSerializer>
    | PlannedPaymentEventSerializer[]
  >('PLANNED_PAYMENT_EVENT/LIST/SUCCESS'),
};

export function fetchPlannedPaymentEventList(
  params: PlannedPaymentEventFilter & {
    page: number;
    page_size?: number;
  },
  options: OptionCallback<
    PaginatedResponse<PlannedPaymentEvent> | PlannedPaymentEvent[]
  >,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPlannedPaymentEventActions.isLoading(true));
    dispatch(listPlannedPaymentEventActions.error(null));

    try {
      const response = await fetchPlannedPaymentEventAPI(params);
      // @ts-expect-error
      dispatch(listPlannedPaymentEventActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(listPlannedPaymentEventActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(listPlannedPaymentEventActions.isLoading(false));
  };
}

export const cancelPlannedPaymentEventActions = {
  isLoading: createAction<boolean>('PLANNED_PAYMENT_EVENT/CANCEL/LOADING'),
  error: createAction<Error | null>('PLANNED_PAYMENT_EVENT/CANCEL/ERROR'), // not used in reducers
  success: createAction<PlannedPaymentEventSerializer>(
    'PLANNED_PAYMENT_EVENT/CANCEL/SUCCESS',
  ),
};

export function cancelPlannedPaymentEvent(
  id: number,
  options: OptionCallback<PlannedPaymentEventSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(cancelPlannedPaymentEventActions.isLoading(true));
    dispatch(cancelPlannedPaymentEventActions.error(null));
    try {
      const response = await cancelPlannedPaymentEventAPI(id);
      dispatch(cancelPlannedPaymentEventActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(cancelPlannedPaymentEventActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(cancelPlannedPaymentEventActions.isLoading(false));
  };
}

export const enablePlannedPaymentEventActions = {
  isLoading: createAction<boolean>('PLANNED_PAYMENT_EVENT/ENABLE/LOADING'),
  error: createAction<Error | null>('PLANNED_PAYMENT_EVENT/ENABLE/ERROR'),
  success: createAction<PlannedPaymentEventSerializer>(
    'PLANNED_PAYMENT_EVENT/ENABLE/SUCCESS',
  ),
};

export function enablePlannedPaymentEvent(
  id: number,
  options: OptionCallback<PlannedPaymentEventSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(enablePlannedPaymentEventActions.isLoading(true));
    dispatch(enablePlannedPaymentEventActions.error(null));

    try {
      const response = await enablePlannedPaymentEventAPI(id);
      dispatch(enablePlannedPaymentEventActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(enablePlannedPaymentEventActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(enablePlannedPaymentEventActions.isLoading(false));
  };
}

export const registerNowPlannedPaymentEventActions = {
  isLoading: createAction<boolean>(
    'PLANNED_PAYMENT_EVENT/REGISTER_NOW/LOADING',
  ),
  error: createAction<Error | null>('PLANNED_PAYMENT_EVENT/REGISTER_NOW/ERROR'),
  success: createAction<PlannedPaymentEventSerializer>(
    'PLANNED_PAYMENT_EVENT/REGISTER_NOW/ENABLE/SUCCESS',
  ),
};

export function registerNowPlannedPaymentEvent(
  id: number,
  options: OptionCallback<PlannedPaymentEventSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(registerNowPlannedPaymentEventActions.isLoading(true));
    dispatch(registerNowPlannedPaymentEventActions.error(null));

    try {
      const response = await registerNowPlannedPaymentEventAPI(id);
      dispatch(registerNowPlannedPaymentEventActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(registerNowPlannedPaymentEventActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(registerNowPlannedPaymentEventActions.isLoading(false));
  };
}

export const changePaymentMethodAndRegisterPlannedPaymentEventActions = {
  isLoading: createAction<boolean>(
    'PLANNED_PAYMENT_EVENT/CHANGE_METHOD/LOADING',
  ),
  error: createAction<Error | null>(
    'PLANNED_PAYMENT_EVENT/CHANGE_METHOD/ERROR',
  ),
  success: createAction<PlannedPaymentEventSerializer>(
    'PLANNED_PAYMENT_EVENT/CHANGE_METHOD/ENABLE/SUCCESS',
  ),
};

export function changePaymentMethodAndRegisterPlannedPaymentEvent(
  ppeId: number,
  paymentMethod: number,
  selectedPaymentMethodId: string | null,
  applyToAllFuturePayments: boolean,
  registerNow: boolean,
  extraData: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      changePaymentMethodAndRegisterPlannedPaymentEventActions.isLoading(true),
    );
    dispatch(
      changePaymentMethodAndRegisterPlannedPaymentEventActions.error(null),
    );
    try {
      const paymentBackendPaymentMethodId = [
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
        PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
      ].includes(paymentMethod)
        ? selectedPaymentMethodId
        : '';

      const data = {
        payment_method_identifier: paymentMethod,
        payment_method_id: paymentBackendPaymentMethodId,
        apply_to_all: applyToAllFuturePayments,
        register_now: registerNow,
        extra_data: extraData,
      };
      const response =
        await changePaymentMethodAndRegisterPlannedPaymentEventAPI(ppeId, data);
      dispatch(
        changePaymentMethodAndRegisterPlannedPaymentEventActions.success(
          response.data,
        ),
      );
      dispatch(
        snackbarSuccess(
          registerNow
            ? 'plannedPayment.registerNow.success'
            : 'subscription.switchPaymentMethod.success',
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (e) {
      console.error(e);
      dispatch(
        changePaymentMethodAndRegisterPlannedPaymentEventActions.error(e),
      );
      dispatch(
        snackbarError(
          registerNow
            ? 'plannedPayment.registerNow.error'
            : 'subscription.switchPaymentMethod.error',
        ),
      );
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(
      changePaymentMethodAndRegisterPlannedPaymentEventActions.isLoading(false),
    );
  };
}

export const editCustomFooterActions = {
  isLoading: createAction<boolean>('INVOICE/EDIT_FOOTER/LOADING'), // not used in reducers
  error: createAction<Error | null>('INVOICE/EDIT_FOOTER/ERROR'), // not used in reducers
  success: createAction<InvoiceDetailsSerializer>(
    'INVOICE/EDIT_FOOTER/SUCCESS',
  ),
};

export function editCustomFooter(
  uuid: string,
  customFooter: string,
  options?: OptionCallback<InvoiceDetailsSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editCustomFooterActions.isLoading(true));
    dispatch(editCustomFooterActions.error(null));
    try {
      const response = await editCustomFooterAPI(uuid, customFooter);
      dispatch(editCustomFooterActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(editCustomFooterActions.error(e));
      if (options && options.onError) {
        options.onError(e);
      }
    }
    dispatch(editCustomFooterActions.isLoading(false));
  };
}

export const schedulePaymentActions = {
  isLoading: createAction<boolean>(
    'PLANNED_PAYMENT_EVENT/SCHEDULE_PAYMENT/LOADING',
  ),
  error: createAction<Error | null>(
    'PLANNED_PAYMENT_EVENT/SCHEDULE_PAYMENT/ERROR',
  ),
  success: createAction<PlannedPaymentEventSerializer>(
    'PLANNED_PAYMENT_EVENT/SCHEDULE_PAYMENT/SUCCESS',
  ),
};

export function schedulePayment(
  uuid: string,
  data: {
    interval: string;
    nb_interval: number;
    payment_method_id: string;
    anchor_date?: string;
    payment_method_identifier: number;
    recurrence_basis: number;
  },
  options: OptionCallback<PlannedPaymentEventSerializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(schedulePaymentActions.isLoading(true));
    dispatch(schedulePaymentActions.error(null));
    try {
      const response = await schedulePaymentAPI(uuid, data);
      dispatch(schedulePaymentActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(schedulePaymentActions.error(err));
    }
    dispatch(schedulePaymentActions.isLoading(false));
  };
}

export const editBillingEstablishmentActions = {
  isLoading: createAction<boolean>(
    'INVOICE/EDIT_BILLING_ESTABLISHMENT/LOADING',
  ), // not used in reducers
  error: createAction<Error | null>('INVOICE/EDIT_BILLING_ESTABLISHMENT/ERROR'), // not used in reducers
  success: createAction<InvoiceV1Serializer>(
    'INVOICE/EDIT_BILLING_ESTABLISHMENT/SUCCESS',
  ),
};

export function editBillingEstablishment(
  uuid: string,
  establishmentId: string,
  options?: OptionCallback<InvoiceV1Serializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editBillingEstablishmentActions.isLoading(true));
    dispatch(editBillingEstablishmentActions.error(null));

    try {
      const response = await editBillingEstablishentAPI(uuid, establishmentId);
      dispatch(editBillingEstablishmentActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (err && err.response && err.response.status === 403) {
        dispatch(
          snackbarError(
            'invoice.billingEstablishment.error.unAuthorizedEstablishmentModification',
          ),
        );
      } else {
        dispatch(editBillingEstablishmentActions.error(err));
        if (options && options.onError) {
          options.onError(err);
        }
      }
    }
    dispatch(editBillingEstablishmentActions.isLoading(false));
  };
}

export const editEstablishmentBillingGroupActions = {
  isLoading: createAction<boolean>(
    'INVOICE/EDIT_ESTABLISHMENT_BILLING_GROUP/LOADING',
  ),
  error: createAction<Error | null>(
    'INVOICE/EDIT_ESTABLISHMENT_BILLING_GROUP/ERROR',
  ),
  success: createAction<InvoiceV1Serializer>(
    'INVOICE/EDIT_ESTABLISHMENT_BILLING_GROUP/SUCCESS',
  ),
};

/**
 * Dispatches actions to edit the EstablishmentBillingGroup of an Invoice.
 *
 * @param {string} uuid - The UUID of the invoice.
 * @param {string} establishmentBillingGroupId - The ID of the establishment billing group.
 * @param {OptionCallback<InvoiceV1Serializer>} [options] - Optional callbacks to handle success and error states.
 * @returns {Function} - A thunk function.
 */
export function editEstablishmentBillingGroup(
  uuid: string,
  establishmentBillingGroupId: number,
  options?: OptionCallback<InvoiceV1Serializer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editEstablishmentBillingGroupActions.isLoading(true));
    dispatch(editEstablishmentBillingGroupActions.error(null));

    try {
      const response = await editEstablishmentBillingGroupAPI(
        uuid,
        establishmentBillingGroupId,
      );
      dispatch(editEstablishmentBillingGroupActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (err && err.response && err.response.status === 403) {
        dispatch(
          snackbarError(
            'invoice.billingEstablishment.error.unAuthorizedEstablishmentModification',
          ),
        );
      } else {
        dispatch(editEstablishmentBillingGroupActions.error(err));
        if (options && options.onError) {
          options.onError(err);
        }
      }
    }
    dispatch(editEstablishmentBillingGroupActions.isLoading(false));
  };
}

export const applyBalanceToInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/APPLY_BALANCE/LOADING'),
  error: createAction<Error | null>('INVOICE/APPLY_BALANCE/ERROR'),
  success: createAction<string>('INVOICE/APPLY_BALANCE/SUCCESS'), // not used in reducers
};

export function applyBalanceToInvoice(uuid: string, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(applyBalanceToInvoiceActions.isLoading(true));
    dispatch(applyBalanceToInvoiceActions.error(null));

    try {
      const response = await applyBalanceToInvoiceAPI(uuid);
      dispatch(applyBalanceToInvoiceActions.success(response.data));
      dispatch(snackbarSuccess('invoice.applyBalance.success'));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `invoice.applyBalance.errors.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('invoice.applyBalance.error'));
      }
      if (options && options.onError) {
        options.onError(error);
      }
      dispatch(applyBalanceToInvoiceActions.error(error));
    }
    dispatch(applyBalanceToInvoiceActions.isLoading(false));
  };
}

export const applyGiftcardOnInvoiceActions = {
  isLoading: createAction<boolean>('INVOICE/APPLY_GIFTCARD/LOADING'),
  error: createAction<Error | null>('INVOICE/APPLY_GIFTCARD/ERROR'),
  success: createAction<Invoice>('INVOICE/APPLY_GIFTCARD/SUCCESS'), // not used in reducers
};

export function applyGiftcardOnInvoice(
  invoice_uuid: string,
  consumer_giftcard_id: number,
  amount: number,
  options?: OptionCallback<Invoice>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(applyGiftcardOnInvoiceActions.isLoading(true));
    dispatch(applyGiftcardOnInvoiceActions.error(null));

    try {
      const response = await applyGiftcardOnInvoiceAPI(
        invoice_uuid,
        consumer_giftcard_id,
        amount,
      );
      dispatch(applyGiftcardOnInvoiceActions.success(response.data));
      dispatch(snackbarSuccess('invoice.applyGiftcard.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `invoice.applyGiftcard.errors.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(snackbarError('invoice.applyGiftcard.error'));
      }
      if (options && options.onError) {
        options.onError(error);
      }
      dispatch(applyGiftcardOnInvoiceActions.error(error));
    }
    dispatch(applyGiftcardOnInvoiceActions.isLoading(false));
  };
}

export const getSequentialNumberingStatusActions = {
  isLoading: createAction<boolean>(
    'SEQUENTIAL_NUMBERING/GET_STATUS/IS_LOADING',
  ),
  error: createAction<Error | null>('SEQUENTIAL_NUMBERING/GET_STATUS/ERROR'),
  success: createAction<SequentialNumberingStatusResponse>(
    'SEQUENTIAL_NUMBERING/GET_STATUS/SUCCESS',
  ),
};

export function getSequentialNumberingStatus(
  options?: OptionCallback<SequentialNumberingStatusResponse>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getSequentialNumberingStatusActions.isLoading(true));
    dispatch(getSequentialNumberingStatusActions.error(null));
    try {
      const response = await getSequentialNumberingStatusAPI();
      dispatch(getSequentialNumberingStatusActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(getSequentialNumberingStatusActions.error(error));
      options?.onError?.(error);
    }
    dispatch(getSequentialNumberingStatusActions.isLoading(false));
  };
}

export const initializeLegalIdentifierLegacyActions = {
  isLoading: createAction<boolean>(
    'INVOICE_SEQUENTIAL_NUMBERING/INITIALIZE_LEGACY/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'INVOICE_SEQUENTIAL_NUMBERING/INITIALIZE_LEGACY/ERROR',
  ),
  success: createAction<InitializeLegalIdentifierLegacyResponse>(
    'INVOICE_SEQUENTIAL_NUMBERING/INITIALIZE_LEGACY/SUCCESS',
  ),
};

export function initializeLegalIdentifierLegacy(
  data: InitializeLegalIdentifierLegacyRequest,
  options?: OptionCallback<InitializeLegalIdentifierLegacyResponse>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(initializeLegalIdentifierLegacyActions.isLoading(true));
    dispatch(initializeLegalIdentifierLegacyActions.error(null));
    try {
      const response = await initializeLegalIdentifierLegacyAPI(data);
      dispatch(initializeLegalIdentifierLegacyActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(initializeLegalIdentifierLegacyActions.error(error));
      options?.onError?.(error);
    }
    dispatch(initializeLegalIdentifierLegacyActions.isLoading(false));
  };
}

export const initializeLegalIdentifierOnboardingActions = {
  isLoading: createAction<boolean>(
    'INVOICE_SEQUENTIAL_NUMBERING/INITIALIZE_ONBOARDING/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'INVOICE_SEQUENTIAL_NUMBERING/INITIALIZE_ONBOARDING/ERROR',
  ),
  success: createAction<InitializeLegalIdentifierOnboarding>(
    'INVOICE_SEQUENTIAL_NUMBERING/INITIALIZE_ONBOARDING/SUCCESS',
  ),
};

export function initializeLegalIdentifierOnboarding(
  data: InitializeLegalIdentifierOnboarding,
  options?: OptionCallback<InitializeLegalIdentifierOnboarding>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(initializeLegalIdentifierOnboardingActions.isLoading(true));
    dispatch(initializeLegalIdentifierOnboardingActions.error(null));
    try {
      const response = await initializeLegalIdentifierOnboardingAPI(data);
      dispatch(
        initializeLegalIdentifierOnboardingActions.success(response.data),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(initializeLegalIdentifierOnboardingActions.error(error));
      options?.onError?.(error);
    }
    dispatch(initializeLegalIdentifierOnboardingActions.isLoading(false));
  };
}

export const checkFiskalyOnboardingStatusActions = {
  isLoading: createAction<boolean>(
    'FISKALY_ONBOARDING/CHECK_STATUS/IS_LOADING',
  ),
  error: createAction<Error | null>('FISKALY_ONBOARDING/CHECK_STATUS/ERROR'),
  success: createAction<{ is_onboarded: boolean }>(
    'FISKALY_ONBOARDING/CHECK_STATUS/SUCCESS',
  ),
};

export function checkFiskalyOnboardingStatus(
  options?: OptionCallback<{ is_onboarded: boolean }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(checkFiskalyOnboardingStatusActions.isLoading(true));
    dispatch(checkFiskalyOnboardingStatusActions.error(null));
    try {
      const response = await checkFiskalyOnboardingStatusAPI();
      dispatch(checkFiskalyOnboardingStatusActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(checkFiskalyOnboardingStatusActions.error(error));
      options?.onError?.();
    }
    dispatch(checkFiskalyOnboardingStatusActions.isLoading(false));
  };
}

export const getFiskalyOnboardingRequirementsActions = {
  isLoading: createAction<boolean>(
    'FISKALY_ONBOARDING/GET_REQUIREMENTS/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FISKALY_ONBOARDING/GET_REQUIREMENTS/ERROR',
  ),
  success: createAction<OnboardingRequirementsResponse>(
    'FISKALY_ONBOARDING/GET_REQUIREMENTS/SUCCESS',
  ),
};

export function getFiskalyOnboardingRequirements(
  options?: OptionCallback<OnboardingRequirementsResponse>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getFiskalyOnboardingRequirementsActions.isLoading(true));
    dispatch(getFiskalyOnboardingRequirementsActions.error(null));
    try {
      const response = await getFiskalyOnboardingRequirementsAPI();
      dispatch(getFiskalyOnboardingRequirementsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(getFiskalyOnboardingRequirementsActions.error(error));
      options?.onError?.();
    }
    dispatch(getFiskalyOnboardingRequirementsActions.isLoading(false));
  };
}

export const onboardFiskalyCompanyActions = {
  isLoading: createAction<boolean>('FISKALY_ONBOARDING/ONBOARD/IS_LOADING'),
  error: createAction<Error | null>('FISKALY_ONBOARDING/ONBOARD/ERROR'),
  success: createAction<{ agreement_url: string }>(
    'FISKALY_ONBOARDING/ONBOARD/SUCCESS',
  ),
};

export function onboardFiskalyCompany(
  options?: OptionCallback<{ agreement_url: string }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(onboardFiskalyCompanyActions.isLoading(true));
    dispatch(onboardFiskalyCompanyActions.error(null));
    try {
      const response = await onboardFiskalyCompanyAPI();
      dispatch(onboardFiskalyCompanyActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(onboardFiskalyCompanyActions.error(error));
      options?.onError?.();
    }
    dispatch(onboardFiskalyCompanyActions.isLoading(false));
  };
}

export const getLastGeneratedAgreementUrlActions = {
  isLoading: createAction<boolean>(
    'FISKALY_ONBOARDING/GET_LAST_GENERATED_AGREEMENT_URL/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FISKALY_ONBOARDING/GET_LAST_GENERATED_AGREEMENT_URL/ERROR',
  ),
  success: createAction<{ agreement_url: string }>(
    'FISKALY_ONBOARDING/GET_LAST_GENERATED_AGREEMENT_URL/SUCCESS',
  ),
};

export function getLastGeneratedAgreementUrl(
  options?: OptionCallback<{ agreement_url: string }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getLastGeneratedAgreementUrlActions.isLoading(true));
    dispatch(getLastGeneratedAgreementUrlActions.error(null));
    try {
      const response = await getLastGeneratedAgreementUrlAPI();
      dispatch(getLastGeneratedAgreementUrlActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(getLastGeneratedAgreementUrlActions.error(error));
      options?.onError?.(error);
    }
    dispatch(getLastGeneratedAgreementUrlActions.isLoading(false));
  };
}

export const getLastUploadedSignedAgreementActions = {
  isLoading: createAction<boolean>(
    'FISKALY_ONBOARDING/GET_LAST_UPLOADED_AGREEMENT/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FISKALY_ONBOARDING/GET_LAST_UPLOADED_AGREEMENT/ERROR',
  ),
  success: createAction<{ signed_agreement_url: string } | null>(
    'FISKALY_ONBOARDING/GET_LAST_UPLOADED_AGREEMENT/SUCCESS',
  ),
};

export function getLastUploadedSignedAgreement(
  options?: OptionCallback<{ signed_agreement_url: string } | null>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getLastUploadedSignedAgreementActions.isLoading(true));
    dispatch(getLastUploadedSignedAgreementActions.error(null));
    try {
      const response = await getLastUploadedSignedAgreementAPI();
      dispatch(getLastUploadedSignedAgreementActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(getLastUploadedSignedAgreementActions.error(error));
      options?.onError?.();
    }
    dispatch(getLastUploadedSignedAgreementActions.isLoading(false));
  };
}

export const uploadSignedAgreementActions = {
  isLoading: createAction<boolean>(
    'FISKALY_ONBOARDING/UPLOAD_SIGNED_AGREEMENT/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FISKALY_ONBOARDING/UPLOAD_SIGNED_AGREEMENT/ERROR',
  ),
  success: createAction<{ file: string }>(
    'FISKALY_ONBOARDING/UPLOAD_SIGNED_AGREEMENT/SUCCESS',
  ),
};

export function uploadSignedAgreement(
  file: File,
  options?: OptionCallback<{ file: string }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(uploadSignedAgreementActions.isLoading(true));
    dispatch(uploadSignedAgreementActions.error(null));
    try {
      const response = await uploadSignedAgreementAPI(file);
      dispatch(uploadSignedAgreementActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(uploadSignedAgreementActions.error(error));
      options?.onError?.();
    }
    dispatch(uploadSignedAgreementActions.isLoading(false));
  };
}

export const getSoftwareRegistrationUrlActions = {
  isLoading: createAction<boolean>(
    'FISKALY_ONBOARDING/GET_SOFTWARE_REGISTRATION_URL/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FISKALY_ONBOARDING/GET_SOFTWARE_REGISTRATION_URL/ERROR',
  ),
  success: createAction<{ software_registration_url: string | null }>(
    'FISKALY_ONBOARDING/GET_SOFTWARE_REGISTRATION_URL/SUCCESS',
  ),
};

export function getSoftwareRegistrationUrl(
  options?: OptionCallback<{ software_registration_url: string | null }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getSoftwareRegistrationUrlActions.isLoading(true));
    dispatch(getSoftwareRegistrationUrlActions.error(null));
    try {
      const response = await getSoftwareRegistrationUrlAPI();
      dispatch(getSoftwareRegistrationUrlActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(getSoftwareRegistrationUrlActions.error(error));
      options?.onError?.();
    }
    dispatch(getSoftwareRegistrationUrlActions.isLoading(false));
  };
}

export const fetchFiskalySignEsInvoiceActions = {
  isLoading: createAction<boolean>('FISKALY_SIGN_ES_INVOICE/FETCH/IS_LOADING'),
  error: createAction<Error | null>('FISKALY_SIGN_ES_INVOICE/FETCH/ERROR'),
  success: createAction<FiskalySignEsInvoiceDetails>(
    'FISKALY_SIGN_ES_INVOICE/FETCH/SUCCESS',
  ),
};

export function fetchFiskalySignEsInvoice(
  invoice_uuid: string,
  options?: OptionCallback<FiskalySignEsInvoiceDetails>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFiskalySignEsInvoiceActions.isLoading(true));
    dispatch(fetchFiskalySignEsInvoiceActions.error(null));
    try {
      const response = await fetchFiskalySignEsInvoiceAPI(invoice_uuid);
      dispatch(fetchFiskalySignEsInvoiceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(fetchFiskalySignEsInvoiceActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchFiskalySignEsInvoiceActions.isLoading(false));
  };
}

export const manuallySendInvoiceToSignEsActions = {
  isLoading: createAction<boolean>(
    'FISKALY_SIGN_ES_INVOICE/MANUALLY_SEND/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'FISKALY_SIGN_ES_INVOICE/MANUALLY_SEND/ERROR',
  ),
  success: createAction<FiskalySignEsInvoiceDetails>(
    'FISKALY_SIGN_ES_INVOICE/MANUALLY_SEND/SUCCESS',
  ),
};

export function manuallySendInvoiceToSignEs(
  invoice_uuid: string,
  options?: OptionCallback<FiskalySignEsInvoiceDetails>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(manuallySendInvoiceToSignEsActions.isLoading(true));
    dispatch(manuallySendInvoiceToSignEsActions.error(null));
    try {
      const response = await manuallySendInvoiceToSignEsAPI({
        invoice_pk: invoice_uuid,
      });
      dispatch(manuallySendInvoiceToSignEsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      dispatch(manuallySendInvoiceToSignEsActions.error(error));
      options?.onError?.();
    }
    dispatch(manuallySendInvoiceToSignEsActions.isLoading(false));
  };
}
