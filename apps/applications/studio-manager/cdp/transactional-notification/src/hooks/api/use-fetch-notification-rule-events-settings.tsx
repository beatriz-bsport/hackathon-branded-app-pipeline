import { useEffect } from "react";

import {
  fetchNotificationRuleSettingsAction,
  selectNotificationRuleSettings,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const _fetchNotificationRuleEventSettings =
  fetchNotificationRuleSettingsAction.bind(null, fetch);

/**
 * Hook for fetching notification rule settings from the system.
 *
 * This hook retrieves notification rule settings that control the behavior and configuration
 * of notification rules. Settings include whether notifications are disabled, if checkboxes
 * should be disabled in the UI, and company-specific settings. The hook automatically fetches
 * the settings on mount and manages the loading state.
 *
 * @returns Object containing loading state, fetch function, and notification rule settings from the store
 */
export function useFetchNotificationRuleEventSettings() {
  const [{ isLoading }, fetchNotificationRuleEventSettings] = useAsync<
    typeof _fetchNotificationRuleEventSettings
  >({
    asyncFn: _fetchNotificationRuleEventSettings,
  });

  const notificationRuleSettings = useNotificationRuleStore((state) =>
    selectNotificationRuleSettings(state),
  );

  useEffect(() => {
    fetchNotificationRuleEventSettings();
  }, [fetchNotificationRuleEventSettings]);

  return {
    isLoading,
    notificationRuleSettings,
    fetchNotificationRuleEventSettings,
  };
}
