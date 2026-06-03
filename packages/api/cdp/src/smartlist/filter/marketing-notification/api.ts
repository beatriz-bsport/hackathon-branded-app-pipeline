import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateMarketingNotificationFilterPayload,
  MarketingNotificationFilter,
  UpdateMarketingNotificationFilterPayload,
} from "./types";

const MARKETING_NOTIFICATION_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/marketing_notifications`;

export const createMarketingNotificationFilter = async (
  fetch: Fetch<MarketingNotificationFilter>,
  payload: CreateMarketingNotificationFilterPayload,
): Promise<MarketingNotificationFilter> => {
  const { data } = await fetch(`${MARKETING_NOTIFICATION_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchMarketingNotificationFilter = async (
  fetch: Fetch<MarketingNotificationFilter>,
  filterId: number,
  payload: UpdateMarketingNotificationFilterPayload,
): Promise<MarketingNotificationFilter> => {
  const { data } = await fetch(
    `${MARKETING_NOTIFICATION_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteMarketingNotificationFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${MARKETING_NOTIFICATION_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
