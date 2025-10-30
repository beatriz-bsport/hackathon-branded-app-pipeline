import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Stripe, StripeElements, StripeError } from '@stripe/stripe-js';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT,
} from '@bsport/common/lib/master-data/payment-group.js';

import { verifyPriceBasket as verifyPriceBasketAPI } from '#src/libs/payment/api';
import { confirmStripePayment as confirmStripePaymentAction } from '#src/libs/payment/payment-module-revamped/actions';
import type { BillingDetails } from '#src/libs/marketplace/types';
import { AxiosResponse } from 'axios';
import {
  StripePaymentMethodNames,
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
} from '#src/libs/payment/constants';
import { saveQueryParamInLocalStorage } from '#src/libs/utils';

// SEPA requires null values, not empty strings, to prevent Stripe validation errors
const SEPA_BILLING_DETAILS = {
  name: null,
  email: null,
  phone: null,
  address: {
    country: null,
    postal_code: null,
    state: null,
    city: null,
    line1: null,
    line2: null,
  },
} as any;

// Map payment group identifiers to Stripe payment method names
const getPaymentMethodType = (
  paymentGroupMethodIdentifier: number,
): string | undefined => {
  switch (paymentGroupMethodIdentifier) {
    case PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT:
      return StripePaymentMethodNames.BANCONTACT;
    case PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL:
      return StripePaymentMethodNames.IDEAL;
    case PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT:
      return StripePaymentMethodNames.TWINT;
    default:
      return undefined;
  }
};

type CardPaymentData = {
  payment_group_method_identifier: number;
  billingDetails: BillingDetails;
  cardBillingDetailsMandatory: boolean;
  shouldConfirmCardPayment: boolean;
  areInitialBillingDetailsNecessary: boolean;
  paymentMethodSelected?: string;
  updatePaymentMethodBillingDetailsAPI?: (data: {
    member?: number;
    payment_method_id: string;
    billing_details: BillingDetails;
    company: number;
  }) => Promise<AxiosResponse>;
  memberId?: number;
  companyId?: number;
};

type SepaPaymentData = {
  payment_group_method_identifier: number;
  shouldConfirmSepaPayment: boolean;
  paymentMethodSelected?: string;
};

type GenericPaymentData = {
  payment_group_method_identifier: number;
  return_url: string;
};

type PaymentMethodData = CardPaymentData | SepaPaymentData | GenericPaymentData;

type UsePaymentSubmitParams = {
  basketId?: string;
  basketTotalPriceCts?: number;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  clientSecret: string;
  createPendingBookingsAndBlockBasket?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  elements: StripeElements | null;
  forceSave?: boolean;
  instalmentPaymentSelectedId?: number | null;
  handleAssignInstalmentPayment?: (
    instalmentPayment: number | null,
    options?: any,
  ) => void;
  invalidatePendingBookingsAndUnblockBasket?: () => void;
  onError?: () => void;
  onSuccess?: (callback: () => void) => void;
  paymentGroupId: number;
  saveForLater?: boolean;
  setPaymentPageProcessing: (process: boolean) => void;
  setError: (error?: StripeError) => void;
  stripe: Stripe | null;
  // Payment method specific data
  paymentMethodData: PaymentMethodData;
  paymentMethodSelected?: string;
};

const isCardPayment = (data: PaymentMethodData): data is CardPaymentData => {
  return 'billingDetails' in data;
};

const isSepaPayment = (data: PaymentMethodData): data is SepaPaymentData => {
  return 'shouldConfirmSepaPayment' in data;
};

const isGenericPayment = (
  data: PaymentMethodData,
): data is GenericPaymentData => {
  return 'return_url' in data;
};

