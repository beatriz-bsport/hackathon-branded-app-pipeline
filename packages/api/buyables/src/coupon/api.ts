import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_V1_URL } from "../constants";
import { ApplyToInvoicePayload, ApplyToInvoiceResponse } from "./types";

const API_URL = `${API_V1_URL}/coupon`;

const applyPromoCodeToInvoiceAPIConfig = (
  params: ApplyToInvoicePayload,
): ApiConfig => {
  return [
    `${API_URL}/applies_to_invoice_new/`,
    { method: "POST", body: JSON.stringify(params) },
  ];
};

export const applyPromoCodeToInvoiceAPI = async (
  fetch: Fetch<ApplyToInvoiceResponse>,
  payload: ApplyToInvoicePayload,
): Promise<ApplyToInvoiceResponse> => {
  const [uri, init] = applyPromoCodeToInvoiceAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
