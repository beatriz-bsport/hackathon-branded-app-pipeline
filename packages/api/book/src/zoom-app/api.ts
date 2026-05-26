import { ApiConfig, Fetch } from "@bsport/store-base";

import { API_V1_URL, BOOKING_QUERY_KEY } from "#src/constants";

import { ZoomApp } from "./types";

const API_URL = `${API_V1_URL}/zoom_app`;
const API_URL_COMPANY = `${API_URL}/company`;

export const zoomAppKeys = {
  all: [BOOKING_QUERY_KEY, "zoom"] as const,
  byCompany: (companyId: number) => [...zoomAppKeys.all, companyId] as const,
};

export const fetchZoomAppsAPIConfig = (companyId: number): ApiConfig => {
  return [`${API_URL_COMPANY}/${companyId}/`];
};

export const fetchZoomAppAPI = async (
  fetch: Fetch<ZoomApp>,
  companyId: number,
): Promise<ZoomApp> => {
  const [uri, init] = fetchZoomAppsAPIConfig(companyId);

  const { data } = await fetch(uri, init);

  return data;
};
