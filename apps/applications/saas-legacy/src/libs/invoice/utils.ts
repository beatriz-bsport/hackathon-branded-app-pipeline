import {
  PLANNED_PAYMENT_EVENT_STATUS_REGISTERED,
  PLANNED_PAYMENT_EVENT_STATUS_PENDING,
  PLANNED_PAYMENT_EVENT_STATUS_ERROR,
} from '@bsport/common/lib/master-data/planned-payment-event';
import { PlannedInvoice } from '#src/libs/subscription/types';
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
  // Stripe payment flow was triggered but not fully completed yet.
  // If successfull, ppe.processing === false and a Payment was generated
  (ppe.processing && ppe.status === PLANNED_PAYMENT_EVENT_STATUS_REGISTERED) ||
  // Created for a specific future date, nothing triggered on Stripe for now.
  ppe.status === PLANNED_PAYMENT_EVENT_STATUS_PENDING ||
  // Something went wrong with Stripe.
  ppe.status === PLANNED_PAYMENT_EVENT_STATUS_ERROR;
