import { useEffect } from "react";

import {
  fetchMarketingNotificationsAction,
  selectMarketingNotificationList,
  useMarketingNotificationStore,
} from "@bsport/store-cdp-marketing-notification";
import { useAsync } from "@bsport/use-async";

import { useFetchMarketingNotificationDependencies } from "#src/hooks/api/use-fetch-marketing-notification-dependencies";
import { fetch } from "#src/utils/fetch";
import { extractAllNotificationIds } from "#src/utils/notificationMetadata";
import {
  BOOKING_CREATION_NOTIFICATION,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
} from "#src/utils/types";

const fetchMarketingNotificationListBinded =
  fetchMarketingNotificationsAction.bind(null, fetch);

/**
 * Hook for fetching marketing notifications.
 *
 * This hook retrieves marketing notifications that control the behavior and configuration
 * of notifications. The hook automatically fetches the notifications on mount and manages
 * the loading state.
 *
 * @returns Object containing loading state, fetch function, and marketing notifications from the store
 */
export function useFetchMarketingNotificationList() {
  const { fetchMarketingNotificationDependencies } =
    useFetchMarketingNotificationDependencies();
  const [{ isLoading }, fetchMarketingNotificationList] = useAsync<
    typeof fetchMarketingNotificationListBinded
  >({
    asyncFn: fetchMarketingNotificationListBinded,
    onSuccess: ({ value }) => {
      // Extract all relevant IDs using type-safe utility functions
      const {
        establishmentIds,
        metaActivityIds,
        privateServiceIds,
        privatePassIds,
        paymentPackIds,
        subscriptionIds,
      } = extractAllNotificationIds(value);

      // Fetch dependencies with extracted IDs
      fetchMarketingNotificationDependencies({
        establishmentIds: Array.from(establishmentIds),
        groupActivityIds: Array.from(metaActivityIds),
        privateServiceIds: Array.from(privateServiceIds),
        privatePassIds: Array.from(privatePassIds),
        subscriptionIds: Array.from(subscriptionIds),
        paymentPackIds: Array.from(paymentPackIds),
      });
    },
  });

  const marketingNotificationsList = useMarketingNotificationStore((state) =>
    selectMarketingNotificationList(state),
  );

  useEffect(() => {
    fetchMarketingNotificationList({
      kind__in: [
        PRIVATE_BOOKING_CREATION_NOTIFICATION,
        BOOKING_CREATION_NOTIFICATION,
        CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
        CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
        PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
        PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
        SUBSCRIPTION_NOTIFICATION_CREATION,
        SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
        SUBSCRIPTION_NOTIFICATION_END,
      ],
    });
  }, [fetchMarketingNotificationList]);

  return {
    isLoading,
    marketingNotificationsList,
    fetchMarketingNotificationList,
  };
}
