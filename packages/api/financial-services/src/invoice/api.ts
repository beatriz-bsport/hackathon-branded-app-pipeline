import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT_INVOICES } from "../constants";
import type { FetchInvoiceResponse } from "./types";

const fetchInvoiceAPIConfig = (invoiceId: string): ApiConfig => {
  const normalizedInvoiceId = encodeURIComponent(invoiceId.trim());

  return [`${API_URL_PAYMENT_INVOICES}/${normalizedInvoiceId}/`];
};

export const fetchInvoiceAPI = async (
  fetch: Fetch<FetchInvoiceResponse>,
  invoiceId: string,
): Promise<FetchInvoiceResponse> => {
  const [uri, init] = fetchInvoiceAPIConfig(invoiceId);

  const { data } = await fetch(uri, init);

  return data;
};
