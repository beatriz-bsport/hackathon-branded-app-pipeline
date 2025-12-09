import { toast } from "@bsport/kaizen-primitive-core";
import {
  CreateMarketingNotificationParams,
  createMarketingNotificationAction,
} from "@bsport/store-cdp-marketing-notification";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const createMarketingNotificationBound = createMarketingNotificationAction.bind(
  null,
  fetch,
);

/**
 * Hook for creating a marketing notification.
 * This hook creates a marketing notification and displays success or failure toasts.
 * @return Object containing handleCreateMarketingNotification function
 */
export function useCreateMarketingNotification({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) {
  const { t } = useTranslation("marketingNotificationsModal");
  const [, createMarketingNotification] = useAsync<
    typeof createMarketingNotificationBound
  >({
    asyncFn: createMarketingNotificationBound,
    onSuccess: () => {
      onSuccess?.();
      toast({
        status: "default",
        icon: "plus",
        title: t("toast.create.success"),
      });
    },
    onFailure: () => {
      onFailure?.();
      toast({
        status: "critical",
        icon: "x",
        title: t("toast.create.failure"),
      });
    },
  });

  const handleCreateMarketingNotification = (
    params: CreateMarketingNotificationParams,
  ) => {
    createMarketingNotification(params);
  };

  return {
    handleCreateMarketingNotification,
  };
}
