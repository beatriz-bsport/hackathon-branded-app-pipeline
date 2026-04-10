import { Fetch } from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import { ProductsByPartnershipAccountResponse } from "./types";

const API_PARTNERSHIP_WELLHUB_URI = `${API_V1_URL}partnership/wellhub/`;

export const fetchWellhubProductsByAccountAPI = async (
  fetch: Fetch<ProductsByPartnershipAccountResponse>,
): Promise<ProductsByPartnershipAccountResponse> => {
  const { data } = await fetch(
    `${API_PARTNERSHIP_WELLHUB_URI}products-by-account/`,
  );

  return data;
};
