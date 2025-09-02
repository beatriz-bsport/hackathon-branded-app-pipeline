import { marketingNotificationStore } from "#src/store";
import type { MarketingNotification } from "#src/types";

/**
 * Updates a single marketing notification in the store.
 * Merges the updated notification with existing data by ID.
 *
 * @param updatedNotification - The notification with updated data
 */
export const updateMarketingNotification = (
  updatedNotification: MarketingNotification,
) => {
  marketingNotificationStore.setState((state) => {
    if (!updatedNotification) return state;

    const id = updatedNotification.id;

    if (id == null) return state;

    // Update both the array and the by-ID mapping
    const updatedNotifications = state.marketingNotifications.map(
      (notification) =>
        notification.id === id ? updatedNotification : notification,
    );

    return {
      marketingNotifications: updatedNotifications,
      marketingNotificationById: {
        ...state.marketingNotificationById,
        [id]: updatedNotification,
      },
    };
  });
};

/**
 * Sets multiple marketing notifications in the store.
 * Replaces the current list and creates a new by-ID mapping.
 *
 * @param notifications - Array of marketing notifications to set
 */
export const setMarketingNotifications = (
  notifications: MarketingNotification[],
) => {
  marketingNotificationStore.setState(() => {
    const sanitizedNotifications = notifications.filter(Boolean);

    const marketingNotificationById = sanitizedNotifications.reduce(
      (acc, notification) => {
        acc[notification.id] = notification;
        return acc;
      },
      {} as { [id: number]: MarketingNotification },
    );

    return {
      marketingNotifications: [...sanitizedNotifications],
      marketingNotificationById,
    };
  });
};

/**
 * Adds a new marketing notification to the store.
 * Appends to existing list and updates the by-ID mapping.
 *
 * @param notification - The new notification to add
 */
export const addMarketingNotification = (
  notification: MarketingNotification,
) => {
  marketingNotificationStore.setState((state) => {
    if (!notification || notification.id == null) return state;

    // Check if notification already exists
    const existingNotification =
      state.marketingNotificationById?.[notification.id];
    if (existingNotification) {
      // If it exists, update it instead
      return {
        marketingNotifications: state.marketingNotifications.map(
          (_notification) =>
            _notification.id === notification.id ? notification : _notification,
        ),
        marketingNotificationById: {
          ...state.marketingNotificationById,
          [notification.id]: notification,
        },
      };
    }

    return {
      marketingNotifications: [...state.marketingNotifications, notification],
      marketingNotificationById: {
        ...state.marketingNotificationById,
        [notification.id]: notification,
      },
    };
  });
};

/**
 * Removes a marketing notification from the store by ID.
 * Updates both the list and by-ID mapping.
 *
 * @param notificationId - The ID of the notification to remove
 */
export const removeMarketingNotification = (notificationId: number) => {
  marketingNotificationStore.setState((state) => {
    const updatedNotifications = state.marketingNotifications.filter(
      (notification) => notification.id !== notificationId,
    );

    const updatedById = { ...state.marketingNotificationById };
    delete updatedById[notificationId];

    return {
      marketingNotifications: updatedNotifications,
      marketingNotificationById: updatedById,
    };
  });
};

/**
 * Clears all marketing notifications from the store.
 * Resets both list and by-ID mapping to empty state.
 */
export const clearMarketingNotifications = () => {
  marketingNotificationStore.setState(() => ({
    marketingNotifications: [],
    marketingNotificationById: {},
  }));
};
