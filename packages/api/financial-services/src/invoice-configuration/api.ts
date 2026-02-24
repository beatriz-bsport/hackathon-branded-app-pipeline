import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT } from "../constants";
import type { InvoiceConfigurationResponse } from "./types";

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
