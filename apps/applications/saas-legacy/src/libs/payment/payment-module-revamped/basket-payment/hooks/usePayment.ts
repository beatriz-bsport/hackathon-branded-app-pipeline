import {
  createPendingBookingsAndBlockBasket as createPendingBookingsAndBlockBasketAPI,
  invalidatePendingBookingsAndUnblockBasket as invalidatePendingBookingsAndUnblockBasketAPI,
} from '#src/libs/payment/payment-module-revamped/api';

import { useBasketPaymentStoreData } from './useBasketPaymentStoreData';

import type { Basket } from '#src/libs/checkout/types';
import type {
  InstalmentPaymentApi,
  InstalmentPaymentApiWithBasketId,
} from '#src/libs/instalment-payment-configuration/types';
import type { OptionCallback } from '#src/state/types';
import { useCallback } from 'react';
import {
  useBasketPaymentLocalState,
  type PaymentEngine,
} from './useBasketPaymentLocalState';
import { shouldNotRetrieveSecret } from '#src/libs/checkout/utils';
import { useBasketPaymentActions } from './useBasketPaymentActions';
import { useParams } from 'react-router';
import { useBasket } from './useBasket';
import { Member } from '#src/libs/member/types';
import { useDispatch } from 'react-redux';
import { updateDefaultEstablishmentBillingGroup } from '#src/libs/member/actions';

type UsePayment = {
  clientSecret: string;
  createPendingBookingsAndBlockBasket: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  invalidatePendingBookingsAndUnblockBasket: () => void;
  getClientSecret: (paymentEngine: PaymentEngine) => void;
  instalmentPaymentConfigurations: InstalmentPaymentApiWithBasketId[];
  instalmentPaymentSelectedId: number | undefined;
  isClientSecretLoading: boolean;
  handleFetchInstalmentPaymentByBasket: (
    options?: OptionCallback<InstalmentPaymentApi>,
  ) => void;
  handleFetchPaymentGroupStatus: ({
    paymentGroupId,
    options,
  }: {
    paymentGroupId: number;
    options?: OptionCallback<number>;
  }) => void;
  handleResetBasketClientSecret: () => void;
  handleSetPaymentProcessing: (isPaymentProcessing: boolean) => void;
  handleUpdateMemberBillingGroup: (
    defaultEstablishmentBillingGroupId: number,
    options?: OptionCallback<Member>,
  ) => void;
  paymentGroupId: number;
  paymentGroupPriceCts: number;
  selectInstalmentPayment: (
    instalmentPayment: number | null,
    options?: OptionCallback<Basket>,
  ) => void;
  useInternalAccount: (amount: number, options?: OptionCallback) => void;
};

/**
 * Custom hook to manage payment operations within OnlinePaymentBasket.
 * This hook is not meant to be used outside the scope of OnlinePaymentBasket.
 *
 * @param {string} basketId - The ID of the basket.
 * @param {number} companyId - The ID of the company.
 * @param {number} memberId - The ID of the member.
 * @returns {UsePayment} An object containing various functions to handle payment operations.
 */
