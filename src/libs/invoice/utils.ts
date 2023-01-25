import {
  PLANNED_PAYMENT_EVENT_STATUS_REGISTERED,
  PLANNED_PAYMENT_EVENT_STATUS_ERROR,
} from '@bsport/common/lib/master-data/planned-payment-event';
import { PlannedInvoice } from '#libs/subscription/types';
import { Invoice, PlannedPaymentEvent } from './types';

export const getInvoiceIdentifier = (invoice: Invoice | PlannedInvoice) => {
  if (!invoice) return '';
  const { uuid, invoice_legal_identifier } = invoice;

  if (invoice_legal_identifier) return invoice_legal_identifier;
  return uuid ? uuid.slice(0, 8).toUpperCase() : '';
};

export const shouldPlannedPaymentEventBeDisplayed = (
  ppe: PlannedPaymentEvent,
) =>
  ppe.status === PLANNED_PAYMENT_EVENT_STATUS_REGISTERED ||
  (ppe.status === PLANNED_PAYMENT_EVENT_STATUS_ERROR &&
    ppe.error_recoverable_manually);
