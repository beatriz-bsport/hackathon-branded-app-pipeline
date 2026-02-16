import { type ApiConfig, type Fetch } from "@bsport/store-base";

import type { UpdateInvoiceFooterResponse } from "./types";

const API_URL = "financial-services/v1/payment/invoices";

const updateInvoiceFooterAPIConfig = (
  invoiceUuid: string,
  customFooter: string,
): ApiConfig => {
  return [
    `${API_URL}/${invoiceUuid}/update_footer/`,
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