export const usePaymentSubmit = ({
  basketId,
  basketTotalPriceCts,
  checkItemsBasket,
  clientSecret,
  createPendingBookingsAndBlockBasket,
  elements,
  forceSave,
  instalmentPaymentSelectedId,
  handleAssignInstalmentPayment,
  invalidatePendingBookingsAndUnblockBasket,
  onError,
  onSuccess,
  paymentGroupId,
  saveForLater,
  setPaymentPageProcessing,
  setError,
  stripe,
  paymentMethodData,
  paymentMethodSelected,
}: UsePaymentSubmitParams) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['invoice', 'payment']);

  const validateBasket = useCallback(async () => {
    if (!basketId) return true;

    const { data } = await verifyPriceBasketAPI(basketId);
    const basketItemsChecked = await checkItemsBasket(basketId);

    if (!basketItemsChecked) {
      setPaymentPageProcessing(false);
      return false;
    }

    if (
      (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
      basketTotalPriceCts !== data
    ) {
      setPaymentPageProcessing(false);
      window.alert(t('paymentPanel.actions.basketInconsistent'));
      window.location.reload();
      return false;
    }

    return true;
  }, [
    basketId,
    basketTotalPriceCts,
    checkItemsBasket,
    setPaymentPageProcessing,
    t,
  ]);

  const processPayment = useCallback(async () => {
    if (!stripe || !elements) {
      return;
    }

    const isBasketValid = await validateBasket();
    if (!isBasketValid) return;

    try {
      createPendingBookingsAndBlockBasket?.({
        payment_group_method_identifier:
          paymentMethodData.payment_group_method_identifier,
      });

      // Handle card-specific billing details update
      if (isCardPayment(paymentMethodData)) {
        if (
          paymentMethodData.updatePaymentMethodBillingDetailsAPI &&
          !paymentMethodData.areInitialBillingDetailsNecessary &&
          paymentMethodData.paymentMethodSelected &&
          paymentMethodData.memberId
        ) {
          try {
            await paymentMethodData.updatePaymentMethodBillingDetailsAPI({
              member: paymentMethodData.memberId,
              payment_method_id: paymentMethodData.paymentMethodSelected,
              billing_details: paymentMethodData.billingDetails,
              company: paymentMethodData.companyId || 0,
            });
          } catch (err) {
            console.error(
              'Failed to update payment method billing details:',
              err,
            );
          }
        }
      }

      // Handle URL parameters for different payment types
      if (isCardPayment(paymentMethodData)) {
        // Card payment
        const url = new URL(window.location.toString());
        const params = url.searchParams;
        params.delete('user_registration_response');
        params.set('check_payment_intent', 'true');
        params.set('get_user_registration_from_storage', 'true');

        if (basketId) {
          params.set('basket_redirection', basketId);
        }
      } else if (isGenericPayment(paymentMethodData)) {
        // Generic payment methods (Bancontact, iDEAL, Twint)
        saveQueryParamInLocalStorage(
          USER_REGISTRATION_RESPONSE_QUERY_PARAM,
          USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
        );

        const url = new URL(window.location.toString());
        const paymentMethodType = getPaymentMethodType(
          paymentMethodData.payment_group_method_identifier,
        );

        const params = url.searchParams;
        params.delete('redirect_status');
        params.delete('user_registration_response');
        params.set('check_payment_intent', 'true');
        params.set('get_user_registration_from_storage', 'true');
        if (paymentMethodType) {
          params.set('payment_method_type', paymentMethodType);
        }

        if (basketId) {
          params.set('basket_redirection', basketId);
        }

        // Update the return_url with the modified URL
        paymentMethodData.return_url = url.toString();
      }

      const paymentParams = {
        saveForLater: saveForLater || forceSave,
        paymentGroupId,
        stripe,
        elements,
        clientSecret,
        shouldConfirmSepaDebitPayment: isSepaPayment(paymentMethodData)
          ? paymentMethodData.shouldConfirmSepaPayment
          : false,
        shouldConfirmCardPayment: isCardPayment(paymentMethodData)
          ? paymentMethodData.shouldConfirmCardPayment
          : false,
        paymentMethodSelected,
        billingDetails: isCardPayment(paymentMethodData)
          ? paymentMethodData.billingDetails
          : undefined,
        cardBillingDetailsMandatory: isCardPayment(paymentMethodData)
          ? paymentMethodData.cardBillingDetailsMandatory
          : false,
        return_url: isGenericPayment(paymentMethodData)
          ? paymentMethodData.return_url
          : undefined,
        paymentMethodData: (() => {
          if (
            isCardPayment(paymentMethodData) &&
            paymentMethodData.billingDetails
          ) {
            return { billing_details: paymentMethodData.billingDetails };
          }
          if (isSepaPayment(paymentMethodData)) {
            return { billing_details: SEPA_BILLING_DETAILS };
          }
          return undefined;
        })(),
      };

      dispatch(
        confirmStripePaymentAction(paymentParams, {
          onPaymentError: (err) => {
            setError(err);
            setPaymentPageProcessing(false);
            invalidatePendingBookingsAndUnblockBasket?.();
            onError?.();
          },
          onPaymentSuccess: async (paymentIntent) => {
            // Payment success handling varies by payment type:
            // - SEPA: Always call onSuccess (payment is still pending)
            // - Card: Only call onSuccess if payment succeeded
            // - Generic: Don't call onSuccess (they handle redirects via return_url)
            if (onSuccess) {
              if (isSepaPayment(paymentMethodData)) {
                onSuccess(() => setPaymentPageProcessing(false));
              } else if (
                isCardPayment(paymentMethodData) &&
                paymentIntent.status === 'succeeded'
              ) {
                onSuccess(() => setPaymentPageProcessing(false));
              }
            }
          },
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }, [
    basketId,
    clientSecret,
    createPendingBookingsAndBlockBasket,
    dispatch,
    elements,
    forceSave,
    invalidatePendingBookingsAndUnblockBasket,
    onError,
    onSuccess,
    paymentGroupId,
    paymentMethodData,
    paymentMethodSelected,
    saveForLater,
    setError,
    setPaymentPageProcessing,
    stripe,
    validateBasket,
  ]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      setPaymentPageProcessing(true);
      setError(undefined);
      event.preventDefault();

      // Assign instalment payment before proceeding
      if (
        instalmentPaymentSelectedId !== undefined &&
        handleAssignInstalmentPayment
      ) {
        handleAssignInstalmentPayment(instalmentPaymentSelectedId, {
          onSuccess: () => {
            elements?.submit();
            processPayment();
          },
        });
      } else {
        elements?.submit();
        processPayment();
      }
    },
    [
      setPaymentPageProcessing,
      setError,
      instalmentPaymentSelectedId,
      handleAssignInstalmentPayment,
      elements,
      processPayment,
    ],
  );

  return { handleSubmit };
};
