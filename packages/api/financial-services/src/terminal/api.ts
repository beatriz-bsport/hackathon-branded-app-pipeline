import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL, QUERY_KEY_MAIN } from "../constants";
import type {
  FetchStripeReadersResponse,
  ProcessPaymentIntentPayload,
  ReaderActionSumup,
  StripeReader,
} from "./types";

export const terminalKeys = {
  all: [QUERY_KEY_MAIN, "terminal"] as const,
  readers: () => [...terminalKeys.all, "readers"] as const,
} as const;

export const fetchStripeReadersAPIConfig = (): ApiConfig => {
  return [`${API_URL}/terminal/reader/`];
};

export const fetchStripeReadersAPI = async (
  fetch: Fetch<FetchStripeReadersResponse>,
): Promise<StripeReader[]> => {
  const [uri, init] = fetchStripeReadersAPIConfig();
  const { data } = await fetch(uri, init);

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data?.data) ? data.data : [];
};

export const processPaymentIntentAPIConfig = (
  readerId: string,
  payload: ProcessPaymentIntentPayload,
): ApiConfig => {
  return [
    `${API_URL}/terminal/reader/${readerId}/process_payment_intent/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const processPaymentIntentAPI = async (
  fetch: Fetch<ReaderActionSumup>,
  readerId: string,
  payload: ProcessPaymentIntentPayload,
): Promise<ReaderActionSumup> => {
  const [uri, init] = processPaymentIntentAPIConfig(readerId, payload);

  const { data } = await fetch(uri, init);

  return data;
};

export const retrieveReaderActionSumupAPIConfig = (
  readerId: string,
): ApiConfig => {
  return [`${API_URL}/terminal/reader/${readerId}/retrieve_reader_sumup/`];
};

export const retrieveReaderActionSumupAPI = async (
  fetch: Fetch<ReaderActionSumup>,
  readerId: string,
): Promise<ReaderActionSumup> => {
  const [uri, init] = retrieveReaderActionSumupAPIConfig(readerId);

  const { data } = await fetch(uri, init);

  return data;
};
