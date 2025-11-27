import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";

import {
  createMarketingNotificationAPI,
  deleteMarketingNotificationAPI,
  fetchMarketingNotificationAPI,
  toggleMarketingNotificationAPI,
  updateMarketingNotificationAPI,
} from "#src/api";
import type {
  CreateMarketingNotificationParams,
  FetchMarketingNotificationsParams,
  MarketingNotification,
} from "#src/types";

import {
  addMarketingNotification,
  removeMarketingNotification,
  setMarketingNotifications,
  updateMarketingNotification,
} from "./store";

/**
 * Fetches marketing notifications filtered by kinds.
 *
 * @param params - Filter parameters
 * @param params.kind__in - Comma-separated string of notification kinds to fetch
 */
export const fetchMarketingNotificationsAction: Action<
  FetchMarketingNotificationsParams,
  MarketingNotification[]
> = async (fetch, params) => {
  const [uri, init] = fetchMarketingNotificationAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      // API returns a simple array of notifications
      const notifications = data as MarketingNotification[];

      setMarketingNotifications(notifications);

      return notifications;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch marketing notifications",
      }),
  );
};

/**
 * Creates a new marketing notification.
 *
 * @param params - The notification data without ID
 */
export const createMarketingNotificationAction: Action<
  CreateMarketingNotificationParams,
  MarketingNotification
> = async (fetch, params) => {
  const [uri, init] = createMarketingNotificationAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      addMarketingNotification(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to create marketing notification",
      }),
  );
};

/**
 * Updates an existing marketing notification.
 *
 * @param params - The complete notification data with ID
 */
export const updateMarketingNotificationAction: Action<
  MarketingNotification,
  MarketingNotification
> = async (fetch, params) => {
  const [uri, init] = updateMarketingNotificationAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateMarketingNotification(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to update marketing notification",
      }),
  );
};

/**
 * Deletes a marketing notification by ID.
 *
 * @param params - Object containing the notification ID
 * @param params.id - The ID of the notification to delete
 */
export const deleteMarketingNotificationAction: Action<
  { id: number },
  void
> = async (fetch, params) => {
  const [uri, init] = deleteMarketingNotificationAPI(params.id);

  return Result.try(
    async () => {
      await fetch(uri, init);

      removeMarketingNotification(params.id);

      return undefined;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to delete marketing notification",
      }),
  );
};

/**
 * Toggles the active state of a marketing notification.
 *
 * @param params - Toggle parameters
 * @param params.id - The ID of the notification to toggle
 * @param params.active - The new active state
 */
export const toggleMarketingNotificationAction: Action<
  { id: number; active: boolean },
  MarketingNotification
> = async (fetch, params) => {
  const [uri, init] = toggleMarketingNotificationAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      // Update the store with the new active state
      updateMarketingNotification(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to toggle marketing notification",
      }),
  );
};
