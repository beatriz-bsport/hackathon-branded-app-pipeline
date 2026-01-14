import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import type { RootState } from '#src/reducers';
import { OptionCallback } from '#src/state/types';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group.js';

import {
  applyBalanceToInvoice as applyBalanceToInvoiceAction,
  requestInvoiceClientSecret as requestInvoiceClientSecretAction,
  resetInvoiceClientSecret as resetInvoiceClientSecretAction,
  detachPaymentMethod as detachPaymentMethodAction,
  fetchPaymentGroupStatus as fetchPaymentGroupStatusAction,
  setPaymentStatus as setPaymentStatusActions,
} from '#src/libs/payment/payment-module-revamped/actions';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';
import { PayerContext } from '#src/libs/payment/payment-module-revamped/types';
import {
  getApplyBalance,
  getInvoiceClientSecret,
  getDetachPaymentMethod,
  getIsPaymentProcessing,
} from '#src/libs/payment/payment-module-revamped/selectors';
import { getUsableCreditAccountBalance } from '#src/libs/membership/selectors';
import { getMemberDetail } from '#src/libs/member/selectors';
import { fetchMembership as fetchMembershipAction } from '#src/libs/membership/actions';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
import { ConsumerInvoiceContext } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceContext';

type UseInvoicePaymentProviderProps = {
  payerContext: PayerContext;
  companyId: number;
  invoiceUuid: string;
  applyBalanceToInvoiceCallbacks?: OptionCallback;
};

type UseInvoicePaymentProvider = {
  creditAccount: {
    allowConsumerToUseInternalAccount: boolean;
    applyBalanceLoading: boolean;
    creditAccountBalance: number;
    handleApplyBalanceToInvoice: () => void;
  };
  companyPaymentSettings: {
    companyThemeLoading: boolean;
    cardBillingDetailsMandatory: boolean;
    handleFetchCompanyTheme: () => void;
  };
  payment: {
    isPaymentProcessing: boolean;
    clientSecret: string;
    isClientSecretLoading: boolean;
    paymentGroupId: number;
    paymentGroupPriceCts: number;
    handleFetchPaymentGroupStatus: ({
      paymentGroupId,
      options,
    }: {
      paymentGroupId: number;
      options: any;
    }) => void;
    handleSetPaymentProcessing: ({
      paymentGroupId,
      paymentProcessing,
    }: {
      paymentProcessing: boolean;
      paymentGroupId: number;
    }) => void;
    handleRequestClientSecretInvoice: () => void;
    handleResetInvoiceClientSecret: () => void;
  };
  paymentMethod: {
    paymentMethodChoices: number[];
    isDetachPaymentMethodLoading: boolean;
    handleDetachPaymentMethod: (pm_id: string, options?: any) => void;
  };
  member: {
    sepaDefaultEmail: string;
    sepaDefaultName: string;
    handleFetchMembership: () => void;
  };
};

/***
 * @description Generic provider for invoice payment
 *
 * @param payerContext Who pays, for who and in which role
 * @param companyId The company ID
 * @param invoiceUuid The invoice UUID
 * @param applyBalanceToInvoiceCallbacks Callbacks for applying balance to invoice
 * @returns UseInvoicePaymentProvider
 * ***/
