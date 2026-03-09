import { BUYABLE_IDENTIFIERS, INVOICE_STATUSES } from "./constants";

export type BuyableItemIdentifier =
  (typeof BUYABLE_IDENTIFIERS)[keyof typeof BUYABLE_IDENTIFIERS];

export type InvoiceStatus =
  (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES];
