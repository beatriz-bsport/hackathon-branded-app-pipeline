import { useSelector } from 'react-redux';
import type { RootState } from '#src/reducers';
import {
  getApplyBalance,
  getInvoiceClientSecret,
  getDetachPaymentMethod,
  getIsPaymentProcessing,
  getHasPaymentSucceeded,
  getIsBackendProcessingAfterPayment,
} from '#src/libs/payment/payment-module-revamped/selectors';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';

type UseInvoicePaymentStatusTrackerProps = {
  invoiceUuid: string;
  memberId: number;
};
type UseInvoicePaymentStatusTracker = {
  isPaymentProcessing: boolean;
  hasPaymentSucceeded: boolean;
  isBackendProcessingAfterPayment: boolean;
  setupPaymentError: Error;
  isPaymentInterfaceLoading: boolean;
};

/***
 * @description Hook to track payment status for an invoice
 * From high level component, I might want to know if the payment is processing, has succeeded,
 * or if the backend is processing after payment. I may also need to know if the payment interface is loading
 *
 * @param invoiceUuid The invoice UUID
 * @param memberId The member ID
 * @returns UseInvoicePaymentStatusTracker
 * ***/
export const useInvoicePaymentStatusTracker = ({
  invoiceUuid,
  memberId,
}: UseInvoicePaymentStatusTrackerProps): UseInvoicePaymentStatusTracker => {
  const invoiceClientSecretPayload = useSelector((state: RootState) =>
    getInvoiceClientSecret(state, invoiceUuid),
  );
  const hasPaymentSucceeded = useSelector((state: RootState) =>
    getHasPaymentSucceeded(state, invoiceClientSecretPayload?.payment_group),
  );
  const isBackendProcessingAfterPayment = useSelector((state: RootState) =>
    getIsBackendProcessingAfterPayment(
      state,
      invoiceClientSecretPayload?.payment_group,
    ),
  );
  const isPaymentProcessing = useSelector((state: RootState) =>
    getIsPaymentProcessing(state, invoiceClientSecretPayload?.payment_group),
  );
  const applyBalance = useSelector((state: RootState) =>
    getApplyBalance(state, invoiceUuid),
  );

  const detachPaymentMethod = useSelector((state: RootState) =>
    getDetachPaymentMethod(state, memberId),
  );

  const { isPaymentMethodListLoading } = useMemberPaymentMethodListProvider({
    memberId,
  });

  const isSettingUpPayment =
    !invoiceClientSecretPayload?.client_secret ||
    !invoiceClientSecretPayload?.payment_group ||
    invoiceClientSecretPayload?.loading;

  const isDetachPaymentMethodLoading = detachPaymentMethod?.loading;
  const applyBalanceLoading = applyBalance?.loading;

  const isPaymentInterfaceLoading =
    isSettingUpPayment ||
    applyBalanceLoading ||
    isDetachPaymentMethodLoading ||
    isPaymentMethodListLoading;

  return {
    hasPaymentSucceeded,
    isBackendProcessingAfterPayment,
    setupPaymentError: invoiceClientSecretPayload?.error,
    isPaymentProcessing,
    isPaymentInterfaceLoading,
  };
};
