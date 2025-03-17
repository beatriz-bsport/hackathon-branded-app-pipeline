import { useSelector } from 'react-redux';
import type { RootState } from '#src/reducers';

import {
  getHasPaymentSucceeded,
  getIsBackendProcessingAfterPayment,
  getIsPaymentProcessing,
} from '#src/libs/payment/payment-module-revamped/selectors';

import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';
import { useBasketPaymentStoreData } from './useBasketPaymentStoreData';

type UseBasketPaymentStatusTracker = {
  hasPaymentSucceeded: boolean;
  isBackendProcessingAfterPayment: boolean;
  clientSecretError: Error | null | undefined;
  isPaymentProcessing: boolean;
  isPaymentInterfaceLoading: boolean;
  isSettingUpPayment: boolean;
};
/**
 * Hook to track payment status for a basket
 * From high level component, I might want to know if the payment is processing, has succeeded,
 * or if the backend is processing after payment. I may also need to know if the payment interface is loading
 *
 * @param basketId The basket ID
 * @param memberId The member ID
 **/
export const useBasketPaymentStatusTracker = (
  basketId: string,
  memberId: number,
): UseBasketPaymentStatusTracker => {
  const {
    paymentGroupId,
    clientSecret,
    isClientSecretLoading,
    clientSecretError,
    isDetachPaymentMethodLoading,
  } = useBasketPaymentStoreData(basketId, memberId);

  const hasPaymentSucceeded = useSelector((state: RootState) =>
    getHasPaymentSucceeded(state, paymentGroupId),
  );

  const isBackendProcessingAfterPayment = useSelector((state: RootState) =>
    getIsBackendProcessingAfterPayment(state, paymentGroupId),
  );

  const isPaymentProcessing = useSelector((state: RootState) =>
    getIsPaymentProcessing(state, paymentGroupId),
  );

  const { isPaymentMethodListLoading } = useMemberPaymentMethodListProvider({
    memberId,
  });

  const isSettingUpPayment =
    !clientSecret || !paymentGroupId || isClientSecretLoading;

  const isPaymentInterfaceLoading =
    isSettingUpPayment ||
    isDetachPaymentMethodLoading ||
    isPaymentMethodListLoading;

  return {
    hasPaymentSucceeded,
    isBackendProcessingAfterPayment,
    clientSecretError,
    isPaymentProcessing,
    isPaymentInterfaceLoading,
    isSettingUpPayment,
  };
};
