import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PAYMENT_INVOICES, QUERY_KEY_MAIN } from "../constants";
import type {
  ApplyGiftcardOnInvoiceRequest,
  FetchInvoiceResponse,
} from "./types";

export const invoiceKeys = {
  all: [QUERY_KEY_MAIN, "invoice"] as const,
  detail: (invoiceId: string) =>
    [...invoiceKeys.all, "detail", invoiceId] as const,
} as const;

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

export const applyBalanceToInvoiceAPIConfig = (
  invoiceId: string,
): ApiConfig => {
  return [
    `${API_URL_PAYMENT_INVOICES}/${invoiceId}/apply_balance_to_invoice/`,
    { method: "POST" },
  ];
};

export const applyBalanceToInvoiceAPI = async (
  fetch: Fetch<string>,
  invoiceId: string,
): Promise<string> => {
  const [uri, init] = applyBalanceToInvoiceAPIConfig(invoiceId);

  const { data } = await fetch(uri, init);

  return data;
};

export const applyGiftcardOnInvoiceAPIConfig = ({
  invoiceId,
  ...payload
}: ApplyGiftcardOnInvoiceRequest): ApiConfig => {
  return [
    `${API_URL_PAYMENT_INVOICES}/${invoiceId}/apply_giftcard_on_invoice/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const applyGiftcardOnInvoiceAPI = async (
  fetch: Fetch<FetchInvoiceResponse>,
  payload: ApplyGiftcardOnInvoiceRequest,
): Promise<FetchInvoiceResponse> => {
  const [uri, init] = applyGiftcardOnInvoiceAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
