import { useCallback } from 'react';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';
import { useBasketPaymentActions } from './useBasketPaymentActions';
import {
  useBasketPaymentLocalState,
  type PaymentEngine,
} from './useBasketPaymentLocalState';
import { useBasketPaymentStoreData } from './useBasketPaymentStoreData';
import { usePayment } from './usePayment';

import type { OptionCallback } from '#src/state/types';
type UsePaymentMethod = {
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  isDetachPaymentMethodLoading: boolean;
  updatePaymentEngine: (newPaymentEngine: PaymentEngine) => void;
};

/**
 * Custom hook to manage payment method operations within OnlinePaymentBasket.
 * This hook is not meant to be used outside the scope of OnlinePaymentBasket.
 *
 * @param {string} basketId - The ID of the basket.
 * @param {number} companyId - The ID of the company.
 * @param {number} memberId - The ID of the member.
 * @returns {UsePaymentMethod} An object containing various functions to handle payment method operations.
 */
export const usePaymentMethod = (
  basketId: string,
  companyId: number,
  memberId: number,
): UsePaymentMethod => {
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
    useMemberPaymentMethodListProvider({ memberId });
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

  return {
    detachPaymentMethod,
    isDetachPaymentMethodLoading,
    updatePaymentEngine,
  };
};
