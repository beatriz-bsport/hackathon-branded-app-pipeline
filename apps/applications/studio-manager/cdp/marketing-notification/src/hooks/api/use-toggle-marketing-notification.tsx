import { useCallback } from "react";

import { toggleMarketingNotificationAction } from "@bsport/store-cdp-marketing-notification";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const toggleMarketingNotificationBinded =
  toggleMarketingNotificationAction.bind(null, fetch);

/**
 * Hook for toggling marketing notification active state.
 *
 * This hook provides functionality to enable or disable marketing notifications by updating
 * their active status. It handles the API call and loading state management for the toggle operation.
 *
 * @returns Object containing the toggle function for marketing notifications
 */
export function useToggleMarketingNotification() {
  const [, toggleMarketingNotification] = useAsync<
    typeof toggleMarketingNotificationBinded
  >({
    asyncFn: toggleMarketingNotificationBinded,
  });

  /**
   * Toggles the active state of a marketing notification.
   *
   * @param notificationId - The unique identifier of the marketing notification to toggle
   * @param checked - The desired active state (true to enable, false to disable)
   */
  const handleToggleMarketingNotification = useCallback(
    ({
      notificationId,
      checked,
    }: {
      notificationId: number;
      checked: boolean;
    }) => {
      toggleMarketingNotification({ id: notificationId, active: checked });
    },
    [toggleMarketingNotification],
  );

  return {
    handleToggleMarketingNotification,
  };
}
