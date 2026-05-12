import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT, QUERY_KEY_MAIN } from "../constants";
import type { InvoiceConfigurationResponse } from "./types";

export const invoiceConfigurationKeys = {
  all: [QUERY_KEY_MAIN, "invoice-configuration"] as const,
  detail: () => [...invoiceConfigurationKeys.all, "detail"] as const,
} as const;

const fetchInvoiceConfigurationAPIConfig = (): ApiConfig => {
  return [`${API_URL_PAYMENT}/configuration/me/`];
};

export const fetchInvoiceConfigurationAPI = async (
  fetch: Fetch<InvoiceConfigurationResponse>,
): Promise<InvoiceConfigurationResponse> => {
  const [uri, init] = fetchInvoiceConfigurationAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};
