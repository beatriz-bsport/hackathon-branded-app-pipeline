import React, { useEffect } from 'react';
import { compose } from 'recompose';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import OnlinePaymentInvoice from '#src/libs/payment/payment-module-revamped/invoice-payment/OnlinePaymentInvoice.component';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '#src/reducers';
import { getTheme } from '#src/libs/theme/selectors';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import { fetchConsumerInvoiceByUuid } from '#src/libs/consumer-space/actions';
import {
  getConsumerInvoiceByUuid,
  getConsumerInvoiceByUuidError,
  getConsumerInvoiceByUuidLoading,
} from '#src/libs/consumer-space/selectors';
import { Typography } from '#src/components/css-only/Fabrique/Typography/Typography.component';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { useInvoicePaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/invoice-payment/hooks/useInvoicePaymentStatusTracker';
import { getInvoiceClientSecret } from '#src/libs/payment/payment-module-revamped/selectors';
import { formatPriceWithCurrency } from '#src/libs/theme/utils';
import BigIcon from '#Fabrique/BigIcon';
import Button from '#Fabrique/ButtonV2';
import { Loading02 } from '#src/components/untitledui';
import CircularProgress from '#src/components/css-only/CircularProgress';
import { shouldCheckPaymentStatus } from '#src/libs/checkout/utils';
import './styles.css';

type Props = {
  invoiceUuid: string;
  memberId: string;
  companyId: string;
};

type PaymentRef = {
  onPaymentConfirm?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onResetInvoicePaymentSetup?: () => void;
};

const InvoicePaymentContent: React.FC<Props> = ({
  companyId,
  invoiceUuid,
  memberId,
}) => {
  const dispatch = useDispatch();

  const paymentRef = React.useRef<PaymentRef>(null);

  const { t } = useTranslation([
    'consumerSpace',
    'common',
    'payment',
    'checkout',
  ]);

  const companyTheme = useSelector(getTheme);

  const isCheckingInvoiceStatus = useSelector(getConsumerInvoiceByUuidLoading);
  const invoiceFetchError = useSelector(getConsumerInvoiceByUuidError);
  const invoice = useSelector((state: RootState) =>
    getConsumerInvoiceByUuid(state, invoiceUuid),
  );
  const isInvoicePaid = !!invoice?.is_finalized;
  const invoiceClientSecretPayload = useSelector((state: RootState) =>
    getInvoiceClientSecret(state, invoiceUuid),
  );

  const handleCloseModal = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'succeeded' }),
      );
    }
  };

  const onCancelPaymentBeforeConfirming = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'cancel' }),
      );
    }
  };

  const onConfirmPaymentError = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'failed' }),
      );
    }
  };

  const handleConfirmPayment = React.useCallback(
    (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      !!event && paymentRef?.current?.onPaymentConfirm?.(event);
    },
    [paymentRef],
  );
  const handleResetInvoicePaymentSetup = React.useCallback(() => {
    paymentRef?.current?.onResetInvoicePaymentSetup?.();
  }, [paymentRef]);

  const applyBalanceToInvoiceCallbacks = {
    onError: onConfirmPaymentError,
  };

  useEffect(() => {
    return () => {
      handleResetInvoicePaymentSetup();
    };
  }, [handleResetInvoicePaymentSetup]);

  const {
    isPaymentProcessing,
    setupPaymentError,
    hasPaymentSucceeded,
    isBackendProcessingAfterPayment,
    isPaymentInterfaceLoading,
  } = useInvoicePaymentStatusTracker({
    invoiceUuid,
    memberId: Number(memberId),
  });

  const hasPaymentSucceededAndBackendProcessedIt =
    hasPaymentSucceeded && !isBackendProcessingAfterPayment;

  const isConfirmDisabled =
    isPaymentProcessing ||
    isPaymentInterfaceLoading ||
    hasPaymentSucceededAndBackendProcessedIt ||
    !!setupPaymentError;

  const isCancelDisabled =
    isPaymentInterfaceLoading || hasPaymentSucceededAndBackendProcessedIt;

  const amountToPayCts = invoiceClientSecretPayload?.price_cts ?? 0;
  const payButtonText =
    amountToPayCts > 0
      ? t('checkout:validation.actions.payAmountNow', {
          amount: formatPriceWithCurrency(
            amountToPayCts / 100,
            companyTheme?.currency_display ?? '€',
          ),
        })
      : t('common:confirm');

  useEffect(() => {
    dispatch(fetchCompanyThemeAction(Number(companyId)));
  }, [dispatch, companyId]);

  // Check the invoice status if the user is redirected from payment (e.g., iDEAL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkPaymentIntent = urlParams.get('check_payment_intent');
    const redirectStatus = urlParams.get('redirect_status');

    if (
      shouldCheckPaymentStatus({
        check_payment_intent: checkPaymentIntent as
          | 'true'
          | 'false'
          | undefined,
        redirect_status: redirectStatus as
          | 'succeeded'
          | 'pending'
          | 'failed'
          | undefined,
      }) &&
      !isCheckingInvoiceStatus &&
      !isInvoicePaid &&
      !invoice
    ) {
      dispatch(fetchConsumerInvoiceByUuid(invoiceUuid));
    }
  }, [dispatch, invoiceUuid, isCheckingInvoiceStatus, isInvoicePaid, invoice]);

  useEffect(() => {
    if (
      setupPaymentError &&
      !isCheckingInvoiceStatus &&
      !isInvoicePaid &&
      !invoiceFetchError &&
      !invoice
    ) {
      dispatch(fetchConsumerInvoiceByUuid(invoiceUuid));
    }
  }, [
    dispatch,
    setupPaymentError,
    invoiceUuid,
    isCheckingInvoiceStatus,
    isInvoicePaid,
    invoiceFetchError,
    invoice,
  ]);

  if (!companyId || !invoiceUuid || !memberId) return null;

  // Show success screen if payment succeeded and backend processed it, or if the invoice is already paid
  if (hasPaymentSucceededAndBackendProcessedIt || isInvoicePaid) {
    return (
      <div className="bs-invoice-payment-container">
        <div className="bs-invoice-payment-success-container">
          <BigIcon variant="success" />
          <Typography align="center" variant="title-md">
            {t('consumerSpace:reworked.myInvoices.payment.successMessage')}
          </Typography>
          <Button
            color="primary"
            onClick={handleCloseModal}
            size="md"
            variant="outlined"
          >
            {t('common:back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!!setupPaymentError && !isCheckingInvoiceStatus) {
    return (
      <div className="bs-invoice-payment-container">
        <Typography variant="title-md">
          {t('consumerSpace:reworked.myInvoices.payment.title')}
        </Typography>
        <Typography variant="body-md">
          {t('payment:setupPaymentError')}
        </Typography>
        <Button
          color="primary"
          onClick={onConfirmPaymentError}
          size="md"
          variant="outlined"
        >
          {t('common:back')}
        </Button>
      </div>
    );
  }

  if (hasPaymentSucceeded && isBackendProcessingAfterPayment) {
    return (
      <div className="bs-invoice-payment-container">
        <Typography variant="title-md">
          {t('consumerSpace:reworked.myInvoices.payment.title')}
        </Typography>
        <Loading02 className="bs-invoice-payment-loader" />
      </div>
    );
  }

  return (
    <div className="bs-invoice-payment-container">
      <Typography variant="title-md">
        {t('consumerSpace:reworked.myInvoices.payment.title')}
      </Typography>
      <OnlinePaymentInvoice
        ref={paymentRef}
        forceHideConfirmPaymentButton
        applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
        companyId={Number(companyId)}
        invoiceUuid={invoiceUuid}
        memberId={Number(memberId)}
        onCancelPaymentBeforeConfirming={onCancelPaymentBeforeConfirming}
        onConfirmPaymentError={onConfirmPaymentError}
        stripePaymentElementConfig={{
          isDefaultForRegion: companyTheme.is_default_for_region,
          stripeId: companyTheme.stripe_id,
        }}
      />
      <div className="bs-invoice-payment-buttons-containers">
        <Button
          isDisabled={isConfirmDisabled}
          leftIcon={
            isPaymentProcessing ? <CircularProgress size="xs" /> : undefined
          }
          onClick={handleConfirmPayment}
          size="md"
        >
          {payButtonText}
        </Button>
        <Button
          color="grey"
          isDisabled={isCancelDisabled}
          onClick={onCancelPaymentBeforeConfirming}
          size="md"
          variant="outlined"
        >
          {t('common:cancel')}
        </Button>
      </div>
    </div>
  );
};

export const InvoicePayment = compose<Props, Props>(
  routerParamsToProps({
    invoiceUuid: 'invoiceUuid:string',
    memberId: 'memberId:string',
    companyId: 'companyId:string',
  }),
  marketplaceCssHoc(),
)(InvoicePaymentContent);
