import { PlannedInvoice } from '#libs/subscription/types';
import { Invoice } from './types';

export const getInvoiceIdentifier = (invoice: Invoice | PlannedInvoice) => {
  if (!invoice) return '';
  const { uuid, invoice_legal_identifier } = invoice;

  if (invoice_legal_identifier) return invoice_legal_identifier;
  return uuid ? uuid.slice(0, 8).toUpperCase() : '';
};
