// #region Models

// TODO: real endpoint (/subscription/planned-invoice/) returns numeric status;
// update type and mapping when migrating away from mock.
export type PlannedInvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "voided"
  | "refunded";

export type PlannedInvoice = {
  id: number;
  uuid: string;
  date: string;
  amount_due_cts: number;
  status: PlannedInvoiceStatus;
  billing_plan: number;
  invoice_legal_identifier: string | null;
  reverted: boolean;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Params

export type FetchPlannedInvoicesParams = {
  billing_plan: number;
  page?: number;
  page_size?: number;
};

// #endregion