export const useInvoicePaymentProvider = ({
  payerContext,
  companyId,
  invoiceUuid,
  applyBalanceToInvoiceCallbacks,
}: UseInvoicePaymentProviderProps): UseInvoicePaymentProvider => {
  const {
    handleWidgetFetchPaymentGroupStatus,
    handleWidgetSetPaymentStatus,
    detachPaymentMethod,
  } = useContext(ConsumerInvoiceContext) ?? {};
  const isWidget =
    WidgetUtils.getConsumerSpaceContext() === ConsumerSpaceContextEnum.WIDGET;
  const dispatch = useDispatch();
  const {
    allow_consumer_to_use_internal_account: allowConsumerToUseInternalAccount,
    force_billing_details_on_cards: cardBillingDetailsMandatory,
    payment_method_available_basket: paymentMethodAvailableBasket,
  } = useSelector((state: RootState) => themeSelectors.getTheme(state));
  const companyThemeLoading = useSelector(
    (state: RootState) => state.theme.loading,
  );

  const member = useSelector((state: RootState) =>
    getMemberDetail(state, payerContext.memberId),
  );
  const applyBalance = useSelector((state: RootState) =>
    getApplyBalance(state, invoiceUuid),
  );
  const invoiceClientSecretPayload = useSelector((state: RootState) =>
    getInvoiceClientSecret(state, invoiceUuid),
  );
  const creditAccountBalance = useSelector((state: RootState) =>
    getUsableCreditAccountBalance(state, companyId),
  );
  const isPaymentProcessing = useSelector((state: RootState) =>
    getIsPaymentProcessing(state, invoiceClientSecretPayload?.payment_group),
  );
  const detachPaymentMethodSelector = useSelector((state: RootState) =>
    getDetachPaymentMethod(state, payerContext.memberId),
  );

  /***
   * @description Payment methods available for payment as a member
   * Will have to be refactor for payment as a manager
   * @returns number[]
   * ***/
  const paymentMethodChoices = React.useMemo(
    () =>
      PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_STRIPE].filter(
        (paymentMethod) => {
          // Exclude TWINT from invoice payment methods
          if (paymentMethod === PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT) {
            return false;
          }

          if (paymentMethodAvailableBasket) {
            return paymentMethodAvailableBasket.length
              ? paymentMethodAvailableBasket.includes(paymentMethod)
              : paymentMethod === PAYMENT_GROUP_METHOD_IDENTIFIER_CB;
          }
          return true;
        },
      ),
    [paymentMethodAvailableBasket],
  );

  const handleApplyBalanceToInvoice = React.useCallback(() => {
    if (invoiceUuid) {
      dispatch(
        applyBalanceToInvoiceAction(
          invoiceUuid,
          applyBalanceToInvoiceCallbacks,
        ),
      );
    }
  }, [dispatch, invoiceUuid, applyBalanceToInvoiceCallbacks]);

  const handleFetchMembership = React.useCallback(() => {
    if (!isWidget && !!payerContext.memberId) {
      dispatch(fetchMembershipAction(payerContext.memberId));
    }
  }, [dispatch, isWidget, payerContext.memberId]);

  /***
   * @description Request client secret for invoice
   * First step of the payment lifecycle the creation of a payment intent (Stripe)
   * Will be called at the very beginning of the payment process, when the invoice is ready to be paid
   * Backend will create a PaymentGroup object linked to the invoice
   * @returns void
   * ***/
  const handleRequestClientSecretInvoice = React.useCallback(() => {
    if (invoiceUuid) {
      dispatch(
        requestInvoiceClientSecretAction({
          uuid: invoiceUuid,
          payment_engine_identifier: PAYMENT_ENGINE_STRIPE,
        }),
      );
    }
  }, [dispatch, invoiceUuid]);

  const handleResetInvoiceClientSecret = React.useCallback(() => {
    if (invoiceUuid) {
      dispatch(
        resetInvoiceClientSecretAction({
          invoiceUuid,
        }),
      );
    }
  }, [dispatch, invoiceUuid]);

  const { handleFetchMemberPaymentMethodList } =
    useMemberPaymentMethodListProvider({
      memberId: payerContext.memberId,
    });

  const handleDetachPaymentMethod = React.useCallback(
    (pm_id: string, options?: any) => {
      if (payerContext.memberId) {
        if (isWidget && !!detachPaymentMethod) {
          return detachPaymentMethod?.(pm_id, {
            onSuccess: () => {
              handleFetchMemberPaymentMethodList({
                onSuccess: options?.onSuccess,
              });
            },
            onError: options?.onError,
          });
        }
        dispatch(
          detachPaymentMethodAction(
            {
              member: payerContext.memberId,
              payment_method_id: pm_id,
              company: companyId,
            },
            {
              onSuccess: () => {
                handleFetchMemberPaymentMethodList({
                  onSuccess: options?.onSuccess,
                });
              },
              onError: options?.onError,
            },
          ),
        );
      }
    },
    [
      payerContext.memberId,
      isWidget,
      dispatch,
      companyId,
      detachPaymentMethod,
      handleFetchMemberPaymentMethodList,
    ],
  );

  const handleFetchCompanyTheme = React.useCallback(() => {
    if (companyId) dispatch(fetchCompanyTheme(companyId));
  }, [dispatch, companyId]);

  const handleFetchPaymentGroupStatus = React.useCallback(
    ({ paymentGroupId, options }) => {
      if (paymentGroupId) {
        if (isWidget) {
          return handleWidgetFetchPaymentGroupStatus(paymentGroupId, {
            onSuccess: (response) => {
              options?.onSuccess?.(response);
              if (response >= PAYMENT_INTENT_STATUS_SUCCESS) {
                handleWidgetSetPaymentStatus({
                  paymentGroupId,
                  paymentProcessing: false,
                  paymentSucceeded: true,
                });
              }
            },
            onError: options?.onError,
          });
        }
        dispatch(
          fetchPaymentGroupStatusAction(paymentGroupId, {
            onSuccess: (response) => {
              options?.onSuccess?.(response);
              if (response >= PAYMENT_INTENT_STATUS_SUCCESS) {
                dispatch(
                  setPaymentStatusActions({
                    paymentGroupId,
                    paymentProcessing: false,
                    paymentSucceeded: true,
                  }),
                );
              }
            },
            onError: options?.onError,
          }),
        );
      }
    },
    [
      dispatch,
      handleWidgetFetchPaymentGroupStatus,
      handleWidgetSetPaymentStatus,
      isWidget,
    ],
  );

  const handleSetPaymentProcessing = React.useCallback(
    ({
      paymentGroupId,
      paymentProcessing,
    }: {
      paymentProcessing: boolean;
      paymentGroupId: number;
    }) => {
      if (isWidget) {
        return handleWidgetSetPaymentStatus({
          paymentGroupId,
          paymentProcessing,
        });
      }
      dispatch(
        setPaymentStatusActions({
          paymentGroupId,
          paymentProcessing,
        }),
      );
    },
    [dispatch, handleWidgetSetPaymentStatus, isWidget],
  );

  return {
    creditAccount: {
      allowConsumerToUseInternalAccount,
      applyBalanceLoading: applyBalance?.loading,
      creditAccountBalance,
      handleApplyBalanceToInvoice,
    },

    companyPaymentSettings: {
      companyThemeLoading,
      cardBillingDetailsMandatory,
      handleFetchCompanyTheme,
    },

    payment: {
      isPaymentProcessing,
      clientSecret: invoiceClientSecretPayload?.client_secret,
      isClientSecretLoading: invoiceClientSecretPayload?.loading,
      paymentGroupId: invoiceClientSecretPayload?.payment_group,
      paymentGroupPriceCts: invoiceClientSecretPayload?.price_cts,
      handleFetchPaymentGroupStatus,
      handleSetPaymentProcessing,
      handleRequestClientSecretInvoice,
      handleResetInvoiceClientSecret,
    },

    paymentMethod: {
      paymentMethodChoices,
      isDetachPaymentMethodLoading: detachPaymentMethodSelector?.loading,
      handleDetachPaymentMethod,
    },

    member: {
      sepaDefaultEmail: member?.email ?? '',
      sepaDefaultName: member?.name ?? '',
      handleFetchMembership,
    },
  };
};
