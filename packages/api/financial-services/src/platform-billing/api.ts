import { type ApiConfig, Fetch } from "@bsport/store-base";

import { API_URL_PLATFORM_BILLING } from "#src/constants";

import type { RequestUpsellPackagePayload } from "./types";

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
