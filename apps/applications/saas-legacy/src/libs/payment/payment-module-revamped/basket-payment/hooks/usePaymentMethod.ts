import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';
import { useBasketPaymentActions } from './useBasketPaymentActions';
import {
  useBasketPaymentLocalState,
  type PaymentEngine,
} from './useBasketPaymentLocalState';
import { useBasketPaymentStoreData } from './useBasketPaymentStoreData';
import { usePayment } from './usePayment';
import {
  checkStripePaymentMethodDomainRegistration,
  checkStripeDomainActions,
} from '#src/libs/payment/actions';
import {
  getStripeDomainCheckLoading,
  getStripeDomainCheckIsRegistered,
} from '#src/libs/payment/selectors';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
} from '@bsport/common/lib/master-data/payment-group';

import type { OptionCallback } from '#src/state/types';

// Optional parameters for Stripe Express Checkout (Apple Pay / Google Pay) support
type UsePaymentMethodParams = {
  clientSecret?: string | null;
  paymentMethodAvailableBasket?: number[] | null;
};

type UsePaymentMethod = {
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  isDetachPaymentMethodLoading: boolean;
  updatePaymentEngine: (newPaymentEngine: PaymentEngine) => void;
  setAvailableExpressCheckoutMethods: (available: boolean | null) => void;
  showStripeExpressCheckout: boolean;
  isStripeDomainRegistrationLoading: boolean;
};

/**
 * Custom hook to manage payment method operations within OnlinePaymentBasket.
 * This hook is not meant to be used outside the scope of OnlinePaymentBasket.
 *
 * @param {string} basketId - The ID of the basket.
 * @param {number} companyId - The ID of the company.
 * @param {number} memberId - The ID of the member.
 * @param {UsePaymentMethodParams} params - Optional parameters for Stripe Express Checkout support.
 * @returns {UsePaymentMethod} An object containing various functions to handle payment method operations.
 */
export const usePaymentMethod = (
  basketId: string,
  companyId: number,
  memberId: number,
  { clientSecret, paymentMethodAvailableBasket }: UsePaymentMethodParams = {},
): UsePaymentMethod => {
  const dispatch = useDispatch();

  const isStripeDomainRegistered = useSelector(
    getStripeDomainCheckIsRegistered,
  );
  const isStripeDomainRegistrationLoading = useSelector(
    getStripeDomainCheckLoading,
  );

  const [availableExpressCheckoutMethods, setAvailableExpressCheckoutMethods] =
    useState<boolean | null>(null);

  const { isDetachPaymentMethodLoading } = useBasketPaymentStoreData(
    basketId,
    memberId,
  );

  const { selectedPaymentEngine, setSelectedPaymentEngine } =
    useBasketPaymentLocalState();

  const { handleDetachPaymentMethod } = useBasketPaymentActions(
    basketId,
    companyId,
    memberId,
  );

  const { getClientSecret } = usePayment(basketId, companyId, memberId);

  const { handleFetchMemberPaymentMethodList } =
    useMemberPaymentMethodListProvider(memberId);

  // Only check domain registration if express checkout params are provided
  // (this feature is only needed for Stripe Express Checkout with Apple Pay / Google Pay)
  const isExpressCheckoutEnabled = !!(
    clientSecret && paymentMethodAvailableBasket
  );

  useEffect(() => {
    if (!isExpressCheckoutEnabled || !companyId) return;

    // If not running inside a widget, assume Stripe domain is registered,
    // regular backoffice URLs are manually allowed and don't depend on the companyId.
    if (!WidgetUtils.isWidget()) {
      dispatch(checkStripeDomainActions.success({ is_registered: true }));
      return;
    }

    dispatch(checkStripePaymentMethodDomainRegistration(companyId));
  }, [companyId, dispatch, isExpressCheckoutEnabled]);

  /**
   * Detaches a payment method linked to a member.
   *
   * @param {string} paymentMethodId - The ID of the payment method to detach.
   * @param {OptionCallback} [options] - Optional callbacks for success and error handling.
   */
  const detachPaymentMethod = useCallback(
    (paymentMethodId: string, options?: OptionCallback) => {
      handleDetachPaymentMethod(paymentMethodId, {
        onSuccess: () => {
          handleFetchMemberPaymentMethodList();
          options?.onSuccess?.();
        },
        onError: options?.onError,
      });
    },
    [handleDetachPaymentMethod, handleFetchMemberPaymentMethodList],
  );

  const updatePaymentEngine = useCallback(
    (newPaymentEngine: PaymentEngine) => {
      if (newPaymentEngine !== selectedPaymentEngine) {
        getClientSecret(newPaymentEngine);
      }
      setSelectedPaymentEngine(newPaymentEngine);
    },
    [getClientSecret, setSelectedPaymentEngine, selectedPaymentEngine],
  );

  /* Show Stripe Express Checkout section if ALL the following are true:
   * 1. Express checkout is enabled (clientSecret and paymentMethodAvailableBasket are provided).
   * 2. The selected payment engine is Stripe.
   * 3. The clientSecret exists.
   * 4. If running inside a widget, the Stripe domain must be registered; otherwise, skip this check.
   * 5. At least one of Apple Pay or Google Pay is available in the basket's payment methods.
   * 6. Stripe Express Checkout element did not trigger onLoadError and at least one payment method is available (Apple Pay or Google Pay)
   */
  const showStripeExpressCheckout = useMemo(
    () =>
      Boolean(
        isExpressCheckoutEnabled &&
          selectedPaymentEngine === PAYMENT_ENGINE_STRIPE &&
          clientSecret &&
          isStripeDomainRegistered === true &&
          (paymentMethodAvailableBasket?.includes(
            PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
          ) ||
            paymentMethodAvailableBasket?.includes(
              PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
            )) &&
          availableExpressCheckoutMethods !== false,
      ),
    [
      availableExpressCheckoutMethods,
      clientSecret,
      isExpressCheckoutEnabled,
      isStripeDomainRegistered,
      paymentMethodAvailableBasket,
      selectedPaymentEngine,
    ],
  );

  return {
    detachPaymentMethod,
    isDetachPaymentMethodLoading,
    updatePaymentEngine,
    setAvailableExpressCheckoutMethods,
    showStripeExpressCheckout,
    isStripeDomainRegistrationLoading,
  };
};
