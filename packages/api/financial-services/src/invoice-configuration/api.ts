import { type ApiConfig, type Fetch } from "@bsport/store-base";

import type { InvoiceConfigurationResponse } from "./types";

const API_URL = "financial-services/v1/payment";

const fetchInvoiceConfigurationAPIConfig = (): ApiConfig => {
  return [`${API_URL}/configuration/me/`];
};

export const fetchInvoiceConfigurationAPI = async (
  fetch: Fetch<InvoiceConfigurationResponse>,
): Promise<InvoiceConfigurationResponse> => {
  const [uri, init] = fetchInvoiceConfigurationAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};
