import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT_INVOICES, QUERY_KEY_MAIN } from "../constants";
import type { CreateInvoiceRequest, CreateInvoiceResponse } from "./types";

export const invoiceCreateKeys = {
  all: [QUERY_KEY_MAIN, "invoice-create"] as const,
  create: () => [...invoiceCreateKeys.all, "create"] as const,
} as const;

const createInvoiceAPIConfig = (payload: CreateInvoiceRequest): ApiConfig => {
  return [
    `${API_URL_PAYMENT_INVOICES}/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const createInvoiceAPI = async (
  fetch: Fetch<CreateInvoiceResponse>,
  payload: CreateInvoiceRequest,
): Promise<CreateInvoiceResponse> => {
  const [uri, init] = createInvoiceAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
