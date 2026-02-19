import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT_INVOICES } from "../constants";
import type { CreateInvoiceRequest, CreateInvoiceResponse } from "./types";

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
