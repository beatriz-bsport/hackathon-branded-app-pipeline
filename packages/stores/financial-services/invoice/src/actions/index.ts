import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import {
  setInvoices,
  updateInvoice,
  updateReceiptUrl,
} from "#src/actions/store";
import {
  fetchInvoiceByInvoiceItemAPI,
  fetchInvoicesAPI,
  finalizeInvoiceAPI,
  getReceiptUrlAPI,
} from "#src/api";
import type { FetchInvoiceByInvoiceItemParams, Invoice } from "#src/types";

/**
 * Fetches a list of paginated invoices.
 * @param params.page The page number.
 * @param params.pageSize The number of items per page.
 */
export const fetchInvoicesAction: Action<
  {
    page: number;
    pageSize: number;
  },
  PaginatedResponse<Invoice>
> = async (fetch, params) => {
  const [uri, init] = fetchInvoicesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setInvoices({
        invoices: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch invoices", { cause: error }),
  );
};

/**
 * Finalizes and returns the updated invoice.
 * @param fetch The fetch function.
 * @param invoiceUuid The UUID of the invoice.
 */
export const finalizeInvoiceAction: Action<string, Invoice> = async (
  fetch,
  invoiceUuid,
) => {
  if (!invoiceUuid) {
    return Result.error(
      new Error("The invoice UUID is required to finalize an invoice"),
    );
  }

  const [uri, init] = finalizeInvoiceAPI(invoiceUuid);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateInvoice(data);

      return data;
    },
    (error) => new Error("Failed to finalize invoice", { cause: error }),
  );
};

/**
 * Generates and returns a receipt URL for an invoice.
 * @param fetch The fetch function.
 * @param invoiceUuid The UUID of the invoice.
 */
export const getReceiptUrlAction: Action<string, string> = async (
  fetch,
  invoiceUuid,
) => {
  if (!invoiceUuid) {
    return Result.error(
      new Error("The invoice UUID is required to generate a receipt URL"),
    );
  }

  const [uri, init] = getReceiptUrlAPI(invoiceUuid);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateReceiptUrl(data);

      return data;
    },
    (error) => new Error("Failed to generate receipt URL", { cause: error }),
  );
};

export const fetchInvoiceByInvoiceItemAction: Action<
  FetchInvoiceByInvoiceItemParams,
  Invoice
> = async (fetch, params) => {
  const [uri, init] = fetchInvoiceByInvoiceItemAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateInvoice(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch invoice by its items",
        params,
      }),
  );
};
