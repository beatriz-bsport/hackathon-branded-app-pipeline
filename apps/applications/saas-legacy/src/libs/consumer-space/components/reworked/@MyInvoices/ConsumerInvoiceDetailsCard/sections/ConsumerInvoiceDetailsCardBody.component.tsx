import React from 'react';

import {
  PLANNED_PAYMENT_EVENT_STATUS_ERROR,
  PLANNED_PAYMENT_EVENT_STATUS_PENDING,
} from '@bsport/common/lib/master-data/planned-payment-event.js';

import { ConsumerGenericCardBodyContainer } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import { convertCtsToFullPrice } from '#src/libs/consumer-space/components/reworked/@MyInvoices/helpers/utils';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import type { ConsumerInvoice } from '#src/libs/invoice/types';
import {
  ConsumerInvoiceItemList,
  ConsumerInvoicePaymentHistory,
  ConsumerInvoicePlannedPaymentList,
  ConsumerInvoiceRefund,
  ConsumerInvoiceTotal,
} from './subsections';

import '../styles.css';

type Props = {
  consumerInvoice: ConsumerInvoice;
  selectedFilter: InvoicesFiltersEnum;
};

const ConsumerInvoiceDetailsCardBody: React.FC<Props> = ({
  consumerInvoice,
  selectedFilter,
}) => {
  const plannedPaymentErrorList = React.useMemo(() => {
    if (consumerInvoice?.plannedpaymentevent_set?.length > 0)
      return consumerInvoice.plannedpaymentevent_set.filter(
        (plannedPayment) =>
          plannedPayment.status === PLANNED_PAYMENT_EVENT_STATUS_ERROR,
      );
    return [];
  }, [consumerInvoice?.plannedpaymentevent_set]);

  const pendingPlannedPaymentList = React.useMemo(() => {
    if (consumerInvoice?.plannedpaymentevent_set?.length > 0)
      return consumerInvoice.plannedpaymentevent_set.filter(
        (plannedPayment) =>
          plannedPayment.status === PLANNED_PAYMENT_EVENT_STATUS_PENDING,
      );
    return [];
  }, [consumerInvoice?.plannedpaymentevent_set]);

  const hidePriceDueValue = selectedFilter === InvoicesFiltersEnum.REFUNDED;

  // Computes the refunded amount for display in the refunded section of refunded invoices
  // If no amount has been refunded, it will show '+0.00$'
  const amountRefundedCts: number | null =
    consumerInvoice?.amount_refunded_cts ||
    (selectedFilter === InvoicesFiltersEnum.REFUNDED ? 0 : null);

  return (
    <ConsumerGenericCardBodyContainer className="bs-consumer-invoice-details-card__body__container">
      <ConsumerInvoiceItemList invoiceItems={consumerInvoice?.invoice_items} />
      <ConsumerInvoiceTotal
        due={
          hidePriceDueValue
            ? null
            : convertCtsToFullPrice(consumerInvoice?.amount_left_to_pay_cts)
        }
        paid={convertCtsToFullPrice(consumerInvoice?.amount_paid_cts)}
        total={convertCtsToFullPrice(consumerInvoice?.amount_due_cts)}
      />
      {amountRefundedCts !== null && (
        <ConsumerInvoiceRefund
          amount={convertCtsToFullPrice(-amountRefundedCts)}
        />
      )}
      <ConsumerInvoicePlannedPaymentList
        plannedPaymentList={pendingPlannedPaymentList}
      />
      <ConsumerInvoicePaymentHistory
        disputedPaymentIds={consumerInvoice?.disputed_payments}
        paymentItemList={consumerInvoice?.payments}
        plannedPaymentErrorList={plannedPaymentErrorList}
      />
    </ConsumerGenericCardBodyContainer>
  );
};

export default React.memo(ConsumerInvoiceDetailsCardBody);
