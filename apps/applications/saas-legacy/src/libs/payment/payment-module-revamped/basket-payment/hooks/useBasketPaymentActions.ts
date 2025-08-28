import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

// ACTIONS
import {
  assignInstalmentPayment,
  createOrRefreshInternalAccountPrepaidLine,
  fetchBasket,
  fetchCurrentBasket,
} from '#src/libs/checkout/actions';
import {
  detachPaymentMethod,
  requestBasketClientSecret,
  resetBasketClientSecret,
  setPaymentStatus,
  fetchPaymentGroupStatus,
} from '#src/libs/payment/payment-module-revamped/actions';
import { fetchInstalmentPaymentByBasket } from '#src/libs/instalment-payment-configuration/actions';

// TYPES
import type { OptionCallback } from '#src/state/types';
import type { Basket } from '#src/libs/checkout/types';
import type { RequestClientSecretPayload } from '#src/libs/invoice/types';
import type { InstalmentPaymentApi } from '#src/libs/instalment-payment-configuration/types';
import { PAYMENT_INTENT_STATUS_SUCCESS } from '@bsport/common/lib/master-data/payment-group';

type UseBasketPaymentActionsData = {
  handleAssignInstalmentPayment: (
    instalmentPayment: number | null,
    options?: OptionCallback<Basket>,
  ) => void;
  handleDetachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  handleFetchBasket: (options?: OptionCallback<Basket>) => void;
  handleFetchCurrentBasket: (options?: OptionCallback<Basket>) => void;
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
  handleRequestBasketClientSecret: (
    paymentEngineIdentifier: number,
    options?: OptionCallback<RequestClientSecretPayload>,
  ) => void;
  handleCreateOrRefreshInternalAccountPrepaidLine: (
    amount: number,
    options?: OptionCallback<Basket>,
  ) => void;
  handleResetBasketClientSecret: () => void;
  handleSetPaymentStatus: ({
    paymentGroupId,
    isPaymentProcessing,
  }: {
    paymentGroupId: number;
    isPaymentProcessing: boolean;
  }) => void;
};

/**
 * Custom hook to provide basket-related actions.
 *
 * @param {string} basketId - The ID of the basket.
 * @param {number} companyId - The ID of the company.
 * @param {number} memberId - The ID of the member.
 * @returns {UseBasketPaymentActionsData} An object containing various action handlers.
 */
export const useBasketPaymentActions = (
  basketId: string,
  companyId: number,
  memberId: number,
): UseBasketPaymentActionsData => {
  const dispatch = useDispatch();

  const handleFetchBasket = useCallback(
    (options?: OptionCallback<Basket>) => {
      if (basketId) dispatch(fetchBasket(basketId, options));
    },
    [dispatch, basketId],
  );

  const handleFetchCurrentBasket = useCallback(
    (options?: OptionCallback<Basket>) => {
      if (companyId) dispatch(fetchCurrentBasket(companyId, options));
    },
    [dispatch, companyId],
  );

  const handleRequestBasketClientSecret = useCallback(
    (
      paymentEngineIdentifier: number,
      options?: OptionCallback<RequestClientSecretPayload>,
    ) => {
      if (basketId && paymentEngineIdentifier) {
        dispatch(
          requestBasketClientSecret(
            {
              basketId,
              payment_engine_identifier: paymentEngineIdentifier,
            },
            options,
          ),
        );
      }
    },
    [dispatch, basketId],
  );

  const handleResetBasketClientSecret = useCallback(() => {
    if (basketId) dispatch(resetBasketClientSecret({ basketId }));
  }, [dispatch, basketId]);

  const handleFetchInstalmentPaymentByBasket = useCallback(
    (options?: OptionCallback<InstalmentPaymentApi>) => {
      if (basketId) dispatch(fetchInstalmentPaymentByBasket(basketId, options));
    },
    [dispatch, basketId],
  );

  const handleDetachPaymentMethod = useCallback(
    (paymentMethodId: string, options?: OptionCallback) => {
      if (memberId && paymentMethodId) {
        dispatch(
          detachPaymentMethod(
            {
              member: memberId,
              payment_method_id: paymentMethodId,
              company: companyId,
            },
            options,
          ),
        );
      }
    },
    [dispatch, memberId, companyId],
  );

  const handleAssignInstalmentPayment = useCallback(
    (instalmentPayment: number | null, options?: OptionCallback<Basket>) => {
      if (basketId)
        dispatch(assignInstalmentPayment(basketId, instalmentPayment, options));
    },
    [dispatch, basketId],
  );

  const handleCreateOrRefreshInternalAccountPrepaidLine = useCallback(
    (amount: number, options?: OptionCallback<Basket>) => {
      if (basketId)
        dispatch(
          createOrRefreshInternalAccountPrepaidLine(basketId, amount, options),
        );
    },
    [basketId, dispatch],
  );

  const handleFetchPaymentGroupStatus = useCallback(
    ({
      paymentGroupId,
      options,
    }: {
      paymentGroupId: number;
      options?: OptionCallback<number>;
    }) => {
      if (paymentGroupId) {
        dispatch(
          fetchPaymentGroupStatus(paymentGroupId, {
            onSuccess: (response) => {
              options?.onSuccess?.(response);
              if (!!response && response >= PAYMENT_INTENT_STATUS_SUCCESS) {
                dispatch(
                  setPaymentStatus({
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
    [dispatch],
  );

  const handleSetPaymentStatus = useCallback(
    ({
      paymentGroupId,
      isPaymentProcessing,
    }: {
      paymentGroupId: number;
      isPaymentProcessing: boolean;
    }) => {
      dispatch(
        setPaymentStatus({
          paymentGroupId,
          paymentProcessing: isPaymentProcessing,
        }),
      );
    },
    [dispatch],
  );

  return {
    handleAssignInstalmentPayment,
    handleCreateOrRefreshInternalAccountPrepaidLine,
    handleDetachPaymentMethod,
    handleFetchBasket,
    handleFetchCurrentBasket,
    handleFetchInstalmentPaymentByBasket,
    handleFetchPaymentGroupStatus,
    handleRequestBasketClientSecret,
    handleResetBasketClientSecret,
    handleSetPaymentStatus,
  };
};
