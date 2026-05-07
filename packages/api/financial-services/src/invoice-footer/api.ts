import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT_INVOICES, QUERY_KEY_MAIN } from "../constants";
import type { UpdateInvoiceFooterResponse } from "./types";

export const invoiceFooterKeys = {
  all: [QUERY_KEY_MAIN, "invoice-footer"] as const,
  detail: (invoiceUuid: string) =>
    [...invoiceFooterKeys.all, "detail", invoiceUuid] as const,
} as const;

const updateInvoiceFooterAPIConfig = (
  invoiceUuid: string,
  customFooter: string,
): ApiConfig => {
  return [
    `${API_URL_PAYMENT_INVOICES}/${invoiceUuid}/update_footer/`,
    {
      method: "POST",
      body: JSON.stringify({ custom_footer: customFooter }),
    },
  ];
};

export const updateInvoiceFooterAPI = async (
  fetch: Fetch<UpdateInvoiceFooterResponse>,
  invoiceUuid: string,
  customFooter: string,
): Promise<UpdateInvoiceFooterResponse> => {
  const [uri, init] = updateInvoiceFooterAPIConfig(invoiceUuid, customFooter);

  const { data } = await fetch(uri, init);

  return data;
};
