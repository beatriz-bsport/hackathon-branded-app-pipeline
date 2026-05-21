import { ApiConfig, Fetch } from "@bsport/store-base";

import { API_V1_URL, BOOKING_QUERY_KEY } from "#src/constants";

import {
  PaginatedWellhubOffersResponse,
  ProductsByPartnershipAccountResponse,
  UpdateWellhubProductIdPayload,
} from "./types";

const API_PARTNERSHIP_WELLHUB_URI = `${API_V1_URL}partnership/wellhub/`;

const API_OFFER_URI = `${API_V1_URL}offer/`;

export const wellhubKeys = {
  all: [BOOKING_QUERY_KEY, "wellhub"] as const,
  productsByAccount: () => [...wellhubKeys.all, "products-by-account"] as const,
  offersMissingProductScope: () =>
    [...wellhubKeys.all, "offers-missing-product"] as const,
  offersMissingProduct: (page: number, page_size: number) =>
    [...wellhubKeys.offersMissingProductScope(), { page, page_size }] as const,
};

export const fetchWellhubProductsByAccountAPI = async (
  fetch: Fetch<ProductsByPartnershipAccountResponse>,
): Promise<ProductsByPartnershipAccountResponse> => {
  const { data } = await fetch(
    `${API_PARTNERSHIP_WELLHUB_URI}products-by-account/`,
  );

  return data;
};

export const fetchOffersMissingWellhubProductAPIConfig = (
  page = 1,
  pageSize = 10,
): ApiConfig => {
  return [
    `${API_PARTNERSHIP_WELLHUB_URI}offers/?page=${page}&page_size=${pageSize}`,
  ];
};

export const fetchOffersMissingWellhubProductAPI = async (
  fetch: Fetch<PaginatedWellhubOffersResponse>,
  page = 1,
  pageSize = 10,
): Promise<PaginatedWellhubOffersResponse> => {
  const [uri, init] = fetchOffersMissingWellhubProductAPIConfig(page, pageSize);
  const { data } = await fetch(uri, init);

  return data;
};

export const updateWellhubProductIdAPIConfig = (
  offerId: number,
  data: UpdateWellhubProductIdPayload,
): ApiConfig => {
  return [
    `${API_OFFER_URI}${offerId}/update_wellhub_product_id/`,
    { method: "POST", body: JSON.stringify(data) },
  ];
};

export const updateWellhubProductIdAPI = async (
  fetch: Fetch<void>,
  offerId: number,
  data: UpdateWellhubProductIdPayload,
): Promise<void> => {
  const [uri, init] = updateWellhubProductIdAPIConfig(offerId, data);
  await fetch(uri, init);
};
