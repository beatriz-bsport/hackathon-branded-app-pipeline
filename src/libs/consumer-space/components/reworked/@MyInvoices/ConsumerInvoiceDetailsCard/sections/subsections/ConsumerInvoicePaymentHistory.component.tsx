import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerInvoicePayment } from '.';
import { convertCtsToFullPrice } from '#src/libs/consumer-space/components/reworked/@MyInvoices/helpers/utils';
import Typography from '#Fabrique/Typography';

import type { PlannedPaymentEventSerializer } from '#src/libs/invoice/types';
import type { PaymentItem } from '#src/libs/invoice/payment/types';

import '../../styles.css';

type Props = {
  disputedPaymentIds: number[];
  paymentItemList?: PaymentItem[];
  plannedPaymentErrorList?: PlannedPaymentEventSerializer[];
};

const ConsumerInvoicePaymentHistory: React.FC<Props> = ({
  disputedPaymentIds,
  paymentItemList,
  plannedPaymentErrorList,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <div className="bs-consumer-invoice-details-card__body__payment-section">
      <Typography
        className="bs-consumer-invoice-details-card__body__payment-section__title"
        variant="body-lg"
      >
        {t('reworked.myInvoices.detailsCard.paymentHistory')}
      </Typography>
      {paymentItemList?.length > 0 || plannedPaymentErrorList?.length > 0 ? (
        <>
          {(paymentItemList || []).map((paymentItem) => (
            <ConsumerInvoicePayment
              key={`ConsumerInvoicePayment-paymentItem:${paymentItem.id}`}
              date={paymentItem.date}
              isDispute={disputedPaymentIds?.includes(paymentItem.id)}
              paymentMethodId={paymentItem.payment_method}
              paymentNote={paymentItem.payment_note}
              paymentReceived={paymentItem.payment_received}
              price={paymentItem.price}
            />
          ))}
          {(plannedPaymentErrorList || []).map((plannedPayment) => (
            <ConsumerInvoicePayment
              key={`ConsumerInvoicePayment-plannedPaymentError:${plannedPayment.id}`}
              isPaymentError
              isPlannedPaymentEvent
              date={plannedPayment.future_date}
              paymentErrorType={plannedPayment.recoverable_error_type}
              paymentMethodId={plannedPayment.payment_method_identifier}
              price={convertCtsToFullPrice(
                parseInt(plannedPayment?.amount_cts, 10),
              )}
              retryDate={plannedPayment.next_retry_date}
            />
          ))}
        </>
      ) : (
        <Typography
          className="bs-consumer-invoice-details-card__body__payment-section__no-content"
          variant="body-md"
        >
          {t('reworked.myInvoices.detailsCard.noPaymentRegistered')}
        </Typography>
      )}
    </div>
  );
};

export default React.memo(ConsumerInvoicePaymentHistory);
