import { toast } from "@bsport/kaizen-primitive-core";
import {
  MarketingNotification,
  updateMarketingNotificationAction,
} from "@bsport/store-cdp-marketing-notification";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const updateMarketingNotificationBound = updateMarketingNotificationAction.bind(
  null,
  fetch,
);

/**
 * Hook for updating a marketing notification.
 * This hook updates a marketing notification and displays success or failure toasts.
 * @return Object containing handleUpdateMarketingNotification function
 */
export function useUpdateMarketingNotification({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) {
  const { t } = useTranslation("marketingNotificationsModal");
  const [, updateMarketingNotification] = useAsync<
    typeof updateMarketingNotificationBound
  >({
    asyncFn: updateMarketingNotificationBound,
    onSuccess: () => {
      onSuccess?.();
      toast({
        status: "default",
        icon: "save",
        title: t("toast.update.success"),
      });
    },
    onFailure: () => {
      onFailure?.();
      toast({
        status: "critical",
        icon: "x",
        title: t("toast.update.failure"),
      });
    },
  });

  const handleUpdateMarketingNotification = (params: MarketingNotification) => {
    updateMarketingNotification(params);
  };

  return {
    handleUpdateMarketingNotification,
  };
}
