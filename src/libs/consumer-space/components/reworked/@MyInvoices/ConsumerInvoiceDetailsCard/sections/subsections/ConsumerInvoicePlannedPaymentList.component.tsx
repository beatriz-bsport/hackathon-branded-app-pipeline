import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerInvoicePayment } from '.';
import { convertCtsToFullPrice } from '#libs/consumer-space/components/reworked/@MyInvoices/helpers/utils';
import Typography from '#Fabrique/Typography';

import type { PlannedPaymentEventSerializer } from '#libs/invoice/types';

import '../../styles.css';

type Props = {
  plannedPaymentList: PlannedPaymentEventSerializer[];
};

const ConsumerInvoicePlannedPaymentList: React.FC<Props> = ({
  plannedPaymentList,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (!plannedPaymentList || !(plannedPaymentList?.length > 0)) return null;

  return (
    <div className="bs-consumer-invoice-details-card__body__planned-payment-section">
      <Typography
        className="bs-consumer-invoice-details-card__body__planned-payment-section__title"
        variant="body-lg"
      >
        {t('reworked.myInvoices.detailsCard.plannedPayments')}
      </Typography>
      {plannedPaymentList.map((plannedPayment) => (
        <ConsumerInvoicePayment
          key={`ConsumerInvoicePayment-plannedPayment:${plannedPayment.id}`}
          isPlannedPaymentEvent
          date={plannedPayment.future_date}
          paymentMethodId={plannedPayment.payment_method_identifier}
          price={convertCtsToFullPrice(
            parseInt(plannedPayment?.amount_cts, 10),
          )}
          retryDate={plannedPayment.next_retry_date}
        />
      ))}
    </div>
  );
};

export default React.memo(ConsumerInvoicePlannedPaymentList);
