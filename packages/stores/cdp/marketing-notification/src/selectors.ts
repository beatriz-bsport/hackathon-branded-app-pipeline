import type { MarketingNotificationState } from "./store";
import type { MarketingNotification, MarketingNotificationKind } from "./types";

/**
 * Selects the complete list of marketing notifications.
 */
export const selectMarketingNotificationList = (
  state: MarketingNotificationState,
) => {
  const { marketingNotifications } = state;
  return marketingNotifications;
};

/**
 * Selects the marketing notifications by-ID mapping.
 */
export const selectMarketingNotificationByIdList = (
  state: MarketingNotificationState,
) => {
  const { marketingNotificationById } = state;
  return marketingNotificationById;
};

/**
 * Selects a specific marketing notification by ID.
 */
export const selectMarketingNotificationById = (
  state: MarketingNotificationState,
  id: number,
) => {
  const { marketingNotificationById } = state;
  return marketingNotificationById?.[id];
};

/**
 * Selects marketing notifications filtered by kind.
 * Provides type-safe filtering based on notification kind.
 */
export const selectMarketingNotificationByKind = (
  state: MarketingNotificationState,
  kind: MarketingNotificationKind,
) => {
  const { marketingNotifications } = state;
  return marketingNotifications.filter(
    (notification) => notification.kind === kind,
  );
};

/**
 * Selects marketing notifications grouped by their kind.
 * Returns a record where keys are notification kinds and values are arrays of notifications.
 */
export const selectMarketingNotificationsByKindMap = (
  state: MarketingNotificationState,
): Record<MarketingNotificationKind, MarketingNotification[]> => {
  const { marketingNotifications } = state;

  return marketingNotifications.reduce(
    (acc, notification) => {
      if (!acc[notification.kind]) {
        acc[notification.kind] = [];
      }
      acc[notification.kind].push(notification);
      return acc;
    },
    {} as Record<MarketingNotificationKind, MarketingNotification[]>,
  );
};
