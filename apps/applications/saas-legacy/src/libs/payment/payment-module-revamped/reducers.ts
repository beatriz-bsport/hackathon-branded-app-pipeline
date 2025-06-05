import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import { RequestClientSecretPayload } from '#src/libs/invoice/types';
import {
  applyBalanceToInvoiceActions,
  detachPaymentMethodActions,
  listSavedPaymentMethodListActions,
  requestBasketClientSecretActions,
  requestInvoiceClientSecretActions,
  setBackendProcessingAfterPaymentActions,
  setPaymentStatusActions,
  updateIntentToSavePaymentMethodActions,
} from './actions';
import { ErrorAndLoading } from '#src/libs/types';
import { PaymentMethod } from '#src/libs/payment/types';

export type PaymentModuleState = {
  applyBalanceToInvoice: {
    [invoiceUuid: string]: { balance: string } & ErrorAndLoading;
  };
  invoiceClientSecret: {
    [invoiceUuid: string]: RequestClientSecretPayload & ErrorAndLoading;
  };
  basketClientSecret: {
    [basketId: string]: RequestClientSecretPayload & ErrorAndLoading;
  };

  paymentMethodList: {
    [memberId: number]: {
      paymentMethods: Array<PaymentMethod>;
    } & { hasFetchSucceeded: boolean } & ErrorAndLoading;
  };
  paymentGroupStatus: {
    [paymentGroupId: number]: { succeeded: boolean; processing: boolean };
  };
  backendStatusAfterPayment: {
    [paymentGroupId: number]: { processing: boolean };
  };
  detachPaymentMethod: {
    [memberId: number]: {
      alternativePaymentMethod: string | null;
    } & ErrorAndLoading;
  };
  updateIntentStatus: {
    [paymentGroupId: number]: ErrorAndLoading;
  };
};

const initialState: Immutable.Immutable<PaymentModuleState> =
  Immutable<PaymentModuleState>({
    applyBalanceToInvoice: {},
    invoiceClientSecret: {},
    basketClientSecret: {},
    paymentMethodList: {},
    paymentGroupStatus: {},
    backendStatusAfterPayment: {},
    detachPaymentMethod: {},
    updateIntentStatus: {},
  });

