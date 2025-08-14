import {
  NotificationRuleSettings,
  updateNotificationRuleSettingsAction,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateNotificationRuleSettingsProps = {
  notificationRuleSettings: NotificationRuleSettings;
  onSuccess?: (notificationRuleSettings: NotificationRuleSettings) => void;
  onFailure?: (error: Error) => void;
};

const _updateNotificationRuleSettings =
  updateNotificationRuleSettingsAction.bind(null, fetch);

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
export function useUpdateNotificationRuleSettings({
  notificationRuleSettings,
  onSuccess,
  onFailure,
}: UseUpdateNotificationRuleSettingsProps) {
  const [{ isLoading }, updateNotificationRuleEventSettings] = useAsync<
    typeof _updateNotificationRuleSettings
  >({
    asyncFn: _updateNotificationRuleSettings,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  const toggleEmailNotification = ({
    checked,
    notificationEventId,
  }: {
    checked: boolean;
    notificationEventId: number;
  }) => {
    if (!notificationRuleSettings.id || !notificationRuleSettings.company) {
      return;
    }
    updateNotificationRuleEventSettings({
      id: notificationRuleSettings.id,
      company: notificationRuleSettings.company,
      settings: {
        ...notificationRuleSettings.settings,
        [notificationEventId]: {
          ...notificationRuleSettings.settings[notificationEventId],
          disabled: !checked,
        },
      },
    });
  };

  return {
    isLoading,
    toggleEmailNotification,
  };
}
