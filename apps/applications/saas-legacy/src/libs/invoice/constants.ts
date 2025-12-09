// This needs to be improved in the future : depending on currency, stripe has a required minimum
export const TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS = 100;

export enum ExportInvoiceStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNKNOWN = null,
}

// Be careful to always be consistend with error codes provided in ./errors.ts
export enum ExportInvoiceErrorCode {
  NO_INVOICE_EXPORTER = 14210,
  NO_USER_OFFICIAL_DOCUMENT_ID = 14211,
  INVOICE_EXPORT_INCOMPLETE_USER_ADDRESS = 14212,
  INVOICE_EXPORT_SCHEMA_COMPLIANCE = 14213,
  INVOICE_EXPORT_EMPTY_ZIP = 14214,
}

export enum InvoiceSignEsSignatureStatus {
  REGISTERED = 'REGISTERED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  NOT_SENDABLE = 'NOT_SENDABLE',
  TO_BE_SENT_MANUALLY = 'TO_BE_SENT_MANUALLY',
}
