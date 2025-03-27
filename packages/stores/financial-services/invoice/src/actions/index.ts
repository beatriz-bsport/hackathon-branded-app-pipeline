import { Result } from "typescript-result";

import { Action } from "@bsport/store-base";

import {
  setInvoices,
  updateInvoice,
  updateReceiptUrl,
} from "#src/actions/store";
import {
  fetchInvoices as apiFetchInvoices,
  finalizeInvoice as apiFinalizeInvoice,
  getReceiptUrl as apiGetReceiptUrl,
} from "#src/api";
import type {
  FetchInvoicesParams,
  Invoice,
  PaginatedResponse,
} from "#src/types";

/**
 * Fetches a list of paginated invoices.
 * @param params.page The page number.
 * @param params.pageSize The number of items per page.
 */
export const fetchInvoices: Action<
  FetchInvoicesParams,
  Result<PaginatedResponse<Invoice>, Error>
> = async (fetch, params) => {
  const [uri, init] = apiFetchInvoices(params);

  return Result.try(
    async () => {
      const { data } = await fetch<PaginatedResponse<Invoice>>(uri, init);

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
export const finalizeInvoice: Action<string, Result<Invoice, Error>> = async (
  fetch,
  invoiceUuid,
) => {
  if (!invoiceUuid) {
    return Result.error(
      new Error("The invoice UUID is required to finalize an invoice"),
    );
  }

  const [uri, init] = apiFinalizeInvoice(invoiceUuid);

  return Result.try(
    async () => {
      const { data } = await fetch<Invoice>(uri, init);

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
export const getReceiptUrl: Action<string, Result<string, Error>> = async (
  fetch,
  invoiceUuid,
) => {
  if (!invoiceUuid) {
    return Result.error(
      new Error("The invoice UUID is required to generate a receipt URL"),
    );
  }

  const [uri, init] = apiGetReceiptUrl(invoiceUuid);

  return Result.try(
    async () => {
      const { data } = await fetch<string>(uri, init);

      updateReceiptUrl(data);

      return data;
    },
    (error) => new Error("Failed to generate receipt URL", { cause: error }),
  );
};
