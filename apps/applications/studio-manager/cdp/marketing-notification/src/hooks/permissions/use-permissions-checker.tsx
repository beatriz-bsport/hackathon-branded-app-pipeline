import { useObjectLevelPermission } from "#src/utils/permissions";

export const usePermissionsChecker = () => {
  const hasToggleNotification = useObjectLevelPermission(
    "member.allowed_actions.manageNotification",
  );

  return {
    isUserMarketingNotificationManager: hasToggleNotification,
  };
};
