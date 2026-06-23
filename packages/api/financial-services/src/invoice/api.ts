import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_URL_PAYMENT_INVOICES, QUERY_KEY_MAIN } from "../constants";
import type {
  ApplyGiftcardOnInvoiceRequest,
  FetchInvoiceResponse,
  ScheduleInvoicePaymentRequest,
  ScheduleInvoicePaymentResponse,
} from "./types";

export const invoiceKeys = {
  all: [QUERY_KEY_MAIN, "invoice"] as const,
  detail: (invoiceId: string) =>
    [...invoiceKeys.all, "detail", invoiceId] as const,
  unpaidCount: (memberId: number) =>
    [...invoiceKeys.all, memberId, "unpaid-count"] as const,
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

export const fetchUnpaidInvoiceCountAPI = async (
  fetch: Fetch<PaginatedResponse<FetchInvoiceResponse>>,
  memberId: number,
): Promise<number> => {
  const { data } = await fetch(
    `${API_URL_PAYMENT_INVOICES}/${buildUrlParams({
      unpaid: true,
      member: memberId,
      is_v2: true,
      page_size: 1,
    })}`,
  );

  return data.count;
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

export const scheduleInvoicePaymentAPIConfig = ({
  invoiceId,
  ...payload
}: ScheduleInvoicePaymentRequest): ApiConfig => {
  return [
    `${API_URL_PAYMENT_INVOICES}/${invoiceId}/schedule_payment/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const scheduleInvoicePaymentAPI = async (
  fetch: Fetch<ScheduleInvoicePaymentResponse>,
  payload: ScheduleInvoicePaymentRequest,
): Promise<ScheduleInvoicePaymentResponse> => {
  const [uri, init] = scheduleInvoicePaymentAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};

export const unpaidInvoiceCountQueryOptions = (
  fetch: Fetch<PaginatedResponse<FetchInvoiceResponse>>,
  memberId: number,
) =>
  queryOptions({
    queryKey: invoiceKeys.unpaidCount(memberId),
    queryFn: () => fetchUnpaidInvoiceCountAPI(fetch, memberId),
  });
