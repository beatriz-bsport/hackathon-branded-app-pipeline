// This needs to be improved in the future : depending on currency, stripe has a required minimum
export const TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS = 100;

export enum ExportInvoiceStatus {
  SUCCESS = 'SUCESS',
  FAIL = 'FAILURE',
  UNKNOWN = null,
}