export default handleActions<Immutable.Immutable<PaymentModuleState>, any>(
  {
    [applyBalanceToInvoiceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string; loading: string } },
    ) => {
      return state.setIn(
        ['applyBalanceToInvoice', payload.invoiceUuid, 'loading'],
        payload.loading,
      );
    },
    [applyBalanceToInvoiceActions.error.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string; error: Error | null } },
    ) => {
      return state.setIn(
        ['applyBalanceToInvoice', payload.invoiceUuid, 'error'],
        payload.error,
      );
    },
    [applyBalanceToInvoiceActions.success.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string; balance: string } },
    ) => {
      return state.setIn(
        ['applyBalanceToInvoice', payload.invoiceUuid, 'balance'],
        payload.balance,
      );
    },
    [applyBalanceToInvoiceActions.initialize.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string } },
    ) => {
      return state.setIn(['applyBalanceToInvoice', payload.invoiceUuid], {
        loading: false,
        balance: null,
        error: null,
      });
    },

    [requestInvoiceClientSecretActions.isLoading.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string; loading: string } },
    ) => {
      return state.setIn(
        ['invoiceClientSecret', payload.invoiceUuid, 'loading'],
        payload.loading,
      );
    },
    [requestInvoiceClientSecretActions.error.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string; error: Error | null } },
    ) => {
      return state.setIn(
        ['invoiceClientSecret', payload.invoiceUuid, 'error'],
        payload.error,
      );
    },
    [requestInvoiceClientSecretActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: RequestClientSecretPayload & { invoiceUuid: string } },
    ) => {
      const { invoiceUuid, ...requestClientSecretPayload } = payload;
      return state.updateIn(
        ['invoiceClientSecret', invoiceUuid],
        (currentValue) => ({
          ...currentValue,
          ...requestClientSecretPayload,
        }),
      );
    },
    [requestInvoiceClientSecretActions.initialize.toString()]: (
      state,
      { payload }: { payload: { invoiceUuid: string } },
    ) => {
      return state.setIn(['invoiceClientSecret', payload.invoiceUuid], {
        loading: false,
        client_secret: null,
        price_cts: null,
        payment_group: null,
        error: null,
      });
    },
    [requestBasketClientSecretActions.initialize.toString()]: (
      state,
      { payload }: { payload: { basketId: string } },
    ) => {
      return state.setIn(['basketClientSecret', payload.basketId], {
        loading: false,
        client_secret: null,
        price_cts: null,
        payment_group: null,
        error: null,
      });
    },
    [requestBasketClientSecretActions.isLoading.toString()]: (
      state,
      { payload }: { payload: { basketId: string; loading: boolean } },
    ) => {
      return state.setIn(
        ['basketClientSecret', payload.basketId, 'loading'],
        payload.loading,
      );
    },
    [requestBasketClientSecretActions.error.toString()]: (
      state,
      { payload }: { payload: { basketId: string; error: Error | null } },
    ) => {
      return state.setIn(
        ['basketClientSecret', payload.basketId, 'error'],
        payload.error,
      );
    },
    [requestBasketClientSecretActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: RequestClientSecretPayload & { basketId: string } },
    ) => {
      const { basketId, ...requestClientSecretPayload } = payload;
      return state.updateIn(
        ['basketClientSecret', basketId],
        (currentValue) => ({
          ...currentValue,
          ...requestClientSecretPayload,
        }),
      );
    },

    [listSavedPaymentMethodListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: { memberId: string; loading: boolean } },
    ) => {
      return state.setIn(
        ['paymentMethodList', payload.memberId, 'loading'],
        payload.loading,
      );
    },
    [listSavedPaymentMethodListActions.error.toString()]: (
      state,
      { payload }: { payload: { memberId: string; error: Error | null } },
    ) => {
      return state.setIn(
        ['paymentMethodList', payload.memberId, 'error'],
        payload.error,
      );
    },
    [listSavedPaymentMethodListActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: { paymentMethodList: Array<PaymentMethod> } & {
          memberId: string;
        };
      },
    ) => {
      return state
        .setIn(
          ['paymentMethodList', payload.memberId, 'paymentMethods'],
          payload.paymentMethodList,
        )
        .setIn(
          ['paymentMethodList', payload.memberId, 'hasFetchSucceeded'],
          true,
        );
    },
    [listSavedPaymentMethodListActions.initialize.toString()]: (
      state,
      { payload }: { payload: { memberId: string } },
    ) => {
      return state.setIn(['paymentMethodList', payload.memberId], {
        loading: false,
        invoice: null,
        error: null,
      });
    },
    [detachPaymentMethodActions.isLoading.toString()]: (
      state,
      { payload }: { payload: { memberId: string; loading: boolean } },
    ) => {
      return state.setIn(
        ['detachPaymentMethod', payload.memberId, 'loading'],
        payload.loading,
      );
    },
    [detachPaymentMethodActions.error.toString()]: (
      state,
      { payload }: { payload: { memberId: string; error: Error | null } },
    ) => {
      return state.setIn(
        ['detachPaymentMethod', payload.memberId, 'error'],
        payload.error,
      );
    },
    [detachPaymentMethodActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: { payment_backend_payment_method_id: string | null } & {
          memberId: string;
        };
      },
    ) => {
      return state.setIn(
        ['detachPaymentMethod', payload.memberId, 'alternativePaymentMethod'],
        payload.payment_backend_payment_method_id,
      );
    },
    [setPaymentStatusActions.set.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          paymentGroupId: string;
          paymentSucceeded?: boolean;
          paymentProcessing?: boolean;
        };
      },
    ) => {
      return state.updateIn(
        ['paymentGroupStatus', payload.paymentGroupId],
        (currentValue = { processing: false, succeeded: false }) => {
          return {
            ...currentValue,
            processing:
              payload.paymentProcessing !== undefined
                ? payload.paymentProcessing
                : currentValue.processing,
            succeeded:
              payload.paymentSucceeded !== undefined
                ? payload.paymentSucceeded
                : currentValue.succeeded,
          };
        },
      );
    },
    [setBackendProcessingAfterPaymentActions.set.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          paymentGroupId: string;
          processing: boolean;
        };
      },
    ) => {
      return state.setIn(
        ['backendStatusAfterPayment', payload.paymentGroupId, 'processing'],
        payload.processing,
      );
    },
    [updateIntentToSavePaymentMethodActions.isLoading.toString()]: (
      state,
      { payload }: { payload: { paymentGroupId: number; loading: boolean } },
    ) => {
      return state.setIn(
        ['updateIntentStatus', payload.paymentGroupId, 'loading'],
        payload.loading,
      );
    },
    [updateIntentToSavePaymentMethodActions.error.toString()]: (
      state,
      { payload }: { payload: { paymentGroupId: number; error: Error | null } },
    ) => {
      return state.setIn(
        ['updateIntentStatus', payload.paymentGroupId, 'error'],
        payload.error,
      );
    },
    [updateIntentToSavePaymentMethodActions.success.toString()]: (
      state,
      { payload }: { payload: { paymentGroupId: number } }, // Only need paymentGroupId here
    ) => {
      // Clear error on success
      return state.setIn(
        ['updateIntentStatus', payload.paymentGroupId, 'error'],
        null,
      );
    },
    [updateIntentToSavePaymentMethodActions.initialize.toString()]: (
      state,
      { payload }: { payload: { paymentGroupId: number } },
    ) => {
      return state.setIn(['updateIntentStatus', payload.paymentGroupId], {
        loading: false,
        error: null,
      });
    },
  },
  initialState,
);
