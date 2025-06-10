import React from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '#Fabrique/Alert';
import BigIcon from '#Fabrique/BigIcon';
import { LinearProgress } from '@material-ui/core';
import Typography from '#Fabrique/Typography';

import './styles.css';
import OnlinePaymentInvoice from '#src/libs/payment/payment-module-revamped/invoice-payment/OnlinePaymentInvoice.component';
import { OptionCallback } from '#src/state/types';
import { useInvoicePaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/invoice-payment/hooks/useInvoicePaymentStatusTracker';
import type { StripePaymentElementConfig } from '#src/libs/company/types';

type Props = {
  companyId: number;
  memberId: number;
  invoiceUuid: string;
  ref: React.Ref<any>;
  applyBalanceToInvoiceCallbacks?: OptionCallback;
  onPaymentSuccess: (callback?: () => void) => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
};

const ConsumerInvoicePaymentContent: React.FC<Props> = React.forwardRef(
  (
    {
      companyId,
      invoiceUuid,
      memberId,
      applyBalanceToInvoiceCallbacks,
      onPaymentSuccess,
      stripePaymentElementConfig,
    },
    ref,
  ) => {
    const { t } = useTranslation('consumerSpace');

    const {
      isPaymentProcessing,
      setupPaymentError,
      hasPaymentSucceeded,
      isBackendProcessingAfterPayment,
    } = useInvoicePaymentStatusTracker({
      invoiceUuid,
      memberId,
    });

    if (hasPaymentSucceeded && !isBackendProcessingAfterPayment) {
      return (
        <div className="bs-consumer-invoice-page__payment-portal__confirmation">
          <BigIcon variant="success" />
          <Typography
            align="center"
            className="bs-consumer-invoice-page__payment-portal__confirmation__text"
            variant="title-sm"
          >
            {t('reworked.myInvoices.payment.successMessage')}
          </Typography>
        </div>
      );
    }
    // This logic is specific to new member profile. Currently there are 2 seconds between the time backend
    // tell the frontend that the payment is successful and the time we fetch the invoice status. The goal is
    // to let the backend process the invoice correctly before we fetch the invoice status. In the meantime
    // we'll now let the user know that the payment is successful and we're processing the invoice.
    if (hasPaymentSucceeded) {
      return (
        <div className="bs-consumer-invoice-page__payment-portal__confirmation">
          <BigIcon variant="success" />
          <Typography
            align="center"
            className="bs-consumer-invoice-page__payment-portal__confirmation__text"
            variant="title-sm"
          >
            {t('reworked.myInvoices.payment.backendProcessingInvoice')}
          </Typography>
        </div>
      );
    }

    if (setupPaymentError) {
      return (
        <Alert
          className="bs-consumer-invoice-page__payment-portal__error"
          color="error"
          variant="weak"
        >
          {setupPaymentError.message}
        </Alert>
      );
    }

    return (
      <>
        <OnlinePaymentInvoice
          ref={ref}
          forceHideConfirmPaymentButton
          applyBalanceToInvoiceCallbacks={applyBalanceToInvoiceCallbacks}
          companyId={companyId}
          invoiceUuid={invoiceUuid}
          memberId={memberId}
          onConfirmPaymentSuccess={onPaymentSuccess}
          stripePaymentElementConfig={stripePaymentElementConfig}
        />
        {isPaymentProcessing && (
          <div className="bs-consumer-invoice-page__payment-portal__processing">
            <LinearProgress />
          </div>
        )}
      </>
    );
  },
);

export default React.memo(ConsumerInvoicePaymentContent);
