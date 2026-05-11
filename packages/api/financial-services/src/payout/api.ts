import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL, QUERY_KEY_MAIN } from "../constants";
import type {
  GetPayoutBalanceTransactionsRequest,
  GetPayoutDetailRequest,
  GetPayoutListRequest,
  PayoutBalanceTransactionsListResponse,
  PayoutDetailResponse,
  PayoutListResponse,
} from "./types";

export const payoutKeys = {
  all: [QUERY_KEY_MAIN, "payout"] as const,
  list: (payload: GetPayoutListRequest) =>
    [
      ...payoutKeys.all,
      "list",
      payload.page,
      payload.page_size ?? null,
    ] as const,
  detail: (payoutId: string) =>
    [...payoutKeys.all, "detail", payoutId] as const,
  balanceTransactions: (payload: GetPayoutBalanceTransactionsRequest) =>
    [
      ...payoutKeys.all,
      "balance-transactions",
      payload.payout_id,
      payload.page,
      payload.page_size ?? null,
    ] as const,
} as const;

const getPayoutListAPIConfig = (payload: GetPayoutListRequest): ApiConfig => {
  const params = new URLSearchParams({ page: String(payload.page) });

  if (payload.page_size !== undefined) {
    params.set("page_size", String(payload.page_size));
  }

  return [
    `${API_URL}/payout/reconciliation/?${params.toString()}`,
    { method: "GET" },
  ];
};

export const getPayoutListAPI = async (
  fetch: Fetch<PayoutListResponse>,
  payload: GetPayoutListRequest,
): Promise<PayoutListResponse> => {
  const [uri, init] = getPayoutListAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};

const getPayoutDetailAPIConfig = (
  payload: GetPayoutDetailRequest,
): ApiConfig => {
  return [
    `${API_URL}/payout/reconciliation/${payload.payout_id}/`,
    { method: "GET" },
  ];
};

export const getPayoutDetailAPI = async (
  fetch: Fetch<PayoutDetailResponse>,
  payload: GetPayoutDetailRequest,
): Promise<PayoutDetailResponse> => {
  const [uri, init] = getPayoutDetailAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};

const getPayoutBalanceTransactionsAPIConfig = (
  payload: GetPayoutBalanceTransactionsRequest,
): ApiConfig => {
  const params = new URLSearchParams({
    page: String(payload.page),
  });

  if (payload.page_size !== undefined) {
    params.set("page_size", String(payload.page_size));
  }

  return [
    `${API_URL}/payout/reconciliation/${payload.payout_id}/balance-transactions/?${params.toString()}`,
    { method: "GET" },
  ];
};

export const getPayoutBalanceTransactionsAPI = async (
  fetch: Fetch<PayoutBalanceTransactionsListResponse>,
  payload: GetPayoutBalanceTransactionsRequest,
): Promise<PayoutBalanceTransactionsListResponse> => {
  const [uri, init] = getPayoutBalanceTransactionsAPIConfig(payload);

  const { data } = await fetch(uri, init);

  return data;
};
