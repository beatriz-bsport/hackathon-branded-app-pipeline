import React, { useEffect } from 'react';
import { compose } from 'recompose';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import OnlinePaymentInvoice from '#src/libs/payment/payment-module-revamped/invoice-payment/OnlinePaymentInvoice.component';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '#src/libs/theme/selectors';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import { Typography } from '#src/components/css-only/Fabrique/Typography/Typography.component';
import { useTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { useInvoicePaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/invoice-payment/hooks/useInvoicePaymentStatusTracker';
import Button from '#Fabrique/ButtonV2';
import { Loading02 } from '#src/components/untitledui';

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

  const { t } = useTranslation(['consumerSpace', 'common', 'payment']);

  const companyTheme = useSelector(getTheme);

  const onConfirmPaymentSuccess = () => {
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
    onSuccess: onConfirmPaymentSuccess,
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

  useEffect(() => {
    dispatch(fetchCompanyThemeAction(Number(companyId)));
  }, [dispatch, companyId]);

  if (!companyId || !invoiceUuid || !memberId) return null;

  if (!!setupPaymentError) {
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
        onConfirmPaymentSuccess={onConfirmPaymentSuccess}
        stripePaymentElementConfig={{
          isDefaultForRegion: companyTheme.is_default_for_region,
          stripeId: companyTheme.stripe_id,
        }}
      />
      <div className="bs-invoice-payment-buttons-containers">
        <Button
          isDisabled={isConfirmDisabled}
          onClick={handleConfirmPayment}
          size="md"
        >
          {t('common:confirm')}
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
