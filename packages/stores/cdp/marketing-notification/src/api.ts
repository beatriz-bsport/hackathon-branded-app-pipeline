import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchMarketingNotificationsParams,
  MarketingNotification,
} from "./types";

const API_URL = "customer-data-platform/v1/marketing/marketing_notification";

/**
 * Fetches marketing notifications with optional filtering parameters.
 * Returns a simple array of notifications (no pagination).
 */
export const fetchMarketingNotificationAPI = (
  params: FetchMarketingNotificationsParams = {},
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

/**
 * Fetches all marketing notifications without filters.
 * Returns a simple array of all notifications.
 */
export const fetchAllMarketingNotificationAPI = (): ApiConfig => {
  return [`${API_URL}/`];
};

export type CreateMarketingNotificationParams = Omit<
  MarketingNotification,
  "id"
>;

export const createMarketingNotificationAPI = (
  params: CreateMarketingNotificationParams,
): ApiConfig => {
  return [
    `${API_URL}/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const updateMarketingNotificationAPI = (
  params: MarketingNotification,
): ApiConfig => {
  return [
    `${API_URL}/${params.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};

export const deleteMarketingNotificationAPI = (id: number): ApiConfig => {
  return [
    `${API_URL}/${id}/`,
    {
      method: "DELETE",
    },
  ];
};

export const toggleMarketingNotificationAPI = (params: {
  active: boolean;
  id: number;
}): ApiConfig => {
  return [
    `${API_URL}/${params.id}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ active: params.active }),
    },
  ];
};
