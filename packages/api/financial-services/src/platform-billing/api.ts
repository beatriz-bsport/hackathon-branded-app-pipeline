import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { API_URL_PLATFORM_BILLING, QUERY_KEY_MAIN } from "#src/constants";

import type { PlatformInvoice, RequestUpsellPackagePayload } from "./types";

const getRequestUpsellPackageConfig = (
  payload: RequestUpsellPackagePayload,
): ApiConfig => {
  return [
    `${API_URL_PLATFORM_BILLING}/upsell_package/request_upsell_by_identifier/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upsell_identifier: payload.upsellIdentifier }),
    },
  ];
};

/**
 * Request an upsell package by identifier (creates HubSpot deal).
 * Same endpoint as saas-legacy platform-billing requestUpsellPackage.
 */
export const requestUpsellPackageAPI = async (
  fetch: Fetch<void>,
  upsellIdentifier: number,
): Promise<void> => {
  const [uri, init] = getRequestUpsellPackageConfig({ upsellIdentifier });
  await fetch(uri, init);
};

export const platformInvoiceKeys = {
  all: [QUERY_KEY_MAIN, "platform-invoice"] as const,
  list: () => [...platformInvoiceKeys.all, "list"] as const,
} as const;

const fetchPlatformInvoiceListAPIConfig = (): ApiConfig => {
  return [`${API_URL_PLATFORM_BILLING}/platform_invoice/from_payment_backend/`];
};

export const fetchPlatformInvoiceListAPI = async (
  fetch: Fetch<{ results: PlatformInvoice[] }>,
): Promise<PlatformInvoice[]> => {
  const [uri, init] = fetchPlatformInvoiceListAPIConfig();

  const { data } = await fetch(uri, init);

  return data.results;
};

export const fetchPlatformInvoiceListQueryOptions = (
  fetch: Fetch<{ results: PlatformInvoice[] }>,
) =>
  queryOptions({
    queryKey: platformInvoiceKeys.list(),
    queryFn: () => fetchPlatformInvoiceListAPI(fetch),
  });

export const payPlatformInvoiceAPI = async (
  fetch: Fetch<void>,
  paymentBackendId: string,
): Promise<void> => {
  await fetch(`${API_URL_PLATFORM_BILLING}/platform_invoice/bill_now/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment_backend_id: paymentBackendId }),
  });
};

export const payPlatformInvoiceMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (paymentBackendId: string) =>
      payPlatformInvoiceAPI(fetch, paymentBackendId),
  });