export const usePayment = (
  basketId: string,
  companyId: number,
  memberId: number,
): UsePayment => {
  const dispatch = useDispatch();

  const { check_payment_intent, redirect_status } = useParams<{
    check_payment_intent?: 'true' | 'false';
    redirect_status?: 'succeeded' | 'pending' | 'failed';
  }>();

  const {
    instalmentPaymentConfigurations,
    instalmentPaymentSelectedId,
    clientSecret,
    paymentGroupId,
    paymentGroupPriceCts,
    isClientSecretLoading,
  } = useBasketPaymentStoreData(basketId, memberId);

  const {
    handleFetchInstalmentPaymentByBasket,
    handleFetchPaymentGroupStatus,
    handleAssignInstalmentPayment,
    handleCreateOrRefreshInternalAccountPrepaidLine,
    handleResetBasketClientSecret,
    handleRequestBasketClientSecret,
    handleSetPaymentStatus,
  } = useBasketPaymentActions(basketId, companyId, memberId);

  const { refreshBasket } = useBasket(basketId, companyId, memberId);

  const { selectedPaymentEngine, selectedEstablishmentBillingGroup } =
    useBasketPaymentLocalState();

  /**
   * Creates pending bookings and blocks the basket based on the basket data.
   *
   * @param {Object} data - Data containing payment group method identifier.
   * @param {number} [data.payment_group_method_identifier] - The payment group method identifier.
   */
  const createPendingBookingsAndBlockBasket = useCallback(
    (data?: { payment_group_method_identifier?: number }) => {
      if (!basketId || !data) return;

      createPendingBookingsAndBlockBasketAPI({ basketId, data }).catch(
        (error) => console.error(error),
      );
    },
    [basketId],
  );

  /**
   * Invalidates pending bookings and unblocks the basket based on the basket data.
   */
  const invalidatePendingBookingsAndUnblockBasket = useCallback(() => {
    if (!basketId) return;

    invalidatePendingBookingsAndUnblockBasketAPI({ basketId }).catch((error) =>
      console.error(error),
    );
  }, [basketId]);

  const getClientSecret = useCallback(
    (paymentEngine: PaymentEngine) => {
      const hasPaymentEngineChanged = paymentEngine !== selectedPaymentEngine;
      if (shouldNotRetrieveSecret({ check_payment_intent, redirect_status })) {
        return;
      }
      handleRequestBasketClientSecret(paymentEngine, {
        onSuccess: () => {
          if (hasPaymentEngineChanged) refreshBasket();
        },
        onError: (error) => {
          console.error(error);
        },
      });
    },
    [
      check_payment_intent,
      handleRequestBasketClientSecret,
      redirect_status,
      selectedPaymentEngine,
      refreshBasket,
    ],
  );

  const handleUpdateMemberBillingGroup = useCallback(
    (
      defaultEstablishmentBillingGroupId: number,
      options?: OptionCallback<Member>,
    ) => {
      if (memberId)
        dispatch(
          updateDefaultEstablishmentBillingGroup(
            memberId,
            {
              default_establishment_billing_group:
                defaultEstablishmentBillingGroupId,
            },
            options,
          ),
        );
    },
    [dispatch, memberId],
  );

  /**
   * Sets the payment processing state.
   *
   * @param {boolean} isPaymentProcessing - The payment processing state to set.
   */
  const handleSetPaymentProcessing = useCallback(
    (isPaymentProcessing: boolean) => {
      selectedEstablishmentBillingGroup &&
        handleUpdateMemberBillingGroup(selectedEstablishmentBillingGroup.id);

      handleSetPaymentStatus({
        paymentGroupId,
        isPaymentProcessing,
      });
    },
    [
      handleUpdateMemberBillingGroup,
      selectedEstablishmentBillingGroup,
      paymentGroupId,
      handleSetPaymentStatus,
    ],
  );

  /**
   * Selects an instalment payment method for the basket.
   *
   * @param {number|null} instalmentPayment - The instalment payment method to select.
   * @param {OptionCallback<Basket>} [options] - Optional callbacks for success and error handling.
   */
  const selectInstalmentPayment = useCallback(
    (instalmentPayment: number | null, options?: OptionCallback<Basket>) => {
      if (basketId) {
        handleAssignInstalmentPayment(instalmentPayment, {
          onSuccess: () => {
            refreshBasket();
            options?.onSuccess?.();
          },
          onError: options?.onError,
        });
      }
    },
    [basketId, handleAssignInstalmentPayment, refreshBasket],
  );

  /**
   * Uses an internal account for payment.
   *
   * @param {number} amount - The amount to use from the internal account.
   * @param {OptionCallback} options - Callbacks for success and error handling.
   */
  const useInternalAccount = useCallback(
    (amount: number, options?: OptionCallback) => {
      handleCreateOrRefreshInternalAccountPrepaidLine(amount, {
        onSuccess: () => {
          options?.onSuccess?.();
          refreshBasket();
        },
        onError: options?.onError,
      });
    },
    [handleCreateOrRefreshInternalAccountPrepaidLine, refreshBasket],
  );

  return {
    clientSecret,
    createPendingBookingsAndBlockBasket,
    invalidatePendingBookingsAndUnblockBasket,
    getClientSecret,
    instalmentPaymentConfigurations,
    instalmentPaymentSelectedId,
    isClientSecretLoading,
    handleFetchInstalmentPaymentByBasket,
    handleFetchPaymentGroupStatus,
    handleResetBasketClientSecret,
    handleSetPaymentProcessing,
    handleUpdateMemberBillingGroup,
    paymentGroupId,
    paymentGroupPriceCts,
    selectInstalmentPayment,
    useInternalAccount,
  };
};
