import React from 'react';
import { useTranslation } from 'react-i18next';

import { AlertColorEnum, AlertVariantEnum } from '#Fabrique/Alert/constants';
import { ConsumerInvoiceDisputeChip } from '#libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceDetailsCard/sections/subsections';
import { formatAsDatetimeAdapted } from '#utils/datetime';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Alert from '#Fabrique/Alert';
import Typography from '#Fabrique/Typography';

import '../../styles.css';

type Props = {
  date: string;
  isDispute?: boolean;
  isPaymentError?: boolean;
  isPlannedPaymentEvent?: boolean;
  paymentErrorType?: string;
  paymentMethodId: number;
  paymentNote?: string;
  paymentReceived?: boolean | null;
  price: string;
  retryDate?: string | null;
};

const ConsumerInvoicePayment: React.FC<Props> = ({
  date,
  isDispute,
  isPaymentError,
  isPlannedPaymentEvent,
  paymentErrorType,
  paymentMethodId,
  paymentNote,
  paymentReceived,
  price,
  retryDate,
}) => {
  const { t } = useTranslation(['consumerSpace', 'payment', 'invoice']);

  return (
    <div className="bs-consumer-invoice-details-card__body__payment-section__item">
      <div className="bs-consumer-invoice-details-card__body__payment-section__item-container">
        <div className="bs-consumer-invoice-details-card__body__payment-section__item-details">
          <Typography
            className="bs-consumer-invoice-details-card__body__payment-section__item-details-date"
            variant="body-xs"
          >
            {isPlannedPaymentEvent && !!retryDate
              ? t('consumerSpace:reworked.myInvoices.detailsCard.retryDate', {
                  date: formatAsDatetimeAdapted(retryDate, 'L'),
                })
              : formatAsDatetimeAdapted(date, 'L')}
          </Typography>
          <Typography
            className="bs-consumer-invoice-details-card__body__payment-section__item-details-label"
            variant="body-md"
          >
            {isPlannedPaymentEvent
              ? t(`invoice:paymentMethod.label.${paymentMethodId}`)
              : t(`payment:paymentMethod.${paymentMethodId}`)}
          </Typography>
        </div>
        <Typography
          className="bs-consumer-invoice-details-card__body__payment-section__item-price"
          variant="body-md"
        >
          {getCurrencyDisplayWithPrice(price)}
        </Typography>
      </div>
      {isDispute && (
        <div className="bs-consumer-invoice-details-card__body__payment-section__item-dispute">
          <Typography
            className="bs-consumer-invoice-details-card__body__payment-section__item-dispute-note"
            variant="body-sm"
          >
            {paymentNote || ' '}
          </Typography>
          <ConsumerInvoiceDisputeChip paymentReceived={paymentReceived} />
        </div>
      )}
      {isPaymentError && (
        <Alert
          className="bs-consumer-invoice-details-card__body__payment-section__item-error-alert"
          color={AlertColorEnum.ERROR}
          variant={AlertVariantEnum.WEAK}
        >
          {paymentErrorType
            ? t(
                'consumerSpace:reworked.myInvoices.detailsCard.paymentErrorWithReason',
                {
                  reason: paymentErrorType,
                },
              )
            : t('consumerSpace:reworked.myInvoices.detailsCard.paymentError')}
        </Alert>
      )}
    </div>
  );
};

export default React.memo(ConsumerInvoicePayment);
